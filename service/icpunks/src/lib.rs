use ic_cdk::{caller, trap, print};
use ic_cdk_macros::*;
use ic_cdk::api;
use ic_cdk::export::candid::{Principal};
use ic_cdk::storage;

use serde_bytes::{ByteBuf, Bytes};
use std::borrow::Cow;
use std::collections::HashMap;

use common::*;

mod token;
use token::{State, Token, Listing};

mod guards;
use guards::{owner_guard};

#[init]
fn init(name: String, symbol: String, max_supply: i128, owner: Principal) {

    let state = State {
        name: name.clone(),
        description: "ICats NFT Collection".to_string(),
        icon_url: "None".to_string(),
        symbol: symbol.clone(),
        max_supply: max_supply as u32,
        owner: owner,

        creators_fee: 2500,
        creators_address: owner,
        tx_enabled: true,
        storage_canister: None,
        ledger_canister: None,

        listed: Vec::with_capacity(10000),
        tokens: Vec::with_capacity(10000),
        owners: HashMap::default(),
        assets: HashMap::default()
    };

    unsafe {
        STATE = Some(state);
    }
}

#[pre_upgrade]
fn pre_upgrade() {
    let state = get_state();

    storage::stable_save((state, )).expect("Failed to save state!");
}

#[post_upgrade]
fn post_upgrade() {
    let (new_state,): (State, ) = storage::stable_restore().expect("Failed to restore state!");

    unsafe {
        STATE = Some(new_state);
    }
}

#[query]
fn get_storage_canister() -> Option<Principal> {
    return get_state().storage_canister;
}

#[query]
fn get_ledger_canister() -> Option<Principal> {
    return get_state().ledger_canister;
}

#[query]
fn get_cycles() -> u128 {
   return api::canister_balance() as u128;
}


#[query]
fn name() -> String {
    return get_state().name.clone();
}

#[query]
fn symbol() -> String {
    return get_state().symbol.clone();
}

#[query]
fn description() -> String {
    return get_state().description.clone();
}
#[query]
fn icon_url() -> String {
    return get_state().icon_url.clone();
}

#[query]
fn owner() -> Principal {
    return get_state().owner;
}

#[query]
fn total_supply() -> u128 {
    return get_state().tokens.len() as u128;
}
#[query]
fn creators_fee() -> u128 {
    return get_state().creators_fee;
}

#[query]
fn tx_enabled() -> bool {
    return get_state().tx_enabled;
}

#[update(guard="owner_guard")]
fn set_tx_enabled(enabled: bool) -> bool {
    let state = get_state();
    state.tx_enabled = enabled;

    return true;
}



#[query]
fn owner_of(token_id: u128) -> Principal {
    let state = get_state();
    if token_id > (state.tokens.len() as u128) || token_id == 0 {trap("Invalid token_id");}

    let pos = (token_id as usize)-1;
    return state.tokens.get(pos).unwrap().owner;
}

#[query]
fn user_tokens(user: Principal) -> Vec<u128> {
    let list = get_state().owners.get(&user);

    match list {
        Some(list) => {
            return list.clone();
        },
        None => {
            return vec![];
        }
    }
}

#[query]
fn data_of(token_id: u128) -> Token {
    let state = get_state();
    if token_id > (state.tokens.len() as u128) || token_id == 0 {trap("Invalid token_id");}
    let pos = (token_id as usize)-1;

    return state.tokens[pos].clone();
}


#[update(guard="owner_guard")]
fn set_owner(owner: Principal) -> bool {
    let state = get_state();
    state.owner = owner;

    return true;
}
#[update(guard="owner_guard")]
fn set_description(description: String) -> bool {
    let state = get_state();
    state.description = description;

    return true;
}
#[update(guard="owner_guard")]
fn set_icon_url(icon_url: String) -> bool {
    let state = get_state();
    state.icon_url = icon_url;

    return true;
}


#[update(guard="owner_guard")]
async fn add_genesis_record() -> u128 {
    let state = get_state();

    if state.storage_canister == None {trap("Storage Canister is null");}

    match state.add_genesis_record().await {
        Ok(id) => return id,
        Err(s) => trap(&s),
    }
}

