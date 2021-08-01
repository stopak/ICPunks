import { useAuth } from "src/utils";

export default function Account() {
    const authContext = useAuth();

    async function signIn() {
        authContext.logIn();
    }

    if (authContext.isAuthenticated) {
        let principal = authContext.identity?.getPrincipal();
        let hex = principal?.toString();

        return (
            <div>
                <span>Welcome {hex?.substring(0, 5)}...{hex?.substring(60)}</span>
        {/* <Button variant="outline-success" onClick={signOut}>Logout</Button> */}
        </div>
        );
    }

    return (<div><img src="/img/wallet.png" alt="wallet" onClick={signIn}/></div>);
}