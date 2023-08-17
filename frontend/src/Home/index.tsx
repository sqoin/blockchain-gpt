import SuccessView from "./SuccessView";
import axios from 'axios';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

import { useSessionContext } from "supertokens-auth-react/recipe/session";
import "./Home.css";
// TODO: This screen needs to be more professional
const Home: React.FC<{ remainingRequests: any, setRemainingRequests: any }> = ({ remainingRequests, setRemainingRequests }) => {
    const sessionContext = useSessionContext();

    if (sessionContext.loading === true) {
        return null;
    }


    return (
        <div className="fill" id="home-container">
            <SuccessView idUser={sessionContext.userId} remainingRequests={remainingRequests} setRemainingRequests={setRemainingRequests} />

        </div>
    );

}
export default Home;