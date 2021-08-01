import type { Principal } from '@dfinity/agent';
export interface ICPunk {
  'addGenesisRecord' : () => Promise<bigint>,
  'claimRandom' : () => Promise<bigint>,
  'enableClaim' : (arg_0: bigint, arg_1: bigint) => Promise<undefined>,
  'getCycles' : () => Promise<bigint>,
  'getRandomToken' : () => Promise<bigint>,
  'getStorageCanister' : () => Promise<[] | [StorageActor]>,
  'listTokens' : () => Promise<Array<[] | [Principal]>>,
  'name' : () => Promise<string>,
  'owner' : () => Promise<Principal>,
  'ownerOf' : (arg_0: bigint) => Promise<[] | [Principal]>,
  'remainingTokens' : () => Promise<bigint>,
  'setStorageCanisterId' : (arg_0: [] | [Principal]) => Promise<boolean>,
  'symbol' : () => Promise<string>,
  'totalSupply' : () => Promise<bigint>,
  'transferFrom' : (arg_0: Principal, arg_1: bigint) => Promise<boolean>,
  'userTokens' : (arg_0: Principal) => Promise<Array<bigint>>,
};
export type Operation = Operation_2;
export type Operation_2 = { 'init' : null } |
  { 'claim' : null } |
  { 'approve' : null } |
  { 'transfer' : null };
export interface StorageActor {
  'addRecord' : (
      arg_0: Principal,
      arg_1: Operation,
      arg_2: [] | [Principal],
      arg_3: [] | [Principal],
      arg_4: bigint,
      arg_5: Time,
    ) => Promise<bigint>,
};
export type Time = bigint;
export default ICPunk;