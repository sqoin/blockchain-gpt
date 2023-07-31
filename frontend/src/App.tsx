import "./App.css";
import "./payment.css";
import SuperTokens, { SuperTokensWrapper, getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import { SuperTokensConfig } from "./config";
import Tester from "./tester";
import ChartComponent from "./components/Statistic/ChartComponent";
import ServiceNotAvailable from "./error_pages/Service_Unavailable";
import ServerErrorPage from "./error_pages/Internal_Server_Error";
import NotAuthorized from "./error_pages/Unauthorized";
import AccountDetails from "./Account_Details";
import { loadStripe } from '@stripe/stripe-js';
import Payment from "./payment";
import Completion from "./Completion";
import Pie_Chart from './components/Statistic/Pie_Chart';
import Bar_Chart from './components/Statistic/Bar_Chart';
import Charts from './components/Statistic/Charts';




import TelegramMessage from "./components/telegram-message/TelegramMessage"
import PaymentMode from "./components/payment-mode/PaymentMode";
import SendSol from "./components/pay-with-phantom/SendSol";
import PayWithMetamask from "./components/pay-with-metamask/PayWithMetamask";
import BarChart from "./components/Statistic/Bar_Chart";
import PieChart from "./pieChart";
SuperTokens.init(SuperTokensConfig);
const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');


SuperTokens.init(SuperTokensConfig);
function App() {
    const user = {
        email: "gahlouzi.ameni@gmail.com",
        name: "Ameni Gahlouzi",
        password: "*********",
        githubAccount: "--",
        googleAccount: "--",
        blockchainAccount: "--"
    };
    return (
        <SuperTokensWrapper>
            <div className="App app-container">
                <Router>
                    <div className="fill">
                        <Switch>
                            {/* This shows the login UI on "/auth" route */}
                            {/* {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}  */}
                            <Route exact path="/">
                                {/* <SessionAuth>  */}
                                <Home />
                                {/* </SessionAuth>  */}
                            </Route>


                            <Route exact path="/test">
                                <Tester />
                            </Route>

                            <Route path="/paymentWithStripe"><Payment /></Route>


                            <Route path="/completion"><Completion /></Route>
                            <Route path="/sendNotif"><TelegramMessage /></Route>






                            <Route path="/statistics">
                                <Charts />
                            </Route>




                            <Route
                                path="/accountdetails"><AccountDetails user={user} /></Route>



                            <Route
                                path="/paywithmetamask"><PayWithMetamask /></Route>



                            <Route
                                path="/paywithphantom"><SendSol /></Route>
                            <Route
                                path="/paymentmode"><PaymentMode /></Route>

                            <Route
                                path="/statistic"><BarChart /></Route>

                        </Switch>
                    </div>
                </Router>
            </div>
        </SuperTokensWrapper>
    );
}

export default App;
