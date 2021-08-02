import React from "react";
import * as apiCalls from "../api/apiCalls";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import UserSignupPage from "../pages/UserSignupPage";
import UserPage from "../pages/UserPage";
import TopBar from "../components/TopBar";

import { Route, Switch } from "react-router-dom";

function App() {
  // switch: used for provide single route
  // exact: used when the router search for the exact path matching to be rendered(not from the root path matching)
  return (
    <div>
      <TopBar />
      <div className="container">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={UserSignupPage} />
          <Route exact path="/:username" component={UserPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
