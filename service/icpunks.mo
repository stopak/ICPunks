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
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Debug "mo:base/Debug";

actor class ICPunk (_name: Text, _symbol: Text, _maxSupply: Nat, _owner: Principal) {
    type Operation = Types.Operation;
    type OpRecord = Types.OpRecord;
    type Property = Types.Property;
    type PropertyDesc = Types.PropertyDesc;
    type TokenDesc = Types.TokenDesc;
    type TokenData = Types.TokenData;
    type TransactionNotification = Types.TransactionNotification;
    type HttpRequest = Types.HttpRequest;
    type HttpResponse = Types.HttpResponse;
    type Result = Types.Result;
    type MintRequest = Types.MintRequest;

    type StorageActor = actor {
        addRecord : (caller: Principal, op: Operation, from: ?Principal, to: ?Principal, tokenId: Nat, timestamp: Time.Time) -> async Nat;
    };

    private stable var owner_ : Principal = _owner;
    private stable let name_ : Text = _name;
    private stable let symbol_ : Text = _symbol;
    private stable var totalSupply_ : Nat = 0;
    private stable let maxSupply_ : Nat = _maxSupply;
    private stable var storageCanister_ : ?StorageActor = null;

    func isEq(x: Nat, y: Nat): Bool { x == y };
    func isEqP(x: Principal, y: Principal): Bool { x == y };

    // private var owners = HashMap.HashMap<Principal, List<Nat>>(1, isEq, Principal.hash);
    // private var tokens_ = HashMap.HashMap<Nat, Principal>(totalSupply_, isEq,  Nat32.fromNat);
    private stable var tokens_ : [var ?TokenDesc] = Array.init<?TokenDesc>(0, null);
    
    private var assetMap_ = HashMap.HashMap<Text, TokenData>(totalSupply_, Text.equal, Text.hash);
    private var owners_ = HashMap.HashMap<Principal, [Nat]>(totalSupply_, isEqP,  Principal.hash);

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


    //Initializes storage with genesis record
    public shared(msg) func add_genesis_record() : async Nat {
        assert(msg.caller == owner_);
        assert(storageCanister_ != null);

        let res = await Option.unwrap(storageCanister_).addRecord(genesis.caller, genesis.op, genesis.from, genesis.to, 
            0, genesis.timestamp);
        return res;
    };

    //Returns number of cycles in this container
    public query func get_cycles() : async Nat {
        return ExperimentalCycles.balance();
    };

    public query func get_storage_canister() : async ?StorageActor {
        return storageCanister_;
    };


    //Setups storage canister
    public shared(msg) func set_storage_canister_id(storage: ?Principal) : async Bool {
        assert(msg.caller == owner_);
        // assert(storageCanister == null);

        storageCanister_ := ?actor(Principal.toText(Option.unwrap(storage)));

        return true;
    };

    private func assignToOwner(owner: Principal, tokenId: Nat) {
        var tokens = owners_.get(owner);

        switch (tokens) {
            case (?tokens) {
                owners_.put(owner, Array.append(tokens, [tokenId]));
            };
            case (_) {
                owners_.put(owner, Array.make(tokenId));
            };
        };
    };

    private func mint_(caller: Principal, data: MintRequest) : async Nat {
        //Increase total supply
        totalSupply_ += 1;

        //Create token desc based on MintRequest
        let token : ?TokenDesc = ?{
            id = totalSupply_;
            url = data.url;
            name = data.name;
            desc = data.desc;
            properties = data.properties;
            owner = caller;
        };

        //Add new token to array
        tokens_ := Array.thaw(Array.append(Array.freeze(tokens_), Array.make(token)));
        //Add new token to user map
        assignToOwner(caller, totalSupply_);

        let tokenData = {
            id = totalSupply_;
            data = [Blob.fromArray(data.data)];
            contentType = data.contentType;
        };
        //Store token data asset
        assetMap_.put(data.url, tokenData);

        //Add to ledger
        let res = await Option.unwrap(storageCanister_).addRecord(caller, #mint, null, Option.make(caller), totalSupply_, Time.now());

        return totalSupply_;
    };


    //Mints token
    public shared(msg) func mint(data: MintRequest) : async Nat {
        //For now only owner can mint
        assert(msg.caller == owner_);
        //We can mint until max supply has been reached
        assert(totalSupply_ < maxSupply_);

        return await mint_(msg.caller, data);
    };

    //Mint multiple tokens
    public shared(msg) func multi_mint(data: [MintRequest]) : async [Nat] {
        //For now only owner can mint
        assert(msg.caller == owner_);
        //We can mint until max supply has been reached
        assert(totalSupply_ < maxSupply_);

        // let dataList = List.fromArray(data);

        var tokens = List.nil<Nat>();

        for (req in data.vals()) {
            let tokenId = await mint_(msg.caller, req);
            tokens := List.append(tokens, List.make(tokenId));
        };

        return List.toArray(tokens);
    };

    //
    //ERC721 similar methods
    //
    ///Returns number of all tokens
    //ERC721 Metadata
    public query func name() : async Text {
        return name_;
    };

    public query func symbol() : async Text {
        return symbol_;
    };

    public query func total_supply() : async Nat {
        return totalSupply_;
    };

    public query func owner() : async Principal {
        return owner_;
    };

    public shared(msg) func caller() : async Principal {
        return msg.caller;
    };

    public shared(msg) func set_owner(newOwner: Principal) : async Bool {
        assert(msg.caller == owner_);

        owner_ := newOwner;

        return true;
    };

    ///Returns owner of given token
    public query func owner_of(tokenId: Nat) : async Principal {
        validate_(tokenId);

        //The array is 0 based, and token ids starts from 1, so w need to subtract 1
        var token = Option.unwrap(tokens_.get(tokenId-1));

        token.owner;
    };

    //Checks if tokenId in question is valid
    private func validate_(tokenId: Nat) {
        assert(tokenId < totalSupply_+1);
        assert(tokenId > 0);
    };

    //Returns description of the token
    public query func data_of(tokenId: Nat) : async ?TokenDesc {
        validate_(tokenId);

        tokens_[tokenId-1];
    };

    ///Returns list of tokens owned by given user
    public query func user_tokens(user: Principal): async [Nat] {
        var tokens = owners_.get(user);

        switch (tokens) {
            case (?items) {
                return items;
            };
            case (_) {
                return [];
            }
        }
    };

    ///Invokes transfer of token from one principal to the other, only the owner of the token can call this action
    public shared(msg) func transfer_to(to: Principal, tokenId: Nat) : async Bool {
        validate_(tokenId);

        var token = Option.unwrap(tokens_.get(tokenId-1));
        
        assert(token.owner == msg.caller);

        //User has to have map entry, we can just call unsafe unwrap
        var tokens = Option.unwrap(owners_.get(token.owner));
        //Remove token from current owner
        owners_.put(token.owner, Array.filter<Nat>(tokens, func(x) {x != token.id}));

        assignToOwner(to, tokenId);

        var new_token = {
            id = token.id;
            url = token.url;
            name = token.name;
            desc = token.desc;
            owner = to;
            properties = token.properties;
        };

        //Update owner in token array
        tokens_[tokenId-1] := Option.make(new_token);

        //Add #transfer record to ledger
        let res = await Option.unwrap(storageCanister_).addRecord(msg.caller, #transfer, Option.make(msg.caller), Option.make(to), tokenId, Time.now());

        return true;
    };

    //
    //Listing and selling related functions
    //

    public query func get_listed(page: Nat) : async [Nat] {
        let records : [Nat] = [1];

        records;
    };

    public func list(tokenId: Nat, price: Nat) : async Bool {
        false;
    };

    public func delist(tokenId: Nat) : async Bool {
        false;
    };

    public func transaction_notification(data: TransactionNotification) : async Result {
        return #Ok("OK");
    };

    public query func http_request(request: HttpRequest) : async HttpResponse {
        Debug.print(request.url);
        let path = Iter.toArray(Text.tokens(request.url, #text("/")));

        var response_code: Nat16 = 200;
        var body = Blob.fromArray([]);
        var headers: [(Text, Text)] = [];

        if (path.size() == 0) {
            response_code := 404;
        } else {
            let asset = assetMap_.get(request.url);

            switch (asset) {
                case (?asset) {
                    body := asset.data[0];
                    headers := [("Content-Type", asset.contentType)];
                };
                case (_) {
                    response_code := 404;
                }
            };
        };


        return {
            body = body;
            headers = headers;
            status_code = response_code;
            streaming_strategy = null;
        };
    };
};   