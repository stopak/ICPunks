import { Actor, HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
// import { Principal } from '@dfinity/principal';

// import protobuf from 'protobufjs';
import fetch from 'node-fetch';
global.fetch = fetch;

import fs from 'fs';

var keyData = fs.readFileSync('./key.json', 'utf8');
var key = Ed25519KeyIdentity.fromJSON(keyData);

function getHttpAgent() {

  if (process.argv.length === 2) {
    const host = "https://boundary.ic0.app/"; //local
    var canister_id = "nvtz2-maaaa-aaaah-qcohq-cai";
    const http = new HttpAgent({ identity: key, host });

    console.log("Run in production!");

    return [http, canister_id];
  } else {
    const host = "http://127.0.0.1:8000"; //local
    var canister_id = "ryjl3-tyaaa-aaaaa-aaaba-cai";
    
    const http = new HttpAgent({ identity: key, host });
    http.fetchRootKey();

    console.log("Run in local dev!");

    return [http, canister_id];
  }
}

const [http, canister_id] = getHttpAgent();

console.log("Loaded principal: " + key.getPrincipal().toString())

import {
  idlFactory
} from "../.dfx/ic/canisters/icpunks/icpunks.did.js";
const actor = Actor.createActor(idlFactory, {
    agent: http,
    canisterId: canister_id,
  });

async function run() {
  let storage_canister = await actor.get_storage_canister();
  console.log("Storage canister: "+storage_canister.toString());

  let ledger_proxy = await actor.get_ledger_canister();
  console.log("Ledger canister: "+ledger_proxy.toString());

  let cycles = await actor.get_cycles();
  console.log("Cycles: "+cycles);

  let name = await actor.name();
  console.log("Name: "+name.toString());

  let symbol = await actor.symbol();
  console.log("Symbol: "+symbol.toString());

  let total_supply = await actor.total_supply();
  console.log("Total supply: "+total_supply.toString());

  let icon_url = await actor.icon_url();
  console.log("Icon Url: "+icon_url.toString());

  let txEnabled = await actor.tx_enabled();
  console.log("Tx Enabled: "+txEnabled.toString());

  let creators_fee = await actor.creators_fee();
  console.log("Creators Fee: "+creators_fee.toString());

  let get_listed_count = await actor.get_listed_count();
  console.log("Listed count: "+get_listed_count.toString());
}


run();



