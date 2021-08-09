import { useEffect, useState } from "react";
import { useLocalState } from "src/utils/state";

export default function OwnedTokens(props: any) {
    const state = useLocalState();

    const [tokens, setTokens] = useState<BigInt[]|null>(null);

    useEffect(() => {
        setTokens(state.userTokens);
    }, [state.userTokens])

    if (tokens == null) {
        return (
            <>
                <h1 className="mt-5">ICPunks example</h1>
                <p className="mb-5">The list below contains example ICPunks</p>
            </>
        )
    }

    return (
        <>
            <h1 className="mt-5">ICPunks example</h1>
            <p className="mb-5">The list below contains example ICPunks</p>
            <ul className="list-group text-black">
                {tokens.map(token => (
                    <li className="list-group-item">ICPunk #{""+token}</li>
                ))
                }
            </ul>
        </>
    );
}