#!/bin/bash

# dfx stop
# rm -r .dfx/local

# dfx start --background --clean 
PUBLIC_KEY="principal \"$( \
    dfx identity get-principal
)\""

dfx canister --no-wallet create icpunks
dfx canister --no-wallet create icpunks_storage

dfx build icpunks
dfx build icpunks_storage

eval dfx canister --no-wallet install icpunks --argument="'(\"ICats\", \"ICA\", 10000, $PUBLIC_KEY)'"
eval dfx canister --no-wallet install icpunks_storage --argument="'($PUBLIC_KEY)'"

ICPUNKSID=$(dfx canister --no-wallet id icpunks)
STOREID=$(dfx canister --no-wallet id icpunks_storage)

ICPUNKSID="principal \"$ICPUNKSID\""
STOREID="principal \"$STOREID\""

eval dfx canister --no-wallet call icpunks set_storage_canister "'($STOREID)'"
eval dfx canister --no-wallet call icpunks_storage setTokenCanisterId "'($ICPUNKSID)'"
eval dfx canister --no-wallet call icpunks add_genesis_record

echo "Preparation complete"
# eval dfx canister --no-wallet call icpunks set_owner "'(principal \"xm4y3-54lfy-pkijk-3gpzg-gsm3l-yr7al-i5ai7-odpf7-l2pmv-222rl-7qe\")'"
