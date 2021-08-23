import { Actor, HttpAgent, Principal } from '@dfinity/agent';
import { Ed25519KeyIdentity, DelegationIdentity } from '@dfinity/identity';
import crypto from 'crypto';
import fetch from 'node-fetch';
import {
    canisterId as ICPunks_canister_id,
    idlFactory as ICPunks_factory
  } from "./.dfx/local/canisters/icpunks/icpunks.js";

import fs from 'fs';
import process from 'process';

global.fetch = fetch;

// const entropy = crypto.randomBytes(32);
// const key = Ed25519KeyIdentity.generate(entropy);

// fs.writeFileSync('key.json', JSON.stringify(key.toJSON()));

var keyData = fs.readFileSync('key.json', 'utf8');
var key = Ed25519KeyIdentity.fromJSON(keyData);

//specify localhost endpoint or ic endpoint;
// const host = "https://boundary.ic0.app/"; //ic
// var canister_id = "qcg3w-tyaaa-aaaah-qakea-cai";

const host = "http://127.0.0.1:8000"; //local
var canister_id = "rwlgt-iiaaa-aaaaa-aaaaa-cai";


const http = new HttpAgent({identity: key, host});
http.fetchRootKey();

// global.ic = {agent: http};

// var canister_id = ICPunks_canister_id;

const actor = Actor.createActor(ICPunks_factory, { agent: http,
    canisterId: canister_id,
  });

// actor.caller().then(x => {
//   console.log("C: "+x.toString());
// });

// actor.owner().then(x => {
//   console.log("O: "+x.toString());
// });

// var targetPrincipal = Principal.fromText("r4rmh-mbkzp-gv2na-yvly3-zcp3r-ocllf-pt3p3-zsri5-6gqvr-stvs2-4ae");
// var ownerPrincipal = Principal.fromText("xm4y3-54lfy-pkijk-3gpzg-gsm3l-yr7al-i5ai7-odpf7-l2pmv-222rl-7qe");

// actor.total_supply().then(x => {
//   console.log(x);
// });

// actor.user_tokens(ownerPrincipal).then(x=>{
//   console.log(x);
// });

// actor.owner_of(1).then(x=>{
//   console.log(x.toString());
// });

// actor.owner_of(2).then(x=>{
//   console.log(x.toString());
// });

// actor.owner_of(99).then(x=>{
//   console.log(x.toString());
// });
// async function transfer() {

//   var result = await actor.transfer_to(targetPrincipal, 99);
//   console.log(result);
// }

// transfer();



var fileName = "punks/0.jpg";

var buffer = fs.readFileSync(fileName);
var data = [...buffer];
var contentType = "image/jpg";

var mintRequest = {
  url: "/Token/",
  contentType: contentType,
  desc: "Super Image",
  name: "Image",
  data: data,
  properties: []
};

var multiMintRequest = [
  mintRequest,
  mintRequest,
  mintRequest,
  mintRequest,
  mintRequest,
  mintRequest,
];

async function multiMint() {
  var hrstart = process.hrtime()
  
  for (let i = 1;i<=17;i++) {
    // mintRequest.url = "/Token/"+i;
    await actor.multi_mint(multiMintRequest);
    console.log(i+"/17");
  }

  var hrend = process.hrtime(hrstart)
  console.log("Creating 100 punks took : %ds %dms", hrend[0], hrend[1] / 1000000);
};
multiMint();
// async function mint() {
//   var hrstart = process.hrtime()
  
//   for (let i = 1;i<=100;i++) {
//     mintRequest.url = "/Token/"+i;
//     await actor.mint(mintRequest);
//     console.log(i+"/100");
//   }

//   var hrend = process.hrtime(hrstart)
//   console.log("Creating 100 punks took : %ds %dms", hrend[0], hrend[1] / 1000000);
// }

// mint();