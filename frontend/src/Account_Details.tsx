import React, { useState, useEffect, ChangeEvent } from 'react';
import './Account_Details.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

interface AccountDetailsProps {
  user: {
    email: string;
    name: string;
    lastName: string;
    githubAccount: string;
    blockchainAccount: string;
  };
  userId: string; }

async function UpdateUserInformation(userId: string, userName: string, userLastName: string) {
  try {
    const response = await axios.put('http://localhost:3003/api/updateUser', {
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
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({email: '', creationDate: '', githubAccount: '',userName:'',userLastName:'' });
  const [lastName, setLastName] = useState('');
  const [Name, setName] = useState('');
  const session = useSessionContext();
  if (!session.loading){
    userId= session.userId;
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
        const response = await axios.get('http://localhost:3003/api/getUserInfo');
        setUserInfo(response.data);
        user.githubAccount = userInfo.githubAccount;
        user.name=userInfo.userName;
        user.lastName=userInfo.userLastName;
        console.log(JSON.stringify(userInfo),"\n name: ",user.name);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);

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
                        defaultValue={user.name}
                        onChange={handleNameChange}
                    ></input>
                  </div>
                </div>


                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input
                        className="form-control"
                        id="lastName"
                        defaultValue={user.lastName}
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
                  <button className={'confirm'} onClick={()=>history.push("/paymentmode")}>Payer mon compte</button>

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
