import { useEffect, useState } from "react";
import { Image, Card, Container } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "src/utils/auth";
import { useLocalState } from "src/utils/state";
import { getCanisterIds } from "src/utils/canister/principals";
import ClaimButton from "./ClaimButton";
import { Principal } from "@dfinity/principal";


export default function TokenCard() {
    const { tokenId } = useParams<any>();
    const canister = getCanisterIds();
    const state = useLocalState();
    const auth = useAuth();
    const history = useHistory();

    const [isWorking, setWorking] = useState(false);

    function shortAddress(adr: Principal | undefined) {
        if (adr === undefined) return "";
        const hex = adr.toString();
        return hex.substring(0, 5) + "..." + hex.substring(60);
    }

    function list() {
        state.setShowList(true);
    }

    async function delist() {
        if (isWorking) return;
        setWorking(true);

        try {
            await state.delistToken(state.displayToken);
            state.removeListed(state.displayToken);
            state.setDisplayTokenListing(null);

        } catch (e) {
            console.log(e);
        }

        setWorking(false);
    }

    // async function purchase() {
    //     if (state.displayToken === undefined) return;

    //     // state.setShowPurchase(true);
    //     state.purchaseToken(BigInt(tokenId).valueOf());
    // }

    function send() {
        state.setShowSend(true);
    }

    function back() {
        history.goBack();
    }


    useEffect(() => {
        if (auth.icpunk === undefined) return;

        state.setDisplayedToken(BigInt(tokenId));
        // state.loadDisplayToken();

    }, [auth.icpunk]);

    if (auth.icpunk === undefined) {
        return (
            <Container className="mt-5 text-center" style={{ height: '700px' }}>
                <h1 style={{ marginTop: '200px', marginBottom: '100px' }}>In order to use marketplace connect your wallet</h1>
                <ClaimButton />
            </Container>
        )
    }




    const format = function (amount: bigint) {
        const pow = Math.pow(10, 8);
        return Number(Number(amount) / pow)
            .toString()
            .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

    const gotoMarket = function () {
        history.push('/market');
    }

    if (state.displayTokenData === null) {
        return (
            <Container className="mt-5">
                <span className="owner_pill price_color inline_spans action_pill" onClick={back}>
                    BACK
                </span>
                <span className="owner_pill price_color inline_spans action_pill" onClick={gotoMarket}>
                    LIST
                </span>
                <div className="text-center mt-5">
                    <h2 className="my-auto">Loading data ... </h2>
                </div>
            </Container>
        )
    }

    let text = "DELIST";
    if (isWorking) text = "DELISTING ...";

    let actions = <></>

    if (state.displayTokenData !== undefined && state.displayTokenData.owner.toString() === auth.principal?.toString()) {
        actions = <>
            {state.displayTokenListing === undefined ?
                <></> :
                <span className="owner_pill price_color inline_spans action_pill" onClick={delist}>
                    {text}
                </span>
            }
            <span className="owner_pill price_color inline_spans action_pill" onClick={send}>
                SEND
            </span>
        </>
    }

    let price = <></>
    if (state.displayTokenListing !== undefined) {
        price = <div className="row right_aligned_div">
            <div className="col-sm float-right">
                <label className="detailed_card_label">price:

                </label>
                <span className="owner_pill price_color inline_spans">
                    {format(state.displayTokenListing.price)} ICP
                </span>
            </div>
        </div>
    }

    // if (auth.principal !== undefined && state.displayTokenData !== null && state.displayTokenData.owner.toString() !== auth.principal.toString()) {
    //     actions = <>
    //         <span className="owner_pill price_color inline_spans action_pill" onClick={purchase}>
    //         PURCHASE
    //     </span>
    //     </>
    // }

    return (
        <>
            <Container className="mt-5">
                <span className="owner_pill price_color inline_spans action_pill" onClick={back}>
                    BACK
                </span>
                <span className="owner_pill price_color inline_spans action_pill" onClick={gotoMarket}>
                    LIST
                </span>
                <div className="container">
                    <div className="row token-card">
                        <div className="col-sm col-xs-12">
                            <Image src={canister.get_img(state.displayTokenData?.url)} fluid />
                        </div>
                        <div className="col-sm col-xs-12">
                            <Card className="background_modal_content">
                                <Card.Body>
                                    <Card.Title><h2>#{state.displayTokenData?.id.toString()}</h2></Card.Title>
                                    <Card.Subtitle className="text-muted-modal">ICPunks</Card.Subtitle>
                                        <div className="row">
                                            <div className="col-6">
                                                <label className="detailed_card_label">owned by:</label>
                                                <div className="owner_pill created_by_color inline_spans">
                                                    {shortAddress(state.displayTokenData?.owner)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm">
                                                <label className="detailed_card_label">attributes:</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {state.displayTokenData?.properties.map((item, id) => (
                                                <div key={id} className="col-sm">
                                                    <div className="attributes_name">
                                                        {item.name}:
                                                    </div>
                                                    <div className="owner_pill attributes_color inline_spans">
                                                        {item.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* <div className="row right_aligned_div">
                                <div className="col-sm">
                                    <label className="detailed_card_label">rank: {punk.rank}</label>
                                </div>
                            </div> */}


                                        {price}


                                </Card.Body>
                            </Card>
                            {actions}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}