/**
 * Module     : storage.mo
 * Copyright  : 2021 DFinance Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : DFinance Team <hello@dfinance.ai>
 * Stability  : Experimental
 * Modified   : Adapted to ERC721
 */

import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Types "./types";
import Nat "mo:base/Nat";
import ExperimentalCycles "mo:base/ExperimentalCycles";

shared(msg) actor class Storage(_owner: Principal) {
    type Operation = Types.Operation;
    type OpRecord = Types.OpRecord;

    public type Stats = {
        // owners: Nat;
        highestSell: Nat64;
        volumeTraded: Nat64;
    };

    private stable var owner_ : Principal = _owner;
    private stable var token_canister_id_ : Principal = msg.caller;
    private stable var ops : [var OpRecord] = [var];
    
    private var ops_acc = HashMap.HashMap<Principal, [var OpRecord]>(1, Principal.equal, Principal.hash);
    //todo: missing private var ops_token = HashMap.HashMap<Nat, [var OpRecord]>(1, Nat.equal, Nat.hash);

    system func preupgrade() {
    };

    system func postupgrade() {
    };

    public shared(msg) func setTokenCanisterId(token: Principal) : async Bool {
        assert(msg.caller == owner_);
        token_canister_id_ := token;
        return true;
    };

    private func putOpsAcc(who: Principal, o: OpRecord) {
        switch (ops_acc.get(who)) {
            case (?op_acc) {
                var op_new : [var OpRecord] = Array.thaw(Array.append(Array.freeze(op_acc), Array.make(o)));
                ops_acc.put(who, op_new);
            };
            case (_) {
                ops_acc.put(who, Array.thaw(Array.make(o)));
            };            
        }
    };

    public shared(msg) func addRecord(
        caller: Principal, 
        op: Operation, 
        from: ?Principal, 
        to: ?Principal, 
        tokenId: Nat,
        price: ?Nat64,
        timestamp: Time.Time
    ) : async Nat {
        assert(msg.caller == token_canister_id_);
        
        let index = ops.size();
        let o : OpRecord = {
            caller = caller;
            op = op;
            index = index;
            from = from;
            to = to;
            tokenId = tokenId;
            price = price;
            timestamp = timestamp;
        };
        ops := Array.thaw(Array.append(Array.freeze(ops), Array.make(o)));
        putOpsAcc(caller, o);
        if ((not Option.isNull(from)) and (from != ?caller)) { putOpsAcc(Option.unwrap(from), o); };
        if ((not Option.isNull(to)) and (to != ?caller) and (to != from) ) { putOpsAcc(Option.unwrap(to), o); };
        return index;
    };

    /// Get Project Stats
    public query func stats() : async Stats {
        var highestSell : Nat64 = 0;
        // var owners: Nat = 0;
        var volume: Nat64 = 0;

        for (op in ops.vals()) {
            switch (op.op) {
                case (#purchase) {
                    let price = Option.unwrap(op.price);
                    volume += price;
                    if (price > highestSell) { highestSell := price }
                };
                case (_) {

                };
            };
        };

        var stats = {
            highestSell;
            volumeTraded = volume;
        };

        return stats;
    };

    /// Get Current owners
    public query func getOwners() : async [Principal] {
        var tokens : [var Principal] = Array.init(1000, Principal.fromText("dwymk-kn72k-3b7pm-jkqo6-w2b6o-mb4wc-amwya-k2m4s-7vh54-qq5p3-kqe"));

        for (op in ops.vals()) {
            switch (op.op) {
                case (#mint) {
                    tokens[op.tokenId-1] := Option.unwrap(op.from);
                };

                case (#purchase) {
                    tokens[op.tokenId-1] := Option.unwrap(op.to);
                };

                case (#transfer) {
                    tokens[op.tokenId-1] := Option.unwrap(op.to);
                };

                case (_) {

                };
            };
        };

        return Array.freeze(tokens);
    };

    /// Get History by index.
    public query func getHistoryByIndex(index: Nat) : async OpRecord {
        return ops[index];
    };

    /// Get history by account.
    public query func getHistoryByAccount(a: Principal) : async ?[OpRecord] {
        switch (ops_acc.get(a)) {
            case (?op_acc) {
                let res = Array.freeze(op_acc);
                return ?res;
            };
            case (_) {
                return null;
            }
        }
    };

    /// Get all update call history.
    public query func allHistory() : async [OpRecord] {
        return Array.freeze(ops);
    };

    public query func tokenCanisterId() : async Principal {
        return token_canister_id_;
    };

    public query func owner() : async Principal {
        return owner_;
    };

    public query func txAmount() : async Nat {
        return ops.size();
    };

    public query func getCycles() : async Nat {
        return ExperimentalCycles.balance();
    };
};