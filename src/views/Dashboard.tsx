import { Principal } from "@dfinity/agent";
import { Component } from "react";
import { listTokens } from "../utils/canister";


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
        if (this.state !== null && this.state.tokens !== null) {
            return (<>Fetched {this.state.tokens.length} tokens!</>);
        } else 
        return (
            <>Loading tokens</>
        );
    }
}