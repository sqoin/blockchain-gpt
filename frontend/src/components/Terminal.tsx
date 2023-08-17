import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./Terminal.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey, Version } from "@solana/web3.js";
import { useHistory, useLocation } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { SignOutIcon } from "../assets/images";
import SideBar from "./SideBar/SideBar"
import CmdOutput from "./CmdOutput/CmdOutput";
import { _getCryptoCurrencyQuote } from "../adapters/market";
import { TELEGRAM_NOTIFICATION } from '../../src/utils/constants';
import getChatIdFromTelegram  from "../components/telegram-message/TelegramMessage";

/// @ts-ignore
import BarChart from "./Statistic/AccountChart.tsx";
/// @ts-ignore
import BitcoinChart from "../charts.tsx";
/// @ts-ignore
import PieChart from "../pieChart.tsx"
/// @ts-ignore
import CryptomarketCapChart from "../cryptoMarketCapChart.tsx";
import Hamburger from 'hamburger-react'
import  DataSets  from "./datasets";
import CryptoChart from "../cryptoCharts";
import { ACCOUNT_MANAGEMENT } from "../utils/constants";
import { fetchQuestionCategory } from "./QuestionCategory";
import axios, { AxiosResponse } from 'axios'; 
import { useSessionContext } from "supertokens-auth-react/recipe/session";

let id='';


interface ILink {
  name: string;
  onClick: () => void;
  icon: string;
}


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
let showDataSet=false;
interface Output {
  input: string;
  command: string;
  error: string;
  eye: boolean;
}

