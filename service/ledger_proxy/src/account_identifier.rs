use candid::CandidType;
use ic_cdk::export::candid::{Principal};
use sha2::Sha224;
use sha2::Digest;
use serde::{de, de::Error, Deserialize, Serialize};
use std::{
    convert::{TryFrom, TryInto},
    fmt::{Display, Formatter},
    str::FromStr,
};

/// While this is backed by an array of length 28, it's canonical representation
/// is a hex string of length 64. The first 8 characters are the CRC-32 encoded
/// hash of the following 56 characters of hex. Both, upper and lower case
/// characters are valid in the input string and can even be mixed.
///
/// When it is encoded or decoded it will always be as a string to make it
/// easier to use from DFX.
#[derive(Clone, Copy, Hash, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct AccountIdentifier {
    pub hash: [u8; 28],
}

impl AsRef<[u8]> for AccountIdentifier {
    fn as_ref(&self) -> &[u8] {
        &self.hash
    }
}


pub static SUB_ACCOUNT_ZERO: Subaccount = Subaccount([0; 32]);
static ACCOUNT_DOMAIN_SEPERATOR: &[u8] = b"\x0Aaccount-id";

impl AccountIdentifier {
    pub fn new(account: Principal, sub_account: Option<Subaccount>) -> AccountIdentifier {
        let mut hash = Sha224::new();
        hash.update(ACCOUNT_DOMAIN_SEPERATOR);
        hash.update(account.as_slice());

        let sub_account = sub_account.unwrap_or(SUB_ACCOUNT_ZERO);
        hash.update(&sub_account.0[..]);

        AccountIdentifier {
            hash: hash.finalize().into(),
        }
    }

    pub fn from_hex(hex_str: &str) -> Result<AccountIdentifier, String> {
        let hex: Vec<u8> = hex::decode(hex_str).map_err(|e| e.to_string())?;
        Self::from_slice(&hex[..]).map_err(|err| match err {
            // Since the input was provided in hex, return an error that is hex-friendly.
            AccountIdParseError::InvalidLength(_) => format!(
                "{} has a length of {} but we expected a length of 64 or 56",
                hex_str,
                hex_str.len()
            ),
            AccountIdParseError::InvalidChecksum(err) => err.to_string(),
        })
    }

    /// Converts a blob into an `AccountIdentifier`.
    ///
    /// The blob can be either:
    ///
    /// 1. The 32-byte canonical format (4 byte checksum + 28 byte hash).
    /// 2. The 28-byte hash.
    ///
    /// If the 32-byte canonical format is provided, the checksum is verified.
    pub fn from_slice(v: &[u8]) -> Result<AccountIdentifier, AccountIdParseError> {
        // Try parsing it as a 32-byte blob.
        match v.try_into() {
            Ok(h) => {
                // It's a 32-byte blob. Validate the checksum.
                check_sum(h).map_err(AccountIdParseError::InvalidChecksum)
            }
            Err(_) => {
                // Try parsing it as a 28-byte hash.
                match v.try_into() {
                    Ok(hash) => Ok(AccountIdentifier { hash }),
                    Err(_) => Err(AccountIdParseError::InvalidLength(v.to_vec())),
                }
            }
        }
    }

    pub fn to_hex(&self) -> String {
        hex::encode(self.to_vec())
    }

    /// Converts this account identifier into a binary "address".
    /// The address is CRC32(identifier) . identifier.
    pub fn to_address(&self) -> [u8; 32] {
        let mut result = [0u8; 32];
        result[0..4].copy_from_slice(&self.generate_checksum());
        result[4..32].copy_from_slice(&self.hash);
        result
    }

    /// Tries to parse an account identifier from a binary address.
    pub fn from_address(blob: [u8; 32]) -> Result<Self, ChecksumError> {
        check_sum(blob)
    }

    pub fn to_vec(&self) -> Vec<u8> {
        [&self.generate_checksum()[..], &self.hash[..]].concat()
    }

    pub fn generate_checksum(&self) -> [u8; 4] {
        let mut hasher = crc32fast::Hasher::new();
        hasher.update(&self.hash);
        hasher.finalize().to_be_bytes()
    }
}

impl Display for AccountIdentifier {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        self.to_hex().fmt(f)
    }
}

