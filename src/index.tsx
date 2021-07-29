import React from "react";
import ReactDOM from "react-dom";
import { updateHead, ProvideAuth } from "./utils";
import { AppRouter } from "./AppRouter";
import Header from "./components/Header";
import "./styles.scss";

function ICPunksApp() {
  return (
    <ProvideAuth>
      <Header />
      <AppRouter />
    </ProvideAuth>
  );
}

// Required for website to behave like a phone app on mobile devices
updateHead(document);

ReactDOM.render(<ICPunksApp />, document.getElementById("app"));
