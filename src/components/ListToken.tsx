import { useState } from "react";
import { Modal, Container, Form } from "react-bootstrap";
import { useAuth } from "src/utils/auth";
import { useLocalState } from "src/utils/state";

export default function ListToken() {
    const auth = useAuth();
    const state = useLocalState();

    const [price, setPrice] = useState(1.0);

    const [isWorking, setWorking] = useState(false);
    const [priceClass, setPriceClass] = useState("form-control");


    const handleClose = () => {
        if (isWorking) return;
        state.setShowList(false);
    }

    if (state.displayToken === null) return <></>

    function handleChange(event) {
        try {

            let price = Number(event.target.value);
            let nan = Number.isNaN(price);

            if (price < 0.01 || nan)
                setPriceClass("form-control is-invalid");
            else
                setPriceClass("form-control");
        } catch {
            setPriceClass("form-control is-invalid");
        }

        setPrice(event.target.value);
    }

    async function handleSend() {
        if (state.displayToken === null) return;
        if (isWorking) return;
        if (priceClass !== "form-control") return;

        setWorking(true);

        let e8s = Number(price);
        e8s = e8s * Math.pow(10, 8);

        if (state.displayToken !== null) {
            await state.listToken(state.displayToken.valueOf(), BigInt(e8s).valueOf());

            let listing = {
                'token_id': state.displayToken.valueOf(),
                'owner': auth.principal,
                'timestamp': 0,
                'price': BigInt(e8s).valueOf(),
                'description': ''
            };

            state.addListed(listing);
            state.setDisplayTokenListing(listing);

            handleClose();
        }

        setWorking(false);
    }

    let sendText = "LIST";
    if (isWorking) sendText = "LISTING ....";

    return (
        <>
            <Modal size="lg" show={state.showListModal} onHide={handleClose} centered>
                <Modal.Header>List your Punk #{state.displayToken.toString()}</Modal.Header>
                <Modal.Body>
                    <Container className="wallets" fluid>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <label htmlFor="to">Price</label>
                            <input type="text" name="to" value={price} onChange={handleChange} className={priceClass} aria-describedby="transfer-to" required></input>
                            <div id="validationServer03Feedback" className="invalid-feedback">
                                Price must be a number and be equal or higher than 0.01
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