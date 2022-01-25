use std::cell::RefCell;
use std::cell::Cell;
use ic_cdk::{caller, trap, id, storage};
use ic_cdk_macros::*;
// use ic_cdk::api;
use ic_cdk::export::candid::{Principal, Decode, CandidType, Deserialize};

// use ic_cdk::storage;

// use serde_bytes::{ByteBuf, Bytes};
// use std::borrow::Cow;
// use std::collections::HashMap;

use ic_cdk::api::call::{call_raw};
// use ic_cdk::{trap};

use prost::Message;

use common::{TransactionNotification, ICPTs, SendArgs};

use intmap::IntMap;


mod account_identifier;

mod ledger {

include!("../gen/ic_ledger.pb.v1.rs");

}
// pub type BlockHeight = u64;
// // These is going away soon
// pub struct BlockArg(pub BlockHeight);

// pub struct ProtoBuf<A>(pub A);


pub struct State {
    pub ledger_canister: Cell<Option<Principal>>,
    pub token_canister: Cell<Option<Principal>>,
    pub owner: Cell<Option<Principal>>,
    pub blocks: RefCell<Vec<SendArgs>>,
    pub blocks_processed: RefCell<IntMap<()>>
}

impl Default for State {
    fn default() -> Self {
        Self {
            ledger_canister: Cell::new(Some(Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap())),
            token_canister: Cell::new(None),
            owner: Cell::new(None),
            blocks: RefCell::new(Vec::default()),
            blocks_processed: RefCell::new(IntMap::new())
        }
    }
}

thread_local! {
    static STATE: State = State::default();
}

#[pre_upgrade]
fn pre() {
    STATE.with(|state| {
        ic_cdk::storage::stable_save(
            ((
                state.ledger_canister.get(),
                state.token_canister.get(),
                state.owner.get(),
                &*state.blocks.borrow(),
                state.blocks_processed.borrow().keys().map(|x| {*x}).collect::<Vec<u64>>()
        ),)
        )
        .unwrap();
    }
    );
}

#[post_upgrade]
fn post() {
    let ((ledger_caniser, token_canister, owner, blocks, blocks_processed),) : ((Option<Principal>, Option<Principal>, Option<Principal>, Vec<SendArgs>, Vec<u64>),) =  ic_cdk::storage::stable_restore().unwrap();

    STATE.with(|state| {
        state.ledger_canister.set(ledger_caniser);
        state.token_canister.set(token_canister);
        state.owner.set(owner);
        state.blocks.replace(blocks);
        let mut bp = state.blocks_processed.borrow_mut();
        blocks_processed.iter().for_each(|x| {bp.insert(*x, ());});
    })
}

#[update]
fn set_ledger_canister(id: Principal) -> bool {
    STATE.with(|s| {
        s.ledger_canister.set(Some(id));
    });

    return true;
}

#[query]
async fn get_blocks() -> Vec<SendArgs> {
    let blocks = STATE.with(|s| {
        s.blocks.borrow().clone()
    });

    return blocks
}

#[query]
async fn count_processed() -> u64 {
    let count = STATE.with(|s| {
        s.blocks_processed.borrow().len() as u64
    });

    return count;
}

#[query]
async fn get_processed() -> Vec<u64> {
    let blocks = STATE.with(|s| {
        s.blocks_processed.borrow().keys().map(|x| *x).collect()
    });

    return blocks;
}

#[update]
 //Sends ICP to given principal id
async fn send_dfx(args: SendArgs) -> u64 {
    let ledger_canister = STATE.with(|s| {
        s.ledger_canister.get().unwrap()
    });

    //Store SendArgs before actual sending
    STATE.with(|s| {
        s.blocks.borrow_mut().push(args.clone());
    });

    //Send ICP to target LEDGER canister
    let event_raw = ic_cdk::export::candid::encode_args(
        (args,)
    ).unwrap();

    let raw_res = call_raw(
        ledger_canister,
        "send_dfx",
        event_raw.clone(),
        0,
    ).await.unwrap_or_else(|(_,s)| trap(&s));

    let res = Decode!(&raw_res, u64).unwrap();

    //Return response from ledger canister
    return res;
}

