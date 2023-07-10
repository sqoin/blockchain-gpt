import "./App.css";
import SuperTokens, { SuperTokensWrapper, getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import { SuperTokensConfig } from "./config";
import Tester from "./tester";
import ChartComponent from "./adapters/ChartComponent";
import Wallet from "./components/Wallet";
SuperTokens.init(SuperTokensConfig);

function App() {
    return (
        <SuperTokensWrapper>
            <div className="App app-container">
                <Router>
                    <div className="fill">
                        <Routes>
                            {/* This shows the login UI on "/auth" route */}
                            {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}

                            <Route
                                path="/"
                                element={
                                    /* This protects the "/" route so that it shows
                                  <Home /> only if the user is logged in.
                                  Else it redirects the user to "/auth" */
                                    <SessionAuth>
                                        <Home />
                                    </SessionAuth>
                                }
                            />

                            <Route
                                path="/test"

                                element={
                                    <Tester />
                                        
                                } />

                              <Route
                                path="/statics"

                                element={
                                    <ChartComponent />
                                        
                                } /> 
                                <Route
                                path="/wallet"

                                element={
                                    <Wallet />
                                        
                                } />
                        </Routes>
                    </div>
                </Router>
            </div>
        </SuperTokensWrapper>
    );
}

export default App;
