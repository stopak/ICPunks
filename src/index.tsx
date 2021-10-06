import ReactDOM from "react-dom";
import { AppRouter } from "./AppRouter";
import "./styles.scss";
import { ProvideState } from "./utils/state";
import SelectWallet from "./components/SelectWallet";
import { ProvideAuth } from "./utils/auth";
import SendToken from "./components/SendToken";
import ListToken from "./components/ListToken";
import PurchaseToken from "./components/PurchaseToken";
import SendIcp from "./components/SendIcp";

function ICPunksApp() {
  return (
    <ProvideAuth>
      <ProvideState>
        <AppRouter />
        <SelectWallet />
        <SendToken />
        <ListToken />
        <PurchaseToken />
        <SendIcp />
      </ProvideState>
    </ProvideAuth>
  );
}

ReactDOM.render(<ICPunksApp />, document.getElementById("app"));
