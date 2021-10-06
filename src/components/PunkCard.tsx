import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Listing_2 } from "src/utils/canister/icpunks_type";

import {getCanisterIds} from "../utils/canister/principals";

export default function PunkCard(props: any) {
    const history = useHistory();

    const pow = Math.pow(10, 8);

    const format = function (amount:bigint) {

        return Number(Number(amount)/ pow)
        .toString()
          .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

    function onPunkChosen() {
        history.push("/token/"+token.token_id.toString());
    }

    var principals = getCanisterIds();

    const token = props.token as Listing_2;
    const imgUrl = principals.token_img+"/Token/"+token.token_id;
    return (
        <Card className="punk_background" onClick={onPunkChosen}>
            <Card.Img onClick={onPunkChosen} className="punk_img" variant="top" src={imgUrl} />
            <Card.Body onClick={onPunkChosen}>
                <Card.Title className="punk_title text-center">
                    <div>
                        #{token.token_id.toString()}
                    </div>
                    <span className="text-muted-modal card_smaller_text">
                        ICPunks
                    </span>
                </Card.Title>
                <Card.Text className="punk_price">
                    {format(token.price)} ICP
                </Card.Text>
            </Card.Body>
        </Card>
    );
}