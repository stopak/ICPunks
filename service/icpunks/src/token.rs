use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use std::collections::HashMap;

use ic_cdk::{caller, print};
use ic_cdk::api::time;

use ic_cdk::export::candid::Decode;

use ic_cdk::api::call::{call_raw, CallResult};

use sha2::Sha224;
use sha2::Digest;

use common::{MintRequest, Property, HeaderField, Operation, TransactionNotification, SendArgs, ICPTs};

#[derive(Clone, CandidType, Deserialize)]
pub struct Listing {
    pub owner: Principal,
    pub token_id: u128,
    pub price: u64,

    pub time: i128,
}

#[derive(Copy, Clone, CandidType, Deserialize)]
pub struct Subaccount(pub [u8; 32]);

#[derive(CandidType, Deserialize)]
pub struct State {
    pub owner: Principal,
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub icon_url: String,
    pub max_supply: u32,

    pub storage_canister: Option<Principal>,
    pub ledger_canister: Option<Principal>,

    pub creators_fee: u128,
    pub creators_address: Principal,
    pub tx_enabled: bool,
    
    pub tokens: Vec<Token>,
    pub owners: HashMap<Principal, Vec<u128>>,
    pub assets: HashMap<String, (Vec<HeaderField>, Vec<u8>)>,

    //sorted by price from high to low, insertion involves finding correct place to insert
    pub listed: Vec<Listing>
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Token {
    pub id: u128,
    pub url: String,
    pub name: String,
    pub desc: String,
    pub owner: Principal,
    pub properties: Vec<Property>,
}

pub static SUB_ACCOUNT_ZERO: Subaccount = Subaccount([0; 32]);
static ACCOUNT_DOMAIN_SEPERATOR: &[u8] = b"\x0Aaccount-id";

impl State {
    pub async fn add_genesis_record(&mut self) -> Result<u128, String> {
        let owner = caller();
        
        let event_raw = ic_cdk::export::candid::encode_args((
            owner, //caller 
            Operation::init, //op 
            None::<Principal>, //from
            owner, //to
            0u128, //tokenId
            None::<u64>, //price
            time() as i128 //timestamp
        )).unwrap();
        
        let res = ic_cdk::api::call::call_raw(
            self.storage_canister.unwrap(),
            "addRecord",
            event_raw.clone(),
            0,
        ).await;

        match res {
            Ok(res) =>{
                let val1 = Decode!(&res, u128).unwrap();
                return Ok(val1);
            },
            Err((_, s)) => {
                return Err(s);
            }
        }
    }

    fn assign_to(&mut self, to: Principal, token_id: u128) {
        let list = self.owners.get_mut(&to);

        match list {
            Some(list) => {
                list.push(token_id);
            }
            None => {
                let list = vec![token_id];
                self.owners.insert(to, list);
            }
        }
    }

    fn remove_from(&mut self, from: Principal, token_id: u128) {
        let list = self.owners.get_mut(&from);

        match list {
            Some(list) => {
                let pos = list.iter().position(|&n| n == token_id);
                if pos.is_some() {
                    list.remove(pos.unwrap());
                }
            }
            None => {
            }
        }
    }

    pub async fn mint(&mut self, data: MintRequest, caller: Principal) -> Result<u128, String>  {
        if self.tokens.len() as u32 >= self.max_supply { return Err("Max token count reached".to_string()); }

        let token_id = (self.tokens.len() as u128)+1;
        let token = Token {
            id: token_id,
            url: data.url.clone(),
            name: data.name,
            desc: data.desc,
            owner: data.owner,
            properties: data.properties,
        };

        self.tokens.push(token);
        self.assign_to(data.owner, token_id);

        self.assets.insert(data.url, (vec![("Content-Type".to_string(), data.content_type)], data.data));

        let res = self.store_tx(caller, Operation::mint, data.owner, None::<Principal>, token_id, None::<u64>, time() as i128).await;

        match res {
            Ok(_) =>{
                return Ok(self.tokens.len() as u128);
            },
            Err((_, s)) => {
                return Err(s);
            }
        }
    }

