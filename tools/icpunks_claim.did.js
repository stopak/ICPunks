export default ({ IDL }) => {
  const Time = IDL.Int;
  const claim = IDL.Service({
    'addToWhitelist' : IDL.Func([IDL.Vec(IDL.Principal), Time], [IDL.Bool], []),
    'addUsers' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'canClaim' : IDL.Func([], [IDL.Bool], ['query']),
    'claimRandom' : IDL.Func([], [IDL.Nat], []),
    'claimTime' : IDL.Func([], [Time], ['query']),
    'curTime' : IDL.Func([], [Time], ['query']),
    'enableClaim' : IDL.Func([IDL.Nat, IDL.Nat], [], ['oneway']),
    'massEnableClaim' : IDL.Func([IDL.Vec(IDL.Nat)], [], ['oneway']),
    'remainingTokens' : IDL.Func([], [IDL.Nat], ['query']),
    'usersCount' : IDL.Func([], [IDL.Nat], ['query']),
    'whitelistCount' : IDL.Func([], [IDL.Nat], ['query']),
  });
  return claim;
};
export const init = ({ IDL }) => { return [IDL.Principal, IDL.Principal]; };