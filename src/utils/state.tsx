import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import { authClient } from "./authClient";
import { claimRandomToken, getRemainingTokensCount, getUserTokens } from "./canister";


export interface StateContext {
    remainingTokens: BigInt;
    userTokens: BigInt[] | null
    displayToken: BigInt | null;

    getRemainingTokens: () => void;
    claimToken: () => Promise<void>;
}

export function useProvideState(): StateContext {
    const authContext = useAuth();
    const [remainingTokens, setRemainingTokens] = useState<BigInt>(BigInt(0));

    const [userTokens, setUserTokens] = useState<BigInt[] | null>(null);
    const [displayToken, setDisplayToken] = useState<BigInt | null>(null);

    const [isLoading, setLoading] = useState(false);

    const getRemainingTokens = async function (): Promise<void> {
        Promise.all([authClient.getIdentity(), authClient.isAuthenticated()]).then(
            () => {
                getRemainingTokensCount().then((count) => {
                    setRemainingTokens(count);
                })
            }
        );
    };

    getRemainingTokens();

    const loadUserTokens = async function (): Promise<void> {
        if (isLoading) return;

        if (authContext.identity !== undefined && !authContext.identity.getPrincipal().isAnonymous()) {
            setLoading(true);
            console.log("Loading user tokens");
            let principal = authContext.identity?.getPrincipal();

            getUserTokens(principal).then((data) => {
                console.log(data);
                setUserTokens(data);
                if (data.length > 0) {
                    setDisplayToken(data[0]);
                }

                setLoading(false);
            }).catch(() => {
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        loadUserTokens();
    }, [authContext.isAuthenticated, authContext.isAuthReady]);

    const claimToken = async function (): Promise<void> {
        let principal = authContext.identity?.getPrincipal();
        let hex = principal?.toString();

        if (authContext.isAuthenticated && hex !== undefined) {
            let token = await claimRandomToken();

            if (userTokens === null) {
                setUserTokens([token]);
            } else {
                setUserTokens([...userTokens, token]);
            }
        }
    }

    return {
        remainingTokens,
        userTokens,
        displayToken,
        getRemainingTokens,
        claimToken
    };
}

const stateContext = createContext<StateContext>(null!);

export function ProvideState({ children }) {
  const state = useProvideState();
  return <stateContext.Provider value={state}>{children}</stateContext.Provider>;
}

export const useLocalState = () => {
  return useContext(stateContext);
};
