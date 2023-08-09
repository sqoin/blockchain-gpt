import React, { useState, useEffect, ChangeEvent } from 'react';
import './Account_Details.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ACCOUNT_MANAGEMENT } from './utils/constants';
import './Account_Details.css';
import { FaTelegram } from "react-icons/fa"

interface IUser {
  ID: string;
  creation_date: Date;
  expiration_date: Date;
  name: string;
  lastName: string;
  email: string;
  account_status: string;
  telegram_user_name: string;
}

const AccountDetails: React.FC<any> = ({ userId }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isToggled, setIsToggled] = useState(false);
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({ email: '', githubAccount: '', userName: '', userLastName: '', telegram_user_name: '' });
  const [lastName, setLastName] = useState('');
  const [Name, setName] = useState('');
  const session = useSessionContext();
  if (!session.loading) {
    userId = session.userId;
  }

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleApplyChanges = () => {
    UpdateUserInformation(userId, Name, lastName, user?.telegram_user_name);
  };


  async function UpdateUserInformation(userId: string, userName: string, userLastName: string, telegramusername?: string) {
    try {
      const response = await axios.put(`${ACCOUNT_MANAGEMENT}/api/updateUser`, {
        
          userId,
          userName:userName,
          userLastName:userLastName,
          telegram_user_name: telegramusername,
        
      });
  
      if (response.status === 200) {
        console.log('User updated successfully!');
      } else {
        console.error('Failed to update user:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating the user:', error);
    }
  }
  

  const getUserById = async (userId: any): Promise<IUser | null> => {
    try {
      const response = await axios.get(`${ACCOUNT_MANAGEMENT}/api/getUserById/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  };

  const fetchUser = async () => {
    const fetchedUser = await getUserById(userId);
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  };


  useEffect(() => {
    fetchUser();
  }, [userId]);



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



  const getUsernameFromTelegram = async (chatId: number) => {
    try {
      const response = await axios.get(`https://api.telegram.org/bot6572515145:AAH3lQky2jdYWs84nH0ZOf_-AnroOH3NGXs/getChat?chat_id=${chatId}`);
      const username = response.data.result.first_name;
      return username;
    } catch (error) {
      console.error('Error fetching username from Telegram:', error);
      return null;
    }
  };





  const handleButtonClick = async () => {
    if (!isToggled) {
      (async () => {
        try {
          window.open('http://t.me/sqqoiin_bot', '_blank');
          const chatId = await getChatIdFromTelegram();
          let telegramusername: any;
          if (chatId) {
            telegramusername = await getUsernameFromTelegram(chatId);
          }
          UpdateUserInformation(userId, Name, lastName, telegramusername);
          await axios.post('http://localhost:3006/api/telegram/chat', { chatId, userId });
          console.log('Button clicked, chat ID collected, and sent to the backend.');
        } catch (error: any) {
          console.error('Error handling button click:', error);
          console.log("Error handling button click" + error.message);
        }
      })();
    }
    setIsToggled((prevIsToggled) => !prevIsToggled);
  };


  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3006/api/telegram/chat/${userId}`)
        .then(response => {
          setIsToggled(response.data.length > 0);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [userId]);




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
                      defaultValue={user?.name}
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
                      defaultValue={user?.lastName}
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
                    >{user?.email}
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
                    <label htmlFor="lastName">Telegram User Name</label>
                    <input
                      className="form-control"
                      id="lastName"
                      defaultValue={user?.telegram_user_name}
                    ></input>
                  </div>
                </div>


                <div className="col-md-6">
                  <div className="form-group">
                  </div>
                  <div className='button-container'>
                    <div className='first-button-container'><button className='confirm' onClick={() => history.push("/paymentmode")}>Payer mon compte</button>
                      <button className='confirm' onClick={handleApplyChanges}>Save changes</button>
                    </div>
                    <div className='on-off-container'>
                      <span className="icons"><FaTelegram /></span>
                      <span>Enable Telegram Notification</span>
                      <input
                        className='on-off-input'
                        type="checkbox"
                        id="switch"
                        onClick={handleButtonClick}
                        checked={isToggled}
                      />
                      <label className='on-off-label' htmlFor="switch"></label>
                    </div>
                  </div>

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
