import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ClaimButton from "./ClaimButton";

export default function Countdown() {
    const countDownDate = new Date("2021-8-9 16:00:00").getTime();
    const utcDate = Date.UTC(2021,8,1,20);

    const [days, setDays] = useState(0);
    const [hr, setHr] = useState(0);
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const [claim, setClaim] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            
        // Get today's date and time
        var now = new Date;
        var utcNow = Date.UTC(now.getFullYear(),now.getMonth(), now.getDate() , 
        now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        
        // Find the distance between now and the count down date
        var distance = utcDate - utcNow;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setDays(days);
        setHr(hours);
        setMin(minutes);
        setSec(seconds);

        }, 1000);
        return () => clearTimeout(timer);
      }, []);
    

    return (
            <Container style={{height: "965px"}}>
                <Row className="mb-5">
                    <Col xl="6" lg="12">
                        <h1 className="title mt-5">ICPunks</h1>
                        <h2><span className="main-color mb-5">First NFTs</span> on the Internet Computer</h2>
                        <p className="mt-5">10,000 randomly generated, unique collectible clowns with proof of ownership stored on the Internet Computer blockchain. Created as a reference to a meme comparing the Internet Computer token (ICP) with the Insane Clown Posse - an American hip hop duo founded in 1989.</p>
                    </Col>
                </Row>
                <Row className="mt-5 mb-5">
                    <Col xl="6" lg="12" className="text-center">
                        <h2>Drop countdown</h2>
                    </Col>
                </Row>
                <Row className="mb-5 text-center">
                    <Col xl="6" lg="12">
                        <Row className="counter">
                            <Col>
                                <div className="button-wrapper dark-background mx-auto"><div className="button main-background"><p className="timer">{days}</p></div></div>
                                <p>DAY</p>
                            </Col>
                            <Col>
                                <div className="button-wrapper dark-background mx-auto"><div className="button main-background"><p className="timer">{hr}</p></div></div>
                                <p>HR</p>
                            </Col>
                            <Col>
                                <div className="button-wrapper dark-background mx-auto"><div className="button main-background"><p className="timer">{min}</p></div></div>
                                <p>MIN</p>
                            </Col>
                            <Col>
                                <div className="button-wrapper dark-background mx-auto"><div className="button main-background"><p className="timer">{sec}</p></div></div>
                                <p>SEC</p>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            {claim &&
                            <ClaimButton />
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
    )
}