import React, { useState } from 'react';
import './Account_Details.css';
import { useHistory } from "react-router-dom";
import axios from 'axios';



interface AccountDetailsProps {
  user: {
    email: string;
    name: string;
    githubAccount: string ;
    googleAccount: string;
    blockchainAccount: string;
  };
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ user }) => {

  const history= useHistory() ;
  const [isToggled, setIsToggled] = useState(false);
  const handleButtonClick = async () => {
    if (!isToggled) {
      (async () => {
        try {
          // Open the Telegram bot link in a new tab
          window.open('http://t.me/testt159_bot', '_blank');
          // Retrieve the chat ID from Telegram
          const chatId = await getChatIdFromTelegram();
          console.log(chatId);
          // Send the chat ID to your backend
          await axios.post('http://localhost:3006/api/telegram/chat', { chatId });
          // Perform any other desired actions
          console.log('Button clicked, chat ID collected, and sent to the backend.');
        } catch (error:any) {
          console.error('Error handling button click:', error);
          console.log("Error handling button click" + error.message);
        }
      })();
    }

    // Toggle the connected state
    setIsToggled((prevIsToggled) => !prevIsToggled);
  };

  const getChatIdFromTelegram = async () => {
    try {
      const response = await axios.get('https://api.telegram.org/bot6692494514:AAEuxi9FiEsIP4OK50nI9s4UwzX31a5OkNQ/getUpdates');
      const chatId = response.data.result[0].message.chat.id;
      return chatId;
    } catch (error) {
      console.error('Error fetching chat ID from Telegram:', error);
      return null;
    }
  };

  
  return ( 
    <div className="accountdetails">
      <div className="form">
        <div className="bg-white shadow rounded-lg d-block d-sm-flex">
          <div className="tab-content p-4 p-md-5" id="v-pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="account"
              role="tabpanel"
              aria-labelledby="account-tab"
            >
              <h2 className="mb-4">Account Details</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <div
                      className="form-control"
                      id="name"
                    >{user.name}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div
                      className="form-control"
                      id="email"
                    >{user.email}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="googleAccount">Google Account</label>
                    <div className="account-links-container">
                      <a href={user.googleAccount} className="account-link google-account-link">
                        {user.googleAccount}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="githubAccount">Github Account</label>
                    <div className="account-links-container">
                      <a href={user.githubAccount} className="account-link github-account-link">
                        {user.githubAccount}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">

                  <button onClick={()=>history.push("/paymentmode")}>Payer mon compte</button>
                  <button  className={`toggle-button ${isToggled ? 'on' : ''}`}  onClick={handleButtonClick}>
      {isToggled ? 'ON' : 'OFF'}
    </button>
                    {/* <label htmlFor="radioOptions">Payment Options</label>
                    <div>
                      <label className="radio-label">
                        <input type="radio" id="option1" name="radioOptions" value="Payant" className="custom-radio" defaultChecked />
                        Payant
                      </label>
                      <label className="radio-label">
                        <input type="radio" id="option2" name="radioOptions" value="Non payant" className="custom-radio" disabled />
                        Non payant
                      </label>
                    </div> */}


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