const Terminal: React.FC<{ idUser: string,remainingRequests:any ,setRemainingRequests :any }> = ({ idUser ,remainingRequests ,setRemainingRequests}) => {

  const [questionCategory, setQuestionCategory] = useState<number | null>(null);
  const [showEye, setShowEye] = useState(false);
  const [error, setError] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState<string>("");
  const [inputHistory, setInputHistory] = useState<string[]>([]);

  const [showChart, setShowChart] = useState(false);
  const [output, setOutput] = useState<Output[]>([]);
  const [solanaNetwork, setSolanaNetwork] = useState<string>(
    "https://api.mainnet-beta.solana.com"
  );
  const [connection, setConnection] = useState<any>(
    new window.solanaWeb3.Connection(solanaNetwork)
  );
  const [solanaWallet, setSolanaWallet]: any = useState(undefined);
  const [rpcUrlInitial, setRpcUrlInitial] = useState<string>("https://test.novafi.xyz/blockchainnode2");
  const sessionContext = useSessionContext();
  const history = useHistory();
  // Set the value of `isUserPaid` based on some condition
  const isUserPaid = true; // Example value, replace with your own logic
  type UserType = "free" | "paid";

  const MAX_REQUESTS_FREE_USER = 2;
  const MAX_REQUESTS_PAID_USER = 10;
  const session=useSessionContext();
  if(!session.loading)
  {
    id=session.userId;
  }
  const userId = id; 
  let userRequestCount: Map<string, number> = new Map();

interface Task {
    _id: string;
    userId: string;
    task: string;
    duration: number;
    status:boolean;
}




  
  useEffect(() => {
    const userId = id; 

    axios.get(`${ACCOUNT_MANAGEMENT}/api/getInputHistory/${userId}`)
      .then((response :AxiosResponse)=> {
        const data = response.data;
        setInputHistory(data.map((item: { input: string }) => item.input));
      })
      .catch((error:any) => {
        console.error('Error fetching input history:', error);
      });
  }, []);






  const getData = (input: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      request
        .post("/gpt-test")
        .send({ command: input })
        .set("Accept", "application/json")
        .set("Access-Control-Allow-Origin", "*")
        .end((err: any, res: any) => {
          if (err) {

            setIsTyping(false)
            popLastItem();
            reject(err);
          } else {

            setIsTyping(false)
            popLastItem();
            resolve(res);
          }
        });
    });
  };

  const getDataCustmised = (input: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      request
        .post("/gpt-test")
        .send({ command: input })
        .set("Accept", "application/json")
        .set("Access-Control-Allow-Origin", "*")
        .end((err: any, res: any) => {
          if (err) {

            setIsTyping(false)
            //popLastItemCustomised();
            reject(err);
          } else {

            setIsTyping(false)
            //popLastItemCustomised();
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

    return data.market_data?.current_price?.usd;
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

    return data.market_data?.current_price?.usd;
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
  //////// tâches répétitives planifiées function  ////////////////////////

  const getAndDisplayPublicKey = async () => {
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

      await sleep(5 * 60 * 1000); // Attendre 5 minutes avant le prochain appel
    }
  };

  async function fetchBalanceFromMetaMask(ms:any) {
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
        handleOutput(`my ethereum balance: ${balance}`);
      } else {
        console.log('Failed to retrieve public key');
      }
      
      await sleep(ms); // Attendre 5 minutes
    }
  }

  async function getNetworkInfoEvery5Minutes() {
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

  async function fetchAndDisplayTransactions() {
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
        const transactions = response.data.result;
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
        handleOutput(`Failed to fetch transactions:${response.data.message} `);
        console.log('Full Response:', response.data);
      }
    } catch (error: any) {
      console.log('Error occurred:', error.message);

    }
  }

  // Interface pour définir le type de données stockées dans le localStorage
  interface InputData {
    inputValue: string;
  }
  // Fonction pour vérifier si l'input existe déjà dans le localStorage
  function isInputExists(inputValue: string): boolean {
    const storedInputs: InputData[] = JSON.parse(localStorage.getItem("inputs") || "[]");
    return storedInputs.some((data) => data.inputValue === inputValue);
  }

  // Fonction pour ajouter un nouvel input dans le localStorage s'il n'existe pas déjà
  function addInputToLocalStorage(inputValue: string): void {
    // Vérifier si l'input existe déjà
    if (!isInputExists(inputValue)) {
      // Vérifier si le localStorage est supporté par le navigateur
      if (typeof Storage !== "undefined") {
        // Récupérer les inputs précédents (s'ils existent) depuis le localStorage
        const storedInputs: InputData[] = JSON.parse(localStorage.getItem("inputs") || "[]");

        // Ajouter le nouvel input à la liste des inputs
        storedInputs.push({ inputValue });

        // Mettre à jour le localStorage avec la nouvelle liste d'inputs
        localStorage.setItem("inputs", JSON.stringify(storedInputs));
      } else {
        // Le localStorage n'est pas supporté par le navigateur
        console.error("LocalStorage n'est pas supporté par ce navigateur.");
      }
    } else {
      console.log("L'input existe déjà dans le localStorage.");
    }
  }


//console.log(allInputs);

