export const ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokensSwapped",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ethReceived",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokensIntoLiqudity",
                "type": "uint256"
            }
        ],
        "name": "SwapAndLiquify",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "enabled",
                "type": "bool"
            }
        ],
        "name": "SwapAndLiquifyEnabledUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "Burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "accounts",
                "type": "address[]"
            }
        ],
        "name": "SnipeBot",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "accounts",
                "type": "address[]"
            }
        ],
        "name": "blacklist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "burnDuration",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "burnRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "burned",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "burnwallet",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creatorWallet",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creatorwalletFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creatorwalletFeeOnBuying",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creatorwalletFeeOnSelling",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creatorwalletFeeOnWhale",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tAmount",
                "type": "uint256"
            }
        ],
        "name": "deliver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "excludeFromFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "excludeFromReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getburnableamount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "includeInFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "includeInReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "isBlacklisted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "isExcludedFromFee",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "isExcludedFromReward",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastBurn",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "launchedAt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "liquidityFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "liquidityFeeOnBuying",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "liquidityFeeOnSelling",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "liquidityFeeOnWhale",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxTxAmountBuy",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxTxAmountSell",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxWhaleFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pancakePair",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pancakeRouter",
        "outputs": [
            {
                "internalType": "contract IPancakeRouter02",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reflectionFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reflectionFeeOnBuying",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reflectionFeeOnSelling",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reflectionFeeOnWhale",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reflectionFeesdiabled",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tAmount",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "deductTransferFee",
                "type": "bool"
            }
        ],
        "name": "reflectionFromToken",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "accounts",
                "type": "address[]"
            }
        ],
        "name": "removeBot",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reflectionFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_liquidityFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_wheelWalletFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_creatorwalletFee",
                "type": "uint256"
            }
        ],
        "name": "setBuyFeePercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "setMinTokenNumberToSell",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reflectionFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_liquidityFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_wheelWalletFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_creatorwalletFee",
                "type": "uint256"
            }
        ],
        "name": "setNormalFeePercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_state",
                "type": "bool"
            }
        ],
        "name": "setReflectionFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IPancakeRouter02",
                "name": "_router",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_pair",
                "type": "address"
            }
        ],
        "name": "setRoute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reflectionFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_liquidityFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_wheelWalletFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_creatorwalletFee",
                "type": "uint256"
            }
        ],
        "name": "setSellFeePercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_state",
                "type": "bool"
            }
        ],
        "name": "setSwapAndLiquifyEnabled",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_reflectionFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_liquidityFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_wheelWalletFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_creatorwalletFee",
                "type": "uint256"
            }
        ],
        "name": "setWhaleFeePercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "setmaxTxAmountBuy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "setmaxTxAmountSell",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_wheelWallet",
                "type": "address"
            }
        ],
        "name": "setwheelWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "swapAndLiquifyEnabled",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "rAmount",
                "type": "uint256"
            }
        ],
        "name": "tokenFromReflection",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalFees",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "accounts",
                "type": "address[]"
            }
        ],
        "name": "unBlacklist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "wheelWallet",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "wheelWalletFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "wheelWalletFeeOnBuying",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "wheelWalletFeeOnSelling",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "wheelWalletFeeOnWhale",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawBNB",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]


