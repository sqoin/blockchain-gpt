import { useEffect, useState } from "react";

import './PaymentMode.css'
import CrypoCurrencyPaymentModal from "../WalletModal";
import MyButton from "../../myButton";


const PaymentMode: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggleCrypoCurrencyPayment = () => setIsOpen(false);
  const onClick = () => setIsOpen(true);

  const toStripe = () => {
    window.location.href = "/paymentWithStripe";
  }

  return (
    <div className='PaymentMode'>
      <div className='main'>
        <h1 className='title'>Choose your method of payment</h1>
        <div className="btns">
          <button className='redirect-btn' onClick={toStripe}>Pay with Stripe</button>
          <button className='redirect-btn'  onClick={onClick}>Pay with CryptoCurrency</button>
        </div>
          
      </div>
      <CrypoCurrencyPaymentModal isOpen={isOpen} toggle={toggleCrypoCurrencyPayment} />
    </div>
    
  );
};

export default PaymentMode;




