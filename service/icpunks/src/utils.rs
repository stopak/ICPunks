use sha2::Sha224;
use ic_cdk::export::candid::{CandidType, Deserialize, Principal};


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

//Calculates crc32 checksum
pub fn generate_checksum(&mut self, hash: [u8; 28]) -> [u8; 4] {
    let mut hasher = crc32fast::Hasher::new();
    hasher.update(&hash);
    hasher.finalize().to_be_bytes()
}