///////////////////////////
  const userCommand1 = "get publickey every 5min";
  //const userCommand2 = "get ethereum balance every 2min";
  const userCommand3="get network information every 5min"
  const userCommand4="get bitcoin price every 5min"
  const userCommand5="get bitcoin total volume every 5min"
  const userCommand6="get bitcoin MarketCap every 5min"
  const userCommand7= "afficher solana price every 1 minute"
  const etherBalance = "get ethereum balance";


  const fetchDataCondition = async () => {
    if (sessionContext.loading === true) {
        return null;
    }
    console.log(sessionContext?.userId)
    let userId = sessionContext?.userId.toString()

    try {
        const response = await axios.get(`${ACCOUNT_MANAGEMENT}/api/tasksvalid/${userId}`);
        const tasksData: Task[] = response.data || []; 
    
        const taskDescriptions = tasksData.map(task => task.task?.toLocaleLowerCase().replace(/\s/g, ''));
        console.log(taskDescriptions);

        return {taskDescriptions,tasksData};
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
 

  useEffect(() => {
    checkUserCommand();
  }, []); // Exécutez cette vérification une seule fois au chargement de la page

     
  
 

  const checkUserCommand = async() => {
   
      const response:any = await fetchDataCondition()
    
      let foundObject = checkStringSimilarity(response.tasksData,etherBalance)
      if( foundObject) {
        fetchBalanceFromMetaMask(foundObject.duration);
      } 
      

      const storedCommand = response.taskDescriptions|| [];
      console.log("storedCommand",storedCommand)
    if ( storedCommand.includes(userCommand1.toLocaleLowerCase().replace(/\s/g, ''))) {
      getAndDisplayPublicKey();
    } 
    // if( storedCommand.includes(userCommand2.toLocaleLowerCase().replace(/\s/g, ''))) {
    //   fetchBalanceFromMetaMask(2 * 60 * 1000);
    // } 
    
    
    if (storedCommand.includes(userCommand3.toLocaleLowerCase().replace(/\s/g, ''))) {
      getNetworkInfoEvery5Minutes();
    }
    if ( storedCommand.includes(userCommand4.toLocaleLowerCase().replace(/\s/g, ''))) {
      while (true) {
        const price = await _getCryptoCurrencyQuote("bitcoin", "price");
        handleOutput(`Bitcoin Price: ${price}`);
        console.log('Bitcoin Price: ',price);
  
        await sleep(5 * 60 * 1000); // Attendre 5 minutes
      }
    } 
    
    if ( storedCommand.includes(userCommand7.toLocaleLowerCase().replace(/\s/g, ''))) {
      while (true) {
        const price = await _getCryptoCurrencyQuote("solana", "price");
        handleOutput(`Bitcoin Price: ${price}`);
        console.log('Bitcoin Price: ',price);
  
        await sleep(5 * 60 * 1000); // Attendre 5 minutes
      }
    } 
    if (storedCommand.includes(userCommand5.toLocaleLowerCase().replace(/\s/g, ''))){
      while (true) {
        const volume = await _getCryptoCurrencyQuote("bitcoin", 'volume');
        handleOutput(`Bitcoin Total Volume: ${volume}`);
        await sleep(5 * 60 * 1000); // Attendre 5 minutes
      }
    }
    if (storedCommand.includes(userCommand6.toLocaleLowerCase().replace(/\s/g, ''))){
      console.log("666666666")
      while (true) {
        const marketCap = await _getCryptoCurrencyQuote("bitcoin", "marketCap");
        handleOutput(`Bitcoin MarketCap: ${marketCap}`);
        await sleep(5 * 60 * 1000); // Attendre 5 minutes
      }
    }
  };

  function checkStringSimilarity(objectList:any[],searchText:string) {
    const stringSimilarity = require('string-similarity');
    const taskTexts = objectList.map(obj => obj.task);
    if(!taskTexts.length){
      return null;
    }
    const matches = stringSimilarity.findBestMatch(searchText, taskTexts);

    const bestMatch = matches.bestMatch;
    if (bestMatch.rating > 0.5) {
      const foundObject = objectList.find(obj => obj.task === bestMatch.target);
      return foundObject
    }
    return null;

  }

    const fetchData = async () => {
        const categoryNumber = await fetchQuestionCategory(input);
        setQuestionCategory(categoryNumber);

        //alert(categoryNumber);
      };
    
      const questionRegex = /\?\s*$/;
      if(questionRegex.test(input))
      {
        fetchData();
        
        setInput("");
      }

  // Mettre à jour le stockage local toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const storedCommand = localStorage.getItem('userCommand');
      if (storedCommand === userCommand1) {
        getAndDisplayPublicKey();
      } /* else if (storedCommand === userCommand2) {
        fetchBalanceFromMetaMask(2 * 60 * 1000);
      } */
      else if (storedCommand === userCommand3) {
        getNetworkInfoEvery5Minutes();
      }
      
      
    }, 5 * 60 * 10000); // 5 minutes en millisecondes

    return () => clearInterval(interval);
  }, []);

