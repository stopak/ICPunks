import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import List "mo:base/List";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Storage "./storage";
import Ledger "./ledger_types";
import Types "./types";
import Time "mo:base/Time";
import Random "mo:base/Random";
import Float "mo:base/Float";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import ArrayEx "./array";

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
    type Listing = Types.Listing;

    type LedgerCanister = actor {
        send_dfx: (args : Ledger.SendArgs) -> async Ledger.BlockHeight;
    };

    type StorageActor = actor {
        addRecord : (caller: Principal, op: Operation, from: ?Principal, to: ?Principal, tokenId: Nat, price: ?Nat64, timestamp: Time.Time) -> async Nat;
    };

    private stable var owner_ : Principal = _owner;
    private stable let name_ : Text = _name;
    private stable let symbol_ : Text = _symbol;
    private stable var totalSupply_ : Nat = 0;
    private stable let maxSupply_ : Nat = _maxSupply;
    private stable var storageCanister_ : ?StorageActor = null;
    
    //In basis points
    private stable var creatorsFee_ : Nat64 = 0;
    private stable var ledgerCanister_ : ?LedgerCanister = null;

    func isEq(x: Nat, y: Nat): Bool { x == y };
    func isEqP(x: Principal, y: Principal): Bool { x == y };

    // private var owners = HashMap.HashMap<Principal, List<Nat>>(1, isEq, Principal.hash);
    // private var tokens_ = HashMap.HashMap<Nat, Principal>(totalSupply_, isEq,  Nat32.fromNat);
    private stable var tokens_ : [var Types.TokenStorage] = [var];
    private stable var listed_ : [Listing] = [];

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
            price = null;
            timestamp = Time.now();
        };


    //Initializes storage with genesis record
    public shared(msg) func add_genesis_record() : async Nat {
        assert(msg.caller == owner_);
        assert(storageCanister_ != null);

        let res = await Option.unwrap(storageCanister_).addRecord(
            genesis.caller, 
            genesis.op, 
            genesis.from, 
            genesis.to, 
            0,
            null,
            genesis.timestamp);
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

    //Handles minting of the token
    private func mint_(caller: Principal, data: MintRequest) : async Nat {
        //Increase total supply
        totalSupply_ += 1;

        //Create token desc based on MintRequest
        let token : Types.TokenStorage = {
            id = totalSupply_;
            url = data.url;
            name = data.name;
            desc = data.desc;
            properties = data.properties;
            var owner = caller;
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
        let res = await Option.unwrap(storageCanister_).addRecord(caller, #mint, null, Option.make(caller), totalSupply_, null, Time.now());

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
        assert(totalSupply_+data.size() < maxSupply_);

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

    public shared(msg) func set_owner(newOwner: Principal) : async Bool {
        assert(msg.caller == owner_);

        owner_ := newOwner;

        return true;
    };

    ///Returns owner of given token
    public query func owner_of(tokenId: Nat) : async Principal {
        validate_(tokenId);

        //The array is 0 based, and token ids starts from 1, so w need to subtract 1
        var token = tokens_.get(tokenId-1);

        token.owner;
    };

    //Checks if tokenId in question is valid
    private func validate_(tokenId: Nat) {
        assert(tokenId < totalSupply_+1);
        assert(tokenId > 0);
    };

    //Returns description of the token
    public query func data_of(tokenId: Nat) : async TokenDesc {
        validate_(tokenId);

        let token = tokens_[tokenId-1];

        {
            id = token.id;
            url = token.url;
            name = token.name;
            desc = token.desc;
            owner = token.owner;
            properties = token.properties;
        };
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

    //Transfers token ownerships from @from to @to
    private func transfer_(to: Principal, token: Types.TokenStorage) : () {
        
        //User has to have map entry, we can just call unsafe unwrap
        var tokens = Option.unwrap(owners_.get(token.owner));
        //Remove token from current owner
        owners_.put(token.owner, Array.filter<Nat>(tokens, func(x) {x != token.id}));
        assignToOwner(to, token.id);

        token.owner := to;

    };

    ///Invokes transfer of token from one principal to the other, only the owner of the token can call this action
    public shared(msg) func transfer_to(to: Principal, tokenId: Nat) : async Bool {
        validate_(tokenId);

        var token = tokens_.get(tokenId-1);
        //Only owner of the token can transfer it
        assert(token.owner == msg.caller);

        //Transfer token
        transfer_(to, token);
        // var new_token = {
        //     id = token.id;
        //     url = token.url;
        //     name = token.name;
        //     desc = token.desc;
        //     owner = to;
        //     properties = token.properties;
        // };

        // //Update owner in token array
        // tokens_[tokenId-1] := new_token;

        //Add #transfer record to ledger
        let res = await Option.unwrap(storageCanister_).addRecord(msg.caller, #transfer, Option.make(msg.caller), Option.make(to), tokenId, null, Time.now());

        return true;
    };

    //
    //Listing and selling related functions, default pagesize is 100
    //

    public query func get_listed(page: Nat) : async [Listing] {
        return ArrayEx.copy(listed_, page*100, 100);
    }; 

    public shared(msg) func list(tokenId: Nat, price: Nat64) : async Bool {
        validate_(tokenId);

        let listing = Array.find(listed_, func (i : Listing) : Bool {
            i.tokenId == tokenId
        });

        switch (listing) {
            case (?listing) {
                return false;
            };
            case (_) {
                let item : Listing = {
                    owner = msg.caller;
                    tokenId = tokenId;
                    price = price;
                    timestamp = Time.now();
                };

                listed_ := Array.append(listed_, Array.make(item));
                //Add #list record to ledger
                let res = await Option.unwrap(storageCanister_).addRecord(msg.caller, #list, Option.make(msg.caller), null, tokenId, Option.make(price), Time.now());
            
                return true;
            };
        };

        false;
    };

    public shared(msg) func delist(tokenId: Nat) : async Bool {
        validate_(tokenId);

        let listing = Array.find(listed_, func (i : Listing) : Bool {
            i.tokenId == tokenId
        });

        switch (listing) {
            case (?listing) {
                listed_ := Array.filter(listed_, func (i : Listing) : Bool {
                    i.tokenId == tokenId
                });

                let res = await Option.unwrap(storageCanister_).addRecord(msg.caller, #delist, Option.make(msg.caller), null, tokenId, Option.make(listing.price), Time.now());

                return true;
            };
            case (_) {
                return false;
            };
        };

        false;
    };

    public shared(msg) func transaction_notification(data: TransactionNotification) : async Result {
        //Ledger principal must be set
        assert(Option.isSome(ledgerCanister_));
        //Only ledger can send transaction_notifications
        assert(msg.caller == Principal.fromActor(Option.unwrap(ledgerCanister_)));

        let tokenId = Nat64.toNat(data.memo);
        //Transaction must relate to existing token
        assert(tokenId < totalSupply_+1);

        let listing = Array.find(listed_, func (x: Listing) : Bool {
            x.tokenId == tokenId;
        });

        switch (listing) {
            case (?listing) {
                assert(listing.price <= data.amount.e8s);

                let token = tokens_.get(tokenId-1);

                //Transfer token
                transfer_(data.to, token);

                //Calculate fee
                let fee = listing.price * creatorsFee_ / 10000;
                let amount = listing.price - fee;

                let block = await Option.unwrap(ledgerCanister_).send_dfx({
                    memo = Nat64.fromNat(listing.tokenId);
                    amount = {e8s = fee;};
                    to = "Test";
                    fee = {e8s = 10000};
                    from_subaccount = null;
                    created_at_time = null;
                });

                let fee_block = await Option.unwrap(ledgerCanister_).send_dfx({
                    memo = Nat64.fromNat(listing.tokenId);
                    amount = {e8s = fee;};
                    to = "Test";
                    fee = {e8s = 10000};
                    from_subaccount = null;
                    created_at_time = null;
                });
            };

            //Token must be listed
            case (_) {
                return #Err("Could not find listing for given tokenId");
            };
        };

        //Transfered amount must match the listing price

        // //Send ICP to seller
        // // await Option.unwrap(storageCanister_).send_dfx({
        // //     memo: listing.tokenId;
        // //     amount: {e8s: fee;};
        // //     to: "Test";
        // //     fee: {e8s: 10000};
        // //     created_at_time: Time.now();
        // // });

        // let sendArgs : Ledger.SendArgs = {
        //     memo: listing.tokenId;
        //     amount: {e8s: amount;};
        // };

        // //Send ICP fee to marketplace
        // // await Option.unwrap(storageCanister_).send_dfx({

        // // });

        // //Add purchase tx to ledger
        // let res = await Option.unwrap(storageCanister_).addRecord(msg.caller, #purchase, Option.make(lilsting.owner), Option.make(to), tokenId, listing.price, Time.now());

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