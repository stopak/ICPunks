import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import List "mo:base/List";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Storage "./storage";
import Types "./types";
import Time "mo:base/Time";
import Random "mo:base/Random";
import Float "mo:base/Float";

actor class ICPunk (_name: Text, _symbol: Text, _totalSupply: Nat, _owner: Principal) {
    type Operation = Types.Operation;
    type OpRecord = Types.OpRecord;
    type Property = Types.Property;
    type PropertyDesc = Types.PropertyDesc;
    type TokenDesc = Types.TokenDesc;

    type StorageActor = actor {
        addRecord : (caller: Principal, op: Operation, from: ?Principal, to: ?Principal, tokenId: Nat, timestamp: Time.Time) -> async Nat;
    };

    private stable var owner_ : Principal = _owner;
    private stable let name_ : Text = _name;
    private stable let symbol_ : Text = _symbol;
    private stable let totalSupply_ : Nat = _totalSupply;
    private stable var storageCanister_ : ?StorageActor = null;

    func isEq(x: Nat, y: Nat): Bool { x == y };
    func isEqP(x: Principal, y: Principal): Bool { x == y };

    // private var owners = HashMap.HashMap<Principal, List<Nat>>(1, isEq, Principal.hash);
    // private var tokens_ = HashMap.HashMap<Nat, Principal>(totalSupply_, isEq,  Nat32.fromNat);
    private stable var tokens_ : [var ?Principal] = Array.init<?Principal>(_totalSupply, null);

    private var owners_ = HashMap.HashMap<Principal, [var Nat]>(totalSupply_, isEqP,  Principal.hash);


    private stable var remainingTokensCount_ : Nat = 0;
    private stable var remainingTokens_ : [Nat] = [];

    // private var tokes = Array.init(1, Principal.fromText("aaaaaa-aaaa"));
    // private var tokens = HashMap.HashMap<Nat, Principal>(100, isEq, hashNat);
    // private var tokenArray_ : [var Principal] = Array.init<Principal>(totalSupply_, Principal.fromText("0"));

    private stable let genesis : OpRecord = {
            caller = owner_;
            op = #init;
            index = 0;
            from = null;
            to = ?owner_;
            tokenId = 0;
            timestamp = Time.now();
        };

    //Setups storage canister
    public shared(msg) func setStorageCanisterId(storage: ?Principal) : async Bool {
        assert(msg.caller == owner_);
        // assert(storageCanister == null);

        storageCanister_ := ?actor(Principal.toText(Option.unwrap(storage)));

        return true;
    };

    //Initializes storage with genesis record
    public shared(msg) func addGenesisRecord() : async Nat {
        assert(msg.caller == owner_);
        assert(storageCanister_ != null);

        let res = await Option.unwrap(storageCanister_).addRecord(genesis.caller, genesis.op, genesis.from, genesis.to, 
            0, genesis.timestamp);
        return res;
    };

    ///Returns list of tokens owned by given user
    public query func userTokens(user: Principal): async [Nat] {
        
        var tokens = owners_.get(user);

        switch (tokens) {
            case (?items) {
                return Array.freeze(items);
            };
            case (_) {
                return [];
            }
        }
    };

    ///Returns owner of given token
    public query func ownerOf(tokenId: Nat) : async ?Principal {
        assert(tokenId < totalSupply_);
        assert(tokenId >= 0);

        var currentOwner = tokens_.get(tokenId);

        switch (currentOwner) {
            //Token was already claimed, return false
            case (?owner) {
                return ?owner;
            };

            case (_) {
                return null;
            }
        };
    };

    //Returns description of the token
    public query func dataOf(tokenId: Nat) : async TokenDesc {
        let properties : [Property] = [];

        let record : TokenDesc = {
            id = 1;
            url = "tokens/1.jpg";
            name = "Super Punk";
            desc = "";
            owner = Principal.fromText("aaaaaaa-aaaa");
            properties = properties;
        };

        return record;
    };

    public func list(tokenId: Nat, price: Nat) : async Bool {
        false;
    };
    public func delist(tokenId: Nat) : async Bool {
        false;
    };

    public query func getListed(page: Nat) : async [Nat] {
        let records : [Nat] = [1];

        records;
    };

    ///Returns random number of token that is available for claim
    public func getRandomToken() : async Nat {
        var blob = await Random.blob();

        var generator = Random.Finite(blob);

        var nullNumber = generator.range(16);
        let maxValue = Nat.pow(2, 16)-1;

        var number = Option.unwrap(nullNumber);

        var result = number*remainingTokensCount_/maxValue;

        return remainingTokens_[result];
    };

    //Claim Random Punk, single principal can claim max one punk
    public shared(msg) func claimRandom() : async Nat {
        assert(storageCanister_ != null);
        assert(remainingTokensCount_ > 0);

        //Check if principal has already claimed token, if yes abort
        var exist = owners_.get(msg.caller);
        assert(Option.isNull(exist));

        var tokenId = await getRandomToken();

        //Remove token from claiming list
        remainingTokensCount_ -= 1;

        var filtered = Array.filter(remainingTokens_, func (a: Nat) : Bool {
            return a != tokenId;
        });

        remainingTokens_ := filtered;

        //Assign token to sender principal
        tokens_[tokenId] := Option.make(msg.caller);
        //Add owner to owners hashmap
        owners_.put(msg.caller, Array.init(1, tokenId));
        //Add record to transaction storage
        var tx = await Option.unwrap(storageCanister_).addRecord(msg.caller, #claim, null, ?msg.caller, tokenId, Time.now());

        //Return claimed token Id
        tokenId;
    };

    //Marks tokens in given range as enabled for claiming, only then users can claim those tokens
    public shared(msg) func enableClaim(from: Nat, to: Nat) {
        assert(msg.caller == owner_); //Only owner can call this function
        assert(from < to);
        var counter = from;

        while (counter < to)  {
            //Check if given token is not already claimed (if yes then it cannot be once again put for claiming)
            assert(Option.isNull(tokens_[counter]));
            counter +=1;
        };

        var buffer = Buffer.Buffer<Nat>(to-from);

        counter := from;
        while (counter < to)  {
            buffer.add(counter);

            counter +=1;
        };

        remainingTokens_ := Array.append(remainingTokens_, buffer.toArray());
        remainingTokensCount_ += (to-from);
    };

    ///Returns number of all tokens
    public query func remainingTokens() : async Nat {
        return remainingTokensCount_;
    };

    // ///Used to claim tokens, this should be made obsolete, 
    // public shared(msg) func claim(tokenId: Nat) : async Bool {
    //     assert(tokenId < totalSupply_);
    //     assert(tokenId >= 0);
    //     assert(storageCanister_ != null);
    //     // assert(token < totalSupply_);

    //     var currentOwner = tokens_.get(tokenId);

    //     switch (currentOwner) {
    //         //Token was already claimed, return false
    //         case (?owner) {
    //             return false;
    //         };
    //         //The token is not claimed, claim it!
    //         case (_) {

    //             var ownedToken = owners_.get(msg.caller);

    //             switch (ownedToken) {
    //                 //Sender already claimed token before!, only one token per person
    //                 case (?token) {
    //                     return false;
    //                 };
    //                 case (_) {
    //                     tokens_[tokenId] := Option.make(msg.caller);
    //                     // claimedTokens_ += 1;

    //                     // owners_.put(msg.caller, Array.make(tokenId));

    //                     var tx = await Option.unwrap(storageCanister_).addRecord(msg.caller, #claim, null, ?msg.caller, tokenId, Time.now());

    //                     return true;
    //                 };
    //             };

    //             return false;
    //         };
    //     };
    // };

    ///Invokes transfer of token from one principal to the other, only the owner of the token can call this action
    public shared(msg) func transferFrom(to: Principal, tokenId: Nat) : async Bool {
        assert(tokenId < totalSupply_);
        assert(tokenId >= 0);

        var currentOwner = tokens_.get(tokenId);


        switch (currentOwner) {
            //Token was already claimed, checking if the owner is sending to new address
            case (?owner) {
                assert(owner == msg.caller);

                tokens_[tokenId] := Option.make(to);
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

    public query func owner() : async Principal {
        return owner_;
    };

    //ERC721 Metadata
    public query func name() : async Text {
        return name_;
    };

    public query func symbol() : async Text {
        return symbol_;
    };

    public query func getStorageCanister() : async ?StorageActor {
        return storageCanister_;
    };

    public query func getCycles() : async Nat {
        return ExperimentalCycles.balance();
    };

};   