export const OPENSEA_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "conduitController",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    { "inputs": [], "name": "BadContractSignature", "type": "error" },
    { "inputs": [], "name": "BadFraction", "type": "error" },
    {
        "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "BadReturnValueFromERC20OnTransfer",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "uint8", "name": "v", "type": "uint8" }],
        "name": "BadSignatureV",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ConsiderationCriteriaResolverOutOfRange",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "orderIndex", "type": "uint256" },
            {
                "internalType": "uint256",
                "name": "considerationIndex",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "shortfallAmount",
                "type": "uint256"
            }
        ],
        "name": "ConsiderationNotMet",
        "type": "error"
    },
    { "inputs": [], "name": "CriteriaNotEnabledForItem", "type": "error" },
    {
        "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            {
                "internalType": "uint256[]",
                "name": "identifiers",
                "type": "uint256[]"
            },
            { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "name": "ERC1155BatchTransferGenericFailure",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "account", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "EtherTransferGenericFailure",
        "type": "error"
    },
    { "inputs": [], "name": "InexactFraction", "type": "error" },
    { "inputs": [], "name": "InsufficientEtherSupplied", "type": "error" },
    { "inputs": [], "name": "Invalid1155BatchTransferEncoding", "type": "error" },
    {
        "inputs": [],
        "name": "InvalidBasicOrderParameterEncoding",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "conduit", "type": "address" }
        ],
        "name": "InvalidCallToConduit",
        "type": "error"
    },
    { "inputs": [], "name": "InvalidCanceller", "type": "error" },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "conduitKey", "type": "bytes32" },
            { "internalType": "address", "name": "conduit", "type": "address" }
        ],
        "name": "InvalidConduit",
        "type": "error"
    },
    { "inputs": [], "name": "InvalidERC721TransferAmount", "type": "error" },
    { "inputs": [], "name": "InvalidFulfillmentComponentData", "type": "error" },
    {
        "inputs": [
            { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "InvalidMsgValue",
        "type": "error"
    },
    { "inputs": [], "name": "InvalidNativeOfferItem", "type": "error" },
    { "inputs": [], "name": "InvalidProof", "type": "error" },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "orderHash", "type": "bytes32" }
        ],
        "name": "InvalidRestrictedOrder",
        "type": "error"
    },
    { "inputs": [], "name": "InvalidSignature", "type": "error" },
    { "inputs": [], "name": "InvalidSigner", "type": "error" },
    { "inputs": [], "name": "InvalidTime", "type": "error" },
    {
        "inputs": [],
        "name": "MismatchedFulfillmentOfferAndConsiderationComponents",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "enum Side", "name": "side", "type": "uint8" }
        ],
        "name": "MissingFulfillmentComponentOnAggregation",
        "type": "error"
    },
    { "inputs": [], "name": "MissingItemAmount", "type": "error" },
    {
        "inputs": [],
        "name": "MissingOriginalConsiderationItems",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "account", "type": "address" }
        ],
        "name": "NoContract",
        "type": "error"
    },
    { "inputs": [], "name": "NoReentrantCalls", "type": "error" },
    { "inputs": [], "name": "NoSpecifiedOrdersAvailable", "type": "error" },
    {
        "inputs": [],
        "name": "OfferAndConsiderationRequiredOnFulfillment",
        "type": "error"
    },
    { "inputs": [], "name": "OfferCriteriaResolverOutOfRange", "type": "error" },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "orderHash", "type": "bytes32" }
        ],
        "name": "OrderAlreadyFilled",
        "type": "error"
    },
    { "inputs": [], "name": "OrderCriteriaResolverOutOfRange", "type": "error" },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "orderHash", "type": "bytes32" }
        ],
        "name": "OrderIsCancelled",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "orderHash", "type": "bytes32" }
        ],
        "name": "OrderPartiallyFilled",
        "type": "error"
    },
    { "inputs": [], "name": "PartialFillsNotEnabledForOrder", "type": "error" },
    {
        "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "identifier", "type": "uint256" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "TokenTransferGenericFailure",
        "type": "error"
    },
    { "inputs": [], "name": "UnresolvedConsiderationCriteria", "type": "error" },
    { "inputs": [], "name": "UnresolvedOfferCriteria", "type": "error" },
    { "inputs": [], "name": "UnusedItemParameters", "type": "error" },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newCounter",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "offerer",
                "type": "address"
            }
        ],
        "name": "CounterIncremented",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "orderHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "offerer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "zone",
                "type": "address"
            }
        ],
        "name": "OrderCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "orderHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "offerer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "zone",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "enum ItemType",
                        "name": "itemType",
                        "type": "uint8"
                    },
                    { "internalType": "address", "name": "token", "type": "address" },
                    {
                        "internalType": "uint256",
                        "name": "identifier",
                        "type": "uint256"
                    },
                    { "internalType": "uint256", "name": "amount", "type": "uint256" }
                ],
                "indexed": false,
                "internalType": "struct SpentItem[]",
                "name": "offer",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "internalType": "enum ItemType",
                        "name": "itemType",
                        "type": "uint8"
                    },
                    { "internalType": "address", "name": "token", "type": "address" },
                    {
                        "internalType": "uint256",
                        "name": "identifier",
                        "type": "uint256"
                    },
                    { "internalType": "uint256", "name": "amount", "type": "uint256" },
                    {
                        "internalType": "address payable",
                        "name": "recipient",
                        "type": "address"
                    }
                ],
                "indexed": false,
                "internalType": "struct ReceivedItem[]",
                "name": "consideration",
                "type": "tuple[]"
            }
        ],
        "name": "OrderFulfilled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "orderHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "offerer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "zone",
                "type": "address"
            }
        ],
        "name": "OrderValidated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "components": [
                    { "internalType": "address", "name": "offerer", "type": "address" },
                    { "internalType": "address", "name": "zone", "type": "address" },
                    {
                        "components": [
                            {
                                "internalType": "enum ItemType",
                                "name": "itemType",
                                "type": "uint8"
                            },
                            { "internalType": "address", "name": "token", "type": "address" },
                            {
                                "internalType": "uint256",
                                "name": "identifierOrCriteria",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endAmount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OfferItem[]",
                        "name": "offer",
                        "type": "tuple[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum ItemType",
                                "name": "itemType",
                                "type": "uint8"
                            },
                            { "internalType": "address", "name": "token", "type": "address" },
                            {
                                "internalType": "uint256",
                                "name": "identifierOrCriteria",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address payable",
                                "name": "recipient",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct ConsiderationItem[]",
                        "name": "consideration",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "enum OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    { "internalType": "uint256", "name": "startTime", "type": "uint256" },
                    { "internalType": "uint256", "name": "endTime", "type": "uint256" },
                    { "internalType": "bytes32", "name": "zoneHash", "type": "bytes32" },
                    { "internalType": "uint256", "name": "salt", "type": "uint256" },
                    {
                        "internalType": "bytes32",
                        "name": "conduitKey",
                        "type": "bytes32"
                    },
                    { "internalType": "uint256", "name": "counter", "type": "uint256" }
                ],
                "internalType": "struct OrderComponents[]",
                "name": "orders",
                "type": "tuple[]"
            }
        ],
        "name": "cancel",
        "outputs": [
            { "internalType": "bool", "name": "cancelled", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "offerer",
                                "type": "address"
                            },
                            { "internalType": "address", "name": "zone", "type": "address" },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct OfferItem[]",
                                "name": "offer",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address payable",
                                        "name": "recipient",
                                        "type": "address"
                                    }
                                ],
                                "internalType": "struct ConsiderationItem[]",
                                "name": "consideration",
                                "type": "tuple[]"
                            },
                            {
                                "internalType": "enum OrderType",
                                "name": "orderType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "zoneHash",
                                "type": "bytes32"
                            },
                            { "internalType": "uint256", "name": "salt", "type": "uint256" },
                            {
                                "internalType": "bytes32",
                                "name": "conduitKey",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint256",
                                "name": "totalOriginalConsiderationItems",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderParameters",
                        "name": "parameters",
                        "type": "tuple"
                    },
                    { "internalType": "uint120", "name": "numerator", "type": "uint120" },
                    {
                        "internalType": "uint120",
                        "name": "denominator",
                        "type": "uint120"
                    },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" },
                    { "internalType": "bytes", "name": "extraData", "type": "bytes" }
                ],
                "internalType": "struct AdvancedOrder",
                "name": "advancedOrder",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "orderIndex",
                        "type": "uint256"
                    },
                    { "internalType": "enum Side", "name": "side", "type": "uint8" },
                    { "internalType": "uint256", "name": "index", "type": "uint256" },
                    {
                        "internalType": "uint256",
                        "name": "identifier",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32[]",
                        "name": "criteriaProof",
                        "type": "bytes32[]"
                    }
                ],
                "internalType": "struct CriteriaResolver[]",
                "name": "criteriaResolvers",
                "type": "tuple[]"
            },
            {
                "internalType": "bytes32",
                "name": "fulfillerConduitKey",
                "type": "bytes32"
            },
            { "internalType": "address", "name": "recipient", "type": "address" }
        ],
        "name": "fulfillAdvancedOrder",
        "outputs": [
            { "internalType": "bool", "name": "fulfilled", "type": "bool" }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "offerer",
                                "type": "address"
                            },
                            { "internalType": "address", "name": "zone", "type": "address" },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct OfferItem[]",
                                "name": "offer",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address payable",
                                        "name": "recipient",
                                        "type": "address"
                                    }
                                ],
                                "internalType": "struct ConsiderationItem[]",
                                "name": "consideration",
                                "type": "tuple[]"
                            },
                            {
                                "internalType": "enum OrderType",
                                "name": "orderType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "zoneHash",
                                "type": "bytes32"
                            },
                            { "internalType": "uint256", "name": "salt", "type": "uint256" },
                            {
                                "internalType": "bytes32",
                                "name": "conduitKey",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint256",
                                "name": "totalOriginalConsiderationItems",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderParameters",
                        "name": "parameters",
                        "type": "tuple"
                    },
                    { "internalType": "uint120", "name": "numerator", "type": "uint120" },
                    {
                        "internalType": "uint120",
                        "name": "denominator",
                        "type": "uint120"
                    },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" },
                    { "internalType": "bytes", "name": "extraData", "type": "bytes" }
                ],
                "internalType": "struct AdvancedOrder[]",
                "name": "advancedOrders",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "orderIndex",
                        "type": "uint256"
                    },
                    { "internalType": "enum Side", "name": "side", "type": "uint8" },
                    { "internalType": "uint256", "name": "index", "type": "uint256" },
                    {
                        "internalType": "uint256",
                        "name": "identifier",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32[]",
                        "name": "criteriaProof",
                        "type": "bytes32[]"
                    }
                ],
                "internalType": "struct CriteriaResolver[]",
                "name": "criteriaResolvers",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "orderIndex",
                        "type": "uint256"
                    },
                    { "internalType": "uint256", "name": "itemIndex", "type": "uint256" }
                ],
                "internalType": "struct FulfillmentComponent[][]",
                "name": "offerFulfillments",
                "type": "tuple[][]"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "orderIndex",
                        "type": "uint256"
                    },
                    { "internalType": "uint256", "name": "itemIndex", "type": "uint256" }
                ],
                "internalType": "struct FulfillmentComponent[][]",
                "name": "considerationFulfillments",
                "type": "tuple[][]"
            },
            {
                "internalType": "bytes32",
                "name": "fulfillerConduitKey",
                "type": "bytes32"
            },
            { "internalType": "address", "name": "recipient", "type": "address" },
            {
                "internalType": "uint256",
                "name": "maximumFulfilled",
                "type": "uint256"
            }
        ],
        "name": "fulfillAvailableAdvancedOrders",
        "outputs": [
            { "internalType": "bool[]", "name": "availableOrders", "type": "bool[]" },
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "enum ItemType",
                                "name": "itemType",
                                "type": "uint8"
                            },
                            { "internalType": "address", "name": "token", "type": "address" },
                            {
                                "internalType": "uint256",
                                "name": "identifier",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address payable",
                                "name": "recipient",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct ReceivedItem",
                        "name": "item",
                        "type": "tuple"
                    },
                    { "internalType": "address", "name": "offerer", "type": "address" },
                    { "internalType": "bytes32", "name": "conduitKey", "type": "bytes32" }
                ],
                "internalType": "struct Execution[]",
                "name": "executions",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "offerer",
                                "type": "address"
                            },
                            { "internalType": "address", "name": "zone", "type": "address" },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct OfferItem[]",
                                "name": "offer",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address payable",
                                        "name": "recipient",
                                        "type": "address"
                                    }
                                ],
                                "internalType": "struct ConsiderationItem[]",
                                "name": "consideration",
                                "type": "tuple[]"
                            },
                            {
                                "internalType": "enum OrderType",
                                "name": "orderType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "zoneHash",
                                "type": "bytes32"
                            },
                            { "internalType": "uint256", "name": "salt", "type": "uint256" },
                            {
                                "internalType": "bytes32",
                                "name": "conduitKey",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint256",
                                "name": "totalOriginalConsiderationItems",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderParameters",
                        "name": "parameters",
                        "type": "tuple"
                    },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" }
                ],
                "internalType": "struct Order[]",
                "name": "orders",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "orderIndex",
                        "type": "uint256"
                    },
                    { "internalType": "uint256", "name": "itemIndex", "type": "uint256" }
                ],
                "internalType": "struct FulfillmentComponent[][]",
                "name": "offerFulfillments",
                "type": "tuple[][]"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "orderIndex",
                        "type": "uint256"
                    },
                    { "internalType": "uint256", "name": "itemIndex", "type": "uint256" }
                ],
                "internalType": "struct FulfillmentComponent[][]",
                "name": "considerationFulfillments",
                "type": "tuple[][]"
            },
            {
                "internalType": "bytes32",
                "name": "fulfillerConduitKey",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "maximumFulfilled",
                "type": "uint256"
            }
        ],
        "name": "fulfillAvailableOrders",
        "outputs": [
            { "internalType": "bool[]", "name": "availableOrders", "type": "bool[]" },
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "enum ItemType",
                                "name": "itemType",
                                "type": "uint8"
                            },
                            { "internalType": "address", "name": "token", "type": "address" },
                            {
                                "internalType": "uint256",
                                "name": "identifier",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address payable",
                                "name": "recipient",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct ReceivedItem",
                        "name": "item",
                        "type": "tuple"
                    },
                    { "internalType": "address", "name": "offerer", "type": "address" },
                    { "internalType": "bytes32", "name": "conduitKey", "type": "bytes32" }
                ],
                "internalType": "struct Execution[]",
                "name": "executions",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "considerationToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "considerationIdentifier",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "considerationAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "offerer",
                        "type": "address"
                    },
                    { "internalType": "address", "name": "zone", "type": "address" },
                    {
                        "internalType": "address",
                        "name": "offerToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "offerIdentifier",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "offerAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum BasicOrderType",
                        "name": "basicOrderType",
                        "type": "uint8"
                    },
                    { "internalType": "uint256", "name": "startTime", "type": "uint256" },
                    { "internalType": "uint256", "name": "endTime", "type": "uint256" },
                    { "internalType": "bytes32", "name": "zoneHash", "type": "bytes32" },
                    { "internalType": "uint256", "name": "salt", "type": "uint256" },
                    {
                        "internalType": "bytes32",
                        "name": "offererConduitKey",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "fulfillerConduitKey",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalOriginalAdditionalRecipients",
                        "type": "uint256"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address payable",
                                "name": "recipient",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct AdditionalRecipient[]",
                        "name": "additionalRecipients",
                        "type": "tuple[]"
                    },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" }
                ],
                "internalType": "struct BasicOrderParameters",
                "name": "parameters",
                "type": "tuple"
            }
        ],
        "name": "fulfillBasicOrder",
        "outputs": [
            { "internalType": "bool", "name": "fulfilled", "type": "bool" }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "offerer",
                                "type": "address"
                            },
                            { "internalType": "address", "name": "zone", "type": "address" },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct OfferItem[]",
                                "name": "offer",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address payable",
                                        "name": "recipient",
                                        "type": "address"
                                    }
                                ],
                                "internalType": "struct ConsiderationItem[]",
                                "name": "consideration",
                                "type": "tuple[]"
                            },
                            {
                                "internalType": "enum OrderType",
                                "name": "orderType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "zoneHash",
                                "type": "bytes32"
                            },
                            { "internalType": "uint256", "name": "salt", "type": "uint256" },
                            {
                                "internalType": "bytes32",
                                "name": "conduitKey",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint256",
                                "name": "totalOriginalConsiderationItems",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderParameters",
                        "name": "parameters",
                        "type": "tuple"
                    },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" }
                ],
                "internalType": "struct Order",
                "name": "order",
                "type": "tuple"
            },
            {
                "internalType": "bytes32",
                "name": "fulfillerConduitKey",
                "type": "bytes32"
            }
        ],
        "name": "fulfillOrder",
        "outputs": [
            { "internalType": "bool", "name": "fulfilled", "type": "bool" }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "offerer", "type": "address" }
        ],
        "name": "getCounter",
        "outputs": [
            { "internalType": "uint256", "name": "counter", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    { "internalType": "address", "name": "offerer", "type": "address" },
                    { "internalType": "address", "name": "zone", "type": "address" },
                    {
                        "components": [
                            {
                                "internalType": "enum ItemType",
                                "name": "itemType",
                                "type": "uint8"
                            },
                            { "internalType": "address", "name": "token", "type": "address" },
                            {
                                "internalType": "uint256",
                                "name": "identifierOrCriteria",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endAmount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OfferItem[]",
                        "name": "offer",
                        "type": "tuple[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum ItemType",
                                "name": "itemType",
                                "type": "uint8"
                            },
                            { "internalType": "address", "name": "token", "type": "address" },
                            {
                                "internalType": "uint256",
                                "name": "identifierOrCriteria",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address payable",
                                "name": "recipient",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct ConsiderationItem[]",
                        "name": "consideration",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "enum OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    { "internalType": "uint256", "name": "startTime", "type": "uint256" },
                    { "internalType": "uint256", "name": "endTime", "type": "uint256" },
                    { "internalType": "bytes32", "name": "zoneHash", "type": "bytes32" },
                    { "internalType": "uint256", "name": "salt", "type": "uint256" },
                    {
                        "internalType": "bytes32",
                        "name": "conduitKey",
                        "type": "bytes32"
                    },
                    { "internalType": "uint256", "name": "counter", "type": "uint256" }
                ],
                "internalType": "struct OrderComponents",
                "name": "order",
                "type": "tuple"
            }
        ],
        "name": "getOrderHash",
        "outputs": [
            { "internalType": "bytes32", "name": "orderHash", "type": "bytes32" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "orderHash", "type": "bytes32" }
        ],
        "name": "getOrderStatus",
        "outputs": [
            { "internalType": "bool", "name": "isValidated", "type": "bool" },
            { "internalType": "bool", "name": "isCancelled", "type": "bool" },
            { "internalType": "uint256", "name": "totalFilled", "type": "uint256" },
            { "internalType": "uint256", "name": "totalSize", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "incrementCounter",
        "outputs": [
            { "internalType": "uint256", "name": "newCounter", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "information",
        "outputs": [
            { "internalType": "string", "name": "version", "type": "string" },
            {
                "internalType": "bytes32",
                "name": "domainSeparator",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "conduitController",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "offerer",
                                "type": "address"
                            },
                            { "internalType": "address", "name": "zone", "type": "address" },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct OfferItem[]",
                                "name": "offer",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address payable",
                                        "name": "recipient",
                                        "type": "address"
                                    }
                                ],
                                "internalType": "struct ConsiderationItem[]",
                                "name": "consideration",
                                "type": "tuple[]"
                            },
                            {
                                "internalType": "enum OrderType",
                                "name": "orderType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "zoneHash",
                                "type": "bytes32"
                            },
                            { "internalType": "uint256", "name": "salt", "type": "uint256" },
                            {
                                "internalType": "bytes32",
                                "name": "conduitKey",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint256",
                                "name": "totalOriginalConsiderationItems",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderParameters",
                        "name": "parameters",
                        "type": "tuple"
                    },
                    { "internalType": "uint120", "name": "numerator", "type": "uint120" },
                    {
                        "internalType": "uint120",
                        "name": "denominator",
                        "type": "uint120"
                    },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" },
                    { "internalType": "bytes", "name": "extraData", "type": "bytes" }
                ],
                "internalType": "struct AdvancedOrder[]",
                "name": "advancedOrders",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "orderIndex",
                        "type": "uint256"
                    },
                    { "internalType": "enum Side", "name": "side", "type": "uint8" },
                    { "internalType": "uint256", "name": "index", "type": "uint256" },
                    {
                        "internalType": "uint256",
                        "name": "identifier",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32[]",
                        "name": "criteriaProof",
                        "type": "bytes32[]"
                    }
                ],
                "internalType": "struct CriteriaResolver[]",
                "name": "criteriaResolvers",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "orderIndex",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "itemIndex",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct FulfillmentComponent[]",
                        "name": "offerComponents",
                        "type": "tuple[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "orderIndex",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "itemIndex",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct FulfillmentComponent[]",
                        "name": "considerationComponents",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct Fulfillment[]",
                "name": "fulfillments",
                "type": "tuple[]"
            }
        ],
        "name": "matchAdvancedOrders",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "enum ItemType",
                                "name": "itemType",
                                "type": "uint8"
                            },
                            { "internalType": "address", "name": "token", "type": "address" },
                            {
                                "internalType": "uint256",
                                "name": "identifier",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address payable",
                                "name": "recipient",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct ReceivedItem",
                        "name": "item",
                        "type": "tuple"
                    },
                    { "internalType": "address", "name": "offerer", "type": "address" },
                    { "internalType": "bytes32", "name": "conduitKey", "type": "bytes32" }
                ],
                "internalType": "struct Execution[]",
                "name": "executions",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "offerer",
                                "type": "address"
                            },
                            { "internalType": "address", "name": "zone", "type": "address" },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct OfferItem[]",
                                "name": "offer",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address payable",
                                        "name": "recipient",
                                        "type": "address"
                                    }
                                ],
                                "internalType": "struct ConsiderationItem[]",
                                "name": "consideration",
                                "type": "tuple[]"
                            },
                            {
                                "internalType": "enum OrderType",
                                "name": "orderType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "zoneHash",
                                "type": "bytes32"
                            },
                            { "internalType": "uint256", "name": "salt", "type": "uint256" },
                            {
                                "internalType": "bytes32",
                                "name": "conduitKey",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint256",
                                "name": "totalOriginalConsiderationItems",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderParameters",
                        "name": "parameters",
                        "type": "tuple"
                    },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" }
                ],
                "internalType": "struct Order[]",
                "name": "orders",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "orderIndex",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "itemIndex",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct FulfillmentComponent[]",
                        "name": "offerComponents",
                        "type": "tuple[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "orderIndex",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "itemIndex",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct FulfillmentComponent[]",
                        "name": "considerationComponents",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct Fulfillment[]",
                "name": "fulfillments",
                "type": "tuple[]"
            }
        ],
        "name": "matchOrders",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "enum ItemType",
                                "name": "itemType",
                                "type": "uint8"
                            },
                            { "internalType": "address", "name": "token", "type": "address" },
                            {
                                "internalType": "uint256",
                                "name": "identifier",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address payable",
                                "name": "recipient",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct ReceivedItem",
                        "name": "item",
                        "type": "tuple"
                    },
                    { "internalType": "address", "name": "offerer", "type": "address" },
                    { "internalType": "bytes32", "name": "conduitKey", "type": "bytes32" }
                ],
                "internalType": "struct Execution[]",
                "name": "executions",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            { "internalType": "string", "name": "contractName", "type": "string" }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "offerer",
                                "type": "address"
                            },
                            { "internalType": "address", "name": "zone", "type": "address" },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct OfferItem[]",
                                "name": "offer",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ItemType",
                                        "name": "itemType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "token",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "identifierOrCriteria",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "endAmount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address payable",
                                        "name": "recipient",
                                        "type": "address"
                                    }
                                ],
                                "internalType": "struct ConsiderationItem[]",
                                "name": "consideration",
                                "type": "tuple[]"
                            },
                            {
                                "internalType": "enum OrderType",
                                "name": "orderType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "endTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "zoneHash",
                                "type": "bytes32"
                            },
                            { "internalType": "uint256", "name": "salt", "type": "uint256" },
                            {
                                "internalType": "bytes32",
                                "name": "conduitKey",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint256",
                                "name": "totalOriginalConsiderationItems",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderParameters",
                        "name": "parameters",
                        "type": "tuple"
                    },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" }
                ],
                "internalType": "struct Order[]",
                "name": "orders",
                "type": "tuple[]"
            }
        ],
        "name": "validate",
        "outputs": [
            { "internalType": "bool", "name": "validated", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
