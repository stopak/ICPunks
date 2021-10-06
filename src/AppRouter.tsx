import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import TokenCard from "./components/TokenCard";

import Dashboard from "./views/Dashboard";
import Market from "./views/Market";

export function AppRouter() {

  return (<>
    <Router>
      <ScrollToTop />
      <Header />
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/market" component={Market} />
        <Route path="/token/:tokenId" component={TokenCard} />
      </Switch>
    </Router>
    <Footer/>
    </>
  );
}
