import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as icpunks_idl, canisterId as icpunks_id } from 'dfx-generated/icpunks';

const agent = new HttpAgent();
const icpunks = Actor.createActor(icpunks_idl, { agent, canisterId: icpunks_id });

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  const greeting = await icpunks.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