impl FromStr for AccountIdentifier {
    type Err = String;

    fn from_str(s: &str) -> Result<AccountIdentifier, String> {
        AccountIdentifier::from_hex(s)
    }
}

impl Serialize for AccountIdentifier {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        self.to_hex().serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for AccountIdentifier {
    // This is the canonical way to read a this from string
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
        D::Error: de::Error,
    {
        let hex: [u8; 32] = hex::serde::deserialize(deserializer)?;
        check_sum(hex).map_err(D::Error::custom)
    }
}

impl From<Principal> for AccountIdentifier {
    fn from(pid: Principal) -> Self {
        AccountIdentifier::new(pid, None)
    }
}

fn check_sum(hex: [u8; 32]) -> Result<AccountIdentifier, ChecksumError> {
    // Get the checksum provided
    let found_checksum = &hex[0..4];

    // Copy the hash into a new array
    let mut hash = [0; 28];
    hash.copy_from_slice(&hex[4..32]);

    let account_id = AccountIdentifier { hash };
    let expected_checksum = account_id.generate_checksum();

    // Check the generated checksum matches
    if expected_checksum == found_checksum {
        Ok(account_id)
    } else {
        Err(ChecksumError {
            input: hex,
            expected_checksum,
            found_checksum: found_checksum.try_into().unwrap(),
        })
    }
}

impl CandidType for AccountIdentifier {
    // The type expected for account identifier is
    fn _ty() -> candid::types::Type {
        String::_ty()
    }

    fn idl_serialize<S>(&self, serializer: S) -> Result<(), S::Error>
    where
        S: candid::types::Serializer,
    {
        self.to_hex().idl_serialize(serializer)
    }
}

/// Subaccounts are arbitrary 32-byte values.
#[derive(Serialize, Deserialize, CandidType, Clone, Hash, Debug, PartialEq, Eq, Copy)]
#[serde(transparent)]
pub struct Subaccount(pub [u8; 32]);

impl Subaccount {
    pub fn to_vec(&self) -> Vec<u8> {
        self.0.to_vec()
    }
}

impl From<&Principal> for Subaccount {
    fn from(principal_id: &Principal) -> Self {
        let mut subaccount = [0; std::mem::size_of::<Subaccount>()];
        let principal_id = principal_id.as_slice();
        subaccount[0] = principal_id.len().try_into().unwrap();
        subaccount[1..1 + principal_id.len()].copy_from_slice(principal_id);
        Subaccount(subaccount)
    }
}

impl From<Subaccount> for Vec<u8> {
    fn from(val: Subaccount) -> Self {
        val.0.to_vec()
    }
}

impl Display for Subaccount {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        hex::encode(self.0).fmt(f)
    }
}

/// An error for reporting invalid checksums.
#[derive(Debug, PartialEq, Eq)]
pub struct ChecksumError {
    input: [u8; 32],
    expected_checksum: [u8; 4],
    found_checksum: [u8; 4],
}

impl Display for ChecksumError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Checksum failed for {}, expected check bytes {} but found {}",
            hex::encode(&self.input[..]),
            hex::encode(self.expected_checksum),
            hex::encode(self.found_checksum),
        )
    }
}

/// An error for reporting invalid Account Identifiers.
#[derive(Debug, PartialEq, Eq)]
pub enum AccountIdParseError {
    InvalidChecksum(ChecksumError),
    InvalidLength(Vec<u8>),
}

impl Display for AccountIdParseError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::InvalidChecksum(err) => write!(f, "{}", err),
            Self::InvalidLength(input) => write!(
                f,
                "Received an invalid AccountIdentifier with length {} bytes instead of the expected 28 or 32.",
                input.len()
            ),
        }
    }
}

#[test]
fn check_from_principal() {
    let principal = Principal::from_str("i3oug-lyaaa-aaaah-qco3a-cai").unwrap();
    let account_id = AccountIdentifier::new(principal, None);
    let account_id2 = AccountIdentifier::from_hex("6749bfc99825a9e6a37521d00dabc44b20855c8666d87429cd63215490a6c611").unwrap();
    println!("{}",account_id.to_hex());
    println!("{}",account_id2.to_hex());
}

