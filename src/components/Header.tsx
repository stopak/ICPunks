import { Navbar, Nav, Container, Image } from "react-bootstrap";
import Account from "./Account";

export default function Header() {
    return (
        <>
        <Container>
        <Navbar bg="white">
            <Navbar.Brand href="#home"><Image src="/img/dfinity_logo.png" width="231"/></Navbar.Brand>
        </Navbar>
        </Container>
        </>
    );
}