import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";

module {
    public type Punk = {
        address: Nat;
        owner: Word32;
    }
}