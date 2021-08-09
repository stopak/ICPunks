import { Container } from "react-bootstrap";

export default function Newsletter() {

    function signIn() {

    }

    return (
        <div className="background-radial mt-3 pb-5">
            <Container fluid className="newsletter">
                <h1>Join our newsletter</h1>
                <h3>Stay up to date with our new releases</h3>

                <div><input type="text" placeholder="email" /></div>

                <div className="button-wrapper sdark-background small">
                    <div className="button sec-background" onClick={signIn}>
                        <p>Send</p>
                    </div>
                </div>

                <img id="Mask_Group_34" alt="" src="/img/Mask_Group_34.png" style={{ overflow: "hidden" }} />
                <img id="Mask_Group_36" alt="" src="/img/Mask_Group_36.png" style={{ overflow: "hidden" }} />


                {/* <iframe className="mj-w-res-iframe" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src="https://app.mailjet.com/widget/iframe/6aKb/K8Y" width="100%"></iframe>

            <script type="text/javascript" src="https://app.mailjet.com/statics/js/iframeResizer.min.js"></script> */}
            </Container>
        </div>
    );
}