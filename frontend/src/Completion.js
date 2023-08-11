import React, { useEffect } from 'react';
import "./completion.css";
import tick  from "./assets/verifier.png"
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import axios from 'axios';
import { ACCOUNT_MANAGEMENT } from './utils/constants';
function Completion(props) {

  const session=useSessionContext();
  


  useEffect(()=>{
    if(session.loading===true)
  {
    return null;
  }
    const id=  session.userId;
  updateUserStatus(id);
  },[]);

  async function updateUserStatus(id){
    console.log("user id is: ",id);  

   try {

    const res= await axios.post(`${ACCOUNT_MANAGEMENT}/api/updateUserStatus`,{ id });
   } catch (error) {
    console.log(error);    
   }
}

  return (
    <div className="Completion">
      <img id="verified-logo" src={tick} alt="Verified Logo"  />
    <h1>Payment succeeded</h1>
      <p> thanks for your purchase! A payment from Stripe Sticker Shop will appear on your statment </p>
      </div>
    
  );

}

export default Completion;
