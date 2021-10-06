import Ledger "./ledger_types";
import Types "./types";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import ArrayEx "./array";


shared actor class LedgerProxy(_owner: Principal, _tokenCanister: Principal) {
    private stable var owner_ : Principal = _owner;
    
    // private stable var token_canister_id_ : Principal = msg.caller;
    private stable var notifyCanister_ : ?NotifyActor = ?actor(Principal.toText(_tokenCanister));

    private stable var blockHeight_ : Ledger.BlockHeight = 0;
    private stable var minBlockHeight_ : Ledger.BlockHeight = 0;

    private stable var blocks : [var Ledger.SendArgs] = [var];
    
    private stable var lastProcessedBlock : Ledger.BlockHeight = 0;

    type NotifyActor = actor {
        transaction_notification : (data: Types.TransactionNotification) -> async Types.Result;
    };

    public shared(msg) func setOwner(newOwner: Principal) : async Bool {
        assert(msg.caller == owner_);

        owner_ := newOwner;

        return true;
    };

    //Receive send ICP, only tokens canister can send this
    public shared(msg) func send_dfx(args : Ledger.SendArgs) : async Ledger.BlockHeight {
        assert(Option.isSome(notifyCanister_));
        assert(msg.caller == Principal.fromActor(Option.unwrap(notifyCanister_)));
        
        blocks := Array.thaw(Array.append(Array.freeze(blocks), Array.make(args)));
        return minBlockHeight_+Nat64.fromNat(blocks.size());
    };

    //Send ICP payment notification to target canister, only owner can send this
    public shared(msg) func proxy_notify_dfx(args: Types.TransactionNotification) : async Ledger.TxResult {
        assert(msg.caller == owner_);

        if (args.block_height < lastProcessedBlock) {
            return {
                res = #Ok "Block already processed";
                blocks = [];
            };

        } else {
            lastProcessedBlock := args.block_height;

            let pos = blocks.size();
            let res = await Option.unwrap(notifyCanister_).transaction_notification(args);
            let new_pos = blocks.size();
            let size = new_pos - pos;

            let outtxs = ArrayEx.copy(Array.freeze(blocks), pos, size);

            return {
                res = res;
                blocks = outtxs;
            };
        }
    };

    //Returns all blocks, only owner can call
    public shared query(msg) func get_blocks() : async [Ledger.SendArgs] {
        assert(msg.caller == owner_);
        
        return Array.freeze(blocks);
    };

    public shared query(msg) func get_last_blocks(length: Nat) : async [Ledger.SendArgs] {
        assert(msg.caller == owner_);

        var start = blocks.size()-length-1;
        if (start < 0) {
            start := 0;
        };
    

        return ArrayEx.copy(Array.freeze(blocks), start, length);
    };

    public shared query(msg) func get_block(block: Nat) : async Ledger.SendArgs {
        assert(msg.caller == owner_);
        assert(blocks.size() > block);


        return blocks[block];
    };

    //Returns block height
    public query func get_block_height() : async Ledger.BlockHeight {
        blockHeight_;
    };
};