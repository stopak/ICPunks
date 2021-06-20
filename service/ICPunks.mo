import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import List "mo:base/List";
import Option "mo:base/Option";
import Principal "mo:base/Principal";

actor class ICPunk () {
    // private stable var owner_ : Principal = _owner;
    private stable let name_ : Text = "ICPunk";
    private stable let symbol_ : Text = "ICPunk";
    private stable let totalSupply_ : Nat = 1000;

    func isEq(x: Nat, y: Nat): Bool { x == y };

    // private var owners = HashMap.HashMap<Principal, List<Nat>>(1, isEq, Principal.hash);
    private var tokens_ = HashMap.HashMap<Nat, Principal>(totalSupply_, isEq,  Nat32.fromNat);
    // private var tokes = Array.init(1, Principal.fromText("aaaaaa-aaaa"));
    // private var tokens = HashMap.HashMap<Nat, Principal>(100, isEq, hashNat);
    // private var tokenArray_ : [var Principal] = Array.init<Principal>(totalSupply_, Principal.fromText("0"));

    public query func countClaimedTokens() : async Nat {
        tokens_.size()
    };

    public query func listTokens() : async [?Principal] {
        let items : [var ?Principal] = Array.init<?Principal>(totalSupply_, null);

        for ((id, owner) in tokens_.entries()) {
            items[id] := ?owner;
        };

        Array.freeze<?Principal>(items);
    };

    // public query func getPunks() : async [Punk] {
    //     var items: [Punk] = [];
        
    //     for ((id, punk) in punks.entries()) {
    //         items := Array.append<Punk>(items, [punk]);
    //     };

    //     items
    // };

    public query func userTokens(user: Principal): async [Nat] {
        var items: [Nat] = [];
        
        for ((id, owner) in tokens_.entries()) {
            if (owner == user) {
                items := Array.append<Nat>(items, [id]);
            }
        };

        items
    };

    ///Used to claim tokens, this should be made obsolete, 
    public shared(msg) func claim(tokenId: Nat) : async Bool {
        assert(tokenId <= totalSupply_);
        assert(tokenId > 0);

        var currentOwner = tokens_.get(tokenId);

        switch (currentOwner) {
            //Token was already claimed, return false
            case (?owner) {
                return false;
            };
            //The token is not claimed, claim it!
            case (_) {
                tokens_.put(tokenId, msg.caller);
                return false;
            };
        };
    };

    ///Invokes transfer of token from one principal to the other, only the owner of the token can call this action
    public shared(msg) func transferFrom(to: Principal, tokenId: Nat) : async Bool {
        assert(tokenId <= totalSupply_);
        assert(tokenId > 0);

        var currentOwner = tokens_.get(tokenId);


        switch (currentOwner) {
            //Token was already claimed, checking if the owner is sending to new address
            case (?owner) {
                assert(owner == msg.caller);

                tokens_.put(tokenId, to);
                return true;
            };
            //The token is not claimed, for now return false
            case (_) {
                return false;
            };
        };
    };

    ///Returns number of all tokens
    public query func totalSupply() : async Nat {
        return totalSupply_;
    };


    //ERC721 Metadata
    public query func name() : async Text {
        return name_;
    };

    public query func symbol() : async Text {
        return symbol_;
    };

};
