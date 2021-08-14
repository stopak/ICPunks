import { createContext, useContext, useEffect, useState } from "react";
import { HttpAgent, Principal } from "@dfinity/agent";

import {
  canisterId as ICPunks_canister_id,
  idlFactory as ICPunks_factory
} from "dfx-generated/icpunks";

import plugWallet, { WalletInterface } from "./wallet/plug";
import ICPunk from "./canister/icpunks";
import internetIdentity from "./wallet/ii";
export interface AuthContext {
  isShow: boolean;
  showModal: (show: boolean) => void;

  wallet?: WalletInterface;
  principal?: Principal;
  agent?: HttpAgent;
  icpunk?: ICPunk;

  usePlug: () => void;
  useInternetIdentity: () => void;

  setPrincipal: (principal: Principal | undefined) => void;
  setAgent: (agent: HttpAgent) => void;
}

// Provider hook that creates auth object and handles state
export function useProvideAuth(): AuthContext {
  const [wallet, setWallet] = useState<WalletInterface | undefined>();


  const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
  const [agent, setAgent] = useState<HttpAgent | undefined>(undefined);
  const [icpunk, setICPunk] = useState<ICPunk | undefined>(undefined);

  const [display, setDisplay] = useState(false);

  const usePlug = function () {
    const wlt = plugWallet(get());
    setWallet(wlt);
    setDisplay(false);
  }

  const useInternetIdentity = function () {
    const wlt = internetIdentity(get());
    setWallet(wlt);
    setDisplay(false);
  }

  //Displays modal to select wallet
  const showModal = function (show: boolean) {
    setDisplay(show);
  }
  
  //Generate actors when principal is ready
  useEffect(() => {
    if (wallet === undefined) return;
    if (principal === undefined) return;

    const fetchData = async () => {
      const icpunkActor = await wallet.getActor<ICPunk>(ICPunks_canister_id, ICPunks_factory);
      setICPunk(icpunkActor);
    }

    fetchData();
  }, [principal])

  function get() {
    return {
      showModal,
      isShow: display,
      setPrincipal,
      principal: principal,
      setAgent,
      agent: agent,
      wallet,
      icpunk,

      usePlug,
      useInternetIdentity,
    };
  }

  return get();
}

const authContext = createContext<AuthContext>(null!);

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};
