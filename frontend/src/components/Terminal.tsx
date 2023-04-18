import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Terminal.css";

const request = require("superagent");

interface Output {
  command: string;
}
const Terminal: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<Output[]>([]);
  const [solanaNetwork, setSolanaNetwork] = useState<string>(
    "https://api.mainnet-beta.solana.com"
  );
  const [connection, setConnection] = useState<any>(
    new window.solanaWeb3.Connection(solanaNetwork)
  ); 

  const getData = (input: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      request
        .post("/gpt-test")
        .send({ command: input })
        .set("Accept", "application/json")
        .set("Access-Control-Allow-Origin", "*")
        .end((err: any, res: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
    });
  };


  const _getCryptoCurrencyPrice = async (
    cryptoName: string,
    date?: string
  ): Promise<number> => {
    cryptoName = cryptoName.toLowerCase();
    if (!date) {
      date = new Date().toISOString().slice(0, 10);
    }

    const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}/history?date=${date}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.market_data.current_price.usd;
  };

  const _getCurrentCryptoCurrencyPrice = async (
    cryptoName: string
  ): Promise<number> => {
    cryptoName = cryptoName.toLowerCase();
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.market_data.current_price.usd;
  };

  //ethereum functions
  const _connectToMetaMask = async (): Promise<string | null> => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }

    // Check if the wallet is already connected
    if (window.ethereum.selectedAddress !== null) {
      console.log("You are already connected to MetaMask");
      return window.ethereum.selectedAddress;
    }

    try {
      // Request permission to access the user's accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // Save the selected account address to local storage
      localStorage.setItem("publicKey", accounts[0]);
      return accounts[0];
    } catch (error: any) {
      // Handle error gracefully
      console.log("Failed to connect to MetaMask: " + error.message);
      return null;
    }
  };

  const _disconnectFromMetaMask = async (): Promise<void> => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      // return null;
    }

    // Check if the wallet is already disconnected
    if (!window.ethereum.selectedAddress) {
      console.log("You are already disconnected from MetaMask");
      // return null;
    }

    try {
      // Disconnect from MetaMask
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      localStorage.removeItem("publicKey");
      console.log("You have successfully disconnected from MetaMask");
    } catch (error: any) {
      // Handle error gracefully
      console.log("Failed to disconnect from MetaMask: " + error.message);
      // return null;
    }
  };
  const _getPublicKey = async (): Promise<void | null | string> => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }

    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log("You are not connected to MetaMask");
      return null;
    }

    try {
      // Retrieve the public key from MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error: any) {
      // Handle error gracefully
      console.log(
        "Failed to retrieve public key from MetaMask: " + error.message
      );
      return null;
    }
  };

  const _getNetworkInfo = async (): Promise<void | null | {
    chainId: string;
    networkId: number;
    networkName: string;
  }> => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }

    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log("You are not connected to MetaMask");
      return null;
    }

    try {
      // Retrieve the network information from MetaMask
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const networkId = await window.ethereum.request({
        method: "net_version",
      });

      let networkName;
      switch (chainId) {
        case "0x1":
          networkName = "Mainnet";
          break;
        case "0x3":
          networkName = "Ropsten Testnet";
          break;
        case "0x4":
          networkName = "Rinkeby Testnet";
          break;
        case "0x5":
          networkName = "Goerli Testnet";
          break;
        case "0x2a":
          networkName = "Kovan Testnet";
          break;
        default:
          networkName = "Unknown Network";
      }

      return {
        chainId: chainId,
        networkId: networkId,
        networkName: networkName,
      };
    } catch (error: any) {
      // Handle error gracefully
      console.log(
        "Failed to retrieve network information from MetaMask: " + error.message
      );
      return null;
    }
  };

  const _getBalance = async (
    address: any,
    type = "ether"
  ): Promise<void | null | string> => {
    const ERC20 = window.ERC20;
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }

    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log("You are not connected to MetaMask");
      return null;
    }

    try {
      let balance;
      if (type === "ether") {
        // Retrieve the balance in ether
        balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address],
        });
        balance = window.Web3.utils.fromWei(balance, "ether");
      } else {
        // Retrieve the balance of a specific token
        const contract = new window.Web3.eth.Contract(ERC20.abi, type);
        balance = await contract.methods.balanceOf(address).call();
        balance = window.Web3.utils.fromWei(balance, "ether");
      }
      return balance;
    } catch (error: any) {
      // Handle error gracefully
      console.log("Failed to retrieve balance: " + error.message);
      return null;
    }
  };

  const _deployNewToken = async (
    supply: any,
    name: any
  ): Promise<null | string> => {
    const ERC20 = window.ERC20;

    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.log("Please install MetaMask to use this feature");
      return null;
    }

    // Check if the wallet is connected
    if (!window.ethereum.selectedAddress) {
      console.log("You are not connected to MetaMask");
      return null;
    }

    try {
      // Get the account address from MetaMask
      const account = await _getPublicKey();

      // Create the token contract instance
      const contract = new window.web3.eth.Contract(ERC20.abi);

      // Build the contract data
      const bytecode = ERC20.bytecode;
      const abi = ERC20.abi;
      const contractData = contract
        .deploy({
          data: bytecode,
          arguments: [supply, name],
        })
        .encodeABI();

      // Get the gas price and estimate the transaction gas limit
      const gasPrice = await window.web3.eth.getGasPrice();
      const gasLimit = await contract
        .deploy({
          data: bytecode,
          arguments: [supply, name],
        })
        .estimateGas({ from: account });

      // Create the transaction object
      const transaction = {
        from: account,
        gasPrice: gasPrice,
        gas: gasLimit,
        data: contractData,
      };

      console.log("Transaction ", transaction, typeof transaction);

      // Sign and send the transaction
      const signedTransaction = await window.ethereum.request({
        method: "eth_signTransaction",
        params: [transaction],
      });

      console.log(
        "Signed Transaction ",
        signedTransaction,
        typeof signedTransaction
      );

      const transactionHash = await window.web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );

      console.log("Transaction hash ", transactionHash, typeof transactionHash);

      // Get the deployed contract address
      const receipt = await window.web3.eth.getTransactionReceipt(
        transactionHash
      );
      console.log("Receipt ", receipt, typeof receipt);

      const contractAddress = receipt.contractAddress;
      console.log(contractAddress, typeof contractAddress);
      return contractAddress;
    } catch (error: any) {
      // Handle error gracefully
      console.log("Failed to deploy new token: " + error.message);
      return null;
    }
  };

  //solana functions
  const _connectToPhantomWallet = async (): Promise<null | string> => {
    const wallet = window.solanaWalletAdapterWallets.getPhantomWallet();

    if (!wallet) {
      console.log("Please install Phantom Wallet to use this feature");
      return null;
    }

    if (wallet.connected) {
      console.log("You are already connected to Phantom Wallet");
      return wallet.publicKey.toBase58();
    }

    try {
      await wallet.connect();
      localStorage.setItem("solanaPublicKey", wallet.publicKey.toBase58());
      return wallet.publicKey.toBase58();
    } catch (error: any) {
      console.log("Failed to connect to Phantom Wallet: " + error.message);
      return null;
    }
  };

  const _disconnectFromPhantomWallet = async (): Promise<null | void> => {
    const wallet = window.solanaWalletAdapterWallets.getPhantomWallet();

    if (!wallet) {
      console.log("Please install Phantom Wallet to use this feature");
      return null;
    }

    if (!wallet.connected) {
      console.log("You are already disconnected from Phantom Wallet");
      return null;
    }

    try {
      await wallet.disconnect();
      localStorage.removeItem("solanaPublicKey");
      console.log("You have successfully disconnected from Phantom Wallet");
    } catch (error: any) {
      console.log("Failed to disconnect from Phantom Wallet: " + error.message);
      return null;
    }
  };

  const _getSolanaPublicKey = async (): Promise<null | string> => {
    const wallet = window.solanaWalletAdapterWallets.getPhantomWallet();

    if (!wallet) {
      console.log("Please install Phantom Wallet to use this feature");
      return null;
    }

    if (!wallet.connected) {
      console.log("You are not connected to Phantom Wallet");
      return null;
    }

    try {
      return wallet.publicKey.toBase58();
    } catch (error: any) {
      console.log(
        "Failed to retrieve public key from Phantom Wallet: " + error.message
      );
      return null;
    }
  };
  const _getSolanaNetworkInfo = async (): Promise<{ rpcUrl: string; networkName: string;}> => {
    const networkInfo = {
      rpcUrl: solanaNetwork,
      networkName: "Solana Mainnet Beta",
    };

    return networkInfo;
  };
  
  const _getSolanaBalance = async (address: any): Promise<null | number> => {
    if (!address) {
      console.log("Invalid address");
      return null;
    }

    try {
      const publicKey = new window.solanaWeb3.PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      const lamportsToSol = balance / 1e9;
      return lamportsToSol;
    } catch (error: any) {
      console.log("Failed to retrieve balance: " + error.message);
      return null;
    }
  };
  type CommandWriter = (message?: any, ...optionalParams: any[]) => void;

  const processServerResponse = async (
    data: string,
    commandWriter: CommandWriter
  ): Promise<string> => {
    const codeRegex: RegExp = /```(?:javascript)?\s*([\s\S]*?)\s*```/g;
    const codeMatch: RegExpExecArray | null = codeRegex.exec(data);

    if (codeMatch) {
      const scriptContent: string = codeMatch[1].trim();
      const wrappedScript: string = `(async () => { ${scriptContent} })();`;

      try {
        let capturedOutput: any;
        const originalConsoleLog: Console["log"] = console.log;
        console.log = commandWriter;
        const result: any = await eval(wrappedScript);
        return capturedOutput;
      } catch (error: any) {
        return `Error: ${error.message} \n script ${scriptContent}`;
      }
    } else {
      return `${data}\n`;
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  const handleInputSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    handleOutput(input);
    if (input.trim().toLowerCase() === "clear") {
      setOutput([]);
      setInput("");
    } else {
      handleOutput("Execution in progress ...");
      try {
        let result;
        const res = await getData(input);
        result = await processServerResponse(res.text, handleOutput);
        setInput("");
      } catch (error: any) {
        handleOutput(`Error: ${error.message}\n`);
      }
    }
  };

  const handleOutput = (new_output: string): void => {
    setOutput([...output, { command: new_output }]);
  };

  return (
    <div className="terminal">
      <div className="terminal-output">
        {output.map((line, index) => (
          <div key={index}>
            <span className="terminal-prompt">$</span> {line.command}
          </div>
        ))}
      </div>
      <form onSubmit={handleInputSubmit}>
        <div className="terminal-input-container">
          <span className="terminal-prompt">$</span>
          <input
            type="text"
            className="terminal-input"
            value={input}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  );
};

export default Terminal;
