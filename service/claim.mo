/*
 * This service enables claiming of icpunks, once icpunks are minted they are assigned to this storage, that enables claiming by anyone
 */


 actor class claim {
     
    private stable var tokens_ : [var Nat] = [var];

    private stable var remainingTokensCount_ : Nat = 0;
    private stable var remainingTokens_ : [Nat] = [];

      // ///Returns random number of token that is available for claim
    // public func getRandomToken() : async Nat {
    //     var blob = await Random.blob();

    //     var generator = Random.Finite(blob);

    //     var nullNumber = generator.range(16);
    //     let maxValue = Nat.pow(2, 16)-1;

    //     var number = Option.unwrap(nullNumber);

    //     var result = number*remainingTokensCount_/maxValue;

    //     return remainingTokens_[result];
    // };

    // //Claim Random Punk, single principal can claim max one punk
    // public shared(msg) func claimRandom() : async Nat {
    //     assert(storageCanister_ != null);
    //     assert(remainingTokensCount_ > 0);

    //     //Check if principal has already claimed token, if yes abort
    //     var exist = owners_.get(msg.caller);
    //     assert(Option.isNull(exist));

    //     var tokenId = await getRandomToken();

    //     //Remove token from claiming list
    //     remainingTokensCount_ -= 1;

    //     var filtered = Array.filter(remainingTokens_, func (a: Nat) : Bool {
    //         return a != tokenId;
    //     });

    //     remainingTokens_ := filtered;

    //     //Assign token to sender principal
    //     tokens_[tokenId] := Option.make(msg.caller);
    //     //Add owner to owners hashmap
    //     owners_.put(msg.caller, Array.init(1, tokenId));
    //     //Add record to transaction storage
    //     var tx = await Option.unwrap(storageCanister_).addRecord(msg.caller, #claim, null, ?msg.caller, tokenId, Time.now());

    //     //Return claimed token Id
    //     tokenId;
    // };

    // //Marks tokens in given range as enabled for claiming, only then users can claim those tokens
    // public shared(msg) func enableClaim(from: Nat, to: Nat) {
    //     assert(msg.caller == owner_); //Only owner can call this function
    //     assert(from < to);
    //     var counter = from;

    //     while (counter < to)  {
    //         //Check if given token is not already claimed (if yes then it cannot be once again put for claiming)
    //         assert(Option.isNull(tokens_[counter]));
    //         counter +=1;
    //     };

    //     var buffer = Buffer.Buffer<Nat>(to-from);

    //     counter := from;
    //     while (counter < to)  {
    //         buffer.add(counter);

    //         counter +=1;
    //     };

    //     remainingTokens_ := Array.append(remainingTokens_, buffer.toArray());
    //     remainingTokensCount_ += (to-from);
    // };

    // ///Returns number of all tokens
    // public query func remainingTokens() : async Nat {
    //     return remainingTokensCount_;
    // };

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

     
 };