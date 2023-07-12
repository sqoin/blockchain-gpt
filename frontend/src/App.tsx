import "./App.css";
import "./payment.css";
import SuperTokens, { SuperTokensWrapper, getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import { SuperTokensConfig } from "./config";
import Tester from "./tester";
import ChartComponent from "./adapters/ChartComponent";
import ServiceNotAvailable from "./Service_Unavailable";
import ServerErrorPage from "./Internal_Server_Error";
import NotAuthorized from "./Unauthorized";
import AccountDetails from "./Account_Details";
import { loadStripe } from '@stripe/stripe-js';
import Payment from "./payment";
import Completion from "./Completion";

import Wallet from "./components/Wallet";
import TestProp from "./components/TestProp";
SuperTokens.init(SuperTokensConfig);
const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');

SuperTokens.init(SuperTokensConfig);
function App() {
      const user = {
        email: "example@example.com",
        name: "John Doe",
        password: "*********",
        githubAccount: "john_doe_github",
        googleAccount: "john_doe_google",
        blockchainAccount: "john_doe_blockchain"
      };
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
                             <Route path="/payment" element={<Payment/>} />
          <Route path="/completion" element={<Completion />} />
                              
      
      


                              <Route
                                path="/statics"

                                element={
                                    <ChartComponent />
                                        
                                } />
                                <Route
                                path="/ServiceUnavailable"

                                element={
                                    <ServiceNotAvailable />
                                        
                                } /> 
                                <Route
                                path="/InternalServerError"

                                element={
                                    <ServerErrorPage />
                                        
                                } /> 
                                <Route
                                path="/notauthorized"

                                element={
                                    <NotAuthorized  />
                                        
                                } /> 
                                <Route
                                path="/accountdetails"

                                element={
                                    <AccountDetails user={user}  />
                                        
                                } /> 
                                
                                <Route
                                path="/paywithmetamask"

                                element={
                                    <Wallet />
                                        
                                } />
                                <Route
                                path="/testpop"

                                element={
                                    <TestProp/>
                                        
                                } />
                        </Routes>
                        
                    </div>
                </Router>
            </div>
        </SuperTokensWrapper>
    );
}

export default App;
