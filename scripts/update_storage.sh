#!/bin/bash

PUBLIC_KEY="principal \"$( \
    dfx identity get-principal
)\""

dfx canister --network ic create icpunks_storage
dfx build --network ic icpunks_storage

eval dfx canister --network ic install icpunks_storage --argument="'($PUBLIC_KEY)'" -m upgrade