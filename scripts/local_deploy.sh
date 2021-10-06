#!/bin/bash

dfx stop
rm -r .dfx/local

dfx start --no-artificial-delay --background --clean 
PUBLIC_KEY="principal \"$( \
    dfx identity get-principal
)\""

# cd ../internet-identity
# rm -r .dfx/local
# II_ENV=development dfx deploy --no-wallet --argument '(null)'

# cp .dfx/local/canister_ids.json ../icpunks/.dfx/local/canister_ids.json

# cd ../icpunks

dfx canister --no-wallet create icpunks
dfx canister --no-wallet create icpunks_storage
dfx canister --no-wallet create icpunks_assets

dfx build icpunks
dfx build icpunks_storage
dfx build icpunks_assets

eval dfx canister --no-wallet install icpunks --argument="'(\"ICPunks\", \"TT\", 10000, $PUBLIC_KEY)'" -m reinstall
eval dfx canister --no-wallet install icpunks_storage --argument="'($PUBLIC_KEY)'" -m reinstall
eval dfx canister --no-wallet install icpunks_assets -m reinstall


ICPUNKSID=$(dfx canister --no-wallet id icpunks)
STOREID=$(dfx canister --no-wallet id icpunks_storage)

ICPUNKSID="principal \"$ICPUNKSID\""
STOREID="principal \"$STOREID\""

eval dfx canister --no-wallet call icpunks set_storage_canister "'($STOREID)'"
eval dfx canister --no-wallet call icpunks_storage setTokenCanisterId "'($ICPUNKSID)'"
eval dfx canister --no-wallet call icpunks add_genesis_record

echo "Preparation complete"