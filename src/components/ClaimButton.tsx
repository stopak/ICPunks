import { useState } from "react";
import { useAuth } from "src/utils/auth";
import { useLocalState } from "src/utils/state";

export default function ClaimButton() {
    const authContext = useAuth();
    const stateContext = useLocalState();
    const [isWorking, setWorking] = useState(false);

    const handleShow = () => authContext.showModal(true);
    // async function claimToken() {
    //     if (isWorking) return;
        
    //     setWorking(true);

    //     await stateContext.claimToken();

    //     setWorking(false);
    // }

    // function goToPunk() {
    //     document.getElementById("punk_image")?.scrollIntoView();
    // }


    // if (stateContext.userTokens != null && stateContext.userTokens.length > 0) {
    //     return (
    //         <div className="button-wrapper sdark-background my-1 w-100">
    //             <div className="button sec-background" onClick={goToPunk}>
    //                 <p>View your punk</p>
    //             </div>
    //         </div>
    //     );
    // }

    // if (stateContext.remainingTokens === BigInt(0)) {
    //     return (
    //         <div className="button-wrapper sdark-background my-1 w-100">
    //             <div className="button sec-background">
    //                 <p>Sold out</p>
    //             </div>
    //         </div>
    //     );
    // }

    if (authContext.principal !== undefined) {
        return (
        <div className="button-wrapper sdark-background my-1 w-100">
            <div className="button sec-background">
                <p>Wait for launch</p>
            </div>
        </div>);
        // return (
        //     <div className="button-wrapper sdark-background my-1 w-100">
        //         <div className="button sec-background" onClick={claimToken}>
        //             <p>Claim your punk</p>
        //         </div>
        //     </div>
        // );
    } 
    return (
        <div className="button-wrapper sdark-background mx-3 w-100">
            <div className="button sec-background" onClick={handleShow}>
                <p>Connect your wallet</p>
            </div>
        </div>
    );
}