    pub async fn transfer(&mut self, from: Principal, to: Principal, token_id: u128) -> Result<bool, String> {
        if token_id > self.tokens.len() as u128 || token_id == 0  { return Err("Invalid token_id".to_string()); }

        let pos = (token_id-1) as usize;
        let token = self.tokens.get_mut(pos).unwrap();

        //Check if current owner of the token is initiating transfer
        if token.owner != from { return Err("This token does not belong to caller".to_string())}

        token.owner = to;

        self.delist(from, token_id).await;
        self.remove_from(from, token_id);
        self.assign_to(to, token_id);

        let _res = self.store_tx(from, Operation::transfer, from, Some(to), token_id, None::<u64>, time() as i128).await;

        return Ok(true);
    }

    pub async fn list(&mut self, from: Principal, token_id: u128, price: u64) -> Result<bool, &'static str> {
        if !self.tx_enabled { return Err("Transactions are not enabled"); }
        if token_id > self.tokens.len() as u128 || token_id == 0  { return Err("Invalid token_id"); }
        if price < 1000000 { return Err("Minimum listing price is 0.01"); }
        let pos = (token_id-1) as usize;
        let token = self.tokens.get_mut(pos).unwrap();

        //todo: listing price update

        //Check if current owner of the token is listing
        if token.owner != from { return Err("This token does not belong to caller")}

        let is_listed = self.listed.iter().position(|x| x.token_id == token_id);
        if is_listed.is_some() {return Err("Token already listed")}

        let mut pos:usize = 0;

        match self.listed.binary_search_by_key(&price, |b| b.price) {
            Ok(p) => { pos = p; }
            Err(p) => { pos = p; }
        }

        let listing = Listing {
            owner: from,
            token_id: token_id,
            price: price,
            time: time() as i128
        };

        //Insert in position, collection is sorted by listed price
        self.listed.insert(pos, listing);

        //Add record to ledger
        let event_raw = ic_cdk::export::candid::encode_args((
            from, 
            Operation::list, 
            from, 
            None::<Principal>, 
            token_id, 
            price, 
            time() as i128
        )).unwrap();
        
        let _res = ic_cdk::api::call::call_raw(
            self.storage_canister.unwrap(),
            "addRecord",
            event_raw.clone(),
            0,
        ).await;

        return Ok(true);
    }

    pub async fn delist(&mut self, from: Principal, token_id: u128) -> Result<bool, &'static str>  {
        if token_id > self.tokens.len() as u128 || token_id == 0  { return Err("Invalid token_id"); }
        let pos = (token_id-1) as usize;
        let token_opt = self.tokens.get_mut(pos);
        if token_opt.is_none() { return Err("Token is not listed") }
        let token = token_opt.unwrap();

        //todo: listing price update

        //Check if current owner of the token is listing
        if token.owner != from { return Err("This token does not belong to caller")}

        let is_listed = self.listed.iter().position(|x| x.token_id == token_id);

        if !is_listed.is_some() { return Err("Token is not listed") };

        self.listed.remove(is_listed.unwrap());

        //Add record to ledger
        let event_raw = ic_cdk::export::candid::encode_args((
            from, 
            Operation::delist, 
            from, 
            None::<Principal>, 
            token_id, 
            None::<u64>, 
            time() as i128
        )).unwrap();
        
        let _res_ = ic_cdk::api::call::call_raw(
            self.storage_canister.unwrap(),
            "addRecord",
            event_raw.clone(),
            0,
        ).await;

