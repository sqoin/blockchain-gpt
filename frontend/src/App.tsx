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
import ImageUpload from "./components/ImageUpload/ImageUpload";
import Hamburger from 'hamburger-react'
import React, { useState, useEffect } from 'react';


SuperTokens.init(SuperTokensConfig);
function App() {
    const user = {
        userId: '',
        email: "",
        name: "",
        password: "*********",
        githubAccount: "--",
        blockchainAccount: "--",
        lastName: ""
    };
    const [imageUpdated, setImageUpdated] = useState(false);
    function updateImage() {
        setImageUpdated(!imageUpdated);
    }
    const [remainingRequests, setRemainingRequests] = useState(20);

    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        const handleWindowSizeChange = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleWindowSizeChange();

        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const handleHamburgerClick = () => {
        if (!isMobile) {
            return; // Don't toggle isOpen in desktop mode
        }
        setOpen(!isOpen);
    
    };

    return (
        <SuperTokensWrapper>
            <div className="App app-container">
                {isMobile && (
                    <div className="mobile-hamburger" onClick={handleHamburgerClick}>
                        <Hamburger toggled={isOpen} />
                    </div>
                )}
                <Router>
                    <div className="fill">
                        <Switch>
                            {/* This shows the login UI on "/auth" route */}
                            {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}
                            <div className={`fix ${isOpen && isMobile ? "sidebar-open" : ""}`}>
                                <div className={`sidebar-container ${isOpen || !isMobile ? "open" : ""}`}>
                                {isOpen || !isMobile ? (
                                        <SideBar remaining={remainingRequests} imageUpdated={imageUpdated} />
                                     ) : null}
                                 </div>
                                <div className="pages-container">
                                    <Route exact path="/">
                                        <SessionAuth>
                                            <Home remainingRequests={remainingRequests} setRemainingRequests={setRemainingRequests} />
                                        </SessionAuth>

                                    </Route>


                                    <Route exact path="/test">
                                        <Tester />
                                    </Route>

                                    <Route path="/paymentWithStripe"><Payment /></Route>

                                    <Route path="/completion">
                                        <SessionAuth>
                                            <Completion /> </SessionAuth></Route>



                                    <Route path="/sendNotif">
                                        <SessionAuth>
                                            <TelegramMessage />

                                        </SessionAuth></Route>
                                    <Route path="/history">

                                        <SessionAuth>
                                            <History />
                                        </SessionAuth>


                                    </Route>
                                    <Route
                                        path="/accountdetails"><AccountDetails userId={user.userId} updateImage={updateImage} /></Route>



                                    <Route
                                        path="/paywithmetamask"><PayWithMetamask /></Route>



                                    <Route
                                        path="/ServiceUnavailable"><ServiceNotAvailable /></Route>
                                    <Route
                                        path="/InternalServerError"><ServerErrorPage /></Route>
                                    <Route
                                        path="/notauthorized"><NotAuthorized /></Route>


                                    <Route
                                        path="/paywithphantom"><SendSol /></Route>
                                    <Route
                                        path="/paymentmode"><PaymentMode /></Route>


                                    <Route path="/repetitivetasks">
                                        <SessionAuth>

                                            <RepetitiveTasks />

                                        </SessionAuth>
                                    </Route>


                                    <Route
                                        path="/statistics"><Charts />
                                    </Route>


                                    <Route
                                        path="/imageupload"><ImageUpload /></Route>
                                </div>

                            </div>
                        </Switch>
                    </div >
                </Router >
            </div>
        </SuperTokensWrapper >
    );
}

export default App;
