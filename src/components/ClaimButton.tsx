// import { useState } from "react";
import { auth, useAuth } from "src/utils/auth";
import { useHistory } from "react-router-dom";
import { useLocalState } from "src/utils/state";

export default function ClaimButton() {
    const authContext = useAuth();
    const stateContext = useLocalState();
    const history = useHistory();
    // const [isWorking, setWorking] = useState(false);

    const handleShow = () => authContext.showModal(true);

    // async function claimToken() {
    //     if (isWorking) return;

    //     setWorking(true);

    //     await stateContext.claimToken();

    //     setWorking(false);
    // }

    function gotoMarketplace() {
        history.push('/market');
    }

    function goToPunk() {
        document.getElementById("punk_image")?.scrollIntoView();
    }

    // if (isWorking) {
    //     return (
    //         <div className="button-wrapper sdark-background my-1 w-100">
    //             <div className="button sec-background" onClick={claimToken}>
    //                 <p>Claiming ...</p>
    //             </div>
    //         </div>
    //     );
    // }

    if (auth.icpunk === undefined) {
        return (
            <div className="button-wrapper sdark-background mx-3 w-100" style={{ cursor: 'pointer' }}>
                <div className="button sec-background" onClick={handleShow}>
                    <p>Connect your wallet</p>
                </div>
            </div>
        );
    }


    if (stateContext.userTokens != null && stateContext.userTokens.length > 0) {
        return (<>
            <div className="button-wrapper dark-background my-1 w-100">
                <div className="button main-background" onClick={gotoMarketplace}>
                    <p>Marketplace</p>
                </div>
            </div>
            <div className="button-wrapper sdark-background my-1 w-100">
                <div className="button sec-background" onClick={goToPunk}>
                    <p>View your punks</p>
                </div>
            </div></>
        );
    }


    // if (stateContext.remainingTokens === BigInt(0)) {
    return (
        <div className="button-wrapper dark-background my-1 w-100">
            <div className="button main-background" onClick={gotoMarketplace}>
                <p>Marketplace</p>
            </div>
        </div>
    );
    // }

    // if (authContext.principal !== undefined) {
    //     if (stateContext.canClaim || stateContext.claimDate < new Date().getTime()) {
    //         return (
    //             <div className="button-wrapper sdark-background my-1 w-100">
    //                 <div className="button sec-background" onClick={claimToken}>
    //                     <p>Claim your punk</p>
    //                 </div>
    //             </div>
    //         );
    //     } else {
    //     return (
    //         <div className="button-wrapper sdark-background my-1 w-100">
    //             <div className="button sec-background">
    //                 <p>Wait for launch</p>
    //             </div>
    //         </div>);
    //     }

    // } 

}