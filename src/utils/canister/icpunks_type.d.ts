import type { Principal } from '@dfinity/agent';

export interface ICPTs { 'e8s' : bigint };
export interface ICPunk {
  'add_genesis_record' : () => Promise<bigint>,
  'data_of' : (arg_0: bigint) => Promise<TokenDesc>,
  'delist' : (arg_0: bigint) => Promise<boolean>,
  'get_cycles' : () => Promise<bigint>,
  'get_listed' : (arg_0: bigint) => Promise<Array<Listing>>,
  'get_listed_count' : () => Promise<bigint>,
  'get_storage_canister' : () => Promise<[] | [StorageActor]>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'list' : (arg_0: bigint, arg_1: bigint) => Promise<boolean>,
  'mint' : (arg_0: MintRequest) => Promise<bigint>,
  'multi_mint' : (arg_0: Array<MintRequest>) => Promise<Array<bigint>>,
  'name' : () => Promise<string>,
  'owner' : () => Promise<Principal>,
  'owner_of' : (arg_0: bigint) => Promise<Principal>,
  'set_owner' : (arg_0: Principal) => Promise<boolean>,
  'set_storage_canister_id' : (arg_0: [] | [Principal]) => Promise<boolean>,
  'symbol' : () => Promise<string>,
  'total_supply' : () => Promise<bigint>,
  'transaction_notification' : (arg_0: TransactionNotification) => Promise<
      Result
    >,
  'transfer_to' : (arg_0: Principal, arg_1: bigint) => Promise<boolean>,
  'user_tokens' : (arg_0: Principal) => Promise<Array<bigint>>,
};
export type Listing = Listing_2;
export interface Listing_2 {
  'token_id' : bigint,
  'owner' : Principal,
  'timestamp' : Time,
  'price' : bigint,
  'description': string
};
export type MintRequest = MintRequest_2;
export interface MintRequest_2 {
  'url' : string,
  'contentType' : string,
  'data' : Array<number>,
  'desc' : string,
  'name' : string,
  'properties' : Array<Property>,
};
export type Operation = Operation_2;
export type Operation_2 = { 'init' : null } |
  { 'list' : null } |
  { 'mint' : null } |
  { 'delist' : null } |
  { 'transfer' : null } |
  { 'purchase' : null };
export interface Property { 'value' : string, 'name' : string };
export type Result = Result_2;
export type Result_2 = { 'Ok' : string } |
  { 'Err' : string };
export interface StorageActor {
  'addRecord' : (
      arg_0: Principal,
      arg_1: Operation,
      arg_2: [] | [Principal],
      arg_3: [] | [Principal],
      arg_4: bigint,
      arg_5: [] | [bigint],
      arg_6: Time,
    ) => Promise<bigint>,
};
export interface StreamingCallbackResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Array<number>,
};
export interface StreamingCallbackToken {
  'key' : string,
  'sha256' : [] | [Array<number>],
  'index' : bigint,
  'content_encoding' : string,
};
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export type Time = bigint;
export type TokenDesc = TokenDesc_2;
export interface TokenDesc_2 {
  'id' : bigint,
  'url' : string,
  'owner' : Principal,
  'desc' : string,
  'name' : string,
  'properties' : Array<Property>,
};
export type TransactionNotification = TransactionNotification_2;
export interface TransactionNotification_2 {
  'to' : Principal,
  'to_subaccount' : [] | [number],
  'from' : Principal,
  'memo' : bigint,
  'from_subaccount' : [] | [number],
  'amount' : ICPTs,
  'block_height' : bigint,
};
export default ICPunk;