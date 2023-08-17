import "./App.css";
import "./payment.css";
import SuperTokens, { SuperTokensWrapper, getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import { SuperTokensConfig } from "./config";
import Tester from "./tester";
import ServiceNotAvailable from "./error_pages/Service_Unavailable";
import ServerErrorPage from "./error_pages/Internal_Server_Error";
import NotAuthorized from "./error_pages/Unauthorized";
import AccountDetails from "./Account_Details";
import { loadStripe } from '@stripe/stripe-js';
import Payment from "./payment";
import Completion from "./Completion";
import Charts from './components/Statistic/Charts';
import SideBar from "./components/SideBar/SideBar";
import TelegramMessage from "./components/telegram-message/TelegramMessage"
import PaymentMode from "./components/payment-mode/PaymentMode";
import SendSol from "./components/pay-with-phantom/SendSol";
import PayWithMetamask from "./components/pay-with-metamask/PayWithMetamask";
import RepetitiveTasks from "./components/Repetitive-Tasks/RepetitiveTasks";
import History from "./components/history/history";

SuperTokens.init(SuperTokensConfig);


SuperTokens.init(SuperTokensConfig);
function App() {
    const user = {
        userId:'',
        email: "",
        name: "",
        password: "*********",
        githubAccount: "--",
        blockchainAccount: "--",
        lastName: ""
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

                        <Route path="/completion">
                        <SessionAuth>
                            <Completion /> 
                        </SessionAuth></Route>
                        
                       <Route path="/sendNotif">
                        <SessionAuth>
                            <TelegramMessage/>
                        
                        </SessionAuth></Route> 

                       <Route path="/history">
                        <SessionAuth>
                        <div className="fix">
                                    <SideBar remaining={20} disabled={false}/>
                                    <History/>
                                    </div>

                       </SessionAuth>


                       </Route>
                            
                           <Route
                                path="/ServiceUnavailable"><ServiceNotAvailable /></Route>
                            <Route
                                path="/InternalServerError"><ServerErrorPage /></Route>
                            <Route
                                path="/notauthorized"><NotAuthorized /></Route> 
                            <Route
                                path="/accountdetails"><div className="fix"><SideBar remaining={20} disabled={false}/><AccountDetails userId={user.userId} /></div></Route>



                            <Route
                                path="/paywithmetamask"><PayWithMetamask /></Route>



                            <Route
                                path="/paywithphantom"><SendSol /></Route>
                            <Route
                                path="/paymentmode"><PaymentMode /></Route>


                            <Route path="/repetitivetasks">
                                <SessionAuth>
                                <div className="fix">
                                    <SideBar remaining={20} disabled={false}/>
                                    <RepetitiveTasks  />
                                    </div>
                                </SessionAuth>
                            </Route>
                            
                            
                            <Route
                                path="/statistics"><div className="fix"><SideBar remaining={20} disabled={false}/><Charts/></div>
                            </Route>
                               


                        
                        </Switch>
                    </div>
                </Router>
            </div>
        </SuperTokensWrapper>
    );
}

export default App;
