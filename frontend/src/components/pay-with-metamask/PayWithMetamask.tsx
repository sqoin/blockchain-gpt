import React, { useState } from "react";
import "./PayWithMetamask.css";
import { FaRegCopy } from "react-icons/fa";
import fox from "../../assets/images/fox.png";
import QRCode from "qrcode.react";
import { _connectToMetaMask, _getBalance } from "../../adapters/ethereum_fn";

const PayWithMetamask: React.FC = () => {
  const [display, setDisplay] = useState("none");

  const web3 = new window.Web3();

  let signature: string = "";

  const [ethAdress, setEthAdress] = useState<string>(
    "0x9c40e4849BEc1fb2f1fF6699c421714D825572fC"
  );

  const [amountValue, setAmountValue] = useState<string>("0.01");
  const [linkText, setLinkText] = useState<string>("");
  const [link, setLink] = useState<string>("https://etherscan.io/tx/");

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
    console.log("amountValue", amountValue);
    let transactionParam = {
      to: ethAdress,
      from: address,
      value: Number(web3.utils.toWei(amountValue, "ether")).toString(16),
    };
    console.log("wei", transactionParam.value);
    await window.ethereum
      .request({ method: "eth_sendTransaction", params: [transactionParam] })
      .then((txhash: any) => {
        txhash ? setDisplay("flex") : setDisplay("hidden");
        setLinkText(link+formAccount2(txhash));
        setLink(link+txhash);
      });
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
