import { Col, Container, Row } from "react-bootstrap";

export default function Description() {

    return (
        <>
            <div className="gray-background px-5">
                <Container fluid className="roadmap rwdcontainer">
                    <h1 className="py-5">As we progress with how many ICPunks are given away, we have something special for you:</h1>

                    <Row>
                        <Col>
                            <div>
                                20% | <span>CLAIMED</span>
                            </div>
                            We send ICPunks to Dfinity team that helped us launch the project and supported us along the way.
                        </Col>
                        <Col>
                            <div>
                                40% | <span>CLAIMED</span>
                            </div>
                            We send ICPunks to influencers and supporters that helped us promote the project
                        </Col>
                        <Col>
                            <div>
                                60% | <span>CLAIMED</span>
                            </div>
                            We send a free NFT to everyone who claimed an ICPunk!
                        </Col>
                        <Col>
                            <div>
                                80% | <span>CLAIMED</span>
                            </div>
                            We release a guide to rare ICPunks - check how valuable is your punk!
                        </Col>
                        <Col>
                            <div>
                                100% | <span>CLAIMED</span>
                            </div>
                            It’s a success! We launch a simple page to exchange your clowns with others.
                        </Col>
                    </Row>

                </Container>
            </div>
            <div className="px-5" style={{overflow: 'hidden'}}>
                <Container fluid className="roadmap2 rwdcontainer">
                    <h1 className="py-5">We also plan the future after all punks will be claimed:</h1>

                    <Row>
                        <Col xl="7">
                            <span>Q3 2021:</span> launch the ICPunks marketplace where you can trade, buy and sell your ICPunks for ICP tokens.
                        </Col>
                        <Col xl="3">
                            <img id="Mask_Group_32" alt="" src="/img/Mask_Group_32.png" />
                            <img id="Mask_Group_33" alt="" src="/img/Mask_Group_33.png" />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl="7">
                            <span>Q4 2021:</span> open the ICPunks marketplace to other NFTs, and launch the first NFT marketplace on Internet Computer. New small collection will be distributed to our supporters!
                        </Col>
                    </Row>
                    <Row>
                        <Col xl="7">
                            <span>Q1 2022:</span> start experimenting with crosschain solutions, so that you can bring your favorite NFTs to Internet Computer from Ethereum or Binance Smart Chain.
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}