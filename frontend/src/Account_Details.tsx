import React, { useState, useEffect, ChangeEvent } from 'react';
import './Account_Details.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ACCOUNT_MANAGEMENT } from './utils/constants';
import './Account_Details.css';



interface AccountDetailsProps {
  user: {
    email: string;
    name: string;
    githubAccount: string ;
    googleAccount: string;
    blockchainAccount: string;
  };
  userId: string; }
  let IDUSER='';

async function UpdateUserInformation(userId: string, userName: string, userLastName: string) {
  try {
    const response = await axios.put(`${ACCOUNT_MANAGEMENT}/api/updateUser`, {
      userId,
      userName,
      userLastName,
    });
    if (response.data && response.data.message) {
    }
    console.log('User updated successfully!');
  } catch (error) {
    console.error('Error updating the user:', error);
  }
}


const AccountDetails: React.FC<AccountDetailsProps> = ({ user, userId }) => {
  const [isToggled, setIsToggled] = useState(false);
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({email: '', githubAccount: '',userName:'',userLastName:'' });
  const [lastName, setLastName] = useState('');
  const [User, setUser] = useState({ githubAccount: '', name: '', lastName: '' });
  const [Name, setName] = useState('');
  const session = useSessionContext();
  if (!session.loading){
    userId= session.userId;
    IDUSER=userId;    
  }

  // Function to handle changes to the last name
  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };


  const handleApplyChanges = () => {
    UpdateUserInformation(userId, Name, lastName);
  };


useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const response = await axios.post(`${ACCOUNT_MANAGEMENT}/api/getUserInfo`, { IDUSER });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  fetchUserInfo();
}, [IDUSER]);




// Update user state whenever userInfo changes
useEffect(() => {
  setUser({
    githubAccount: userInfo.githubAccount,
    name: userInfo.userName,
    lastName: userInfo.userLastName,
  });
}, [userInfo]);


const handleButtonClick = async () => {
  if (!isToggled) {
    (async () => {
      try {
        // Open the Telegram bot link in a new tab
        window.open('http://t.me/sqqoiin_bot', '_blank');
        // Retrieve the chat ID from Telegram
        const chatId = await getChatIdFromTelegram();
        console.log(chatId);
        // Send the chat ID to your backend
        await axios.post('http://localhost:3006/api/telegram/chat', { chatId,userId});
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
    const response = await axios.get('https://api.telegram.org/bot6572515145:AAH3lQky2jdYWs84nH0ZOf_-AnroOH3NGXs/getUpdates');
    const chatId = response.data.result[0].message.chat.id;
    return chatId;
  } catch (error) {
    console.error('Error fetching chat ID from Telegram:', error);
    return null;
  }
};



  const AccountDetails: React.FC<AccountDetailsProps> = ({ user }) => {
    const history = useHistory();
    const [isToggled, setIsToggled] = useState(false);
    const session = useSessionContext();
    let userId = ''; // Initialize userId with a default value
  
    if (!session.loading) {
      userId = session.userId;
    }
  }

  const handleButtonClick = async () => {
    if (!isToggled) {
      (async () => {
        try {
          // Open the Telegram bot link in a new tab
          window.open('http://t.me/sqqoiin_bot', '_blank');
          // Retrieve the chat ID from Telegram
          const chatId = await getChatIdFromTelegram();
          console.log(chatId);
          // Send the chat ID to your backend
          await axios.post('http://localhost:3006/api/telegram/chat', { chatId,userId});
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
      const response = await axios.get('https://api.telegram.org/bot6572515145:AAH3lQky2jdYWs84nH0ZOf_-AnroOH3NGXs/getUpdates');
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
                    <input
                        className="form-control"
                        id="name"
                        defaultValue={User.name}
                        onChange={handleNameChange}
                    ></input>
                  </div>
                </div>


                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="lastName">Last name </label>
                    <input
                        className="form-control"
                        id="lastName"
                        defaultValue={User.lastName}
                        onChange={handleLastNameChange}
                    ></input>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div
                      className="form-control"
                      id="email"
                    >{userInfo.email}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="githubAccount">Github Account</label>
                    <div className="account-links-container">
                      <a href={userInfo.githubAccount} className="account-link github-account-link">
                        {userInfo.githubAccount}
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
                  <div>
                    <button className={'confirm'} onClick={handleApplyChanges}>Save changes</button>
                  </div>
                  <button  className={`toggle-button ${isToggled ? 'on' : ''}`}  onClick={handleButtonClick}>
                    {isToggled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
