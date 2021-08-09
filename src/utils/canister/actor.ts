import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import {
  idlFactory as ICPunks_idl,
  canisterId as ICPunks_canister_id,
} from "dfx-generated/icpunks";

// import _SERVICE from "./typings";
import ICPunk from "./icpunks";

import dfxConfig from "../../../dfx.json";

const DFX_NETWORK = process.env.DFX_NETWORK || process.env.REACT_APP_DFX_NETWORK || "local";
const isLocalEnv = DFX_NETWORK === "local";

function getHost() {
  // Setting host to undefined will default to the window location 👍🏻
  return dfxConfig.networks.ic.providers[0];
}

const host = getHost();

function createActor(identity?: Identity) {
  const agent = new HttpAgent({ host, identity });
  const actor = Actor.createActor<ICPunk>(ICPunks_idl, {
    agent,
    canisterId: ICPunks_canister_id,
  });
  return { actor, agent };
}

/*
 * Responsible for keeping track of the actor, whether the user has logged
 * in again or not. A logged in user uses a different actor with their
 * Identity, to ensure their Principal is passed to the backend.
 */
class ActorController {
  _actor: Promise<ICPunk>;
  _isAuthenticated: boolean = false;

  constructor() {
    this._actor = this.initBaseActor();
  }

  async initBaseActor(identity?: Identity) {
    const { agent, actor } = createActor(identity);
    // The root key only has to be fetched for local development environments
    if (isLocalEnv) {
      await agent.fetchRootKey();
    }
    return actor;
  }

  /*
   * Get the actor instance to run commands on the canister.
   */
  get actor() {
    return this._actor;
  }

  /*
   * Once a user has authenticated and has an identity pass this identity
   * to create a new actor with it, so they pass their Principal to the backend.
   */
  async authenticateActor(identity: Identity) {
    this._actor = this.initBaseActor(identity);
    this._isAuthenticated = true;
  }

  /*
   * If a user unauthenticates, recreate the actor without an identity.
   */
  unauthenticateActor() {
    this._actor = this.initBaseActor();
    this._isAuthenticated = false;
  }
}

export const actorController = new ActorController();
