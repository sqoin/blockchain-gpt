import { ConnectionConfig, HttpHeaders } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";


export const PAID_NODE_URL = "https://nova-solana-main-rpc-0.machine.restake.tech"

export const HEADERS={
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Basic ${btoa(`${process.env.REACT_APP_RPC_USERNAME}:${process.env.REACT_APP_RPC_PASSWORD}`)}`
}

let httpHeaders:HttpHeaders={
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Basic ${btoa(`${process.env.REACT_APP_RPC_USERNAME}:${process.env.REACT_APP_RPC_PASSWORD}`)}`,
    wsEndpoint: createWSEndpoint(PAID_NODE_URL)
};

function createWSEndpoint(rpcUrl:any) {
    const u = new URL(rpcUrl);
    u.protocol = u.protocol.replace("http", "ws");
    u.username = `${process.env.REACT_APP_RPC_USERNAME}`;
    u.password = `${process.env.REACT_APP_RPC_PASSWORD}`;
    return u.toString();
}


export const CONFIG : ConnectionConfig = {
    httpHeaders
}

export function getConnection():Connection{
    const rpcUrl:any = PAID_NODE_URL;
    const username = process.env.REACT_APP_RPC_USERNAME;
    const password = process.env.REACT_APP_RPC_PASSWORD;
    const solConnection = new Connection(rpcUrl, {
      httpHeaders: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
      wsEndpoint: createWSEndpoint(rpcUrl),
    });
  return solConnection;
}