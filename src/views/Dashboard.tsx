import { Principal } from "@dfinity/agent";
import { Component } from "react";
import { listTokens } from "../utils/canister";
import TokenCard from "../components/TokenCard";

import { Container, Col, Row } from "react-bootstrap";
interface DashboardProps {

}

interface DashboardState {
    tokens: Principal[];
}

export class Dashboard extends Component<DashboardProps, DashboardState> {
    async componentDidMount() {
        var tokens = await listTokens();

        this.setState({
            tokens: tokens
        });
    }

    render() {
        if (this.state === null || this.state.tokens === null) {
            return (<>Loading ...</>);
        }

        return (
            <Container fluid>
                <Row>
                    {this.state.tokens.map((value, index) =>
                        <Col key={index} xl="3" lg="4" md="6" sm="12">
                            <TokenCard value={value} index={index} />
                        </Col>
                    )}</Row>
            </Container>
        );
    }
}