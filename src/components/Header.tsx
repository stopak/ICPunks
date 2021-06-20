import { useAuth } from "src/utils";

export default function Header() {
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
            <>Authorized! {hex} <button onClick={signOut}>Logout</button></>
        );
    }


    return (
        <>Not authorized! <button onClick={signIn}>Login</button></>
    );
}