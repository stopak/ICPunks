#!/bin/bash

PUBLIC_KEY="principal \"$( \
    dfx identity get-principal
)\""

dfx build --network ic icpunks

eval dfx canister --network ic install icpunks --argument="'(\"ICTest\", \"ICT\", 1000, $PUBLIC_KEY)'" -m upgrade