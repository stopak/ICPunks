import { Navbar, Nav } from "react-bootstrap";
import Account from "./Account";

export default function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">ICPunks</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Punks</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav>
                <Account/>
            </Navbar.Collapse>
        </Navbar>
    );
}