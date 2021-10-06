import { useEffect, useState } from "react";
import { useLocalState } from "src/utils/state";

export default function OwnedTokens(props: any) {
    const state = useLocalState();

    const [tokens, setTokens] = useState<BigInt[]|null>(null);

    useEffect(() => {
        setTokens(state.userTokens);
        if (state.userTokens !== null)
            state.setDisplayedToken(state.userTokens[0]);
    }, [state.userTokens])

    const selectToken = function (token: BigInt) {
        state.setDisplayedToken(token);
    }

    if (tokens == null) {
        return (
            <>
                <h1 className="mt-5">Your ICPunks</h1>
                <p className="mb-5">You do not have ICPunks</p>
            </>
        )
    }

    return (
        <>
            <h1 className="mt-5">Your ICPunks</h1>
            <p className="mb-5">The list below contains your ICPunks</p>
            <ul className="list-group text-black">
                {tokens.map((token, i) => (
                    <li key={i} className="list-group-item" onClick={()=>selectToken(token)}>ICPunk #{""+token}</li>
                ))
                }
            </ul>
        </>
    );
}