//Notifies canister about transaction
#[update]
async fn notify(block_height: u64) -> Result<(), String> {
    //Check if given block_height was already processed
    let is_processed = STATE.with(|s| {
        s.blocks_processed.borrow().get(block_height).is_some()
    });

    if is_processed {
        return Err(format!("Block already processed {}", block_height));
    }

    //Store block as processed
    STATE.with(|s| {
        s.blocks_processed.borrow_mut().insert(block_height, ());
    });

    //Token canister that will be notified
    let to_canister = Principal::from_text("nvtz2-maaaa-aaaah-qcohq-cai").unwrap();
    let caller_principal_id = caller();

    //Get block from ledger
    let raw_block: ledger::EncodedBlock = get_block(block_height).await
    .unwrap_or_else(|| trap("Block not found!"));

    //Decode block data
    let block = ledger::Block::decode(&raw_block.block[..])
    .unwrap_or_else(|_| trap("Could not decode block"));
    let transaction = block.transaction
    .unwrap_or_else(|| trap("Transaction is None"));
    //Verify that transaction is of type Send (Mint and Burn cannot be processed)
    let (_from, _to, amount) = match transaction.transfer
    .unwrap_or_else(|| trap("Transaction transfer is None")) 
    {
        ledger::transaction::Transfer::Send(item) => (
            account_identifier::AccountIdentifier::from_slice(&item.from.unwrap().hash[..]).unwrap(), 
            account_identifier::AccountIdentifier::from_slice(&item.to.unwrap().hash[..]).unwrap(), 
            item.amount
        ),
        ledger::transaction::Transfer::Burn(_) => trap("Notification failed transfer must be of type send, found burn"),
        ledger::transaction::Transfer::Mint(_) => trap("Notification failed transfer must be of type send, found mint"),
    };

    //Verify that transaction is for our canister, otherwise throw error
    let caller_account_id = account_identifier::AccountIdentifier::new(caller_principal_id, None);
    let canister_account_id = account_identifier::AccountIdentifier::new(id(), None);
    if caller_account_id != _from {
        trap("Invalid block! Caller does not match block sender");
    }
    if canister_account_id != _to {
        trap("Invalid block! Canister does not match block recipient");
    }

    //Prepare notification to target canister
    let transaction_notification_args = TransactionNotification {
        from: caller_principal_id,
        from_subaccount: None,
        to: to_canister,
        to_subaccount: None,
        block_height,
        amount: ICPTs {
            e8s: amount.unwrap().e8s
        },
        memo: transaction.memo.unwrap().memo,
    };
    let event_raw = ic_cdk::export::candid::encode_args(
        (transaction_notification_args,)
    ).unwrap();

    //Notify token canister
    let raw_res = call_raw(
        to_canister,
        "transaction_notification",
        event_raw.clone(),
        0,
    ).await.unwrap_or_else(|(_,s)| trap(&s));

    let res = Decode!(&raw_res, Result<&str, &str>).unwrap();

    match res {
        Ok(_) => { return Ok(()); }
        Err(text) => { trap(text); }
    }
}

async fn get_block(block_height: u64) -> Option<ledger::EncodedBlock> {
    let canister = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").ok().unwrap();

    let mut req = ledger::BlockRequest::default();
    req.block_height = block_height;

    let mut buf = Vec::<u8>::new();
    buf.reserve(req.encoded_len());
    req.encode(&mut buf).unwrap();

    let res = call_raw(
        canister,
        "block_pb",
        buf,
        0
    ).await.unwrap_or_else(|(_, text)| trap(&text));

    let resp = ledger::BlockResponse::decode(&res[..]).unwrap();
    
    match resp.block_content.unwrap() {
        ledger::block_response::BlockContent::Block(raw_block) => {
            return Some(raw_block);
        }
        ledger::block_response::BlockContent::CanisterId(_prin) => {
            trap("Block is already archived!");
        }
    }
}


