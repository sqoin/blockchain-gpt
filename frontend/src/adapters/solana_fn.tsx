import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey, Version, Transaction, SystemProgram } from "@solana/web3.js";
import * as buffer from "buffer";
import {  getConnection } from "../utils/headers";
import { PAID_NODE_URL } from "../utils/constants";
import { createWSEndpoint } from "../utils/headers";
window.Buffer = buffer.Buffer;


export const _connectToPhantomWallet = async (): Promise<null | PhantomWalletAdapter> => {

  //@ts-ignore
  const provider = window.solana;
  if (!provider || !provider.isPhantom) {
    window.open("https://phantom.app/", "_blank");
    return null;
  }
  let wallet = new PhantomWalletAdapter(provider);

  if (!wallet) {
    console.log("Please install Phantom Wallet to use this feature");
    return null;
  }

  if (wallet.connected) {
    console.log("You are already connected to Phantom Wallet");
    return wallet;
  }

  try {
    await wallet.connect();
    if (!wallet.publicKey) {
      console.log("No Connected Account");
      return null;
    }
    localStorage.setItem("solanaPublicKey", wallet.publicKey.toBase58());
    return wallet;
  } catch (error: any) {
    console.log("Failed to connect to Phantom Wallet: " + error.message);
    return null;
  }
};

export const _disconnectFromPhantomWallet = async (wallet: PhantomWalletAdapter): Promise<null | string> => {

  if (!wallet) {
    console.log("Please install Phantom Wallet to use this feature");
    return null;
  }

  console.log(wallet.connected)

  if (!wallet.connected) {
    console.log("You are already disconnected from Phantom Wallet");
    return null;
  }

  try {
    await wallet.disconnect();
    localStorage.removeItem("solanaPublicKey");
    console.log("You have successfully disconnected from Phantom Wallet");
    return "success"
  } catch (error: any) {
    console.log("Failed to disconnect from Phantom Wallet: " + error.message);
    return null;
  }
};

export const _getSolanaPublicKey = async (wallet: PhantomWalletAdapter): Promise<null | string> => {

  if (!wallet) {
    console.log("Please install Phantom Wallet to use this feature");
    return null;
  }

  if (!wallet.connected || !wallet.publicKey) {
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
export const _getSolanaNetworkInfo = async (rpcUrl: any): Promise<{ endpoint: string, solanaCore: string | undefined, featureSet: number | undefined } | null> => {
  try {
    let connection = new Connection(rpcUrl)
    let version: Version = await connection.getVersion()
    let endpoint = connection.rpcEndpoint
    const networkInfo = {
      endpoint: endpoint,
      solanaCore: version["solana-core"],
      featureSet: version["feature-set"]
    };
    return networkInfo;
  }
  catch (error: any) {
    console.log("Error while connection to this RPC URL ", error.message)
    return null;
  }
};

export const _getSolanaBalance = async (address: string): Promise<null | number> => {
  try {
/*      const rpcUrl:any = PAID_NODE_URL;
    const username = process.env.REACT_APP_RPC_USERNAME;
    const password = process.env.REACT_APP_RPC_PASSWORD;


const connection = new Connection(rpcUrl, {
  httpHeaders: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
  },
  wsEndpoint: createWSEndpoint(rpcUrl),
});  */

   let connection = getConnection();
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    console.log("**********",balance)
    const lamportsToSol = balance / 1e9;
    return lamportsToSol;
  } catch (error: any) {
    console.log("Failed to retrieve balance: " + error.message);
    return null;
  }
};



export async function _sendSolana(recipientAddress: string, wallet: PhantomWalletAdapter, amount:any) {
  if (!wallet) {
    console.log("Please install Phantom Wallet to use this feature");
    return;
  }

  if (!wallet.connected || !wallet.publicKey) {
    console.log("You are not connected to Phantom Wallet");
    return;
  }

  try {
    const connection = getConnection();;

    // Construct and sign the transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: amount, 
      })
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    transaction.feePayer = wallet.publicKey!;

    let signed = await wallet.signTransaction(transaction);

    let signature = await connection.sendRawTransaction(signed.serialize());
    console.log("tr signature********", signature)
    let res = await connection.confirmTransaction(signature, 'max');

    console.log(transaction);


    console.log(signature);


    console.log("Transaction sent. Signature:", signature);
  } catch (error: any) {
    console.log("Failed to send Solana:", error.message);
  }
}