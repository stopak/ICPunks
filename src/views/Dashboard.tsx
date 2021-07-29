import { Principal } from "@dfinity/agent";
import { Component } from "react";
import { listTokens } from "../utils/canister";
import TokenCard from "../components/TokenCard";

import { Container, Col, Row } from "react-bootstrap";
interface DashboardProps {

}

interface DashboardState {
    tokens: ([] | Principal)[];
}

export class Dashboard extends Component<DashboardProps, DashboardState> {
    async componentDidMount() {
        // var tokens = await listTokens();

        // this.setState({
        //     tokens: tokens
        // });
    }

    render() {
        return (
            <>
                <div style={{ position: "absolute" }}>
                    <img id="Mask_Group_11" src="/img/Mask_Group_11.png" srcSet="/img/Mask_Group_11.png 1x, Mask_Group_11@2x.png 2x" />
                    <img id="Mask_Group_37" src="/img/Mask_Group_33.png" srcSet="/img/Mask_Group_33.png 1x, Mask_Group_33@2x.png 2x" />
                    <img id="Clown1" src="/img/Clown1.png" srcSet="/img/Clown1.png 1x, Clown1@2x.png 2x" />
                    <img id="Mask_Group_10" src="/img/Mask_Group_10.png" srcSet="/img/Mask_Group_10.png 1x, Mask_Group_10@2x.png 2x" />
                    <img id="Mask_Group_9" src="/img/Mask_Group_9.png" srcSet="/img/Mask_Group_9.png 1x, Mask_Group_9@2x.png 2x" />
                    <img id="Mask_Group_5" src="/img/Mask_Group_5.png" srcSet="/img/Mask_Group_5.png 1x, Mask_Group_5@2x.png 2x" />
                    <img id="Mask_Group_4" src="/img/Mask_Group_4.png" srcSet="/img/Mask_Group_4.png 1x, Mask_Group_4@2x.png 2x" />
                </div>
                <Container>
                    <Row className="mb-5">
                        <Col xl="6" lg="12">
                            <h1 className="title mt-5">ICPunks</h1>
                            <h2><span className="main-color mb-5">First NFT's</span> on the Internet Computer</h2>
                            <p className="mt-5">10,000 randomly generated, unique collectible clowns with proof of ownership stored on the Internet Computer blockchain. Created as a reference to a meme comparing the Internet Computer token (ICP) with the Insane Clown Posse - an American hip hop duo founded in 1989.</p>
                        </Col>
                    </Row>
                    <Row className="mt-5 mb-5">
                        <Col xl="6" lg="12" className="text-center">
                            <h2>Drop countdown</h2>
                        </Col>
                    </Row>
                    <Row className="mb-5 text-center">
                        <Col xl="6" lg="12">
                            <Row className="counter">
                                <Col>
                                    <div className="button-wrapper dark-background mx-auto"><div className="button main-background"><p className="timer">1</p></div></div> 
                                    <p>DAY</p>
                                </Col>
                                <Col>
                                <div className="button-wrapper dark-background mx-auto"><div className="button main-background"><p className="timer">12</p></div></div>
                                    <p>HR</p>
                                </Col>
                                <Col>
                                <div className="button-wrapper dark-background mx-auto"><div className="button main-background"><p className="timer">23</p></div></div>
                                    <p>MIN</p>
                                </Col>
                                <Col>
                                <div className="button-wrapper dark-background mx-auto"><div className="button main-background"><p className="timer">34</p></div></div>
                                    <p>SEC</p>
                                </Col>
                            </Row>
                            <Row>
                            <div className="button-wrapper sdark-background my-1 w-100"><div className="button sec-background"><p>Connect your wallet</p></div></div>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}