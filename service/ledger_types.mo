module {
    type Memo = nat64;
    type ICPTs = record {
        e8s : nat64;
    };  
    type SubAccount = vec nat8;
    type AccountIdentifier = text;
    
    type SendArgs = record {
        memo: Memo;
        amount: ICPTs;
        fee: ICPTs;
        from_subaccount: opt SubAccount;
        to: AccountIdentifier;
        created_at_time: opt TimeStamp;
    };
};