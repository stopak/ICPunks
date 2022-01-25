import { Actor, HttpAgent, Principal } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import fetch from 'node-fetch';
import {
    idlFactory as ICPunks_factory
  } from "../.dfx/local/canisters/icpunks/icpunks.js";

import fs from 'fs';
import process from 'process';

global.fetch = fetch;

var keyData = fs.readFileSync('key.json', 'utf8');
var key = Ed25519KeyIdentity.fromJSON(keyData);

//specify localhost endpoint or ic endpoint;
const host = "http://127.0.0.1:8000"; //local
var canister_id = "rwlgt-iiaaa-aaaaa-aaaaa-cai";

const http = new HttpAgent({identity: key, host});
http.fetchRootKey();

const actor = Actor.createActor(ICPunks_factory, { agent: http,
    canisterId: canister_id,
  });


var targetPrincipal = Principal.fromText("hes2n-2pjrc-wnm7e-6acff-yy3wo-otw2l-nebk7-go2ky-dmzfo-gva5j-6qe");
var ownerPrincipal = Principal.fromText("xm4y3-54lfy-pkijk-3gpzg-gsm3l-yr7al-i5ai7-odpf7-l2pmv-222rl-7qe");





