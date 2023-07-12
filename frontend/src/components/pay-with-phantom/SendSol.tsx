import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import copy from "copy-to-clipboard";
import { FaGhost, FaRegCopy } from 'react-icons/fa';
import { Connection, PublicKey, Version, Transaction, TransactionInstruction, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import phantom from '../../assets/Phantom-Icon-Purple.png'
import { _connectToPhantomWallet, _disconnectFromPhantomWallet, _getSolanaBalance, _getSolanaNetworkInfo, _getSolanaPublicKey, _sendSolana } from "../../adapters/solana_fn";
import './SendSol.css';

interface Info {
  amount: number;
  address: any;
}

const SendSol: React.FC = () => {


  const [rpcUrl, setRpcUrl] = useState<string>("https://api.mainnet-beta.solana.com");

  const [info, setInfo] = useState<Info>({
    amount: 0,
    address: "D1RXUnD61kb2r1JbaD4MVAMD5LJ9YbtZK8tLkPXQNHvd"
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    let address:any; 
    let key:any;
    let balance; 
    let transaction:any;

    try {
      address = await _connectToPhantomWallet();
    } catch (error) {
      console.log(error); 
    }
    try {
      key = await _getSolanaPublicKey(address);
    } catch (error) {
      console.log(error); 
    }
    try {
      balance = await _getSolanaBalance(key,rpcUrl);
    } catch (error) {
      console.log(error); 
    }
    if (Number(balance) < Number(info.amount)) { 
      console.log("Insufficient funds in MetaMask account"); 
      return; 
    } 
    console.log("amountValue", balance); 
    try {
      transaction = _sendSolana(info.address, rpcUrl, address)
    } catch (error) {
      console.log(error);
      
    }
    
    

  };
  

  const copyAmount = () => {
    copy(info.amount.toString());
  };

  const copyAddress = () => {
    copy(info.address);
  };

  return (
    


      <div className="PayWithPhantom"> 
      <div className="container"> 
        <div className="subContainer"> 
          <QRCode className="qr" value={info.address} size={200} /> 
          <form action="" className="form" onSubmit={handleSubmit}> 
            <section className="inputs"> 
              <label htmlFor="amount" className="label"> 
                Send this amount{" "} 
                <span className="copy" onClick={copyAmount}> 
                  (click to copy) 
                </span> 
              </label> 
              <input 
                type="number" 
                name="amount" 
                id="amount" 
                className="info" 
                value={info.amount} 
                onChange={handleChange} 
              /> 
              <span className="clickable-icon" onClick={copyAmount}> 
                <FaRegCopy /> 
              </span> 
              <label htmlFor="address" className="label"> 
                To this ETH address{" "} 
                <span className="copy" onClick={copyAddress}> 
                  (click to copy) 
                </span> 
              </label> 
              <input 
                type="text" 
                name="address" 
                id="address" 
                className="info" 
                value={info.address} 
                onChange={handleChange} 
              /> 
              <span className="clickable-icon" onClick={copyAddress}> 
                <FaRegCopy /> 
              </span> 
            </section> 
            <button 
              type="submit" 
              className="submit-btn" 
            > 
              <img src={phantom} alt="fox" className="fox" /> 
              <span>Open PHANTOM</span> 
            </button> 
          </form> 
        </div> 
      </div> 
    </div>
  );
};

export default SendSol;
