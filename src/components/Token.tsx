// import { Principal } from "@dfinity/agent";
import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useLocalState } from "src/utils/state";
// import { useAuth } from "src/utils";


export default function Token() {
    const state = useLocalState();

    const [desc, setDesc] = useState("???");
    const [imgUrl, setImgUrl] = useState("/img/image_4_3.bpc.png");

    useEffect(() => {
        if (state.displayToken !== null && state.displayToken !== undefined) {
            setDesc("ICPunk #"+state.displayToken);
            setImgUrl("/punks/"+state.displayToken+".jpg");
        }
    }, [state.displayToken]);



    return (
        <>
            <h1 id="punk_image" className="mt-5">Your ICPunk</h1>
            <p className="mb-5">Enjoy your unique ICPunk!</p>
            <div className="p-3" style={{ width: "100%", background: "white", borderRadius: "10px" }}>
                <h2 style={{ borderRadius: "10px", backgroundColor: "rgba(75,0,123,1)", padding: "10px", marginTop: "-1px" }}>{desc}</h2>
                <img className="w-100" src={imgUrl} />
                {/* <div className="text-black">
                                <h3>Properties</h3>
                                <Row>
                                    <Col>
                                        <div>
                                            <h6>BACKGROUND</h6>
                                            <p>GRAY</p>
                                            <div>18% have this trait</div>
                                        </div>
                                    </Col>
                                    <Col>BASE</Col>
                                </Row>
                                <Row>
                                    <Col>BODY</Col>
                                    <Col>FACE</Col>
                                </Row>
                                <Row>
                                    <Col>HEAD</Col>
                                    <Col>LOREM</Col>
                                </Row>
                                </div> */}
            </div>
        </>
    );
}