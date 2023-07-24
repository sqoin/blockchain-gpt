import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey, Version, Transaction, sendAndConfirmTransaction, SystemProgram } from "@solana/web3.js";
import * as buffer from "buffer";
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

function hexToUint8Array(hex: string): Uint8Array {
  const uint8Array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const byteValue = parseInt(hex.substr(i, 2), 16);
    uint8Array[i / 2] = byteValue;
  }
  return uint8Array;
}

export async function _sendSolana(recipientAddress: string, rpcUrl: string, senderAddress: PhantomWalletAdapter, privateKey: string) {
  if (!senderAddress) {
    console.log("Please install Phantom Wallet to use this feature");
    return;
  }

  if (!senderAddress.connected || !senderAddress.publicKey) {
    console.log("You are not connected to Phantom Wallet");
    return;
  }

  try {
    const connection = new Connection(rpcUrl);

    // Construct and sign the transaction
    const transaction = new Transaction().add(
      // Add instructions for the transaction here
      // For example, to transfer SOL, you can use `SystemProgram.transfer`
      // You would need to specify the recipient address and the amount in lamports
      // Example:
      SystemProgram.transfer({
        fromPubkey: senderAddress.publicKey!,
        toPubkey: new PublicKey(recipientAddress),
        lamports: 1000000, // Amount in lamports (adjust as needed)
      })
    );

    // Convert the hexadecimal private key to a Uint8Array
    const privateKeyBytes = hexToUint8Array(privateKey);

    if (privateKeyBytes.length !== 32) {
      console.log("Private key should be exactly 32 bytes.");
      return;
    }

    // Create a custom signer with the private key
    const customSigner = {
      publicKey: senderAddress.publicKey!,
      secretKey: privateKeyBytes,
    };

    

    // Send the signed transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [customSigner]);
    console.log(signature);
    

    console.log("Transaction sent. Signature:", signature);
  } catch (error: any) {
    console.log("Failed to send Solana:", error.message);
  }
}