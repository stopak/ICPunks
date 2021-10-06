import { Navbar, Container, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Account from "./Account";

export default function Header() {
    const history = useHistory();

    function navMain() {
        history.push('/');
    }

    return (
        <div className="box-shadow">
            <Container>
                <Navbar bg="white">
                    <Navbar.Brand onClick={navMain}><Image src="/img/logo_short.png" width="120" /></Navbar.Brand>
                    <div className="ml-auto">
                        <Account />
                    </div>
                </Navbar>
            </Container>
        </div>
    );
}