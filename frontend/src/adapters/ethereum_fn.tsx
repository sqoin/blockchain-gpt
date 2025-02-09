

export const _isConnectedToMetamask = async (): Promise<boolean> => {
  if (typeof window.ethereum === "undefined") {
    console.log("Please install MetaMask to use this feature");
    return false;
  } else {
    // Check if the wallet is already connected
    if (window.ethereum.selectedAddress !== null) {
      console.log("You are already connected to MetaMask");
      return true;
    }else{
      console.log("You are not connected to MetaMask");
      return false;
    }
  }
};

export const _connectToMetaMask = async (): Promise<string | null> => {
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

export const _disconnectFromMetaMask = async (): Promise<void> => {
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

export const _getPublicKey = async (): Promise<void | null | string> => {
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

export const _getNetworkInfo = async (): Promise<null | {
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

export const _getBalance = async (
  address: any,
  type = "ether"
): Promise<null | number> => {
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
      const web3 = new window.Web3(window.web3.currentProvider);

      const contract = new web3.eth.Contract(ERC20.abi, type); 
      
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


export const _deployNewToken = async (
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
    const web3 = new window.Web3(window.web3.currentProvider);

    const contract = new web3.eth.Contract(ERC20.abi); 
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
    const gasPrice = await web3.eth.getGasPrice();
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

    const transactionHash = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );

    console.log("Transaction hash ", transactionHash, typeof transactionHash);

    // Get the deployed contract address
    const receipt = await web3.eth.getTransactionReceipt(
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


const LBRouterABI = [
  {
    inputs: [
      {
        internalType: "contract ILBFactory",
        name: "_factory",
        type: "address",
      },
      {
        internalType: "contract IJoeFactory",
        name: "_oldFactory",
        type: "address",
      },
      {
        internalType: "contract IWAVAX",
        name: "_wavax",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bp",
        type: "uint256",
      },
    ],
    name: "BinHelper__BinStepOverflows",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "id",
        type: "int256",
      },
    ],
    name: "BinHelper__IdOverflows",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "BinHelper__IntOverflows",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountXMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountX",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountYMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountY",
        type: "uint256",
      },
    ],
    name: "LBRouter__AmountSlippageCaught",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "LBRouter__BinReserveOverflows",
    type: "error",
  },
  {
    inputs: [],
    name: "LBRouter__BrokenSwapSafetyCheck",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentTimestamp",
        type: "uint256",
      },
    ],
    name: "LBRouter__DeadlineExceeded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LBRouter__FailedToSendAVAX",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "idDesired",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "idSlippage",
        type: "uint256",
      },
    ],
    name: "LBRouter__IdDesiredOverflows",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "id",
        type: "int256",
      },
    ],
    name: "LBRouter__IdOverflows",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "activeIdDesired",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "idSlippage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "activeId",
        type: "uint256",
      },
    ],
    name: "LBRouter__IdSlippageCaught",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "LBRouter__InsufficientAmountOut",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "wrongToken",
        type: "address",
      },
    ],
    name: "LBRouter__InvalidTokenPath",
    type: "error",
  },
  {
    inputs: [],
    name: "LBRouter__LengthsMismatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountInMax",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    name: "LBRouter__MaxAmountInExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "LBRouter__NotFactoryOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenX",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenY",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "binStep",
        type: "uint256",
      },
    ],
    name: "LBRouter__PairNotCreated",
    type: "error",
  },
  {
    inputs: [],
    name: "LBRouter__SenderIsNotWAVAX",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "LBRouter__SwapOverflows",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "excess",
        type: "uint256",
      },
    ],
    name: "LBRouter__TooMuchTokensIn",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reserve",
        type: "uint256",
      },
    ],
    name: "LBRouter__WrongAmounts",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenX",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenY",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountX",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountY",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "msgValue",
        type: "uint256",
      },
    ],
    name: "LBRouter__WrongAvaxLiquidityParameters",
    type: "error",
  },
  {
    inputs: [],
    name: "LBRouter__WrongTokenOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "Math128x128__LogUnderflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "int256",
        name: "y",
        type: "int256",
      },
    ],
    name: "Math128x128__PowerUnderflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "prod1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "denominator",
        type: "uint256",
      },
    ],
    name: "Math512Bits__MulDivOverflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "prod1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
    ],
    name: "Math512Bits__MulShiftOverflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
    ],
    name: "Math512Bits__OffsetOverflows",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "SafeCast__Exceeds128Bits",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "SafeCast__Exceeds40Bits",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "tokenX",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "tokenY",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "binStep",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountX",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountY",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountXMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountYMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "activeIdDesired",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "idSlippage",
            type: "uint256",
          },
          {
            internalType: "int256[]",
            name: "deltaIds",
            type: "int256[]",
          },
          {
            internalType: "uint256[]",
            name: "distributionX",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "distributionY",
            type: "uint256[]",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        internalType: "struct ILBRouter.LiquidityParameters",
        name: "_liquidityParameters",
        type: "tuple",
      },
    ],
    name: "addLiquidity",
    outputs: [
      {
        internalType: "uint256[]",
        name: "depositIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "liquidityMinted",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "tokenX",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "tokenY",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "binStep",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountX",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountY",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountXMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountYMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "activeIdDesired",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "idSlippage",
            type: "uint256",
          },
          {
            internalType: "int256[]",
            name: "deltaIds",
            type: "int256[]",
          },
          {
            internalType: "uint256[]",
            name: "distributionX",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "distributionY",
            type: "uint256[]",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        internalType: "struct ILBRouter.LiquidityParameters",
        name: "_liquidityParameters",
        type: "tuple",
      },
    ],
    name: "addLiquidityAVAX",
    outputs: [
      {
        internalType: "uint256[]",
        name: "depositIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "liquidityMinted",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_tokenX",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_tokenY",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "_activeId",
        type: "uint24",
      },
      {
        internalType: "uint16",
        name: "_binStep",
        type: "uint16",
      },
    ],
    name: "createLBPair",
    outputs: [
      {
        internalType: "contract ILBPair",
        name: "pair",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "contract ILBFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ILBPair",
        name: "_LBPair",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "getIdFromPrice",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ILBPair",
        name: "_LBPair",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "_id",
        type: "uint24",
      },
    ],
    name: "getPriceFromId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ILBPair",
        name: "_LBPair",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountOut",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_swapForY",
        type: "bool",
      },
    ],
    name: "getSwapIn",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feesIn",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ILBPair",
        name: "_LBPair",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_swapForY",
        type: "bool",
      },
    ],
    name: "getSwapOut",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feesIn",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oldFactory",
    outputs: [
      {
        internalType: "contract IJoeFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_tokenX",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_tokenY",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_binStep",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_amountXMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountYMin",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "removeLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "amountX",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountY",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_binStep",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_amountTokenMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountAVAXMin",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
      {
        internalType: "address payable",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "removeLiquidityAVAX",
    outputs: [
      {
        internalType: "uint256",
        name: "amountToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountAVAX",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapAVAXForExactTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountOutMin",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapExactAVAXForTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountOutMin",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapExactAVAXForTokensSupportingFeeOnTransferTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountOutMinAVAX",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address payable",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForAVAX",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountOutMinAVAX",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address payable",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForAVAXSupportingFeeOnTransferTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountOutMin",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountOutMin",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountAVAXOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountInMax",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address payable",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapTokensForExactAVAX",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountInMax",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_pairBinSteps",
        type: "uint256[]",
      },
      {
        internalType: "contract IERC20[]",
        name: "_tokenPath",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "swapTokensForExactTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "sweep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ILBToken",
        name: "_lbToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
    ],
    name: "sweepLBToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "wavax",
    outputs: [
      {
        internalType: "contract IWAVAX",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];