/** handle some static user input */
 async function handleUserStaticInputRep(input:string) {
  if (input === "get publickey every 5 min") {
    //addInputToLocalStorage(input);
    getAndDisplayPublicKey();

  }
  else if (input === "get balance every 5min") {
   // addInputToLocalStorage(input);
    fetchBalanceFromMetaMask(5 * 60 * 1000);

  } 
  else if (input === "get network information every 5min") {
    //addInputToLocalStorage(input);
    getNetworkInfoEvery5Minutes();
  }
}
 async function handleUserInputQ(input:string) {

  if (input === "What is Bitcoin") {

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
      fetchAndDisplayTransactions();

  } 
  
   else {
    // Handle other cases if needed
    console.log("Unknown input:", input);
    return false;
  }
}
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
      let connection = new Connection(/* solanaNetwork */rpcUrlInitial)
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

  async function connecttobot() {

    // Add the static response to the output
    await sleep(5000);
    while (true) {
      let wallet: any = await _connectToPhantomWallet();
      let balance = await _getSolanaBalance(wallet?.publicKey?.toBase58());
      await sleep(15 * 1000);
     // console.log(balance)
      if (!balance) {
        try {
          window.open('http://t.me/sqoin2aout_bot', '_blank');
        const chatId = await getChatIdFromTelegram();
        await axios.post(`${TELEGRAM_NOTIFICATION}/api/telegram/chat`, { chatId,userId });

        }catch (error) {
          console.error('Error handling button click:', error);
        }
        
      }
    }
  }

  const getChatIdFromTelegram = async () => {
    try {
      const response = await axios.get('https://api.telegram.org/bot6468293397:AAEZk7NM3GHSnlRjvzg_t8zVxD0iM1Ba1UM/getUpdates');
      const chatId = response.data.result[0]?.message?.chat?.id;
      return chatId;
    } catch (error) {
      console.error('Error fetching chat ID from Telegram:', error);
      return null;
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  
  



  async function handleRepetitiveTasks() {
    let test :any= await isRepetitive();
    if(test?.isRepetitiveTask && test?.duration>0){
      let task = { userId: idUser, task: input, duration: test.duration,status:false}
      addTask(task); 
    }
    return test?.isRepetitiveTask



  }
  const toMessage = async() => {
    try {
      // Call the backend API to send hello messages to all chats
      await axios.post(`${TELEGRAM_NOTIFICATION}/sendHelloToAll`);
      console.log('Hello messages sent to all chats.');
    } catch (error) {
      console.error('Error sending hello messages:', error);
    }
  }





  const notifs = async () => {
    let telegramQ = `L'utilisateur a tapé dans son command line:"${input}"  c'est a dire est ce qu'il s'agit d'une alerte telegram ou non?Retourner moi un object 
    {alerteTelegram:boolean} exemple la tache "Renvoie-moi une alerte Telegram "  
    tu vas retourner {alerteTelegram: true} `
    let rq ;
    try {
      rq = await getDataCustmised(telegramQ);
      console.log("data received")
    } catch (error: any) {
      handleOutput("", error.message, true)
    }
    let rs = null;
    if(rq){
      rs = parseBotchart1(rq.text);
    }
    console.log("****rs***",rs)
    return rs;
  }
  async function handletelegram() {
    try {
        const test: any = await notifs();

        if (test?.alerteTelegram) {
            toMessage();
        }

        return test?.alerteTelegram;
    } catch (error: any) {
        setError(error.message);
        handleOutput("", error.message, true);
    }
}


 async function handleChartType(){
   //Chart Type  
   try {
    const res :any = await chartType();
    let chartNmbr = getChartType(parseFloat(res.Chart))
    //alert(chartNmbr)

    //console.log(JSON.stringify(res1));
  }
   catch (error: any) {
    setError(error.message);
    handleOutput("", error.message, true)
   }
 }

 function getChartType(n:number) {
   switch (n) {
      case -1:
       return "it's not about chart "
      case 0:
        return "it's not about chart "
      case 1:
       return "Bar Chart"
      case 2:
       return "Line Chart"
      case 3:
       return "Pie Chart"
      case 4:
       return "Scatter Plot"
      case 5:
       return "Bubble Chart"
      case 6:
       return "Histogram"
      case 7:
       return "Gantt Chart"
      case 8:
        return "Radar Chart "
      case 9:
        return "Box Plot"
      case 10:
        return "Waterfall Chart"
      case 11:
        return "Heatmap"
      case 12:
        return "TreeMap"
      case 13:
        return "Donut Chart"
      case 14:
        return "Funnel Chart"
      case 15:
        return "Area Chart"
      default:
        return "it's not about chart "
   }
 }
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
          axios.post(`${ACCOUNT_MANAGEMENT}/api/saveInput`, { userId, input: input })
            .then(() => {
              setInputHistory((prevInputHistory:any) => [...prevInputHistory, input]);
              setInput('');
            })
            .catch((error:any) => {
              console.error('Error saving input:', error);
            });
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
              
              else if (input === "Quelles ont été les nouvelles les plus importantes dans la blockchain ces trois derniers jours") {
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
              else if (input === "check solana wallet") {
                connecttobot()
              }
              else if (input !== "") {

                try {
                  let res :any = await handleUserStaticInputRep(input);
                  res = await handleUserInputQ(input);
                  if(res){
                    return;
                  }

                  let bool = await handleRepetitiveTasks();
                  if(bool) {
                    //alert("repetetive task")
                  }
                  await handleChartType()
                  await handletelegram()


                 
                   
                    const resData = await getData(input);
                    result = await processServerResponse(resData.text, handleOutput);
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
              showDataSet = input.toLocaleLowerCase().replace(/\s/g, '').includes('givemepriceevolutionofanyunitexample');
              //setInput("");
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
  const isRepetitive = async () => {
    let repetitiveQuerry = `L'utilisateur a tapé dans son command line:"${input}" est ce que 
    cette tache est repetitive c'est a dire est ce qu'il veut que cette tache 
    soit repeter d'une manière periodique ou non?Retourner moi un object 
    {duration:number,isRepetitifTask:boolean} duration in milliseconds
    exemple la tache "give me bitcoin price every 5 minutes" est repetitive 
    tu vas retourner {duration:5,isRepetitifTask:true}
    et la tache "give me bitcoin price"  est non repetitive tu vas retourner 
    {duration:0,isRepetitifTask:false}`
    let rq;
    try {
      rq = await getDataCustmised(repetitiveQuerry);
    } catch (error: any) {
      handleOutput("", error.message, true)
    }
    let rs = null;
    if (rq) {
      rs = parseTaskString(rq.text);
    }
    return rs;
  }


  const chartType = async () => {
    let Querry = `the user asked me this question:"${input}" , could you decide if it's about draw a chart,
    if so can you just give me the type of chart, answer me as follows no further text should be included in the answer: 
    {"Chart": number}
    -1: it's not about chart 
    1:Bar Chart
    2:Line Chart
    3:Pie Chart
    4:Scatter Plot
    5:Bubble Chart
    6:Histogram
    7:Gantt Chart
    8:Radar Chart 
    9:Box Plot 
    10:Waterfall Chart
    11:Heatmap
    12:TreeMap
    13:Donut Chart
    14:Funnel Chart
    15:Area Chart`

    let rq;
    try {
      rq = await getDataCustmised(Querry);

    } catch (error: any) {
      handleOutput("", error.message, true)
    }
    let rs = null;
    if (rq) {
      rs = parseChartString(rq.text);
    }
    return rs;

  }




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
    setOutput((prevOutput: any) => {
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

  const popLastItemCustomised = (): void => {
    setOutput((prevOutput: Output[]) => {
      // Filter out items with command === "Execution in progress ..."
      const updatedOutput = prevOutput.filter(item => item.command !== "Execution in progress ...");
      return updatedOutput;
    });
  };


  const addTask = async (task: any) => {
    try {
      await axios.post(`${ACCOUNT_MANAGEMENT}/api/tasks`, task);
      //console.log('Task saved successfully!');
    } catch (error: any) {
      //console.log(error?.message);
    }
  };
  
 

  
  function parseTaskString(taskString: string): { duration: number; isRepetitiveTask: boolean } {
    // Initialize default values for the properties
    let duration: number = 0;
    let isRepetitiveTask: boolean = false;
    
    // Regular expressions to check for duration and repetitive task patterns in the string
    
    const durationRegex = /(\d+(\.\d+)?)(\s*(min|minute|hour|hr|h))/i;
    const repetitiveRegex = /(repetitive|repeat|daily|weekly|monthly|yearly)/i;

    // Check for duration in the string and extract the number value
    const durationMatch = taskString.match(durationRegex);
    
    if (durationMatch) {
        let value = parseFloat(durationMatch[1]);
        const unit = durationMatch[4].toLowerCase();
         duration = calculateMilliseconds(value, unit);
    }
    console.log(duration)

    // Check for repetitive task keywords in the string
    const repetitiveMatch = taskString.match(repetitiveRegex);
    if (repetitiveMatch) {
      isRepetitiveTask = true;
    }

    // Return the object with the parsed values
    return { duration, isRepetitiveTask };

  }
 

  function calculateMilliseconds(value: number, unit: string): number {
    switch (unit) {
      case 'min':
      case 'minute':
        return value * 60 * 1000; // Convert minutes to milliseconds
      case 'hr':
      case 'hour':
        return value * 60 * 60 * 1000; // Convert hours to milliseconds
      default:
        return value;
    }
  }

const parseBotchart = (inputString: string) => {
    const keyword = "envoyer une alerte telegram";
    const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');

    if (regex.test(inputString)) {
        return { alerteTelegram: true };
    } else {
        return { alerteTelegram: false };
    }
};
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
};




  
function parseBotchart1(inputString: string): { alerteTelegram: boolean } {
  // Regular expression to match the phrase "alerte telegram" (case-insensitive)
  const regex = /\balerte\s+telegram\b/i;

  // Search for the phrase in the input string
  const match = inputString.match(regex);

  let alerte: boolean = false;
  if (match) {
      // If the phrase is found, set alerte to true
      alerte = true;
  }

  // Create and return the object
  return { alerteTelegram: alerte };
}


  
  

  function parseChartString(inputString: string): { Chart: number } {

    let chartNumber: number = 0;
    // Regular expression to match the object pattern
    const regex = /{*\n*\s*"*Chart"*\s*:\s*(\d+)\n*}*/;

    // Search for the object pattern in the input string
    const match = inputString.match(regex);

    if (match) {
      // Extract the number from the matched object
      chartNumber = parseFloat(match[1]);
    }

    // Create and return the object
    return { Chart: chartNumber };
  }



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
 
  
    const [showSection, setShowSection] = useState(true);
    const [isOpen, setOpen]=useState(false);
  
    const toggleSection = () => {
      setShowSection(!showSection);
    };
 

    useEffect(() => {
      const isMobile = window.innerWidth <= 768; 
      setOpen(isMobile);
      console.log("not a mobile")
    }, []); 

  return (

    
    <div className="terminal">
      <div className="mobile-hamburger">
           <Hamburger toggled={isOpen} toggle={setOpen} />
      </div> 

      <div className="input-output">
        <div className="output-result">
          {output.map((line, index) => (
            <CmdOutput oput={line} index={index} key={index} />
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
              disabled={remainingRequests <= 0 /* || isTyping */}
            />
          </div>

          <div>
            {questionCategory !== null && (
              <p>Category number: {questionCategory}</p>
            )}
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


            {/* {showBarChart ? <div className="bar-chart">
              <BarChart/>
            </div> : null} */}
            {showDataSet? <div className="dataset">
            <DataSets/>
          </div>:null}

          </div>
          
        </form>
        {/*  <div>
      <input type="text" onChange={handleInput} />
      </div> */}

      </div>

    </div>



  )
};


export default Terminal;
function setInputDisabled(arg0: boolean) {
  throw new Error("Function not implemented.");
}

