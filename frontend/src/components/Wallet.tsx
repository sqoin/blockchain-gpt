import React, { useRef, useState } from "react";
import "./Wallet.css";
import imgPath from "../assets/images/metamask.png";
import { FaRegCopy } from "react-icons/fa";
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
  async function sendTransactionFromMetaMask() {
    let address;
    try {
      address = await _connectToMetaMask();
      console.log("address", address);
    } catch (error) {}
    try {
      let balance = await _getBalance(address);
      console.log("balance", balance);
    } catch (error) {
       console.log(error)
    }
  }
  // async function sendTransactionFromMetaMask(): Promise<void> {
  //   if (typeof window.ethereum === "undefined") {
  //     console.log("Please install MetaMask to use this feature");
  //     return;
  //   }

  //   try {
  //     // Check if the wallet is already connected
  //     if (window.ethereum.selectedAddress !== null) {
  //       console.log("You are already connected to MetaMask");
  //       await handleSendTransaction(window.ethereum.selectedAddress);
  //       return;
  //     }

  //     // Request permission to access the user's accounts
  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });

  //     const account = accounts[0];
  //     await handleSendTransaction(account);
  //   } catch (error: any) {
  //     // Handle error gracefully
  //     console.log("Failed to connect to MetaMask: " + error.message);
  //   }
  // }

  // async function handleSendTransaction(account: any): Promise<void> {
  //   try {
  //     const recipientAddress = ethAdress;
  //     const amountToSend = amountValue;
  //     const ERC20 = window.ERC20;
  //     let balance;
  //     const type = "ether";
  //     try {
  //       if (type === "ether") {
  //         // Retrieve the balance in ether
  //         balance = await window.ethereum.request({
  //           method: "eth_getBalance",
  //           params: [account],
  //         });

  //         balance = window.Web3.utils.fromWei(balance, "ether");
  //       } else {
  //         // Retrieve the balance of a specific token
  //         const web3 = new window.Web3(window.web3.currentProvider);

  //         const contract = new web3.eth.Contract(ERC20.abi, type);

  //         balance = await contract.methods.balanceOf(account).call();
  //         balance = window.Web3.utils.fromWei(balance, "ether");
  //         console.log("etherBalance", balance);
  //       }
  //     } catch (error: any) {
  //       // Handle error gracefully
  //       console.log("Failed to retrieve balance: " + error.message);
  //     }

  //     if (Number(balance) < Number(amountToSend)) {
  //       console.log("Insufficient funds in MetaMask account");
  //       return;
  //     }

  //     const transactionObject = {
  //       from: account,
  //       to: recipientAddress,
  //       value: window.ethereum.utils.toWei(amountToSend, "ether"),
  //     };

  //     await window.ethereum.request({
  //       method: "eth_sendTransaction",
  //       params: [transactionObject],
  //     });

  //     console.log("Transaction sent successfully!");
  //   } catch (error: any) {
  //     console.error("Error sending transaction:", error);
  //   }
  // }

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

  return (
    <div className="wallet">
      <div className="imageContainer">
        <img src={imgPath} alt="Image description" className="image" />
      </div>
      <div className="appForm">
        <div className="qrCodeContainer">
          <QRCode value={ethAdress} />
        </div>
        <div className="formFields">
          <div className="formField">
            <label className="formFieldLabel">Send this amount</label>
            <div className="inputContainer">
              <input
                className="formFieldInput"
                placeholder="Enter your amount"
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
              />
              <button className="copyButton" onClick={handleCopyAmount}>
                <FaRegCopy color="white" size={20} />
              </button>
            </div>
          </div>

          <div className="formField">
            <label className="formFieldLabel">To this ETH address</label>
            <div className="inputContainer">
              <input
                className="formFieldInput"
                placeholder="ETH address"
                value={ethAdress}
                onChange={(e) => setEthAdress(e.target.value)}
              />
              <button className="copyButton" onClick={handleCopyEth}>
                <FaRegCopy color="white" size={20} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="formFieldButton"
            onClick={sendTransactionFromMetaMask}
          >
            Open METAMASK
          </button>
        </div>

        <div className="formField"></div>
      </div>
    </div>
  );
};

export default Wallet;
