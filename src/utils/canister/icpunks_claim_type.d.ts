import type { Principal } from '@dfinity/agent';
export type Time = bigint;
export interface claim {
  'addToWhitelist' : (arg_0: Array<Principal>, arg_1: Time) => Promise<boolean>,
  'canClaim' : () => Promise<boolean>,
  'claimRandom' : () => Promise<bigint>,
  'claimTime' : () => Promise<Time>,
  'curTime' : () => Promise<Time>,
  'enableClaim' : (arg_0: bigint, arg_1: bigint) => Promise<undefined>,
  'remainingTokens' : () => Promise<bigint>,
};
export default claim;