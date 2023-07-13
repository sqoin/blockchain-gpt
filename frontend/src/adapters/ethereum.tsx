import React, { useRef, useState } from "react";
import {_isConnectedToMetamask, _connectToMetaMask, _disconnectFromMetaMask , _getPublicKey , _getNetworkInfo , _getBalance , _deployNewToken,main} from "./ethereum_fn";
import Web3 from 'web3';


const Ethereum: React.FC = () => {
  
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);

  const [adress, setAdress] = useState<string | undefined>(undefined);

  const [balance, setBalance] = useState<number | null >(null);
  const [balanceToken, setBalanceToken] = useState<number | null >(null);
  const [network, setNetwork] = useState<{ chainId: string; networkId: number; networkName: string; } | null>(null);
  const [connected , setConnected] = useState<boolean|undefined>(undefined);
  const [newToken,setNewToken] =useState<string|null>('');

  const [token, setToken] = useState('');

  const [name, setName] = useState('');


  const [supply, setSupply] = useState();


  const handleChangeToken = async (event:any) => {
    setToken(event.target.value);
  }

  const handleChangeName = async (event:any) => {
    setName(event.target.value);
  }

  const handleChangeSupply = async (event:any) => {
    setSupply(event.target.value);
  }



  const handleClick = async (fn :any) => {
   switch (fn) {
    case 'connect':
        try{
           let result= await _connectToMetaMask();
           if(result != null){
            setConnected(true)
           }else{
            setConnected(false)
           }
        }catch(error){
            console.error(error);
        }
    break;
    case 'disconnect':
        try{
           let result= await _disconnectFromMetaMask();
           if (localStorage.getItem('publicKey')){
            setConnected(false)
           }else{
            setConnected(true)
           }
        }catch(error){
            console.error(error);
        }
    break;
    case 'key':
        try{
           let result= await  _getPublicKey();
           if(typeof(result) == 'string'){
            setPublicKey(result)
           }else{
            setPublicKey(undefined)
           }
        }catch(error){
            console.error(error);
        }
    break;
    case 'network':
        try{
           let result= await  _getNetworkInfo();
            setNetwork(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'balance':
        try{
            let address = await _getPublicKey()
            let result= await  _getBalance(address);
            setBalance(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'balance_token':
        try{
            
            let address = await _getPublicKey();            
            let result= await  _getBalance(address,token);
            setBalanceToken(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'deploy':
        try{
            
            
            let result= await  _deployNewToken(name,supply)
            setNewToken(result)
        }catch(error){
            console.error(error);
        }
    break;
   
    case 'address-balance':
        try{
           let result= await main();
           if(typeof(result) == 'string'){
            setAdress(result)
           }else{
            setAdress(undefined)
           }
        }catch(error){
            console.error(error);
        }
    break;
    default:
        break;
   }
  }
 

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
    async function handleTransfer(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

     
      // verifier la connection à MetaMask
       let address =await _connectToMetaMask()

      // Récupérer l'adresse du compte connecté
       let balance:any =await _getBalance(address)
       console.log('*****$',balance)


       let toAddress="0x9c40e4849BEc1fb2f1fF6699c421714D825572fC"
       const amountValue = '0.0009'; // Montant en Ether


        const web3 = new window.Web3();
        
        if (balance < amountValue) {
          alert('Le solde du compte est insuffisant.');
          return;
        }

        //Créer une transaction de transfert de balance
        const transactionParam = {
          from: address,
          to: toAddress,
          value: Number(web3.utils.toWei(amountValue, "ether")).toString(16)
        };

         await window.ethereum
        .request({ method: "eth_sendTransaction", params: [transactionParam] })
        .then((txhash: string) => {
          const link = "https://etherscan.io/tx/";
          const transactionLink = link + txhash;
          console.log("Transfert de balance réussi ! Transaction : ", transactionLink);
        })
        .catch((error: Error) => {
          console.log("Une erreur s'est produite lors du transfert de balance :", error);
        });
        
    }

  return (
    <div>
      <button onClick={(e:any)=>handleClick('connect')}>Connect to metamask</button>
      <div>{connected ? "You are connected" : "You are not connected"}</div>

      <button onClick={(e:any)=>handleClick('disconnect')}>Disconnect from metamask</button>
      <div>{!connected ? "You are not connected" : "You are connected"}</div>

      <button onClick={(e:any)=>handleClick('key')}>Get metamask public key</button>
      <div>{publicKey ? `${publicKey}` : "Click the button to get your public key"}</div>


      <button onClick={(e:any)=>handleClick('network')}>Get network information</button>
      <div>{network ? `${JSON.stringify(network)}` : "Click the button to get network "}</div>

      <button onClick={(e:any)=>handleClick('balance')}>Get your wallet balance</button>
      <div>{balance ? `${balance}` : "Click the button to get balance "}</div>

      <button onClick={(e:any)=>handleClick('balance_token')}>Get your wallet balance by token</button>
      <input type="text" value={token} onChange={handleChangeToken}  placeholder="token address" id="token"></input>
      <div>{balanceToken ? `${balanceToken}` : "Click the button to get token balance "}</div>

      <button onClick={(e:any)=>handleClick('deploy')}>Deploy new token</button>
      <input type="text" value={name} onChange={handleChangeName}  placeholder="token name" id="name"></input>
      <input type="number" value={supply} onChange={handleChangeSupply}  placeholder="token supply" id="supply"></input>

      <div>{newToken ? `${newToken}` : "Click the button to deploy new token "}</div>


      <button onClick={(e:any)=>handleClick('address-balance')}>Get address balance</button>
      <div>{adress ? `${adress}` : "Click the button to  get your adress balance"}</div> 
<br/>
      <form onSubmit={ handleTransfer}>
      <div>
        <label>Adresse du destinataire:</label>
        <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      </div>
      <div>
        <label>Montant à transférer (ETH):</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button type="submit">Transférer</button>
    </form>

    </div>
  );
};

export default Ethereum;


