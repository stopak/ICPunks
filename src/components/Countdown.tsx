import { Col, Row } from "react-bootstrap";
import ClaimButton from "./ClaimButton";

export default function Countdown() {

    return (<>
        <Row className="mb-5 text-center">
            <Col lg="6" md="12">
                <Row className="mb-3">
                    <ClaimButton />
                </Row>
            </Col>
        </Row>
    </>)
}