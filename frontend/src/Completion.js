import React from 'react';
import "./completion.css";
import tick  from "./assets/verifier.png"


function Completion(props) {
  // Custom logic or functionality can be added here
  console.log(props);

  return (
    <div>
      <img id="verified-logo" src={tick} alt="Verified Logo"  />
    <h1>Payment succeeded</h1>
      <p> thanks for your purchase! A payment from Stripe Sticker Shop will appear on your statment </p>
      </div>
    
  );
}

export default Completion;
