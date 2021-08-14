import ReactDOM from "react-dom";
import { AppRouter } from "./AppRouter";
import Header from "./components/Header";
import "./styles.scss";
import { ProvideState } from "./utils/state";
import SelectWallet from "./components/SelectWallet";
import { ProvideAuth } from "./utils/auth";

function ICPunksApp() {
  return (
    <ProvideAuth>
      <ProvideState>
        <Header />
        <AppRouter />
        <SelectWallet />
      </ProvideState>
    </ProvideAuth>
  );
}

ReactDOM.render(<ICPunksApp />, document.getElementById("app"));
