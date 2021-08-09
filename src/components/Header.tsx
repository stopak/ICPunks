import { Navbar, Container, Image } from "react-bootstrap";
import Account from "./Account";

export default function Header() {
    return (
        <div className="box-shadow">
            <Container>
                <Navbar bg="white">
                    <Navbar.Brand href="#home"><Image src="/img/dfinity_logo.png" width="231" /></Navbar.Brand>
                    <div className="ml-auto">
                        <Account />
                    </div>
                </Navbar>
            </Container>
        </div>
    );
}