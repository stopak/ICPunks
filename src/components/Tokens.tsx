import { Container, Col, Row } from "react-bootstrap";

import { useLocalState } from "src/utils/state";
import OwnedTokens from "./OwnedTokens";
import Token from "./Token";

export default function Tokens() {
    const stateContext = useLocalState();


    

    if (stateContext.userTokens != null && stateContext.userTokens.length > 0) {

        return (
            <>
                <div className="background-radial pb-5">
                    <Container >
                        <Row className="mb-5 justify-content-md-center">
                            <Col xl="6" className="text-center">
                                <h1 className="mt-5">Your ICPunk</h1>
                            </Col>
                        </Row>
                        <Row className="mb-5 justify-content-md-center">
                            <Col xl="6" className="text-center">
                                <OwnedTokens />
                            </Col>
                            <Col xl="6" className="text-center">
                                <Token />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </>
        );
    }

    return (<></>);
}