#!/bin/bash

PUBLIC_KEY="principal \"$( \
    dfx identity get-principal
)\""


eval dfx canister --no-wallet install icpunks --argument="'(\"ICPunks\", \"TT\", 1000, $PUBLIC_KEY)'" -m reinstall
# eval dfx canister --no-wallet install icpunks_storage --argument="'($PUBLIC_KEY)'"


