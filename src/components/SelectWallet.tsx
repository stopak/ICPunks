import { useEffect } from "react";
import {  Modal, Image, Row, Col, Container } from "react-bootstrap";
import { useAuth } from "src/utils/auth";

export default function SelectWallet() {
    const auth = useAuth();

    const handleClose = () => auth.showModal(false);

    const loginPlug = () => {
        auth.usePlug();
    }

    const loginIi = async () => {
        await auth.useInternetIdentity();
    }

    useEffect(() => {
        if (auth.wallet !== undefined)
            auth.wallet.logIn();

    }, [auth.wallet]);

    return (
        <>
            <Modal size="lg" show={auth.isShow} onHide={handleClose} centered>
                <Modal.Body>
                    <Container className="wallets" fluid>
                    <Row>
                        <Col sm="6" className="text-center p-2" onClick={loginPlug}>
                            <Image src="/img/plug.svg" />
                            <h3>Plug</h3>
                        </Col>
                        <Col sm="6" className="text-center p-2" onClick={loginIi}>
                            <Image src="/img/dfinity.svg" />
                            <h3>Internet Identity</h3>
                        </Col>
                    </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
};