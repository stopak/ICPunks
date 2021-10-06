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

// actor.total_supply().then(x => {
//   console.log(x);
// });

// actor.user_tokens(targetPrincipal).then(x=>{
//   console.log(x);
// });

async function user_tokens() {
  var ownerTokens = await actor.user_tokens(ownerPrincipal);
  console.log("Owner: ");
  console.log(ownerTokens);

  var targetTokens = await actor.user_tokens(targetPrincipal);
  console.log("Target: ");
  console.log(targetTokens);
}

user_tokens();

async function get_token(tokenId) {
  actor.data_of(tokenId).then(x=>{
    console.log(x);
  });
}

async function owner_of(tokenId) {
  actor.owner_of(tokenId).then(x=>{
    console.log(x.toString());
  });
}


async function transfer(tokenId) {

  console.log(targetPrincipal.toString());
  var result = await actor.transfer_to(targetPrincipal, tokenId);
  console.log(result);

  await owner_of(tokenId);
}

// transfer(60);
// transfer(20);
// transfer(36);

// transfer(15);
// transfer(45);

// owner_of(13);
// get_token(20);
// get_token(36);

var contentType = "image/jpg";

var mintRequest = {
  url: "/Token/",
  contentType: contentType,
  desc: "Example description of ICPunk",
  name: "ICPunk #",
  data: null,
  properties: [
    { name: 'Background', value: 'Black'},
    { name: 'Body', value: 'White Suit'},
    { name: 'Nose', value: 'None'},
    { name: 'Mouth', value: 'Purple'},
    { name: 'Eyes', value: 'None'},
    { name: 'Head', value: 'Long Yellow Smile'},
    { name: 'Top', value: 'None'},
  ]
};

async function mint() {
  var hrstart = process.hrtime()
  
  for (let i = 1;i<=52;i++) {

    var fileName = "../test_data/"+(i-1)+".jpg";

    var buffer = fs.readFileSync(fileName);
    var data = [...buffer];

    mintRequest.url = "/Token/"+i;
    mintRequest.data = data;
    mintRequest.name = "ICPunk #"+i;

    await actor.mint(mintRequest);
    console.log(i+"/52");
  }

  var hrend = process.hrtime(hrstart)
  console.log("Creating 52 punks took : %ds %dms", hrend[0], hrend[1] / 1000000);
}

mint();