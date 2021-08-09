#!/bin/bash

# dfx start --no-artificial-delay --background --clean 
PUBLIC_KEY="principal \"$( \
    dfx identity get-principal
)\""

dfx canister --network ic create icpunks
dfx canister --network ic create icpunks_storage
dfx canister --network ic create icpunks_assets

dfx build --network ic icpunks
dfx build --network ic icpunks_storage
dfx build --network ic icpunks_assets

eval dfx canister --network ic install icpunks --argument='("ICPunks", "TT", 10000, principal "dkzjk-sxlxb-cdh5x-rtexw-7y54l-yfwbq-rhayo-ufw34-lugle-j4s23-4ae")' -m reinstall
eval dfx canister --network ic install icpunks_storage --argument='(principal "dkzjk-sxlxb-cdh5x-rtexw-7y54l-yfwbq-rhayo-ufw34-lugle-j4s23-4ae")'
eval dfx canister --network ic install icpunks_assets

ICPUNKSID=$(dfx canister --network ic id icpunks)
STOREID=$(dfx canister --network ic id icpunks_storage)

ICPUNKSID="principal \"$ICPUNKSID\""
STOREID="principal \"$STOREID\""

eval dfx canister --network ic call icpunks setStorageCanisterId '(opt principal "qfh5c-6aaaa-aaaah-qakeq-cai")'
eval dfx canister --network ic call icpunks_storage setTokenCanisterId 'principal "qcg3w-tyaaa-aaaah-qakea-cai"'
eval dfx canister --network ic call icpunks addGenesisRecord

echo "Preparation complete"