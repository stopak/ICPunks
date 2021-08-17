import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { auth } from "../auth";
import { getHost } from "../canister/actor";
import { AuthClient } from '@dfinity/auth-client';
import { WalletInterface } from "./plug";

const IDENTITY_URL =
  process.env.REACT_APP_INTERNET_IDENTITY_URL ||
  'https://identity.ic0.app';

export default function internetIdentity(): WalletInterface {

  let authClient: AuthClient | null = null;
  let identity: Identity | null = null;

  async function getActor<Type>(canisterId: string, idl: any): Promise<Type | undefined> {
    const agent = auth.agent;

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
          
          const agent = new HttpAgent({ host, identity });
          auth.setAgent(agent);

          auth.setPrincipal(identity.getPrincipal());

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
    auth.setAgent(undefined);
    auth.setPrincipal(undefined);      
  }

  return {
    logIn,
    logOut,
    getActor
  };
}