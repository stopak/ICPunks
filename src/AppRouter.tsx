import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Token from "./components/Token";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
// import { SignIn } from "./views/SignIn";
// import { SignUp } from "./components/SignUp";
// import { useAuth } from "./utils";
// import { PrivateRoutes } from "./components/PrivateRoutes";

import { Dashboard } from "./views/Dashboard";

// function wrapRouteWithFade(Component) {
//   return ({ match }) => (
//     <CSSTransition
//       in={match != null}
//       timeout={300}
//       classNames="page-fade"
//       unmountOnExit
//     >
//       <Component />
//     </CSSTransition>
//   );
// }

export function AppRouter() {
  // const { user, setUser, isAuthenticated, isAuthReady, logOut } = useAuth();

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/token/:tokenId" component={Token} />
      </Switch>
    </Router>
  );
}
