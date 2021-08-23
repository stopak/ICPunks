import { Image } from "react-bootstrap";
import { useAuth } from "src/utils/auth";

export default function Account() {
    const authContext = useAuth();

    const handleShow = () => authContext.showModal(true);

    function copyAddress() {
        if (authContext.principal === null) return;

        // let text = item.id;
        let hex = authContext.principal?.toString() as string;

        navigator.clipboard.writeText(hex)
        .then(() => {
          alert('Address copied: '+hex);
        })
        .catch(err => {
          alert('Error in copying text: '+err);
        });
    }

    if (authContext.principal) {
        // let principal = authContext.identity?.getPrincipal();
        let hex = authContext.principal?.toString();

        return (
            <div>
                <span>Welcome: {hex?.substring(0, 5)}...{hex?.substring(60)} <Image src="/img/copy.svg" style={{width: '24px', marginLeft: '15px', cursor: 'pointer'}} onClick={copyAddress} /></span>
            </div>
        );
    }

    return (
            <div><img src="/img/wallet.png" alt="wallet" onClick={handleShow} style={{ cursor: 'pointer' }} /></div>
    );


}