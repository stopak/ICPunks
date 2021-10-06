import { useEffect, useState } from "react";
import { useLocalState } from "src/utils/state";
import { Container, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";


export default function Token() {
    const state = useLocalState();

    const [desc, setDesc] = useState("???");
    const [imgUrl, setImgUrl] = useState("/img/image_4_3_bpc.png");

    const history = useHistory();

    useEffect(() => {
        if (state.displayToken !== null && state.displayToken !== undefined) {
            setDesc("ICPunk #" + state.displayToken);
            if (state.displayTokenData !== null) {
                // setImgUrl("http://rwlgt-iiaaa-aaaaa-aaaaa-cai.localhost:8000" + state.displayTokenData?.url);
                setImgUrl("https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app" + state.displayTokenData?.url);

            }
        }
    }, [state.displayToken, state.displayTokenData]);

    function goToMarketplace() {
        history.push('/token/'+state.displayToken?.toString());
    }

    function send() {
        state.setShowSend(true);
    }

    return (
        <>
            <h1 id="punk_image" className="mt-5">Your ICPunk</h1>
            <p className="mb-5">Enjoy your unique ICPunk!</p>
            <div className="p-3" style={{ width: "100%", background: "white", borderRadius: "10px" }}>
                <h2 style={{ borderRadius: "10px", backgroundColor: "rgba(75,0,123,1)", padding: "10px", marginTop: "-1px" }}>{desc}</h2>
                <img className="w-100" src={imgUrl} alt="token" />
                <div className="text-black properties">
                    <h3>Properties</h3>
                    <Container>
                        <Row>
                            {state.displayTokenData?.properties.map((prop, i) => {
                                return (
                                    <Col xl="6" key={i}>

                                        <div className="prop">
                                            <h6>{prop.name}</h6>
                                            <p>{prop.value}</p>
                                        </div>
                                    </Col>
                                )
                            })
                            }

                        </Row>
                    </Container>
                </div>
                <div>
                <span className="owner_pill price_color inline_spans action_pill" onClick={goToMarketplace}>
                    Marketplace
                </span>
                <span className="owner_pill price_color inline_spans action_pill" onClick={send}>
                    SEND
                </span>
                </div>
            </div>
        </>
    );
}