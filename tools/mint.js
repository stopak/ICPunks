import { Actor, HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Principal } from '@dfinity/principal';
import fetch from 'node-fetch';
import {
    idlFactory
  } from "./icpunks.js";

import fs from 'fs';
import process from 'process';

import { readFile } from 'fs/promises';
const traits = JSON.parse(
  await readFile(
    new URL('../data/finaltraits.json', import.meta.url)
  )
);

global.fetch = fetch;

var keyData = fs.readFileSync('key.json', 'utf8');
var key = Ed25519KeyIdentity.fromJSON(keyData);

//specify localhost endpoint or ic endpoint;
const host = "https://boundary.ic0.app/"; //ic
var canister_id = "4nvhy-3qaaa-aaaah-qcnoq-cai";
// const host = "http://127.0.0.1:8000"; //local
// var canister_id = "rwlgt-iiaaa-aaaaa-aaaaa-cai";

const http = new HttpAgent({ identity: key, host });
// http.fetchRootKey();

const actor = Actor.createActor(idlFactory, {
  agent: http,
  canisterId: canister_id,
});

var raw_map = fs.readFileSync('mapping.json');
var mapping = JSON.parse(raw_map);


//Prepares mint request using provided data
function make_request(trait) {
  var [imagePath, contentType] = get_image_path(trait.tokenId);

  var buffer = fs.readFileSync(imagePath);
  var data = [...buffer];

  let owner_raw = mapping[trait.tokenId+1];
  let owner = Principal.fromText(owner_raw);

  var mintRequest = {
    url: "/Token/" + (trait.tokenId + 1),
    content_type: contentType,
    desc: "",
    name: "ICat #" + (trait.tokenId + 1),
    data: data,
    properties: [
      { name: 'Background', value: trait.Background },
      { name: 'Skin', value: trait.Skin },
      { name: 'Eyes', value: trait.Eyes },
      { name: 'Clothes', value: trait.Clothes },
      { name: 'Face', value: trait.Face },
      { name: 'Head', value: trait.Head },
      { name: 'Hand', value: trait.Hand },
    ],
    owner: owner
  };

  //Assignes 100 first tokens to the owner, instead of claiming canister
  // if (trait.tokenId <= 100) mintRequest.owner = ownerPrincipal;

  return mintRequest;
}

function get_image_path(token_id) {
  var path = '../data/' + token_id;

  if (fs.existsSync(path + '.jpg')) return [path + '.jpg', 'image/jpg'];
  if (fs.existsSync(path + '.png')) return [path + '.png', 'image/png'];

  return [];
}

//Mints new tokens using multi_mint feature, before sending package of tokens to mint, checks if the request is within max_size limits (currently 2mb of data)
async function multi_mint() {
  var counter = 5130;
  var total_minted = 5130;

  var hrstart = process.hrtime()

  var traits_length = traits.length;
  // var traits_length = 20;

  while (counter < traits_length) {
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
  console.log("Creating "+traits.length+" cats took : %ds %dms", hrend[0], hrend[1] / 1000000);
}

multi_mint();