import { HttpAgent } from "@dfinity/agent";
import { AuthContext } from "../auth";
import { getHost } from "../canister/actor";
import {
  canisterId as ICPunks_canister_id,
} from "dfx-generated/icpunks";

export interface PlugWindow extends Window {
  ic: any;
}

declare let window: PlugWindow;

export interface WalletInterface {
  logIn: () => void;
  logOut: () => void;

  getActor: <Type>(canisterId: string, idl: any) => Promise<Type | undefined>;
}

export default function plugWallet(context: AuthContext): WalletInterface {
    let agent: HttpAgent | undefined = undefined;

    async function getActor<Type>(canisterId: string, idl: any): Promise<Type | undefined> {
      const actor = await window.ic.plug.createActor({
        canisterId,
        interfaceFactory: idl,
      });

      return actor as Type;
    }

    async function logIn() {
      if (window.ic === undefined) return

      const connected = await window.ic.plug.isConnected();
      const host = getHost();
      const whitelist = [ICPunks_canister_id];

      if (!connected) {
        const result = await window.ic.plug.requestConnect();

        if (!result) {
          console.log('Could not login to plug');
          return;
        }
      }

      await window.ic.plug.createAgent({ whitelist, host })
      agent = window.ic.plug.agent as HttpAgent;
      const principal = await agent.getPrincipal();
      
      context.setAgent(agent);
      context.setPrincipal(principal);
    }

    function logOut() {

    }

    return {
        logIn,
        logOut,
        getActor
      };
}