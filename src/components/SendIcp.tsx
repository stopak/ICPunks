import { Principal } from "@dfinity/principal";
import { useEffect, useState } from "react";
import { Modal, Container, Form } from "react-bootstrap";
import { getAccountId } from "src/utils/account";
import { useAuth } from "src/utils/auth";
import { useLocalState } from "src/utils/state";

import BigNumber from "bignumber.js";

export default function SendIcp() {
    const state = useLocalState();
    const auth = useAuth();

    const [to, setTo] = useState("");
    const [val, setVal] = useState<bigint | null>(null);
    const [valError, setValError] = useState("");
    const [dispVal, setDispVal] = useState("");

    const [fee, setFee] = useState(0.0001);

    const [isWorking, setWorking] = useState(false);
    const [toClass, setToClass] = useState("form-control is-invalid");
    const [valClass, setValClass] = useState("form-control");
    const [accountId, setAccountId] = useState("");

    const handleClose = () => {
        if (isWorking) return;
        state.setShowTransfer(false);
    }

    useEffect(() => {
        if (auth.balance !== null) {
            let val = auth.balance - BigInt(10000).valueOf();
            let strVal = Number(val) / Math.pow(10, 8);
            setVal(val);
            setDispVal(strVal.toString());
        }
    }, [auth.balance])

    function handleChange(event) {
        try {
            let id = Principal.fromText(event.target.value);
            setAccountId(getAccountId(id.toText(), 0));
            setToClass("form-control");
        } catch {
            setToClass("form-control is-invalid");
        }

        setTo(event.target.value);
    }

    function handleValChange(event) {
        if (auth.balance === null) return;

        try {
            let val = new BigNumber(event.target.value);
            let val2 = val.multipliedBy(Math.pow(10, 8));
            let bigVal = BigInt(val2.toNumber());

            if (bigVal <= BigInt(0)) {
                setValError("You must send at least 0.00000001");
                setValClass("form-control is-invalid");
            } else {

                let withFee = bigVal + BigInt(10000);

                if (withFee <= auth.balance) {
                    setVal(bigVal)
                    setValClass("form-control");
                } else {
                    setVal(null);
                    setValClass("form-control is-invalid");
                    setValError("Not enough funds");
                }
            }
        } catch {
            setVal(null);
            setValClass("form-control is-invalid");
            setValError("This is not a valid number");
        }

        setDispVal(event.target.value);
    }

    async function handleSend() {
        if (isWorking) return;
        if (toClass !== "form-control") return;
        if (valClass !== "form-control") return;

        setWorking(true);

        let id = Principal.fromText(to);

        if (auth.wallet !== undefined) {
            let accountId = getAccountId(id.toString(), 0);

            let txRequest = {
                to: accountId,
                amount: val,
            }

            let result = await auth.wallet?.requestTransfer(txRequest);

            if (result) {
                await auth.wallet?.getBalance();

                setTo("");
                setAccountId("");
                handleClose();
            }
        }

        setWorking(false);
    }

    let sendText = "SEND";
    if (isWorking) sendText = "SENDING ....";

    return (
        <>
            <Modal size="lg" show={state.showTransferModal} onHide={handleClose} centered>
                <Modal.Header>Send your ICP</Modal.Header>
                <Modal.Body>
                    <Container className="wallets" fluid>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <label htmlFor="to">To</label>
                            <input type="text" name="to" value={to} onChange={handleChange} className={toClass} aria-describedby="transfer-to" required></input>
                            <div id="validationServer03Feedback" className="invalid-feedback">
                                Please provide a valid Principal ID.
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <label htmlFor="to">Account Id</label>
                            <input type="text" name="accountId" value={accountId} className="form-control" aria-describedby="accountid" readOnly></input>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <label htmlFor="val">Amount</label>
                            <input type="text" name="val" value={dispVal} onChange={handleValChange} className={valClass} aria-describedby="val" required></input>
                            <div id="validationServer03Feedback" className="invalid-feedback">
                                {valError}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <label htmlFor="fee">Fee</label>
                            <input type="text" name="fee" value={fee} className="form-control" aria-describedby="fee" readOnly></input>
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