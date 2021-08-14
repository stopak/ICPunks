import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";


export interface StateContext {
    remainingTokens: BigInt | null;
    userTokens: BigInt[] | null
    displayToken: BigInt | null;

    // getRemainingTokens: () => void;
    claimToken: () => Promise<void>;
}

export function useProvideState(): StateContext {
    const authContext = useAuth();

    const [remainingTokens, setRemainingTokens] = useState<BigInt | null>(null);

    const [userTokens, setUserTokens] = useState<BigInt[] | null>(null);
    const [displayToken, setDisplayToken] = useState<BigInt | null>(null);

    const [isLoading, setLoading] = useState(false);

    const getRemainingTokens = async function (): Promise<void> {
        if (authContext.icpunk === undefined) return;

        var tokens = await authContext.icpunk.remainingTokens();

        console.log("Remaining tokens "+tokens);

        setRemainingTokens(tokens);
    };

    // getRemainingTokens();

    const loadUserTokens = async function (): Promise<void> {
        // if (isLoading) return;

        // if (authContext.agent === undefined) return;

        // setLoading(true);

        // await authContext.icpunk?.userTokens(authContext.principal as Principal);

        // setLoading(false);
        // if (authContext.identity !== undefined && !authContext.identity.getPrincipal().isAnonymous()) {
        //     setLoading(true);
        //     console.log("Loading user tokens");
        //     let principal = authContext.identity?.getPrincipal();

        //     getUserTokens(principal).then((data) => {
        //         console.log(data);
        //         setUserTokens(data);
        //         if (data.length > 0) {
        //             setDisplayToken(data[0]);
        //         }

        //         setLoading(false);
        //     }).catch(() => {
        //         setLoading(false);
        //     });
        // }
    };

    


    const claimToken = async function (): Promise<void> {
        // let hex = authContext.principal?.toString();

        // if (authContext.isAuthenticated && hex !== undefined) {
        //     let token = await claimRandomToken();

        //     if (userTokens === null) {
        //         setUserTokens([token]);
        //     } else {
        //         setUserTokens([...userTokens, token]);
        //     }
        // }
    }


    useEffect(() => {
        getRemainingTokens();
        // loadUserTokens();
    }, [authContext.icpunk]);

    return {
        remainingTokens,
        userTokens,
        displayToken,
        // getRemainingTokens,

        claimToken,
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
