import { Principal } from "@dfinity/agent";
import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useAuth } from "src/utils";

import { claimToken } from "../utils/canister";

export default function Token(props: any) {
    const [ownerText, setOwnerText] = useState("");
    const [claimText, setClaimText] = useState(<Button variant="primary" onClick={claimTokenButton}>Claim!</Button>);
    const [isWorking, setWorking] = useState(false);
    const authContext = useAuth();

    const tokenId = props.match.params.tokenId;

    let imgSrc = "/punks/cat" + (Number(tokenId)+1) + ".png";

    useEffect(() => {

    }, [props]);

    useEffect(() => {
        // if (value.toString() === "")
        //     setOwnerText("Still ownerless, claim it!");
        // else {
        //     setOwnerText("Already Claimed, sorry");
        //     setClaimText(<></>);
        // }
        // if (authContext.isAuthenticated && authContext.identity?.getPrincipal().toString() === value.toString()) {
        //     setOwnerText("Your token!");
        //     setClaimText(<></>);
        // }

    }, [authContext]);

    async function claimTokenButton() {
        if (!authContext.isAuthenticated) return;
        if (isWorking) return;

        setWorking(true);

        setClaimText(<>Claiming ...</>);
        
        var result = await claimToken(tokenId);

        if (result)
            setClaimText(<>Claimed!</>);
        else
            setClaimText(<>Error during claiming</>);

        setWorking(false);
    }

    let url = "/token/"+tokenId;

    return (
        <Card style={{ width: '18rem', margin: '20px' }}>
            <Card.Img variant="top" src={imgSrc} />
            <Card.Body>
                <Card.Title>Punk {tokenId}</Card.Title>
                <Card.Text>
                    {ownerText}
                </Card.Text>
                {claimText}
                {/* <Button variant="primary" href={url}>View</Button> */}
            </Card.Body>
        </Card>
    );
}