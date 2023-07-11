import React, { useRef, useState } from "react";
import "./Wallet.css";
import { FaRegCopy } from 'react-icons/fa';
import QRCode from "qrcode.react";
import {
  _isConnectedToMetamask,
  _connectToMetaMask,
  _disconnectFromMetaMask,
  _getPublicKey,
  _getNetworkInfo,
  _getBalance,
  _deployNewToken,
} from "../adapters/ethereum_fn";

const Wallet: React.FC = () => {
  const web3 = new window.Web3();
  async function sendTransactionFromMetaMask() {
    let address;
    let balance;
    try {
      address = await _connectToMetaMask();
      console.log("address", address);
    } catch (error) {}
    try {
      balance = await _getBalance(address);
      console.log("balance", balance);
    } catch (error) {
      console.log(error);
    }
    if (Number(balance) < Number(amountValue)) {
      console.log("Insufficient funds in MetaMask account");
      return;
    }
    console.log("amountValue",  Number(web3.utils.toWei('0.009', 'ether')).toString(16))
    let transactionParam = {
      to: ethAdress,
      from: address,
        value : Number(web3.utils.toWei(amountValue, 'ether')).toString(16),
    };
    console.log("wei",transactionParam.value)
    await window.ethereum
      .request({ method: "eth_sendTransaction", params: [transactionParam] })
      .then((txhash: any) => {
        console.log(txhash);
      });
  }

  const [ethAdress, setEthAdress] = useState<string>(
    "0x9c40e4849BEc1fb2f1fF6699c421714D825572fC"
  );
  const handleCopyEth = () => {
    if (ethAdress) {
      navigator.clipboard.writeText(ethAdress);
    }
  };

  const [amountValue, setAmountValue] = useState<string>("");
  const handleCopyAmount = () => {
    if (amountValue) {
      navigator.clipboard.writeText(amountValue);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };
  
  return (
    <div className="container">
      <QRCode className="qr" value={ethAdress} size={200} />
      <form action="" className="form" onSubmit={handleSubmit}>
        <section className="inputs">
          <label htmlFor="amount" className="label">
            Send this amount{" "}
            <span className="copy" onClick={handleCopyAmount}>
              (click to copy)
            </span>
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            className="info"
            value={amountValue}
            onChange={(e) => setAmountValue(e.target.value)}
          />
          <span className="clickable-icon" onClick={handleCopyAmount}>
            <FaRegCopy />
          </span>
          <label htmlFor="address" className="label">
            To this ETH address{" "}
            <span className="copy" onClick={handleCopyEth}>
              (click to copy)
            </span>
          </label>
          <input
            type="text"
            name="address"
            id="address"
            className="info"
            value={ethAdress}
            onChange={(e) => setEthAdress(e.target.value)}
          />
          <span className="clickable-icon" onClick={handleCopyEth}>
            <FaRegCopy />
          </span>
        </section>
        <button type="submit" className="submit-btn" onClick={sendTransactionFromMetaMask}>
          {/* <span>
            <GiFoxHead />
          </span> */}
          Open METAMASK
        </button>
      </form>
    </div>
  );
};

export default Wallet;
