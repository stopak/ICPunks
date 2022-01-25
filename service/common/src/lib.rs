mod types;

use ic_cdk::export::candid::{Principal};

use sha2::Sha224;
use sha2::Digest;

pub use types::*;

pub static SUB_ACCOUNT_ZERO: Subaccount = Subaccount([0; 32]);
pub static ACCOUNT_DOMAIN_SEPERATOR: &[u8] = b"\x0Aaccount-id";

//Calculates crc32 checksum
pub fn generate_checksum(hash: [u8; 28]) -> [u8; 4] {
    let mut hasher = crc32fast::Hasher::new();
    hasher.update(&hash);
    hasher.finalize().to_be_bytes()
}

//Calculates account id from principal and sub_account
pub fn account_id(account: Principal, sub_account: Option<Subaccount>) -> String {
    let mut hash = Sha224::new();
    hash.update(ACCOUNT_DOMAIN_SEPERATOR);
    // print(account.to_text());
    hash.update(account.as_slice());

    let sub_account = sub_account.unwrap_or(SUB_ACCOUNT_ZERO);
    hash.update(&sub_account.0[..]);

    let fhash: [u8; 28];
    fhash = hash.finalize().into();

    let vec = [&generate_checksum(fhash)[..], &fhash[..]].concat();

    return hex::encode(vec);
}

