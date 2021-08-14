import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { AuthContext } from "../auth";
import { getHost } from "../canister/actor";
import { AuthClient } from '@dfinity/auth-client';
import { WalletInterface } from "./plug";

const IDENTITY_URL =
  process.env.REACT_APP_INTERNET_IDENTITY_URL ||
  'https://identity.ic0.app';

export default function internetIdentity(context: AuthContext): WalletInterface {

  let authClient: AuthClient | null = null;
  let identity: Identity | null = null;

  async function getActor<Type>(canisterId: string, idl: any): Promise<Type | undefined> {
    const agent = context.agent;

    const actor = Actor.createActor<Type>(idl, {
      agent,
      canisterId: canisterId,
    });

    return actor;
  }

  async function logIn() {
    if (authClient == null) authClient = await AuthClient.create();

    if (authClient != null) {
      const host = getHost();


      authClient.login({
        identityProvider: IDENTITY_URL,
        onSuccess: () => {
          const client = authClient as AuthClient;
          identity = client.getIdentity();
          context.setPrincipal(identity.getPrincipal());
          const agent = new HttpAgent({ host, identity });
          context.setAgent(agent);
          console.log("Logged in with II");
        },
        onError: (str) => {
          console.log("Error while logging with II: "+str);
        }
      })
    }
  }

  function logOut() {
    authClient?.logout();
    context.setPrincipal(undefined);
  }

  return {
    logIn,
    logOut,
    getActor
  };
}