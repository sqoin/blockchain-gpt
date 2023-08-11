import React, { useState } from "react";
import "./PayWithMetamask.css";
import { FaRegCopy } from "react-icons/fa";
import fox from "../../assets/images/fox.png";
import QRCode from "qrcode.react";
import { _connectToMetaMask, _getBalance } from "../../adapters/ethereum_fn";
import Web3 from "web3";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import axios from "axios";
import { ACCOUNT_MANAGEMENT } from "../../utils/constants";
const PayWithMetamask: React.FC = () => {
  const session = useSessionContext();
  let id='';
  if(!session.loading)
  {
    id=session.userId;
  }
  console.log(id);

  const [display, setDisplay] = useState("none");

  const web3 = new window.Web3(window.ethereum);

  let signature: string = "";

  const [ethAdress, setEthAdress] = useState<string>(
    "0x9c40e4849BEc1fb2f1fF6699c421714D825572fC"
  );

  const [amountValue, setAmountValue] = useState<string>("0.01");
  const [linkText, setLinkText] = useState<string>("");
  const [link, setLink] = useState<string>("https://etherscan.io/tx/");
  const [postExecuted, setPostExecuted] = useState(false);

  async function sendTransactionFromMetaMask() {
    try {
      const address = await _connectToMetaMask();
      console.log("address", address);
  
      const balance = await _getBalance(address);
      console.log("balance", balance);
  
      console.log("amountValue", amountValue);
  
      if (Number(balance) < Number(amountValue)) {
        console.log("Insufficient funds in MetaMask account");
        return;
      }
  
      let transactionParam = {
        to: ethAdress,
        from: address,
        value: web3.utils.toWei(amountValue, "ether"),
      };
      console.log("wei", transactionParam.value);
  
      const txhash: string = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParam],
      });
      console.log("test2");
  
      setDisplay("flex");
      setLinkText(link + formAccount2(txhash));
      setLink(link + txhash);
  
      // Function to check transaction receipt and handle confirmation
      const checkReceiptAndConfirmation = async () => {
        try {
          const receipt = await web3.eth.getTransactionReceipt(txhash);
          if (receipt) {
            console.log("test3");
            if (receipt.status) {
              console.log("Transaction successful!");
              if (!postExecuted) {
                try {
                  const res = await axios.post(`${ACCOUNT_MANAGEMENT}/api/updateUserStatus`, { id });
                  setPostExecuted(true); // Set the flag to true after the post is executed
                } catch (error) {
                  console.log(error);
                }
              }
            } else {
              console.log("Transaction failed!");
            }
            
            clearInterval(checkReceiptInterval); // Stop checking when receipt is available
          }
        } catch (error) {
          console.error("Error while checking receipt:", error);
        }
      };
  
      // Start checking the receipt periodically
      const checkReceiptInterval = setInterval(checkReceiptAndConfirmation, 3000); // Check every 3 seconds (adjust if needed)
  
    } catch (error) {
      console.log("Error sending transaction:", error);
    }
  }
  
    
  
  
  
  
  

  function formAccount2(x: String) {
    var str = x;
    var res1 = str.substring(0, 6);
    var res2 = str.substring(str.length - 4, str.length);
    var res = res1.concat("...", res2);
    return res;
  }

  const handleCopyEth = () => {
    if (ethAdress) {
      navigator.clipboard.writeText(ethAdress);
    }
  };

  const handleCopyAmount = () => {
    if (amountValue) {
      navigator.clipboard.writeText(amountValue);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  return (
    <div className="PayWithMetamask">
      <div className="container">
        <div className="subContainer">
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
            <button
              type="submit"
              className="submit-btn"
              onClick={sendTransactionFromMetaMask}
            >
              <img src={fox} alt="fox" className="fox" />
              <span>Open METAMASK</span>
            </button>
          </form>
        </div>
        <div className="subContainer" style={{ display: display }}>
          <h3>Check your transaction</h3>
          <a href={link} target="_blank">
            {linkText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PayWithMetamask;
