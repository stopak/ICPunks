import { Container, Col, Row } from "react-bootstrap";
import Countdown from "src/components/Countdown";
import Description from "src/components/Description";
import { useAuth } from "src/utils/auth";

export default function Dashboard() {
    const authContext = useAuth();

    async function signIn() {
        authContext.showModal(true);
    }

    let waitStyle = authContext.principal !== undefined ? "text-center " : "text-center inactive";

    return (
        <>
            <Countdown/>

            <div className="background-radial pb-5">
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
                      <Row className="steps">
                        <Col className="text-center" onClick={signIn} style={{cursor:'pointer'}}>
                            <div className="image">
                                <img src="/img/wallet.svg" alt="wallet"/>
                            </div>
                            <div className="step">STEP 1</div>
                            <div className="name">Connect your wallet</div>
                            <div className="desc">ICPunk will be sent to the connected wallet</div>
                            <div className="action">Connect wallet</div>
                        </Col>
                        <Col className={waitStyle}>
                            <div className="image">
                                <img src="/img/draw.svg" alt="wallet"/>
                            </div>
                            <div className="step">STEP 2</div>
                            <div className="name">Wait untill Sept 1 20:00 UTC</div>
                            <div className="desc">Claiming will be enabled at that time</div>
                            <div className="action">Wait</div>
                        </Col>
                        <Col className="text-center inactive">
                            <div className="image">
                                <img src="/img/collect.svg" alt="wallet"/>
                            </div>
                            <div className="step">STEP 3</div>
                            <div className="name">Collect your unique ICPunk</div>
                            <div className="desc">Enjoy your unique ICPunk!</div>
                            <div className="action">Collect</div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Description />
        </>
    );
}