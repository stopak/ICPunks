import { Principal } from "@dfinity/principal";
import { useState } from "react";
import { Modal, Container, Form } from "react-bootstrap";
import { useLocalState } from "src/utils/state";

export default function SendToken() {
    const state = useLocalState();

    const [to, setTo] = useState("");

    const [isWorking, setWorking] = useState(false);
    const [toClass, setToClass] = useState("form-control");


    const handleClose = () => {
        if (isWorking) return;
        state.setShowSend(false);
    }

    if (state.displayToken === null) return <></>

    function handleChange(event) {
        try {
            Principal.fromText(event.target.value);
            setToClass("form-control");
        } catch {
            setToClass("form-control is-invalid");
        }

        setTo(event.target.value);
    }

    async function handleSend() {
        if (state.displayToken === null) return;
        if (isWorking) return;
        if (toClass !== "form-control") return;
        
        setWorking(true);

        let id = Principal.fromText(to);

        if (state.displayToken !== null) {
            try {
                await state.delistToken(state.displayToken);
            } catch {

            }
            await state.sendToken(state.displayToken.valueOf(), id);
            await state.loadDisplayToken();
            await state.loadUserTokens();
            setTo("");
            handleClose();
        }

        setWorking(false);
    }

    let sendText = "SEND";
    if (isWorking) sendText = "SENDING ....";

    return (
        <>
            <Modal size="lg" show={state.showSendModal} onHide={handleClose} centered>
                <Modal.Header>Send your Punk #{state.displayToken.toString()}</Modal.Header>
                <Modal.Body>
                    <Container className="wallets" fluid>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <label htmlFor="to">TO</label>
                                <input type="text" name="to" value={to} onChange={handleChange} className={toClass} aria-describedby="transfer-to" required></input>
                                <div id="validationServer03Feedback" className="invalid-feedback">
                                    Please provide a valid principal ID.
                                </div>
                            </Form.Group>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
        <span className="owner_pill price_color inline_spans action_pill" onClick={handleSend}>
            {sendText}
        </span>
        <span className="owner_pill price_color inline_spans action_pill" onClick={handleClose}>
            CLOSE
        </span>
                </Modal.Footer>
            </Modal>
        </>
    );
};