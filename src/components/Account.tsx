import { useAuth } from "src/utils/auth";

export default function Account() {
    const authContext = useAuth();

    const handleShow = () => authContext.showModal(true);

    if (authContext.principal) {
        // let principal = authContext.identity?.getPrincipal();
        let hex = authContext.principal?.toString();

        return (
            <div>
                <span>Welcome {hex?.substring(0, 5)}...{hex?.substring(60)}</span>
            </div>
        );
    }

    return (
            <div><img src="/img/wallet.png" alt="wallet" onClick={handleShow} style={{ cursor: 'pointer' }} /></div>
    );


}