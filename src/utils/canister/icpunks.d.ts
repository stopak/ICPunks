import type { Principal } from '@dfinity/agent';
export interface ICPunk {
  'claim' : (arg_0: bigint) => Promise<boolean>,
  'countClaimedTokens' : () => Promise<bigint>,
  'listTokens' : () => Promise<Array<[] | [Principal]>>,
  'name' : () => Promise<string>,
  'ownerOf' : (arg_0: bigint) => Promise<[] | [Principal]>,
  'symbol' : () => Promise<string>,
  'totalSupply' : () => Promise<bigint>,
  'transferFrom' : (arg_0: Principal, arg_1: bigint) => Promise<boolean>,
  'userTokens' : (arg_0: Principal) => Promise<Array<bigint>>,
};
export default ICPunk;