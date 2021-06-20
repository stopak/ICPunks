import { Principal } from "@dfinity/agent";
import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useAuth } from "src/utils";

import { claimToken } from "../utils/canister";

export default function TokenCard({ value, index }: { value: Principal, index: number }) {
    const [ownerText, setOwnerText] = useState("");
    const [claimText, setClaimText] = useState("Claim!");
    const authContext = useAuth();

    let imgSrc = "punks/cat" + (index+1) + ".png";

    useEffect(() => {
        if (value.toString() === "")
            setOwnerText("Still ownerless, claim it!");
        else
            setOwnerText("Already Claimed, sorry");

        if (authContext.isAuthenticated && authContext.identity?.getPrincipal().toString() === value.toString()) {
            setOwnerText("Your token!");
        }

    }, [value, authContext.isAuthenticated]);

    async function claimTokenButton() {
        if (!authContext.isAuthenticated) return;
        if (claimText !== "Claim!") return;

        setClaimText("Claiming ...");
        
        var result = await claimToken(index);

        if (result)
            setClaimText("Claimed!");
        else
            setClaimText("Error during claiming");
    }

    return (
        <Card style={{ width: '18rem', margin: '20px' }}>
            <Card.Img variant="top" src={imgSrc} />
            <Card.Body>
                <Card.Title>Punk {index}</Card.Title>
                <Card.Text>
                    {ownerText}
                </Card.Text>
                <Button variant="primary" onClick={claimTokenButton}>{claimText}</Button>
            </Card.Body>
        </Card>
    );
}