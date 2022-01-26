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

eval dfx canister --no-wallet install icpunks --argument="'(\"C4Meadow\", \"C4M\", 10000, $PUBLIC_KEY)'"
eval dfx canister --no-wallet install icpunks_storage --argument="'($PUBLIC_KEY)'"

ICPUNKSID=$(dfx canister --no-wallet id icpunks)
STOREID=$(dfx canister --no-wallet id icpunks_storage)

ICPUNKSID="principal \"$ICPUNKSID\""
STOREID="principal \"$STOREID\""

eval dfx canister --no-wallet call icpunks set_storage_canister "'($STOREID)'"
eval dfx canister --no-wallet call icpunks_storage setTokenCanisterId "'($ICPUNKSID)'"
eval dfx canister --no-wallet call icpunks add_genesis_record

# echo "Preparation complete"
eval dfx canister --no-wallet call icpunks set_owner "'(principal \"wgkgu-x3efg-isqui-eycha-nxyr2-7eydm-xso43-a7lx2-2tlid-felwc-eqe\")'"