import { Container, Col, Row, Card } from "react-bootstrap";
import ClaimButton from "src/components/ClaimButton";
import Countdown from "src/components/Countdown";
import Description from "src/components/Description";
import OwnedTokens from "src/components/OwnedTokens";
import Token from "src/components/Token";

export default function Dashboard() {
    return (
        <>
            <div className="bgimg" style={{ position: "absolute", width: "100%", height: "2000px", overflow: "hidden" }}>
                <img id="Mask_Group_11" alt="" src="/img/Mask_Group_11.png" />
                <img id="Mask_Group_37" alt="" src="/img/Mask_Group_33.png" />
                <img id="Clown1" alt="" src="/img/Clown1.png" />
                <img id="Mask_Group_10" alt="" src="/img/Mask_Group_10.png" />
                <img id="Mask_Group_9" alt="" src="/img/Mask_Group_9.png" />
                <img id="Mask_Group_5" alt="" src="/img/Mask_Group_5.png" />
                <img id="Mask_Group_4" alt="" src="/img/Mask_Group_4.png" />

                <svg className="Union_2" viewBox="-10 -10 400 400">
                    <path id="Union_2" d="M 30.48724365234375 133.7037963867188 C 30.48724365234375 113.5083236694336 35.26175308227539 94.36210632324219 43.81233596801758 77.19657897949219 C 22.32898902893066 60.4134407043457 -1.58664608001709 35.23154830932617 0.08212340623140335 7.146937370300293 C 9.58573055267334 26.54001045227051 39.55623245239258 40.33237075805664 63.17194366455078 48.52211380004883 C 89.32957458496094 18.88452339172363 128.8631896972656 0 173.0992889404297 0 C 251.8619079589844 0 315.7129211425781 59.86260223388672 315.7129211425781 133.7037963867188 C 315.7129211425781 207.5449676513672 251.8619079589844 267.404052734375 173.0992889404297 267.404052734375 C 94.33744812011719 267.404052734375 30.48724365234375 207.5449676513672 30.48724365234375 133.7037963867188 Z">
                    </path>
			    </svg>
                <img id="Mask_Group_19" src="/img/Mask_Group_19.png" />

            </div>

            <Countdown/>

            <div className="background-radial mt-3 pb-5">
                <Container >
                    <Row className="mb-5 justify-content-md-center">
                        <Col xl="6" className="text-center">
                            <h1 className="mt-5">Only three steps to claim your FREE ICPunk</h1>
                            <p className="my-5">The process is fast and easy. Follow these three simple steps to be sure that you claimed your ICPunk properly</p>
                            <p className="xy-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
                                </svg>
                            </p>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col className="text-center">
                        <img src="/img/wallet.png" alt="wallet"/>
                        <div>STEP 1</div><span>Connect your wallet</span><span>ICPunk will be sent to the connected wallet</span>
                        <div>Connect wallet</div>
                        </Col>
                        <Col className="text-center">
                        <img src="/img/draw.png" alt="wallet"/>
                        <div>STEP 2</div> <span>Draw your FREE ICPunk</span><span>Your ICPunk will be drawn from 10 000 randomly generated ICPunks</span>
                        <div>Draw ICPunk</div>
                        </Col>
                        <Col className="text-center">
                        <img src="/img/collect.png" alt="wallet"/>
                        <div>STEP 3</div> <span>Collect your unique ICPunk</span><span>Enjoy your unique ICPunk!</span>
                        <div>Collect</div>
                        </Col>
                    </Row> */}
                    {/* <Row>
                        <Col xl="7" className="text-center">
                            <OwnedTokens/>
                        </Col>
                        <Col xl="5" className="text-center">
                            <Token/>
                        </Col>
                    </Row> */}
                </Container>
            </div>

            <Description />
        </>
    );
}