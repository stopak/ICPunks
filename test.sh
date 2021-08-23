#!/bin/bash

dfx start --no-artificial-delay --clean --background 
PUBLIC_KEY="principal \"$( \
    dfx identity get-principal
)\""

dfx canister --no-wallet create icpunks
dfx canister --no-wallet create icpunks_storage
# dfx canister --no-wallet create icpunks_assets

dfx build icpunks
dfx build icpunks_storage
# dfx build icpunks_assets

eval dfx canister --no-wallet install icpunks --argument="'(\"ICPunks\", \"TT\", 10000, $PUBLIC_KEY)'" -m reinstall
eval dfx canister --no-wallet install icpunks_storage --argument="'($PUBLIC_KEY)'"
# eval dfx canister --no-wallet install icpunks_assets

ICPUNKSID=$(dfx canister --no-wallet id icpunks)
STOREID=$(dfx canister --no-wallet id icpunks_storage)

ICPUNKSID="principal \"$ICPUNKSID\""
STOREID="principal \"$STOREID\""

eval dfx canister --no-wallet call icpunks set_storage_canister_id "'(opt $STOREID)'"
eval dfx canister --no-wallet call icpunks_storage setTokenCanisterId "'($ICPUNKSID)'"
eval dfx canister --no-wallet call icpunks add_genesis_record

echo "Preparation complete"

echo "Mint test"
eval dfx canister --no-wallet call icpunks mint "'(record { url=\"/Test\"; contentType=\"json\"; data=vec {}; desc=\"\"; name=\"\"; properties=vec{}})'"
eval dfx canister --no-wallet call icpunks total_supply
eval dfx canister --no-wallet call icpunks data_of "'(1)'"

# eval dfx canister --no-wallet call icpunks enableClaim "'(500, 10000)'"
# eval dfx canister --no-wallet call icpunks remainingTokens

# echo "20x Random Token complete"

# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken
# eval dfx canister --no-wallet call icpunks getRandomToken


# echo "Token Claim test"

# eval dfx canister --no-wallet call icpunks claimRandom
# eval dfx canister --no-wallet call icpunks remainingTokens

dfx stop