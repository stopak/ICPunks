import { Actor, HttpAgent, Principal } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import fetch from 'node-fetch';
import {
    idlFactory
  } from "./icpunks.js";

import fs from 'fs';
import process from 'process';

import { readFile } from 'fs/promises';
const traits = JSON.parse(
  await readFile(
    new URL('../punks/finaltraits.json', import.meta.url)
  )
);

global.fetch = fetch;


var keyData = fs.readFileSync('key.json', 'utf8');
var key = Ed25519KeyIdentity.fromJSON(keyData);

//specify localhost endpoint or ic endpoint;
const host = "https://boundary.ic0.app/"; //ic
var canister_id = "qcg3w-tyaaa-aaaah-qakea-cai";

//Update this with claim canister principal ID!!!!
var claimCanister = Principal.fromText("3hdbp-uiaaa-aaaah-qau4q-cai");

//Update this with your principal!!!!
var ownerPrincipal = Principal.fromText("rncip-xm7tb-lpn3o-svcxh-xlcrb-yoivy-sx5df-5oiqo-ownaw-5t7km-iqe");

const http = new HttpAgent({ identity: key, host });

const actor = Actor.createActor(idlFactory, {
  agent: http,
  canisterId: canister_id,
});

//Prepares mint request using provided data
function make_request(trait) {
  var [imagePath, contentType] = get_image_path(trait.tokenId);

  var buffer = fs.readFileSync(imagePath);
  var data = [...buffer];

  var mintRequest = {
    url: "/Token/" + (trait.tokenId + 1),
    content_type: contentType,
    desc: "",
    name: "ICPunk #" + (trait.tokenId + 1),
    data: data,
    properties: [
      { name: 'Background', value: trait.Background },
      { name: 'Body', value: trait.Body },
      { name: 'Nose', value: trait.Nose },
      { name: 'Mouth', value: trait.Mouth },
      { name: 'Eyes', value: trait.Eyes },
      { name: 'Head', value: trait.Head },
      { name: 'Top', value: trait.Top },
    ],
    owner: claimCanister
  };

  //Assignes 100 first tokens to the owner, instead of claiming canister
  if (trait.tokenId <= 100) mintRequest.owner = ownerPrincipal;

  return mintRequest;
}

function get_image_path(token_id) {
  var path = '../punks/CLOWNS/' + token_id;

  if (fs.existsSync(path + '.jpg')) return [path + '.jpg', 'image/jpg'];
  if (fs.existsSync(path + '.png')) return [path + '.png', 'image/png'];

  return [];
}

//Mints new tokens using multi_mint feature, before sending package of tokens to mint, checks if the request is within max_size limits (currently 2mb of data)
async function mint_punks() {
  var counter = 0;
  var total_minted = 0;

  var hrstart = process.hrtime()

  while (counter < traits.length) {
    var multi_mint = [make_request(traits[counter])];

    var total_size = fs.statSync(get_image_path(counter)[0]).size;

    var next = true;

    while (next) {
      //if not the last one
      if (counter < traits.length - 1) {
        var next_size = fs.statSync(get_image_path(counter + 1)[0]).size;
        if (total_size + next_size < (2 * 1024 * 1024*0.9)) {
          total_size += next_size;
          multi_mint.push(make_request(traits[counter + 1]))
          counter++;
        } else {
          next = false;
        }
      } else {
        next = false;
      }
    }

    console.log('Minting tokens: '+multi_mint.length+' '+total_minted);
    await actor.multi_mint(multi_mint);
    total_minted += multi_mint.length;

    counter++;
  }

  var hrend = process.hrtime(hrstart)
  console.log("Creating "+traits.length+" punks took : %ds %dms", hrend[0], hrend[1] / 1000000);
}

mint_punks();