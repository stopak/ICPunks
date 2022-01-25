// import "base_types.proto";

// Annotations related to the use of hardware wallets. The annotated messages are
// parsed on hardware wallets and marked fields are displayed in a trusted user
// interface (TUI). We must not, for instance, add fields that would change the
// semantics of the message such that old hardware wallets would not display
// appropriate information to users.

// ** LEDGER CANISTER ENDPOINTS

#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PrincipalId {
    #[prost(bytes="vec", tag="1")]
    pub serialized_id: ::prost::alloc::vec::Vec<u8>,
}
// * Shared Endpoints *

/// Get a single block
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BlockRequest {
    #[prost(uint64, tag="1")]
    pub block_height: u64,
}
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct EncodedBlock {
    #[prost(bytes="vec", tag="1")]
    pub block: ::prost::alloc::vec::Vec<u8>,
}
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BlockResponse {
    #[prost(oneof="block_response::BlockContent", tags="1, 2")]
    pub block_content: ::core::option::Option<block_response::BlockContent>,
}
/// Nested message and enum types in `BlockResponse`.
pub mod block_response {
    #[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum BlockContent {
        #[prost(message, tag="1")]
        Block(super::EncodedBlock),
        #[prost(message, tag="2")]
        CanisterId(super::PrincipalId),
    }
}
// Get a set of blocks
// message GetBlocksRequest {
//   uint64 start = 1;
//   uint64 length = 2;
// }

// message Refund {
//   BlockHeight refund = 2;
//   string error = 3;
// }

// message ToppedUp {
// }

// message EncodedBlocks {
//     repeated EncodedBlock blocks = 1;
// }

// message GetBlocksResponse {
//   oneof get_blocks_content {
//     EncodedBlocks blocks = 1;
//     string error = 2;
//   }
// }

// // Iterate through blocks
// message IterBlocksRequest {
//   uint64 start = 1;
//   uint64 length = 2;
// }

// message IterBlocksResponse {
//   repeated EncodedBlock blocks = 1;
// }

// message ArchiveIndexEntry {
//   uint64 height_from = 1;
//   uint64 height_to = 2;
//   PrincipalId canister_id = 3;
// }

// message ArchiveIndexResponse {
//   repeated ArchiveIndexEntry entries = 1;
// }

// ** ARCHIVE CANISTER ENDPOINTS **

/// * Archive canister *
/// Init the archive canister
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ArchiveInit {
    #[prost(uint32, tag="1")]
    pub node_max_memory_size_bytes: u32,
    #[prost(uint32, tag="2")]
    pub max_message_size_bytes: u32,
}
/// Add blocks to the archive canister
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ArchiveAddRequest {
    #[prost(message, repeated, tag="1")]
    pub blocks: ::prost::alloc::vec::Vec<Block>,
}
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ArchiveAddResponse {
}
// Fetch a list of all of the archive nodes
// message GetNodesRequest {
// }

// message GetNodesResponse {
//   repeated PrincipalId nodes = 1;
// }

/// ** BASIC TYPES **
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Tokens {
    #[prost(uint64, tag="1")]
    pub e8s: u64,
}
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Payment {
    #[prost(message, optional, tag="1")]
    pub receiver_gets: ::core::option::Option<Tokens>,
}
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BlockHeight {
    #[prost(uint64, tag="1")]
    pub height: u64,
}
/// This is the
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)] #[cfg_attr(feature = "test", derive(comparable::Comparable))]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Block {
    #[prost(message, optional, tag="1")]
    pub parent_hash: ::core::option::Option<Hash>,
    #[prost(message, optional, tag="2")]
    pub timestamp: ::core::option::Option<TimeStamp>,
    #[prost(message, optional, tag="3")]
    pub transaction: ::core::option::Option<Transaction>,
}
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Hash {
    #[prost(bytes="vec", tag="1")]
    pub hash: ::prost::alloc::vec::Vec<u8>,
}
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Account {
    #[prost(message, optional, tag="1")]
    pub identifier: ::core::option::Option<AccountIdentifier>,
    #[prost(message, optional, tag="2")]
    pub balance: ::core::option::Option<Tokens>,
}
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)] #[cfg_attr(feature = "test", derive(comparable::Comparable))]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Transaction {
    #[prost(message, optional, tag="4")]
    pub memo: ::core::option::Option<Memo>,
    /// obsolete
    #[prost(message, optional, tag="5")]
    pub created_at: ::core::option::Option<BlockHeight>,
    #[prost(message, optional, tag="6")]
    pub created_at_time: ::core::option::Option<TimeStamp>,
    #[prost(oneof="transaction::Transfer", tags="1, 2, 3")]
    pub transfer: ::core::option::Option<transaction::Transfer>,
}
/// Nested message and enum types in `Transaction`.
pub mod transaction {
    #[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]
    #[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Transfer {
        #[prost(message, tag="1")]
        Burn(super::Burn),
        #[prost(message, tag="2")]
        Mint(super::Mint),
        #[prost(message, tag="3")]
        Send(super::Send),
    }
}
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Send {
    #[prost(message, optional, tag="1")]
    pub from: ::core::option::Option<AccountIdentifier>,
    #[prost(message, optional, tag="2")]
    pub to: ::core::option::Option<AccountIdentifier>,
    #[prost(message, optional, tag="3")]
    pub amount: ::core::option::Option<Tokens>,
    #[prost(message, optional, tag="4")]
    pub max_fee: ::core::option::Option<Tokens>,
}
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Mint {
    #[prost(message, optional, tag="2")]
    pub to: ::core::option::Option<AccountIdentifier>,
    #[prost(message, optional, tag="3")]
    pub amount: ::core::option::Option<Tokens>,
}
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Burn {
    #[prost(message, optional, tag="1")]
    pub from: ::core::option::Option<AccountIdentifier>,
    #[prost(message, optional, tag="3")]
    pub amount: ::core::option::Option<Tokens>,
}
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)] #[cfg_attr(feature = "test", derive(comparable::Comparable))]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AccountIdentifier {
    /// Can contain either:
    ///  * the 32 byte identifier (4 byte checksum + 28 byte hash)
    ///  * the 28 byte hash
    #[prost(bytes="vec", tag="1")]
    pub hash: ::prost::alloc::vec::Vec<u8>,
}
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Subaccount {
    #[prost(bytes="vec", tag="1")]
    pub sub_account: ::prost::alloc::vec::Vec<u8>,
}
#[derive(candid::CandidType, candid::Deserialize, serde::Serialize)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Memo {
    #[prost(uint64, tag="1")]
    pub memo: u64,
}
#[derive(Eq, PartialOrd, Ord, Hash, Copy, candid::CandidType, serde::Deserialize, serde::Serialize)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TimeStamp {
    #[prost(uint64, tag="1")]
    pub timestamp_nanos: u64,
}
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Certification {
    #[prost(bytes="vec", tag="1")]
    pub certification: ::prost::alloc::vec::Vec<u8>,
}
