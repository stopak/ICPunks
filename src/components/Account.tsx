import { Image } from "react-bootstrap";
import { auth, useAuth } from "src/utils/auth";
import { useLocalState } from "src/utils/state";

export default function Account() {
    const localState = useLocalState();
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

    function showSendModal() {
        localState.setShowTransfer(true);
    }

    if (authContext.principal) {
        // let principal = authContext.identity?.getPrincipal();
        let hex = authContext.principal?.toString();

        let icp = <></>;


        if (authContext.wallet !== undefined && authContext.wallet.name === 'ii' && authContext.balance !== null && authContext.balance > BigInt(0)) {
            let balance = Number(authContext.balance)/Math.pow(10, 8);
            icp = <>
                <span className="owner_pill price_color inline_spans action_pill" onClick={showSendModal}>
                    Your ICP: {balance}
                </span>
            </>
        }

        return (
        <>
            <div>
                <span>Welcome: {hex?.substring(0, 5)}...{hex?.substring(60)} <Image src="/img/copy.svg" style={{width: '24px', marginLeft: '15px', cursor: 'pointer'}} onClick={copyAddress} /></span>
            
            </div>
            {icp}

            </>
        );
    }

    return (
            <div><img src="/img/wallet.png" alt="wallet" onClick={handleShow} style={{ cursor: 'pointer' }} /></div>
    );


}