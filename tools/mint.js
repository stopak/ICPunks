import { Actor, HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import fetch from 'node-fetch';
import idlImport from "../.dfx/local/canisters/icpunks/icpunks.did.js";

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
// const host = "https://boundary.ic0.app/"; //ic
// var canister_id = "qcg3w-tyaaa-aaaah-qakea-cai";

const host = "http://127.0.0.1:8000"; //local
var canister_id = "rwlgt-iiaaa-aaaaa-aaaaa-cai";


const http = new HttpAgent({ identity: key, host });
http.fetchRootKey();

const actor = Actor.createActor(idlImport, {
  agent: http,
  canisterId: canister_id,
});

async function make_request(traits) {
  var [imagePath, contentType] = get_image_path(trait.tokenId);

  var buffer = fs.readFileSync(imagePath);
  var data = [...buffer];

  var mintRequest = {
    url: "/Token/" + (trait.tokenId + 1),
    contentType: contentType,
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
    ]
  };

  return mintRequest;
}

function get_image_path(token_id) {
  var path = './punks/CLOWNS/' + token_id;

  if (fs.existsSync(path + '.jpg')) return (path + '.jpg', 'image/jpg');
  if (fs.existsSync(path + '.png')) return (path + '.png', 'image/png');
}

async function mint_punks() {
  var counter = 0;

  var hrstart = process.hrtime()

  while (counter < traits.length) {
    var multi_mint = [make_request(traits[counter])];

    var total_size = fs.statSync(get_image_path(counter)[0]);

    var next = true;

    while (next) {
      //if not the last one
      if (counter < traits.length - 1) {
        var next_size = fs.statSync(get_image_path(counter + 1)[0]);

        if (total_size + next_size < 2 * 1024 * 1024) {
          total_size += next_size;
          multi_mint.push(make_request(traits[counter + 1]))
          counter++;
        } else {
          next = false;
        }
      }
    }

    console.log('Minting tokens: '+multi_mint.length);
    await actor.multi_mint(multi_mint);


    counter++;
  }

  var hrend = process.hrtime(hrstart)
  console.log("Creating "+traits.length+" punks took : %ds %dms", hrend[0], hrend[1] / 1000000);
}

mint_punks();