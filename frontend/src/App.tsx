import "./App.css";
import "./payment.css";
import SuperTokens, { SuperTokensWrapper, getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
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

import PaymentMode from "./components/payment-mode/PaymentMode";
import SendSol from "./components/pay-with-phantom/SendSol";
import PayWithMetamask from "./components/pay-with-metamask/PayWithMetamask";
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
                    <Switch>
                            {/* This shows the login UI on "/auth" route */}
                            {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}

                            
                            <Route exact path="/">
                                <SessionAuth>
                                        <Home />
                                </SessionAuth>
                            </Route>


                            <Route exact path="/test">
                                <Tester />
                            </Route>
                             
                            <Route path="/paymentWithStripe"><Payment /></Route>
                            <Route path="/completion"><Completion /></Route>





                            <Route path="/statics">
                                <ChartComponent />
                            </Route>
                            <Route
                                path="/ServiceUnavailable"><ServiceNotAvailable /></Route>

                              
                            <Route
                                path="/InternalServerError"><ServerErrorPage /></Route>

                               
                            <Route
                                path="/notauthorized"><NotAuthorized /></Route>

                                
                            <Route
                                path="/accountdetails"><AccountDetails user={user} /></Route>

                               

                            <Route
                                path="/paywithmetamask"><PayWithMetamask /></Route>

                               
                            

                            <Route
                                path="/paywithphantom"><SendSol /></Route>
                            <Route
                                path="/paymentmode"><PaymentMode /></Route>

                               

                    </Switch>

                    </div>
                </Router>
            </div>
        </SuperTokensWrapper>
    );
}

export default App;
