
import { Actor, HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';

// import protobuf from 'protobufjs';
import fetch from 'node-fetch';
global.fetch = fetch;

import fs from 'fs';

var keyData = fs.readFileSync('./key.json', 'utf8');
var key = Ed25519KeyIdentity.fromJSON(keyData);
console.log("Loaded principal: " + key.getPrincipal().toString())

function getHttpAgent() {
    if (process.argv.length === 2) {
        const host = "https://boundary.ic0.app/"; //local
        var canister_id = "nvtz2-maaaa-aaaah-qcohq-cai";
        var storage_id = "pioxs-7iaaa-aaaah-qcoia-cai"
        const http = new HttpAgent({ identity: key, host });

        console.log("Run in production!");

        return [http, canister_id, storage_id];
    } else {
        const host = "http://127.0.0.1:8000"; //local
        var canister_id = "ryjl3-tyaaa-aaaaa-aaaba-cai";
        var storage_id = "pioxs-7iaaa-aaaah-qcoia-cai"

        const http = new HttpAgent({ identity: key, host });
        http.fetchRootKey();

        console.log("Run in local dev!");

        return [http, canister_id, storage_id];
    }
}

const [http, canister_id, storage_id] = getHttpAgent();

import {
  idlFactory
} from "../.dfx/ic/canisters/icpunks/icpunks.did.js";
const actor = Actor.createActor(idlFactory, {
    agent: http,
    canisterId: canister_id,
  });

import {
  idlFactory as idlStorageFactory
} from "../.dfx/ic/canisters/icpunks_storage/icpunks_storage.did.js";
const storage_actor = Actor.createActor(idlStorageFactory, {
  agent: http,
  canisterId: storage_id,
})


function calculateTokenOwners(txs) {
  let tokens = [];

  for (var i = 0; i < txs.length; i++) {
    let tx = txs[i];
    
    let tokenId = Number(tx.tokenId)

    if ('mint' in tx.op) {
      tokens[tokenId-1] = tx.from[0];
    }

    if ('transfer' in tx.op || 'purchase' in tx.op) {
      if (tx.from === tx.to) continue;

      tokens[tokenId-1] = tx.to[0];
    }
  }

  return tokens;
}

function compare_prin(l,r) {
  let res = l === r;

  if (l._arr.length !== r._arr.length) return false;

  let eq = true;

  for (let x=0;x<l._arr.length;x++) {
    eq = eq && l._arr[x] === r._arr[x];
  }

  return eq;
}

async function compare() {
    let txs = await storage_actor.allHistory();
    let owners = calculateTokenOwners(txs);
    let calc = await storage_actor.getOwners();

    let equal = true;

    for (let i=0;i<1000;i++) {
      let l = owners[i];
      let r = calc[i];

      equal = equal && compare_prin(l, r);
    }

    console.log(equal);
}

compare();