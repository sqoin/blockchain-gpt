
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey, Version } from "@solana/web3.js";

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

export const _disconnectFromPhantomWallet = async (wallet:PhantomWalletAdapter): Promise<null | string> => {

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

export const _getSolanaPublicKey = async (wallet:PhantomWalletAdapter): Promise<null | string> => {

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
export const _getSolanaNetworkInfo = async (rpcUrl:any): Promise<{ endpoint: string, solanaCore: string|undefined, featureSet: number|undefined} | null> => {
  try{
    let connection = new Connection(rpcUrl)
    let version:Version = await connection.getVersion()
    let endpoint =  connection.rpcEndpoint
    const networkInfo = {
      endpoint: endpoint,
      solanaCore: version["solana-core"],
      featureSet: version["feature-set"]
    };
    return networkInfo;
  }
  catch(error:any){
    console.log("Error while connection to this RPC URL ", error.message )
    return null;
  }
};

export const _getSolanaBalance = async (address: string, rpcUrl: string): Promise<null | number> => {
  try {
    let connection = new Connection(rpcUrl)
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    const lamportsToSol = balance / 1e9;
    return lamportsToSol;
  } catch (error: any) {
    console.log("Failed to retrieve balance: " + error.message);
    return null;
  }
};
export function _sendSolana(recipientAddress:String,rpcUrl:String,senderAddress:PhantomWalletAdapter){

  
}