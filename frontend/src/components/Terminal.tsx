import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Terminal.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey, Version } from "@solana/web3.js";
import { SERVER_DOMAIN } from "../utils/constants";
import { useHistory, useLocation } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { SignOutIcon } from "../assets/images";
import SideBar from "./SideBar/SideBar"
import CmdOutput from "./CmdOutput/CmdOutput";
import { _getCryptoCurrencyQuote } from "../adapters/market";

/// @ts-ignore
import BitcoinChart from "../charts.tsx";
/// @ts-ignore
import PieChart from "../pieChart.tsx"
/// @ts-ignore
import CryptomarketCapChart from "../cryptoMarketCapChart.tsx";


import CryptoChart from "../cryptoCharts";




interface ILink {
  name: string;
  onClick: () => void;
  icon: string;
}
const axios = require('axios');


interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  timeStamp: string;
}

const request = require("superagent");
let showBitcoinChart = false;
let showPieChart = false;
let showCharts = false
let showMarketCapCharts = false;
interface Output {
  input: string;
  command: string;
  error: string;
  eye:boolean;
}
const Terminal: React.FC = () => {
  const [showEye, setShowEye] = useState(false);
  const [error, setError] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState<string>("");
  const [showChart, setShowChart] = useState(false);
  const [output, setOutput] = useState<Output[]>([]);
  const [remainingRequests, setRemainingRequests] = useState(20); // Define the remainingRequests variable
  const [solanaNetwork, setSolanaNetwork] = useState<string>(
    "https://api.mainnet-beta.solana.com"
  );
  const [connection, setConnection] = useState<any>(
    new window.solanaWeb3.Connection(solanaNetwork)
  );
  const [solanaWallet, setSolanaWallet]: any = useState(undefined);
  const [rpcUrlInitial, setRpcUrlInitial] = useState<string>("https://test.novafi.xyz/blockchainnode2");
  const history = useHistory();
  // Set the value of `isUserPaid` based on some condition
  const isUserPaid = true; // Example value, replace with your own logic
  type UserType = "free" | "paid";

  const MAX_REQUESTS_FREE_USER = 2;
  const MAX_REQUESTS_PAID_USER = 10;

  let userRequestCount: Map<string, number> = new Map();



  const getData = (input: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      request
        .post("/gpt-testy")
        .send({ command: input })
        .set("Accept", "application/json")
        .set("Access-Control-Allow-Origin", "*")
        .end((err: any, res: any) => {
          if (err) {
            //console.log(err);

            setIsTyping(false)
            popLastItem();
            reject(err);
          } else {
            //console.log(res);

            setIsTyping(false)
            popLastItem();
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
  const _connectToPhantomWallet = async (): Promise<null | PhantomWalletAdapter> => {

    //@ts-ignore
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return null;
    }
    let wallet = new PhantomWalletAdapter(provider);

    if (!wallet) {

      handleOutput("Please install Phantom Wallet to use this feature")
      console.log("Please install Phantom Wallet to use this feature");
      return null;
    }

    if (wallet.connected) {

      handleOutput("You are already connected to Phantom Wallet")
      console.log("You are already connected to Phantom Wallet");
      return wallet;
    }

    try {
      await wallet.connect();
      if (!wallet.publicKey) {

        console.log("No Connected Account");
        handleOutput("Failed to connect to Phantom Wallet")
        return null;
      }
      localStorage.setItem("solanaPublicKey", wallet.publicKey.toBase58());
      setSolanaWallet(wallet)
      //handleOutput("You are now connected " + wallet.publicKey.toBase58())
      return wallet;
    } catch (error: any) {

      console.log("Failed to connect to Phantom Wallet: " + error.message);
      handleOutput("Failed to connect to Phantom Wallet: " + error.message);
      return null;
    }

  };

  const _disconnectFromPhantomWallet = async (): Promise<null | string> => {

    if (!solanaWallet || !solanaWallet.connected || !solanaWallet.publicKey) {

      console.log("This Phantom Wallet is not connected");
      handleOutput("This Phantom Wallet is not connected, please connect first")
      return null;
    }

    try {
      await solanaWallet.disconnect();
      localStorage.removeItem("solanaPublicKey");
      console.log("You have successfully disconnected from Phantom Wallet");

      handleOutput("You have successfully disconnected from Phantom Wallet")
      return "success"
    } catch (error: any) {
      console.log("Failed to disconnect from Phantom Wallet: " + error.message);

      handleOutput("Failed to disconnect from Phantom Wallet: " + error.message)
      return null;
    }
  };

  const _getSolanaPublicKey = async (): Promise<null | string> => {

    if (!solanaWallet || !solanaWallet.connected || !solanaWallet.publicKey) {

      handleOutput("You are not connected to Phantom Wallet");
      return null;
    }

    try {

      handleOutput(solanaWallet.publicKey.toBase58())
      return solanaWallet.publicKey.toBase58();
    } catch (error: any) {

      handleOutput(
        "Failed to retrieve public key from Phantom Wallet: " + error.message
      );
      return null;
    }
  };

  const _getSolanaNetworkInfo = async (rpcUrl: string): Promise<string | null> => {
    try {
      if (!rpcUrl) rpcUrl = rpcUrlInitial
      let connection = new Connection(rpcUrl)
      let version: Version = await connection.getVersion()
      const epochInfo = await connection.getEpochInfo();
      let endpoint = connection.rpcEndpoint
      const networkInfo = {
        endpoint: endpoint,
        solanaCore: version["solana-core"],
        featureSet: version["feature-set"],
        epoch: epochInfo.epoch
      };

      handleOutput(JSON.stringify(networkInfo))
      return JSON.stringify(networkInfo);
    }
    catch (error: any) {

      handleOutput("Error while connection to this RPC URL " + error.message)
      return "Error while connection to this RPC URL " + error.message;
    }
  };



  const _getSolanaBalance = async (address: string): Promise<null | number> => {
    try {
      let connection = new Connection(rpcUrlInitial)
      const publicKey = address ? new PublicKey(address) : solanaWallet.publicKey;
      const balance = await connection.getBalance(publicKey);
      if (!balance || typeof balance != 'number')
        return null
      const lamportsToSol = balance / 1e9;

      handleOutput("Your balance is " + lamportsToSol)
      return lamportsToSol;
    } catch (error: any) {
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

      commandWriter("This input does not require any specific action.")

      return `${data}`;
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  const handleInputSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    let remainingResult = await remaining();
    if (input.trim().toLowerCase() === "clear") {
      setOutput([]);
      setInput("");
    } else {
      if (remainingResult < 21) {
        try {
          let result;

          setIsTyping(true)

          setTimeout(async () => {
            //handleOutput(input);
            let newinput = input;
            setInput("");
            handleOutput(`Execution in progress ...`);
            if (remainingResult > 0) {


              if (input === 'Dessiner un graphique circulaire de la capitalisation boursière de Bitcoin, Ethereum et Binance.') {

                //handleOutput("Exécution en progress ...")
                // sleep(5000)
                setShowChart(true)
              }


              else if (input === "Quelles ont été les nouvelles les plus importantes dans la blockchain ces trois derniers jours ?") {

                // Add the static response to the output
                sleep(5000)
                handleOutput("Parmi les dernières tendances dans la technologie de la blockchain, Algofi, le plus gros protocole sur la blockchain Algorand, annonce la fin de la plupart de ses activités. La plate-forme se concentrera désormais sur le retrait uniquement, laissant de côté les prêts, les emprunts et les échanges. En parallèle, le Bitcoin, la plus importante crypto-monnaie au monde, connaît une nouvelle baisse de valeur, se situant en dessous de 30 500 $, avec une baisse de 0,70 % sur la dernière journée. Les investisseurs et traders s'inquiètent d'un mouvement de 10 000 bitcoins, d'une valeur de plus de 300 millions de dollars, initié par le gouvernement américain. Dans le même temps, les ventes minières de Bitcoin atteignent des sommets records, tandis que la complexité de l'extraction de Bitcoin atteint un niveau sans précédent.");
              }
              else if (input === "Vérifier la valeur de mon portefeuille toutes les  15 secondes et m'envoyer une alerte Telegram si la valeur de mon portefeuille en dollars augmente de plus de 200$.") {
                // Add the static response to the output
                sleep(5000)
                while (true) {
                  let wallet: any = await _connectToPhantomWallet()
                  let balnace = await _getSolanaBalance(wallet?.publicKey?.toBase58())
                  await sleep(15 * 1000)
                }

              }
              else if (input === "donner moi le publickey chaque 5min") {
                while (true) {
                  let wallet = await _connectToMetaMask();
                  if (!wallet) {
                    console.log('Failed to connect to MetaMask');
                    return;
                  }
                  const publicKey = await _getPublicKey();
                  if (publicKey) {
                    console.log('Public Key:', publicKey);

                    handleOutput(`Public Key: ${publicKey}`);

                  } else {
                    console.log('Failed to retrieve public key');
                  }
                  await sleep(5 * 60 * 1000); // Attendre 5 minutes
                }
              }
              else if (input === "donner moi la balance chaque 5min") {
                while (true) {
                  let wallet = await _connectToMetaMask();
                  if (!wallet) {
                    console.log('Failed to connect to MetaMask');
                    return;
                  }
                  const publicKey = await _getPublicKey();
                  const balance = await _getBalance(publicKey);
                  if (balance) {
                    console.log('balance:', balance);

                    handleOutput(`balance: ${balance}`);

                  } else {
                    console.log('Failed to retrieve public key');
                  }
                  await sleep(5 * 60 * 1000); // Attendre 5 minutes
                }
              }
              else if (input === "get network information every 5min") {
                while (true) {
                  let wallet = await _connectToMetaMask();
                  if (!wallet) {
                    console.log('Failed to connect to MetaMask');
                    return;
                  }
                  const network = await _getNetworkInfo();
                  if (network) {

                    handleOutput(`Network Information:
                    Chain ID: ${network.chainId}
                    Network ID: ${network.networkId}
                    Network Name: ${network.networkName}`);

                  } else {
                    console.log('Failed to retrieve network information');
                  }
                  await sleep(5 * 60 * 1000); // Attendre 5 minutes
                }
              }
              else if (input === "get bitcoin price every 5min") {
                while (true) {
                  const price = await _getCryptoCurrencyQuote("bitcoin", "price");

                  handleOutput(`Bitcoin Price: ${price}`);
                  await sleep(5 * 60 * 1000); // Attendre 5 minutes
                }

              }
              else if (input === "get bitcoin total volume every 5min") {
                while (true) {
                  const volume = await _getCryptoCurrencyQuote("bitcoin", 'volume');

                  handleOutput(`Bitcoin Total Volume: ${volume}`);
                  await sleep(5 * 60 * 1000); // Attendre 5 minutes
                }
              }
              else if (input === "get bitcoin MarketCap every 5min") {
                while (true) {
                  const marketCap = await _getCryptoCurrencyQuote("bitcoin", "marketCap");

                  handleOutput(`Bitcoin MarketCap: ${marketCap}`);
                  await sleep(5 * 60 * 1000); // Attendre 5 minutes
                }
              }
              else if (input === "What is Bitcoin?") {

                handleOutput(`Bitcoin is a decentralized cryptocurrency based on blockchain technology. It is a form of digital currency that enables peer-to-peer transactions without the need for a central authority such as a bank.`);
              }
              else if (input === "How does Bitcoin work?") {

                handleOutput(`Bitcoin operates on a decentralized network of nodes, where transactions are recorded in a public ledger called the blockchain. Transactions are secured using cryptographic techniques, 
                              and miners validate transactions by solving complex mathematical problems.`);
              }
              else if (input === "Who created Bitcoin?") {

                handleOutput(`Bitcoin was created by an individual or group of individuals using the pseudonym Satoshi Nakamoto. The true identity of Satoshi Nakamoto remains unknown to this day.`);
              }
              else if (input === "What is the difference between Bitcoin and traditional currencies?") {

                handleOutput(`Bitcoin differs from traditional currencies because it is not issued or controlled by a central authority like a central bank. It relies on blockchain technology and operates in a decentralized manner.`);
              }
              else if (input === "What is a Bitcoin address?") {

                handleOutput(`A Bitcoin address is a unique alphanumeric string that represents the location where Bitcoins are stored. You can share this address with others to receive Bitcoins.`);
              }
              else if (input === "How can I securely store my Bitcoins?") {

                handleOutput(`You can store your Bitcoins in a Bitcoin wallet. Wallets can be either software wallets on electronic devices or physical hardware wallets that offer additional security.`);
              }
              else if (input === "How can I use Bitcoin to make transactions?") {

                handleOutput(`To make a Bitcoin transaction, you need to know the recipient's Bitcoin address. You can send Bitcoins from your wallet using that address, specifying the amount and signing the transaction.`);
              }
              else if (input === "Is Bitcoin legal?") {

                handleOutput(`The legality of Bitcoin varies from country to country. In many countries, Bitcoin is considered a legal form of digital asset, but some jurisdictions may restrict its use or regulation.`);
              }
              else if (input === "get Latest Transactions") {
                try {
                  let wallet = await _connectToMetaMask();
                  if (!wallet) {
                    console.log('Failed to connect to MetaMask');
                    return;
                  }
                  const publicKey = await _getPublicKey();
                  const apiKey = '13899XRJ6IPW6PJXJDQ9DMJ6ZMNP51PY7I'; // Replace with your Etherscan API key
                  const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${publicKey}&sort=desc&apikey=${apiKey}`;
                  const response = await axios.get(apiUrl);

                  if (response.data.status === '1') {
                    const transactions: Transaction[] = response.data.result;
                    transactions.forEach((transaction: Transaction) => {
                      console.log('success');

                      handleOutput(`Transaction Information:
                      Transaction Hash: ${transaction.hash}
                      From: ${transaction.from}
                      To: ${transaction.to}
                      Value: ${transaction.value}
                      Gas Price: ${transaction.gasPrice}
                      Timestamp: ${transaction.timeStamp}
                      ----------------------------------`);
                    });
                  } else {
                    console.log('Failed to fetch transactions:', response.data.message);
                    console.log('Full Response:', response.data);
                  }
                } catch (error: any) {
                  console.log('Error occurred:', error.message);
                }
              }
              else {
                try {
                  const res = await getData(input);

                  result = await processServerResponse(res.text, handleOutput);
                } catch (error: any) {
                  setError(error.message);
                  setShowEye(true)
                  handleOutput("", error.message, true)
                }


              }


              showBitcoinChart = input.toLocaleLowerCase().replace(/\s/g, '').includes('bitcoinpricesevolution');
              showPieChart = input.toLocaleLowerCase().replace(/\s/g, '').includes('bitcoinethereumandbinancemarketcapitalization');
              showCharts = input.toLocaleLowerCase().replace(/\s/g, '').includes('cryptocurrenciespricesevolution');
              showMarketCapCharts = input.toLocaleLowerCase().replace(/\s/g, '').includes('cryptomarketcaps');
              setInput("");
              setRemainingRequests(remainingResult - 1);
              //await handleOutput(`Remaining requests: ${remainingResult}`);

              setRemainingRequests(remainingResult - 1);
            } else {
              setError("Maximum request limit reached !! Please upgrade to a paid account to continue using this feature.");
              setShowEye(true)
              handleOutput("", "Maximum request limit reached !! Please upgrade to a paid account to continue using this feature.", true)

              //handleOutput(`Error: Maximum request limit reached !! Please upgrade to a paid account to continue using this feature.`);
              await sleep(10000)
              history.push("/paymentmode")
            }
          }, 2000);

        } catch (error: any) {

          setError(error.message);
          setShowEye(true)
          handleOutput("", error.message, true)
        }
      }


    }
  };



  async function logoutClicked() {
    await signOut();
    history.push("/auth");
  }
  const links: ILink[] = [
    {
      name: "Sign Out",
      onClick: logoutClicked,
      icon: SignOutIcon,
    },
  ];


  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const remaining = async () => {
    // Get the user type based on whether the user has paid or not
    const userType = isUserPaid ? "free" : "paid";
    // Get the current request count for the user
    let requestCount = 0;

    // Calculate the remaining request count for the user

    if (userType === "free") {
      setRemainingRequests(remainingRequests - 1);
    } else {
      setRemainingRequests(MAX_REQUESTS_PAID_USER - requestCount);
    }

    if (remainingRequests <= 0) {

      handleOutput(`Error: Maximum request limit reached ! \n`);
      await sleep(10000)
      history.push("/paymentmode")
      return remainingRequests;
    } else {
      requestCount++;
      return remainingRequests;

    }
  }
  const handleOutput = (command: string, error: string = "", eye: boolean = false): void => {
    setOutput(prevOutput => {
      const lastOutput = prevOutput[prevOutput.length - 1];
      const isNewOutput = lastOutput?.input !== input.trim() || lastOutput?.command !== command;

      if (isNewOutput) {
        return [
          ...prevOutput,
          {
            input: input.trim(),
            command,
            error,
            eye
          },
        ];
      } else {
        return prevOutput;
      }
    });
  };

  /*
   //this one is better
    const popLastItem = (): void => {
      setOutput((prevOutput: Output[]) => {
        // Check if the previous output exists and has at least one item
        if (prevOutput && prevOutput.length > 0) {
          const lastItem = prevOutput[prevOutput.length - 1];
    
          // Check if the command of the last item is "Execution in progress ..."
          if (lastItem.command === "Execution in progress ...") {
            // Remove the last item from the array
            return prevOutput.slice(0, prevOutput.length - 1);
          }
        }
        // If the command is not "Execution in progress ..." or the array is empty, return the original array
        return prevOutput;
      });
    };*/



  const popLastItem = (): void => {
    setOutput((prevOutput: Output[]) => {
      // Filter out items with command === "Execution in progress ..."
      const updatedOutput = prevOutput.filter(item => item.command !== "Execution in progress ...");
      return updatedOutput;
    });
  };






  /*  const _getStatics = async (
     coinName: string,
     vsCurrency: string,
     days: number
   ): Promise<string> => {
 
     const interfaceUrl = `/statics?coinName=${coinName}&vsCurrency=${vsCurrency}&days=${days}`;
     window.open(interfaceUrl, '_blank');
     return 'you will find your request on the statics page '
 
 
   }; */

  function redirectToAccDetails() {
    // window.open(SERVER_DOMAIN+"/accountdetails","_blank")
    history.push("/accountdetails");
  }
  


  return (
    <div className="terminal">
      <SideBar remaining={remainingRequests} />
      <div className="input-output">

        <div className="output-result">
          {output.map((line, index) => (
            <CmdOutput oput={line} index={index} />
          ))}
        </div>
        <form onSubmit={handleInputSubmit} className="input-cmd">
          <div className="line">
            <span >{'>>>'}</span>
            <input
              type="text"
              className="prompt"
              value={input}
              onChange={handleInputChange}
              disabled={remainingRequests <= 0 || isTyping}
            />
          </div>
          <div className="bitcoin-chart">
            {showChart ? <PieChart /> : <></>}

            {showBitcoinChart ? <div className="bitcoin-chart">
              <BitcoinChart /> </div> : null
            }

            {showPieChart ? <div className="pie-chart">
              <PieChart apiEndpoint="https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin" />
            </div> : null}

            {showCharts ? <div className="crypto-charts">
              <CryptoChart />
            </div> : null}

            {showMarketCapCharts ? <div className="marketcap-charts">
              <CryptomarketCapChart />
            </div> : null}

          </div>
        </form>

      </div>


    </div>

  )
};

export default Terminal;
function setInputDisabled(arg0: boolean) {
  throw new Error("Function not implemented.");
}

