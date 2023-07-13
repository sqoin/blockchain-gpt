import React, { useEffect, useState } from 'react';

import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    TransactionInstruction,
    sendAndConfirmTransaction,
  } from '@solana/web3.js';
import {_isConnectedToMetamask, _connectToMetaMask, _disconnectFromMetaMask , _getPublicKey , _getNetworkInfo , _getBalance , _deployNewToken } from "./ethereum_fn";
import { _connectToPhantomWallet, _disconnectFromPhantomWallet, _getSolanaBalance, _getSolanaNetworkInfo, _getSolanaPublicKey } from "./solana_fn";

const Solana: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | null >(null);
  const [network, setNetwork] = useState<{ endpoint: string, solanaCore: string|undefined, featureSet: number|undefined} | null>(null);
  const [connected , setConnected] = useState<boolean|undefined>(undefined);
  const [myWallet, setMyWallet]: any = useState(undefined);
  const [rpcUrl, setRpcUrl] = useState<string | undefined>("https://api.mainnet-beta.solana.com");


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
            if(address && rpcUrl) result= await _getSolanaBalance(address,rpcUrl);
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


  const ConnectionConfig = {
    cluster: 'mainnet-beta', // Or 'devnet', 'testnet'
    rpcUrl: 'https://api.mainnet-beta.solana.com', // Or custom RPC URL
  };
  
  const RecipientPublicKey = 'D1RXUnD61kb2r1JbaD4MVAMD5LJ9YbtZK8tLkPXQNHvd'; // Replace with the recipient's public key
  
    //const { wallet, connect } = useWallet();
  
    const [transactionSent, setTransactionSent] = useState<boolean>(false);
  
    const sendTransaction = async (event: React.FormEvent) => {
      event.preventDefault();
  
     
        const connection = new Connection(ConnectionConfig.rpcUrl);
        const userPublicKey = myWallet.publicKey as PublicKey;
        //const keypair = Keypair.fromSecretKey(wallet.secretKey as Uint8Array);
    
        const LamportsToSend = 0.01 * 1000000000; 
        const transaction = new Transaction();
                transaction.add(
                    SystemProgram.transfer({
                        fromPubkey: userPublicKey,
                        toPubkey: new PublicKey(RecipientPublicKey),
                        lamports: LamportsToSend,
                    })
                );
                transaction.recentBlockhash = (
                    await connection.getLatestBlockhash()
                ).blockhash;
                transaction.feePayer = userPublicKey;
                let signed;
                try {
                    signed = await myWallet.signTransaction(transaction);
                } catch (error:any) {
                    console.log(error);
                } 
        let signature = await connection.sendRawTransaction(signed.serialize());
        console.log("tr signature********", signature)
        let res = await connection.confirmTransaction(signature, 'max');
        
    
    };
  /* 
    useEffect(() => {
      connect().catch((error:any) => console.error('Error connecting wallet:', error));
    }, [connect]); */


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
      <div>{balance !== null ? `${balance}` : "Click the button to get balance "}</div>

      <div>
      
       
        {myWallet && (
          <div>
          
            {!transactionSent ? (
              <form onSubmit={sendTransaction}>
                <button type="submit">Send Transaction</button>
              </form>
            ) : (
              <p>Transaction sent successfully!</p>
            )}
          </div>
        )}
      </div>
    

    </div>
  );
};

export default Solana;
