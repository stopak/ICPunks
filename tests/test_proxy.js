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
    var canister_id = "i3oug-lyaaa-aaaah-qco3a-cai";
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
} from "../.dfx/ic/canisters/ledger_proxy/ledger_proxy.did.js";
const actor = Actor.createActor(idlFactory, {
    agent: http,
    canisterId: canister_id,
  });
  
async function count() {
  let res = await actor.count_processed();

  console.log(res);
}
// count();

async function processed() {
  let res = await actor.get_processed();

  console.log("Processed: "+res.length);
  console.log(res);
}
processed();

async function get_blocks() {
  let res = await actor.get_blocks();

  console.log("Send ICP blocks: "+res.length);
  console.log(res);
}
get_blocks();

async function check_block() {
    // let ledger_proto = await protobuf.load("service/ledger_proxy/pb/v1/types.proto");
    let res = await actor.notify(2036564, []);

    console.log(res);

    // const blockType = ledger_proto.root.lookupType("ic_ledger.pb.v1.Block");
    // let block = blockType.decode(res[0]);

    // console.log(block);
}
// check_block();

async function check_send_dfx() {
  let args = {
    to : "596c812adf60be0750d71ad4a8c3fdcbbe11aadbad34a15bbec1807281e96f34",
    fee : { e8s: 10000 },
    memo : 1,
    from_subaccount : [],
    created_at_time : [],
    amount : { e8s : 990000 }
  };

  let res = await actor.send_dfx(args);

  console.log(res);
}

// check_send_dfx();
// 