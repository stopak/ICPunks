import Prim "mo:prim";

module {
    public func copy<A>(xs: [A], start: Nat, length: Nat) : [A] {
        if (start > xs.size()) return [];
        
        let size = xs.size() - start;
        var items = length;

        if (size < length)
            items := size;

        Prim.Array_tabulate<A>(items, func (i : Nat) : A {
            xs[i+start];
        });
    }
}