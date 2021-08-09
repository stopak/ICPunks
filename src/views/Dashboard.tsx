import { Container, Col, Row, Card } from "react-bootstrap";
import ClaimButton from "src/components/ClaimButton";
import Countdown from "src/components/Countdown";
import Description from "src/components/Description";
import OwnedTokens from "src/components/OwnedTokens";
import Token from "src/components/Token";

export default function Dashboard() {
    return (
        <>
            <div style={{ position: "absolute", width: "100%", height: "2000px", overflow: "hidden" }}>
                <img id="Mask_Group_11" alt="" src="/img/Mask_Group_11.png" style={{ overflow: "hidden" }} />
                <img id="Mask_Group_37" alt="" src="/img/Mask_Group_33.png" style={{ overflow: "hidden" }} />
                <img id="Clown1" alt="" src="/img/Clown1.png" style={{ overflow: "hidden" }} />
                <img id="Mask_Group_10" alt="" src="/img/Mask_Group_10.png" style={{ overflow: "hidden" }} />
                <img id="Mask_Group_9" alt="" src="/img/Mask_Group_9.png" style={{ overflow: "hidden" }} />
                <img id="Mask_Group_5" alt="" src="/img/Mask_Group_5.png" style={{ overflow: "hidden" }} />
                <img id="Mask_Group_4" alt="" src="/img/Mask_Group_4.png" style={{ overflow: "hidden" }} />

            </div>

            <Countdown/>

            <div className="background-radial mt-3 pb-5">
                <Container >
                    <Row className="mb-5">
                        <Col xl="12" className="text-center">
                            <h1 className="mt-5">Only three steps to claim your FREE ICPunk</h1>
                            <p className="my-5">The process is fast and easy. Follow these three simple steps to be sure that you claimed your ICPunk properly</p>
                            <p className="xy-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
                                </svg>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl="7" className="text-center">
                            <OwnedTokens/>
                        </Col>
                        <Col xl="5" className="text-center">
                            <Token/>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Description />
        </>
    );
}