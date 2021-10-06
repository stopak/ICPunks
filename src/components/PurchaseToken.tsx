import { useState } from "react";
import { Modal, Container, Form } from "react-bootstrap";
import { useAuth } from "src/utils/auth";
import { useLocalState } from "src/utils/state";

export default function PurchaseToken() {
    const auth = useAuth();
    const state = useLocalState();

    const [isWorking, setWorking] = useState(false);


    const handleClose = () => {
        if (isWorking) return;
        state.setShowPurchase(false);
    }

    if (state.displayToken === null) {
        // handleClose();

        return <></>;
    } else
        return (
            <>
                <Modal size="lg" show={state.showPurchaseModal} onHide={handleClose} centered>
                    <Modal.Header>Purchase Punk #{state.displayToken.toString()}</Modal.Header>
                    <Modal.Body>
                        <Container className="wallets" fluid>
                            Starting transaction ... <br/>
                            Sending ICP ... <br/>
                            Waiting for confirmation ... <br/>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <span className="owner_pill price_color inline_spans action_pill" onClick={handleClose}>
                            CLOSE
                        </span>
                    </Modal.Footer>
                </Modal>
            </>
        );
};