import React, { useRef, useState } from "react";
import {_isConnectedToMetamask, _connectToMetaMask, _disconnectFromMetaMask , _getPublicKey , _getNetworkInfo , _getBalance , _deployNewToken } from "./ethereum_fn";
import { _connectToPhantomWallet, _disconnectFromPhantomWallet, _getSolanaBalance, _getSolanaNetworkInfo, _getSolanaPublicKey } from "./solana_fn";

const Solana: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | null >(null);
  const [network, setNetwork] = useState<{ endpoint: string, solanaCore: string|undefined, featureSet: number|undefined} | null>(null);
  const [connected , setConnected] = useState<boolean|undefined>(undefined);
  const [myWallet, setMyWallet]: any = useState(undefined);
  const [rpcUrl, setRpcUrl] = useState<string | undefined>("https://test.novafi.xyz/blockchainnode2");



  const [token, setToken] = useState('');

  const handleChange = async (event:any) => {
    setToken(event.target.value);
  }

  const handleClick = async (fn :any) => {
   switch (fn) {
    case 'connect':
        try{
           let result= await _connectToPhantomWallet();
           if(result != null){
            setConnected(true)
            setMyWallet(result)
           }else{
            setConnected(false)
           }
        }catch(error){
            console.error(error);
        }
    break;
    case 'disconnect':
        try{
           let result= await _disconnectFromPhantomWallet(myWallet);
           if (result != null){
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
           let result= await  _getSolanaPublicKey(myWallet);
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
           let result= await  _getSolanaNetworkInfo(rpcUrl);
            setNetwork(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'balance':
        try{
            
            let address = await _getSolanaPublicKey(myWallet);
            let result = null;
            if(address && rpcUrl) result= await _getSolanaBalance(address);
            setBalance(result)
        }catch(error){
            console.error(error);
        }
    break;
    case 'balance_token':
        try{
            
            let address = await _getPublicKey();
            console.log(token);
            
            let result= await  _getBalance(address,token);
            setBalance(result)
        }catch(error){
            console.error(error);
        }
    break;
    default:
        break;
   }
  };

  return (
    <div>
      <button onClick={(e:any)=>handleClick('connect')}>Connect to Phantom</button>
      <div>{connected ? "You are connected" : "You are not connected"}</div>

      <button onClick={(e:any)=>handleClick('disconnect')}>Disconnect from Phantom</button>
      <div>{!connected ? "You are not connected" : "You are connected"}</div>

      <button onClick={(e:any)=>handleClick('key')}>Get public key</button>
      <div>{publicKey ? `${publicKey}` : "Connect your wallet, then click the button to get your public key"}</div>


      <button onClick={(e:any)=>handleClick('network')}>Get network information</button>
      <input type="text" value={rpcUrl} onChange={(e) => setRpcUrl(e.target.value)}  placeholder="RPC URL" id="rpcUrl"></input>
      <div>{network ? `${JSON.stringify(network)}` : "Click the button to get network "}</div>

      <button onClick={(e:any)=>handleClick('balance')}>Get your wallet balance</button>
      <div>{balance ? `${balance}` : "Click the button to get balance "}</div>
 
    </div>
  );
};

export default Solana;
