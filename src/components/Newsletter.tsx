import { useState } from "react";
import { Container } from "react-bootstrap";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [isSent, setSent] = useState(false);

    function signIn() {
        var data = new FormData();
        data.append('email', email);
        data.append('l', "9d88fb56-31df-41ec-b448-2c693a465cca");

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://news.icpunks.com/subscription/form', true);
        xhr.onload = function () {
            // do something to response
            console.log(this.responseText);
            setSent(true);
        };
        xhr.send(data);
    }

    function updateEmail(e) {
        setEmail(e.target.value);
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '100px' }}>

            <img id="Mask_Group_34" alt="" src="/img/Mask_Group_34.png" />
            <img id="Mask_Group_36" alt="" src="/img/Mask_Group_36.png" />
            <div className="background-radial" style={{ overflow: 'hidden' }}>
                <Container fluid className="newsletter rwdcontainer">
                    <h1>Join our newsletter</h1>
                    <h3>Stay up to date with our new releases</h3>

                    <div className="mt-5">
                        { !isSent?
                        <div className="button-wrapper input-wrapper gray-background">
                            <input value={email} onChange={updateEmail} type="text" className="button white-background" name="email" placeholder="E-mail" />
                        </div> :
                        <h2>Thank you for signing up to newsletter!</h2> }
                    </div>
                    <div>
                        <div className="button-wrapper sdark-background small">
                            <div className="button sec-background" onClick={signIn}>
                                <p>Send</p>
                            </div>
                        </div>
                    </div>

                </Container>
            </div>
        </div>
    );
}