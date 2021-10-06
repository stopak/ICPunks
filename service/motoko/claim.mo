import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Buffer "mo:base/Buffer";
import Option "mo:base/Option";
import Array "mo:base/Array";

/*
 * This service enables claiming of icpunks, once icpunks are minted they are assigned to this storage, that enables claiming by anyone
 */


 actor class claim (_tokenCanister: Principal, _owner: Principal) {
    private var owner_ : Principal = _owner;

    func isEqP(x: Principal, y: Principal): Bool { x == y };

    //List of users who claimed tokens
    private var users_ = HashMap.HashMap<Principal, Nat>(5000, isEqP, Principal.hash);
    //List of principals eligible for claiming at given time
    private var whitelist_ = HashMap.HashMap<Principal, Time.Time>(7000, isEqP, Principal.hash);
    //Treshold value after which open claiming is available
    private var whitelistUntil_: Time.Time = 1630526400000000000;


    //List of tokens available for claiming
    private var remainingTokens_ : [Nat] = [];


    type TokenCanister = actor {
        transfer_to : (to: Principal, token_id: Nat) -> async Bool;
    };
    private var tokenCanister_ : TokenCanister = actor(Principal.toText(_tokenCanister));

    //Get claiming time for caller principal
    public shared query(msg) func claimTime() : async Time.Time {
        if (Time.now() > whitelistUntil_) return whitelistUntil_;

        var user = whitelist_.get(msg.caller);

        if (Option.isNull(user)) return whitelistUntil_;

        return Option.unwrap(user);
    };

    public query func curTime() : async Time.Time {
        return Time.now();
    };


    func _canClaim(caller: Principal) : Bool {
        if (remainingTokens_.size() == 0) return false; //No more tokens to claim

        var owner = users_.get(caller);
        if (Option.isSome(owner)) return false; //user already claimed token, only one per wallet

        if (Time.now() > whitelistUntil_) return true; //Whitelist disabled

        var user = whitelist_.get(caller);
        if (Option.isNull(user)) return false; //user is not in whitelist

        return Time.now() > Option.unwrap(user); //True if it is later then user treshhold
    };

    public shared query(msg) func canClaim() : async Bool {
        return _canClaim(msg.caller);
    };

    public shared query(msg) func whitelistCount() : async Nat {
        assert(msg.caller == owner_); //Only owner can call this function

        return whitelist_.size();
    };

    public shared(msg) func addToWhitelist(users: [Principal], at: Time.Time) : async Bool {
        assert(msg.caller == owner_); //Only owner can call this function

        for (user in users.vals()) {
            whitelist_.put(user, at);
        };
        return true;
    };

    public shared(msg) func addUsers(users: [Principal]) : async Bool {
        assert(msg.caller == owner_); //Only owner can call this function

        for (user in users.vals()) {
            users_.put(user, 0);
        };
        return true;
    };

    public shared query(msg) func usersCount() : async Nat {
        assert(msg.caller == owner_); //Only owner can call this function
        return users_.size();
    };

    public shared(msg) func massEnableClaim(tokens: [Nat]) {
        assert(msg.caller == owner_); //Only owner can call this function
        remainingTokens_ := Array.append(remainingTokens_, tokens);
    };

    //Marks tokens in given range as enabled for claiming, only then users can claim those tokens
    public shared(msg) func enableClaim(from: Nat, to: Nat) {
        assert(msg.caller == owner_); //Only owner can call this function
        assert(from < to);
        var counter = from;

        // while (counter < to)  {
        //     //Check if given token is not already claimed (if yes then it cannot be once again put for claiming)
        //     assert(Option.isNull(tokens_[counter]));
        //     counter +=1;
        // };

        //Create buffer that contains all tokens from to to
        var buffer = Buffer.Buffer<Nat>(to-from);

        counter := from;
        while (counter < to)  {
            buffer.add(counter);
            counter +=1;
        };

        //Append buffer to remaining tokens array
        remainingTokens_ := Array.append(remainingTokens_, buffer.toArray());
    };

    ///Returns number of all tokens
    public query func remainingTokens() : async Nat {
        return remainingTokens_.size();
    };

    //Claim Random Punk, single principal can claim max one punk
    public shared(msg) func claimRandom() : async Nat {
        var eligible = _canClaim(msg.caller); //check if caller can claim

        assert(eligible); //throw is user is not eligible

        var tokenId = await _getRandomToken();

        //Remove token from claim list
        var filtered = Array.filter(remainingTokens_, func (a: Nat) : Bool {
            return a != tokenId;
        });
        remainingTokens_ := filtered;

        //Add owner to owners hashmap
        users_.put(msg.caller, tokenId);

        //Send token to caller
        var tx = await tokenCanister_.transfer_to(msg.caller, tokenId);

        assert(tx);

        //Return claimed token Id
        tokenId;
    };

    // Returns random number of token that is available for claim
    func _getRandomToken() : async Nat {
        var blob = await Random.blob();

        var generator = Random.Finite(blob);

        var nullNumber = generator.range(16);
        let maxValue = Nat.pow(2, 16)-1;

        var number = Option.unwrap(nullNumber);

        var result = number*remainingTokens_.size()/maxValue;

        return remainingTokens_[result];
    };    
 };