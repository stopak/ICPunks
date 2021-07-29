import { useAuth } from "src/utils";
import { Button } from "react-bootstrap";

export default function Account() {
    const authContext = useAuth();

    async function signIn() {
        authContext.logIn();
    }

    function signOut() {
        authContext.logOut();
    }

    if (authContext.isAuthenticated) {
        let principal = authContext.identity?.getPrincipal();
        let hex = principal?.toString();

        return (
            <div>
                <span>{hex}</span>
        <Button variant="outline-success" onClick={signOut}>Logout</Button>
        </div>
        );
    }

    return (<div>
        <Button variant="outline-success" onClick={signIn}>Connect wallet</Button>
       <img src="/img/wallet.png" alt="wallet"/>
        </div>);
}