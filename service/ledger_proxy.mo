import Ledger "./ledger_types";
import Types "./types";
import Option "mo:base/Option";


shared(msg) actor class LedgerProxy(_owner: Principal) {
    private stable var owner_ : Principal = _owner;
    
    private stable var token_canister_id_ : Principal = msg.caller;
    private stable var notifyCanister_ : ?NotifyActor = null;

    private var blockHeight_ : Ledger.BlockHeight = 0;
    private var minBlockHeight_ : Ledger.BlockHeight = 0;

    type NotifyActor = actor {
        transaction_notification : (data: Types.TransactionNotification) -> async Types.Result;
    };

    public shared(msg) func send_dfx(args : Ledger.SendArgs) : async Ledger.BlockHeight {
        0;
    };

    public shared(msg) func proxy_notify_dfx(args: Types.TransactionNotification) {
        let res = await Option.unwrap(notifyCanister_).transaction_notification(args);
    };

    
    public query func get_block_height() : async Ledger.BlockHeight {
        blockHeight_;
    };
};