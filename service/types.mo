/**
 * Module     : types.mo
 * Copyright  : 2021 DFinance Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : DFinance Team <hello@dfinance.ai>
 * Stability  : Experimental
 * Changed    : Adapted operations and OpRecord for NFT purposes, ERC 721
 */

import Time "mo:base/Time";

module {
    /// Update call operations
    public type Operation = {
        // #mint;
        // #burn;
        #claim;
        #transfer;
        #approve;
        #init;
    };
    /// Update call operation record fields
    public type OpRecord = {
        caller: Principal;
        op: Operation;
        index: Nat;
        from: ?Principal;
        to: ?Principal;
        tokenId: Nat;
        timestamp: Time.Time;
    };

    public type Property = {
        name: Text;
        value: Text;
    };

    public type PropertyDesc = {
        name: Text;
        values: [Text];
    };

    public type TokenDesc = {
        id: Nat;
        url: Text;
        name: Text;
        desc: Text;
        owner: Principal;
        properties: [Property]
    };
};    