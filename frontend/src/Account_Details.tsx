import React from 'react';
import './Account_Details.css';

interface AccountDetailsProps {
  user: {
    email: string;
    name: string;
    githubAccount: string;
    googleAccount: string;
    blockchainAccount: string;
  };
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ user }) => {
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
                    <label htmlFor="radioOptions">Payment Options</label>
                    <div>
                      <label className="radio-label">
                        <input type="radio" id="option1" name="radioOptions" value="Payant" className="custom-radio" defaultChecked />
                        Payant
                      </label>
                      <label className="radio-label">
                        <input type="radio" id="option2" name="radioOptions" value="Non payant" className="custom-radio" disabled />
                        Non payant
                      </label>
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
};

export default AccountDetails;