        return Ok(true) 
    }



    pub fn account_id(&mut self,account: Principal, sub_account: Option<Subaccount>) -> String {
        let mut hash = Sha224::new();
        hash.update(ACCOUNT_DOMAIN_SEPERATOR);
        print(account.to_text());
        hash.update(account.as_slice());

        let sub_account = sub_account.unwrap_or(SUB_ACCOUNT_ZERO);
        hash.update(&sub_account.0[..]);

        let fhash: [u8; 28];
        fhash = hash.finalize().into();

        let vec = [&self.generate_checksum(fhash)[..], &fhash[..]].concat();

        return hex::encode(vec);
    }

    pub fn generate_checksum(&mut self, hash: [u8; 28]) -> [u8; 4] {
        let mut hasher = crc32fast::Hasher::new();
        hasher.update(&hash);
        hasher.finalize().to_be_bytes()
    }

    pub async fn send_icp(&mut self, to: Principal, amount: u64, memo: u64) -> Result<bool, String> {
        let to_account = self.account_id(to, None).clone();
        
        let args = SendArgs {
            memo: memo,
            amount: ICPTs { e8s: amount },
            fee: ICPTs { e8s: 10000 },
            from_subaccount: None,
            to: to_account,
            created_at_time: None
        };

        //Add record to ledger
        let event_raw = ic_cdk::export::candid::encode_args(
            (args,)
        ).unwrap();

        let res = call_raw(
            self.ledger_canister.unwrap(),
            "send_dfx",
            event_raw.clone(),
            0,
        ).await;

        match res {
            Ok(_) => {
                return Ok(true);
            },
            Err((_, s)) => {
                print(s.clone());
                return Err(s.clone());
            }
        }
    }

    pub async fn store_tx(&mut self, caller: Principal, op: Operation, from: Principal, to: Option<Principal>, token_id: u128, price: Option<u64>, time: i128) -> CallResult<Vec<u8>> {
        //Add record to ledger
        let event_raw = ic_cdk::export::candid::encode_args((
            caller, 
            op, 
            from, 
            to, 
            token_id, 
            price, 
            time
        )).unwrap();
        
        let res = call_raw(
            self.storage_canister.unwrap(),
            "addRecord",
            event_raw.clone(),
            0,
        ).await;

        return res;
    }

    pub async fn purchase(&mut self, caller: Principal, args: TransactionNotification)-> Result<&'static str, &'static str> {
        let result = self._purchase(caller, args.clone()).await;

        match result {
            Ok(_) => {}, //Everythin is fine do nothing
            Err(_) => { //Transaction error, return funds if possible

                if args.amount.e8s > 10000 { //Return funds only if the sent amount is enough
                    let _res = self.send_icp(args.from, args.amount.e8s-10000, args.memo).await;
                }
            }
        }

        return result;
    }

    async fn _purchase(&mut self, caller: Principal, args: TransactionNotification)-> Result<&'static str, &'static str> {
        if !self.tx_enabled { return Err("Transaction are not enabled"); }
        if self.ledger_canister.is_none() { return Err("Ledger canister is not set");}
        if caller != self.ledger_canister.unwrap() { return Err("Only ledger canister can call notify");}

        let token_id = args.memo as u128;
        if token_id > self.tokens.len() as u128 || token_id == 0  { return Err("Invalid token_id"); }

        let listing_pos = self.listed.iter().position(|x| x.token_id == token_id);
        if listing_pos.is_none() { return Err("Token is not listed"); }

        let listing = self.listed.get(listing_pos.unwrap()).unwrap().clone();
        if listing.price > args.amount.e8s { return Err("Sent amount does not satisfy listing price");}

        //Calculate fee and amount to send
        let mut fee = (listing.price as u128 * self.creators_fee / 100000) as u64;
        let amount = listing.price - fee;

        //Include doble tx fees one for sending tokens to seller and one for sending tokens to creator
        fee = fee - 10000 - 10000;

        let _token_result = self.send_icp(listing.owner, amount, token_id as u64).await;
        match _token_result {
            Ok(_) => {},
            Err(_) => {
                return Err("Could not process transaction");
            }
        }


        let _fee_result = self.send_icp(self.creators_address, fee, token_id as u64).await;
        let _res = self.store_tx(caller, Operation::purchase, listing.owner, Some(args.from), token_id, Some(listing.price), time() as i128).await;

        //Return surplus amount to sender
        if listing.price < args.amount.e8s {
            let surplus = args.amount.e8s - listing.price;

            if surplus > 10000 { //Return only if the surplus amount is bigger then tx fee 
                let _fee_result = self.send_icp(args.from, surplus-10000, token_id as u64).await;
            }
        }

        //Remove listed position from listings, it was just purchased
        self.listed.remove(listing_pos.unwrap());

        //Transfer token to purchaser
        let pos = (token_id-1) as usize;
        let token = self.tokens.get_mut(pos).unwrap();
        
        token.owner = args.from;

        self.remove_from(listing.owner, token_id);
        self.assign_to(args.from, token_id);

        return Ok("Purchased token");
    }
} 