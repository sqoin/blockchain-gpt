import React from 'react';
import './PaymentMode.css'

const Tester: React.FC = () => {

  const toStripe = () => {
    window.location.href = "http://localhost:3000/sendsol";
  }

  return (
    <div className='PaymentMode'>
      <div className='main'>
        <h1 className='title'>Choose your method of payment</h1>
        <div className="btns">
          <button className='redirect-btn' onClick={toStripe}>Pay with Stripe</button>
          <button className='redirect-btn'>Pay with CryptoCurrency</button>
        </div>
          
      </div>
    </div>
    
  );
};

export default Tester;