#[update(guard="owner_guard")]
fn set_storage_canister(storage: Principal) -> bool {
    get_state().storage_canister = Some(storage);

    return true;
}

#[update(guard="owner_guard")]
fn set_ledger_canister(ledger: Principal) -> bool {
    get_state().ledger_canister = Some(ledger);

    return true;
}

#[update(guard="owner_guard")]
async fn mint(data: MintRequest) -> u128 {
    let state = get_state();

    match state.mint(data, caller()).await {
        Ok(id) => return id,
        Err(s) => trap(&s),
    }
}
#[update(guard="owner_guard")]
async fn multi_mint(data: Vec<MintRequest>) -> Vec<u128> {
    let state = get_state();

    if (state.tokens.len()+data.len()) as u32 > state.max_supply {trap("Max token count reached");}

    let mut result : Vec<u128> = Vec::with_capacity(data.len());

    let owner = caller().clone();

    for item in data {
        match state.mint(item, owner).await {
            Ok(id) => result.push(id),
            Err(_) => {}
        }        
    }

    return result;
}

#[update]
async fn transfer_to(to: Principal, token_id: u128) -> bool {
    let state = get_state();
    //Check if tokenId is valid

    match state.transfer(caller(), to, token_id).await {
        Ok(_) => return true,
        Err(s) => trap(&s),
    }
}

#[update]
async fn multi_transfer_to(data: Vec<(Principal, u128)>) -> Vec<bool> {
    let state = get_state();
    //Check if tokenId is valid

    let mut result : Vec<bool> = Vec::with_capacity(data.len());

    for item in data {
        match state.transfer(caller(), item.0, item.1).await {
            Ok(id) => result.push(id),
            Err(_) => {}
        }        
    }

    return result;
}

#[query]
fn get_listed_count() -> u128 {
    let state = get_state();
    return state.listed.len() as u128;
}

//Returns current listing, by default it is in ascending order
#[query]
fn get_listed(page: u128) -> Vec<Listing> {
    let state = get_state();

    let start = (page*10) as usize;
    let mut len = 10;

    if start > state.listed.len() { return vec![]; }

    if start+len >= state.listed.len() {
        len = state.listed.len() - start;
    }

    return state.listed[start..start+len].to_vec();
}

#[update]
async fn list(token_id: u128, price: u64) -> bool {
    let state = get_state();
    match state.list(caller(), token_id, price).await {
        Ok(_) => { return true; }
        Err(msg) => {trap(msg);}
    }
}
#[update]
async fn delist(token_id: u128) -> bool {
    let state = get_state();
    match state.delist(caller(), token_id).await {
        Ok(_) => { return true; }
        Err(msg) => {trap(msg);}
    }
}

#[update]
async fn transaction_notification(args: TransactionNotification) -> Result<&'static str, &'static str> {
    let state=get_state();
    return state.purchase(caller(), args).await;
}

#[update]
async fn send_icp(to: Principal, amount: u64) -> Result<bool, String> {
    let state=get_state();
    return state.send_icp(to, amount, 0).await;
}

#[query]
fn http_request(req: HttpRequest) -> HttpResponse {
    //Splits request url in to parts before ? and after ?
    let parts: Vec<&str> = req.url.split('?').collect();
    let probably_an_asset = parts[0];

    let state = get_state();

    let asset = state.assets.get(probably_an_asset);

    match asset {
        Some((headers, value)) => {
            let mut headers = headers.clone();
            //We can enable cache, NFT asset will never change
            headers.push(("Cache-Control".to_string(),"public, max-age=604800, immutable".to_string()));

            HttpResponse {
                status_code: 200,
                headers: headers,
                body: Cow::Borrowed(Bytes::new(value)),
            }
        }
        None => HttpResponse {
            status_code: 404,
            headers: vec![],
            // headers: vec![certificate_header],
            body: Cow::Owned(ByteBuf::from(format!(
                "Asset {} not found.",
                probably_an_asset
            ))),
        },
    }
}


//Contains whole state of NFT
    static mut STATE: Option<State> = None;
// }

pub fn get_state() -> &'static mut State {
    unsafe { STATE.as_mut().unwrap() }
}