#[test]
fn check_round_trip() {
    let ai = AccountIdentifier { hash: [7; 28] };
    let res = ai.to_hex();
    assert_eq!(
        res.parse(),
        Ok(ai),
        "The account identifier doesn't change after going back and forth between a string"
    )
}

#[test]
fn check_encoding() {
    let ai = AccountIdentifier { hash: [7; 28] };

    let en1 = candid::encode_one(ai).unwrap();
    let en2 = candid::encode_one(ai.to_string()).unwrap();

    assert_eq!(
        &en1, &en2,
        "Candid encoding of an account identifier and a string should be identical"
    );

    let de1: String = candid::decode_one(&en1[..]).unwrap();
    let de2: AccountIdentifier = candid::decode_one(&en2[..]).unwrap();

    assert_eq!(
        de1.parse(),
        Ok(de2),
        "The types are the same after decoding, even through a different type"
    );

    assert_eq!(de2, ai, "And the value itself hasn't changed");
}

#[test]
fn test_account_id_from_slice() {
    let length_27 = b"123456789_123456789_1234567".to_vec();
    assert_eq!(
        AccountIdentifier::from_slice(&length_27),
        Err(AccountIdParseError::InvalidLength(length_27))
    );

    let length_28 = b"123456789_123456789_12345678".to_vec();
    assert_eq!(
        AccountIdentifier::from_slice(&length_28),
        Ok(AccountIdentifier {
            hash: length_28.try_into().unwrap()
        })
    );

    let length_29 = b"123456789_123456789_123456789".to_vec();
    assert_eq!(
        AccountIdentifier::from_slice(&length_29),
        Err(AccountIdParseError::InvalidLength(length_29))
    );

    let length_32 = [0; 32].to_vec();
    assert_eq!(
        AccountIdentifier::from_slice(&length_32),
        Err(AccountIdParseError::InvalidChecksum(ChecksumError {
            input: length_32.try_into().unwrap(),
            expected_checksum: [128, 112, 119, 233],
            found_checksum: [0, 0, 0, 0],
        }))
    );

    // A 32-byte address with a valid checksum
    let length_32 = [
        128, 112, 119, 233, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
    ]
    .to_vec();
    assert_eq!(
        AccountIdentifier::from_slice(&length_32),
        Ok(AccountIdentifier { hash: [0; 28] })
    );
}

#[test]
fn test_account_id_from_hex() {
    let length_56 = "00000000000000000000000000000000000000000000000000000000";
    assert_eq!(
        AccountIdentifier::from_hex(length_56),
        Ok(AccountIdentifier { hash: [0; 28] })
    );

    let length_57 = "000000000000000000000000000000000000000000000000000000000";
    assert!(AccountIdentifier::from_hex(length_57).is_err());

    let length_58 = "0000000000000000000000000000000000000000000000000000000000";
    assert_eq!(
        AccountIdentifier::from_hex(length_58),
        Err("0000000000000000000000000000000000000000000000000000000000 has a length of 58 but we expected a length of 64 or 56".to_string())
    );

    let length_64 = "0000000000000000000000000000000000000000000000000000000000000000";
    assert!(AccountIdentifier::from_hex(length_64)
        .unwrap_err()
        .contains("Checksum failed"));

    // Try again with correct checksum
    let length_64 = "807077e900000000000000000000000000000000000000000000000000000000";
    assert_eq!(
        AccountIdentifier::from_hex(length_64),
        Ok(AccountIdentifier { hash: [0; 28] })
    );
}

#[test]
fn test_compare_accounts() {
    // Try again with correct checksum
    let length_64 = "807077e900000000000000000000000000000000000000000000000000000000";

    let account_id = AccountIdentifier::from_hex(length_64).unwrap();
    let account_id2 = AccountIdentifier::from_hex("6749bfc99825a9e6a37521d00dabc44b20855c8666d87429cd63215490a6c611").unwrap();
    let account_id3 = AccountIdentifier::from_hex(length_64).unwrap();

    println!("{}",account_id.to_hex());
    println!("{}",account_id2.to_hex());

    assert!(account_id != account_id2);
    assert!(account_id == account_id3);

    // assert_eq!(
    //     account_id,
    //     account_id2,
    // );
}
