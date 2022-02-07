export const idlFactory = ({ IDL }) => {
  const Operation__1 = IDL.Variant({
    'init' : IDL.Null,
    'list' : IDL.Null,
    'mint' : IDL.Null,
    'delist' : IDL.Null,
    'transfer' : IDL.Null,
    'purchase' : IDL.Null,
  });
  const Time = IDL.Int;
  const Operation = IDL.Variant({
    'init' : IDL.Null,
    'list' : IDL.Null,
    'mint' : IDL.Null,
    'delist' : IDL.Null,
    'transfer' : IDL.Null,
    'purchase' : IDL.Null,
  });
  const OpRecord = IDL.Record({
    'op' : Operation,
    'to' : IDL.Opt(IDL.Principal),
    'tokenId' : IDL.Nat,
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : Time,
    'caller' : IDL.Principal,
    'index' : IDL.Nat,
    'price' : IDL.Opt(IDL.Nat64),
  });
  const Storage = IDL.Service({
    'addRecord' : IDL.Func(
        [
          IDL.Principal,
          Operation__1,
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
          IDL.Nat,
          IDL.Opt(IDL.Nat64),
          Time,
        ],
        [IDL.Nat],
        [],
      ),
    'allHistory' : IDL.Func([], [IDL.Vec(OpRecord)], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getHistoryByAccount' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(OpRecord))],
        ['query'],
      ),
    'getHistoryByIndex' : IDL.Func([IDL.Nat], [OpRecord], ['query']),
    'getOwners' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'owner' : IDL.Func([], [IDL.Principal], ['query']),
    'setTokenCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'tokenCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'txAmount' : IDL.Func([], [IDL.Nat], ['query']),
  });
  return Storage;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
