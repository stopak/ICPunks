#!/bin/bash

dfx start --clean --background

PUBLIC_KEY="principal \"$( \
    dfx identity get-principal
)\""

dfx canister --no-wallet create --all

dfx build icpunks
dfx build icpunks_storage

eval dfx canister --no-wallet install icpunks --argument="'(\"ICPunks\", \"TT\", 1000, $PUBLIC_KEY)'"
eval dfx canister --no-wallet install icpunks_storage --argument="'($PUBLIC_KEY)'"

ICPUNKSID=$(dfx canister --no-wallet id icpunks)
STOREID=$(dfx canister --no-wallet id icpunks_storage)

ICPUNKSID="principal \"$ICPUNKSID\""
STOREID="principal \"$STOREID\""

eval dfx canister --no-wallet call icpunks setStorageCanisterId "'(opt $STOREID)'"
eval dfx canister --no-wallet call icpunks_storage setTokenCanisterId "'($ICPUNKSID)'"
eval dfx canister --no-wallet call icpunks addGenesisRecord
