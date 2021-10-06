export default ({ IDL }) => {
  const Operation = IDL.Variant({
    'init' : IDL.Null,
    'list' : IDL.Null,
    'mint' : IDL.Null,
    'delist' : IDL.Null,
    'transfer' : IDL.Null,
    'purchase' : IDL.Null,
  });
  const Operation_2 = Operation;
  const Time = IDL.Int;
  const OpRecord_2 = IDL.Record({
    'op' : Operation,
    'to' : IDL.Opt(IDL.Principal),
    'tokenId' : IDL.Nat,
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : Time,
    'caller' : IDL.Principal,
    'index' : IDL.Nat,
    'price' : IDL.Opt(IDL.Nat64),
  });
  const OpRecord = OpRecord_2;
  const Storage = IDL.Service({
    'addRecord' : IDL.Func(
        [
          IDL.Principal,
          Operation_2,
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
    'owner' : IDL.Func([], [IDL.Principal], ['query']),
    'setTokenCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'tokenCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'txAmount' : IDL.Func([], [IDL.Nat], ['query']),
  });
  return Storage;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };