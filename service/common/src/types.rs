use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use std::borrow::Cow;
use serde_bytes::{ByteBuf, Bytes};

pub type HeaderField = (String, String);

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct HttpRequest {
    pub method: String,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub body: ByteBuf,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct HttpResponse {
    pub status_code: u16,
    pub headers: Vec<HeaderField>,
    pub body: Cow<'static, Bytes>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct TokenStorage {
    pub id: u32,
    pub url: String,
    pub name: String,
    pub desc: String,
    pub owner: Principal,
    pub properties: Vec<Property>
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Property {
    pub name: String,
    pub value: String
}

#[derive(Clone, CandidType, Deserialize)]
pub struct MintRequest {
    pub name: String,
    pub url: String,
    pub desc: String,
    pub properties: Vec<Property>,
    pub data: Vec<u8>,
    pub content_type: String,
    pub owner: Principal
}

#[derive(CandidType, Deserialize, Clone)]
pub enum Operation {
    delist,
    init,
    list,
    mint,
    purchase,
    transfer
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Record {
    pub caller: Principal,
    pub op: Operation,
    pub from: Option<Principal>,
    pub to: Option<Principal>,
    pub token_id: u128,
    pub price: u64,
    pub timestamp: u128
}

#[derive(Clone, CandidType, Deserialize)]
pub struct ICPTs {
    pub e8s: u64,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct TransactionNotification {
    pub amount: ICPTs,
    pub block_height: u64,
    pub from: Principal,
    pub from_subaccount: Option<Subaccount>,
    pub memo: u64,
    pub to: Principal,
    pub to_subaccount: Option<Subaccount>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct TimeStamp {
    pub timestamp_nanos: u64,
}

#[derive(Copy, Clone, CandidType, Deserialize)]
pub struct Subaccount(pub [u8; 32]);

#[derive(Clone, CandidType, Deserialize)]
pub struct SendArgs {
    pub memo: u64,
    pub amount: ICPTs,
    pub fee: ICPTs,
    pub from_subaccount: Option<Subaccount>,
    pub to: String,
    pub created_at_time: Option<TimeStamp>,
}

