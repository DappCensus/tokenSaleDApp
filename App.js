import React, { useEffect, useState } from 'react';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/countdown.js';
//import './Web3Client';
import logo from '../src/logo.svg';
import webIcon from '../src/mdi_web.svg';
import helpIcon from '../src/bx_bx-help-circle.svg';
import mediumIcon from '../src/social icons/bx_bxl-medium.svg';
import twitterIcon from '../src/social icons/ei_sc-twitter.svg';
import facebookIcon from '../src/social icons/ei_sc-facebook.svg';
import githubIcon from '../src/social icons/ei_sc-github.svg';
import linkedinIcon from '../src/social icons/ei_sc-linkedin.svg';
import telegramIcon from '../src/social icons/ei_sc-telegram.svg';
import youtubeIcon from '../src/social icons/ei_sc-youtube.svg';
import swal from 'sweetalert';
import Web3 from 'web3';
import arrowDownIcon from '../src/bi_arrow-down.svg';
import polygonLog from '../src/polygon-matic-seeklogo.com.svg';
import bscLog from '../src/binance-smart-chain-seeklogo.com.svg';

const SweetAlert = require('react-bootstrap-sweetalert');
// require('ABI.js');
let selectedAccount;
let amount = '0';
let networkName = 'bsc';
let handlebalance;
//let nftContract;
let erc20Contract;
let busdContract;
let privateContract;
let hmeContract;
let isInitialized = false;

const networks = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com'],
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org',
      'https://bsc-dataseed4.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
      'wss://bsc-ws-node.nariox.org',
    ],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  busd: {
    chainId: `0x${Number(97).toString(16)}`,
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'Binance Chain Test Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545'
    ],
    blockExplorerUrls: ['https://explorer.binance.org/smart-testnet'],
  },
};
const changeNetwork = async ({ networkName, setError }) => {
  try {
    if (!window.ethereum) throw new Error('No crypto wallet found');
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          ...networks[networkName],
        },
      ],
    });
  } catch (err) {
    setError(err.message);
  }
};

function App() {
  //Homwere: 0x076d7DBf9C1dd04Eee7709150077D27C2070dCe8
  //BUSD: 0x09B552437AC4e4fA03644682Ecce9688c20409E6
  //Private sell: 0x1D839639Fd8FF3d53D2eFA876a1431A9B803fc80

  let initialTxt = 'Connect Wallet';
  let value = '';
  let smart_contract = '0x1D839639Fd8FF3d53D2eFA876a1431A9B803fc80';
  var busd_contract = '0x55d398326f99059ff775485246999027b3197955';
  let hme_contract = '0x92964B2b5a4F708Dc622B8D613263f6811517Aa1';
  let type_address = '0x09B552437AC4e4fA03644682Ecce9688c20409E6';
  let initialtype = 'usdt';
  const [error, setError] = useState();
  const [text, setText] = React.useState(initialTxt);
  const [amount, setamount] = useState('0');
  const [option, setoption] = useState('');
  const [activeclass, setactiveclass] = useState('active');
  const [maxallocation, setmaxallocation] = useState('');
  const [remainallocation, setremainallocation] = useState('');
  const [type, settype] = useState(initialtype);
  const [mybalance, setmybalance] = useState(0);
  const [btntext, setbtntext] = useState('Purchase');
  const [btndisabled, setbtndisabled] = useState(false);
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(0);
  const [hme, setHme] = useState(0);
  const [maxhme, setMaxHme] = useState(0);
  const [buyhme, setBuyHme] = useState(0);
  const [width, setWidth] = useState(0);
  const [innerbalance, setInnerBalance] = useState(0);
  const [totalpurchased, setTotalPurchased] = useState(0);
  const [allow, setAllow] = useState();
  const [price, setPrice] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  // async function changeNetwork() {
  //   console.log(type);
  //   if (type == 'bsc') {
  //     console.log('ass');
  //     networkName = 'bsc';
  //   }
  //   if (type == 'matic') {
  //     networkName = 'polygon';
  //   }
    const handleNetworkSwitch = async (networkName) => {
      setError();
      await changeNetwork({ networkName, setError });
    };
  // }

  const changeType = async (type) => {
    let provider = window.ethereum;
    //console.log(provider);
    console.log("hello"+ type);

   
    settype(type);
    if (typeof provider !== 'undefined') {
     // handleNetworkSwitch(type)
      provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          selectedAccount = accounts[0];
          //console.log(`Selected account is ${selectedAccount}`);
        })
        .catch((err) => {
          console.log(err);
          return;
        });

      window.ethereum.on('accountsChanged', function (accounts) {
        selectedAccount = accounts[0];
        // console.log(`Selected account changed to ${selectedAccount}`);
      });

      window.ethereum.on('networkChanged', function(networkId){
        console.log("Network Changed!");
        init();
      });
    

    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    if(type == 'busd' && networkId == 56){
      busd_contract = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
    }
    if(type == 'usdt' && networkId == 56){
        busd_contract = '0x55d398326f99059ff775485246999027b3197955'
    }
    if(type == 'busd' && networkId == 137){
      busd_contract = '0xa8d394fe7380b8ce6145d5f85e6ac22d4e91acde';
    }
    if(type == 'usdt' && networkId == 137){
        busd_contract = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
    }
    if(type == 'usdc' && networkId == 137){
      busd_contract = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
    }
    if(networkId == 56){
      smart_contract = "0x5796c08627d4c96db1943b11b4de8824eb953da4";
      hme_contract = "0x92964B2b5a4F708Dc622B8D613263f6811517Aa1";
    }else{
      smart_contract = "0xc4919ae262e43b8bc0722ad29841ffe9a3ea1c67";
      hme_contract = "0xf8277513cef36CfC6e222e0F828b845472082E74";
    }
    // console.log("network :"+networkId);
    const privateAbi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_homwereAdr',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'previousAdminRole',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'newAdminRole',
            type: 'bytes32',
          },
        ],
        name: 'RoleAdminChanged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'RoleGranted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'RoleRevoked',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'Buyer',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'Amount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'contractAdr',
            type: 'address',
          },
        ],
        name: 'partipateEvt',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'Spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'Amount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'contractAdr',
            type: 'address',
          },
        ],
        name: 'tknWithDraw',
        type: 'event',
      },
      {
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'airDropAmt',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_amt',
            type: 'uint256',
          },
        ],
        name: 'buyToken',
        outputs: [
          {
            internalType: 'bool',
            name: 'result',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
        ],
        name: 'checkAllowance',
        outputs: [
          {
            internalType: 'uint256',
            name: 'allowanceAmt',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getAddrAllocation',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_addr',
            type: 'address',
          },
        ],
        name: 'getAddrParm',
        outputs: [
          {
            internalType: 'uint256',
            name: '_remainAllo',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_bought',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
        ],
        name: 'getPrice',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_amt',
            type: 'uint256',
          },
        ],
        name: 'getQuantity',
        outputs: [
          {
            internalType: 'uint256',
            name: '_Quan',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
        ],
        name: 'getRoleAdmin',
        outputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'hasRole',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'homwereAdr',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_allocation',
            type: 'uint256',
          },
        ],
        name: 'setAddrAllocation',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_price',
            type: 'uint256',
          },
        ],
        name: 'setPrice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes4',
            name: 'interfaceId',
            type: 'bytes4',
          },
        ],
        name: 'supportsInterface',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'amt',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: '_contractAdr',
            type: 'address',
          },
        ],
        name: 'withdrawERC',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];
    const busdAbi = [
      {
        inputs: [
          {
            internalType: 'string',
            name: 'name_',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol_',
            type: 'string',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint8',
            name: '',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'subtractedValue',
            type: 'uint256',
          },
        ],
        name: 'decreaseAllowance',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'addedValue',
            type: 'uint256',
          },
        ],
        name: 'increaseAllowance',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    console.log(busd_contract)

    erc20Contract = new web3.eth.Contract(busdAbi, busd_contract);

    privateContract = new web3.eth.Contract(privateAbi, smart_contract, {
      gasPrice: "30000000000"
    } );

    hmeContract = new web3.eth.Contract(busdAbi, hme_contract);

    // console.log("hme contract "+hmeContract.methods);

    privateContract.methods
      .getPrice(busd_contract)
      .call(function (err, result) {
        if (!err) {
			if(networkId == 137){
				// console.log(Web3.utils.fromWei(result));
				setPrice(result / 1000000);
			}else{
				setPrice(Web3.utils.fromWei(result));
			}
        }
      });

    privateContract.methods.getAddrAllocation().call(function (err, result) {
      if (!err) {
        setmaxallocation(Web3.utils.fromWei(result));
      }
    });

    privateContract.methods
      .getAddrParm(selectedAccount)
      .call(function (err, result) {
        if (!err) {
          // console.log(result);
          let totalpur = Web3.utils.fromWei(result[1]);
          setTotalPurchased(totalpur);
          privateContract.methods
            .getAddrAllocation()
            .call(function (err, result) {
              if (!err) {
                let totalallo = Web3.utils.fromWei(result);
                let leftallo = totalallo - totalpur;
                setremainallocation(leftallo);
              }
            });
        }
      });

    erc20Contract.methods
      .balanceOf(selectedAccount)
      .call(function (err, result) {
        if (!err) {
          if(networkId == 137){
            setInnerBalance(result/1000000);
          }else{
            setInnerBalance(Web3.utils.fromWei(result));
          }
          console.log("change type type"+ type);
          console.log("change type result"+ result);
          
        }
      });

    hmeContract.methods.balanceOf(smart_contract).call(function (err, result) {
      if (!err) {
        let leftsupply = Web3.utils.fromWei(result);
        setMaxHme(25000000);
        setBuyHme(leftsupply);
        let getwidth = 100 - ((leftsupply / 25000000) * 100);
        setWidth(getwidth);
       
      }
    });

    isInitialized = true;
  }};

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Make sure you have Metamask installed!');
      return;
    } else {
      window.ethereum.on('accountsChanged', function (accounts) {
        selectedAccount = accounts[0];
        console.log(`Selected account changed to ${selectedAccount}`);
        setText('Connected : ' + selectedAccount.substr(0, 8) + '..');
        init();
      });
      // console.log("Wallet exists! We're ready to go!")
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      // console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
      setText('Connected : ' + account.substr(0, 8) + '..');
    } else {
      //  console.log("No authorized account found");
    }
  };

  const getHME = async (value) => {
    // console.log(typeof value);
    setamount(value);
    console.log(busd_contract);
    if (value != '' && value >= 0) {
      let provider = window.ethereum;
      // console.log(provider);
      let web3 = new Web3(provider);
      let networkId = await web3.eth.net.getId();
      console.log(networkId);
      if(type == 'busd' && networkId == 56){
        busd_contract = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
      }
      if(type == 'usdt' && networkId == 56){
          busd_contract = '0x55d398326f99059ff775485246999027b3197955'
      }
      if(type == 'busd' && networkId == 137){
        busd_contract = '0xa8d394fe7380b8ce6145d5f85e6ac22d4e91acde';
      }
      if(type == 'usdt' && networkId == 137){
          busd_contract = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
      }
      if(type == 'usdc' && networkId == 137){
        busd_contract = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
      }
      if(networkId == 56){
        smart_contract = "0x5796c08627d4c96db1943b11b4de8824eb953da4";
        hme_contract = "0x92964B2b5a4F708Dc622B8D613263f6811517Aa1";
      }else{
        smart_contract = "0xc4919ae262e43b8bc0722ad29841ffe9a3ea1c67";
        hme_contract = "0xf8277513cef36CfC6e222e0F828b845472082E74";
      }
      let privateAbi = [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_homwereAdr',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'previousAdminRole',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'newAdminRole',
              type: 'bytes32',
            },
          ],
          name: 'RoleAdminChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
          ],
          name: 'RoleGranted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
          ],
          name: 'RoleRevoked',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'Buyer',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'Amount',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'contractAdr',
              type: 'address',
            },
          ],
          name: 'partipateEvt',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'Spender',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'Amount',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'address',
              name: 'contractAdr',
              type: 'address',
            },
          ],
          name: 'tknWithDraw',
          type: 'event',
        },
        {
          inputs: [],
          name: 'DEFAULT_ADMIN_ROLE',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'airDropAmt',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_conaddress',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_amt',
              type: 'uint256',
            },
          ],
          name: 'buyToken',
          outputs: [
            {
              internalType: 'bool',
              name: 'result',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_conaddress',
              type: 'address',
            },
          ],
          name: 'checkAllowance',
          outputs: [
            {
              internalType: 'uint256',
              name: 'allowanceAmt',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getAddrAllocation',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_addr',
              type: 'address',
            },
          ],
          name: 'getAddrParm',
          outputs: [
            {
              internalType: 'uint256',
              name: '_remainAllo',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: '_bought',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_conaddress',
              type: 'address',
            },
          ],
          name: 'getPrice',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_conaddress',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_amt',
              type: 'uint256',
            },
          ],
          name: 'getQuantity',
          outputs: [
            {
              internalType: 'uint256',
              name: '_Quan',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
          ],
          name: 'getRoleAdmin',
          outputs: [
            {
              internalType: 'bytes32',
              name: '',
              type: 'bytes32',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'grantRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'hasRole',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'homwereAdr',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'renounceRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'role',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'revokeRole',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_allocation',
              type: 'uint256',
            },
          ],
          name: 'setAddrAllocation',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_conaddress',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_price',
              type: 'uint256',
            },
          ],
          name: 'setPrice',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes4',
              name: 'interfaceId',
              type: 'bytes4',
            },
          ],
          name: 'supportsInterface',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'amt',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_contractAdr',
              type: 'address',
            },
          ],
          name: 'withdrawERC',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];
      privateContract = new web3.eth.Contract(privateAbi, smart_contract, {
        gasPrice: "30000000000"
      } );
     // console.log("private"+ privateContract);
      let quantity = Web3.utils.toWei(value);
      //console.log(quantity);
      // console.log(busd_contract);
      // console.log(smart_contract);
      privateContract.methods
        .getQuantity(busd_contract, quantity)
        .call(function (err, result) {
          if (!err) {
			if(networkId == 137){
				// console.log(Web3.utils.fromWei(result));
				setHme(result / 1000000000000);
			}else{
				setHme(result);
			}
          }
        });
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Please install Metamask!');
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      //  console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
      setText('Connected : ' + accounts[0].substr(0, 8) + '..');
    } catch (err) {
      console.log(err);
    }
  };

  const init = async () => {
    settype('usdt');
    let provider = window.ethereum;
    //console.log(provider);
    if (typeof provider !== 'undefined') {
      provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          selectedAccount = accounts[0];
          //console.log(`Selected account is ${selectedAccount}`);
        })
        .catch((err) => {
          console.log(err);
          return;
        });

      window.ethereum.on('accountsChanged', function (accounts) {
        selectedAccount = accounts[0];
        // console.log(`Selected account changed to ${selectedAccount}`);
      });
    

    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    // console.log("network :"+networkId);
    // if(networkId == 137){
    //   settype("usdt");
    // }
    console.log("t"+ type);
    if(type == 'busd' && networkId == 56){
      busd_contract = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
    }
    if(type == 'usdt' && networkId == 56){
        busd_contract = '0x55d398326f99059ff775485246999027b3197955'
    }
    if(type == 'busd' && networkId == 137){
      busd_contract = '0xa8d394fe7380b8ce6145d5f85e6ac22d4e91acde';
    }
    if(type == 'usdt' && networkId == 137){
        busd_contract = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
    }
    if(type == 'usdc' && networkId == 137){
      busd_contract = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
    }
    if(networkId == 56){
      smart_contract = "0x5796c08627d4c96db1943b11b4de8824eb953da4";
      hme_contract = "0x92964B2b5a4F708Dc622B8D613263f6811517Aa1";
      setoption('busd');
    }else{
      smart_contract = "0xc4919ae262e43b8bc0722ad29841ffe9a3ea1c67";
      hme_contract = "0xf8277513cef36CfC6e222e0F828b845472082E74";
      setoption('usdc');
    }
    const privateAbi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_homwereAdr',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'previousAdminRole',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'newAdminRole',
            type: 'bytes32',
          },
        ],
        name: 'RoleAdminChanged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'RoleGranted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'RoleRevoked',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'Buyer',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'Amount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'contractAdr',
            type: 'address',
          },
        ],
        name: 'partipateEvt',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'Spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'Amount',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'contractAdr',
            type: 'address',
          },
        ],
        name: 'tknWithDraw',
        type: 'event',
      },
      {
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'airDropAmt',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_amt',
            type: 'uint256',
          },
        ],
        name: 'buyToken',
        outputs: [
          {
            internalType: 'bool',
            name: 'result',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
        ],
        name: 'checkAllowance',
        outputs: [
          {
            internalType: 'uint256',
            name: 'allowanceAmt',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getAddrAllocation',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_addr',
            type: 'address',
          },
        ],
        name: 'getAddrParm',
        outputs: [
          {
            internalType: 'uint256',
            name: '_remainAllo',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_bought',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
        ],
        name: 'getPrice',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_amt',
            type: 'uint256',
          },
        ],
        name: 'getQuantity',
        outputs: [
          {
            internalType: 'uint256',
            name: '_Quan',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
        ],
        name: 'getRoleAdmin',
        outputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'hasRole',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'homwereAdr',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_allocation',
            type: 'uint256',
          },
        ],
        name: 'setAddrAllocation',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_conaddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_price',
            type: 'uint256',
          },
        ],
        name: 'setPrice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes4',
            name: 'interfaceId',
            type: 'bytes4',
          },
        ],
        name: 'supportsInterface',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'amt',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: '_contractAdr',
            type: 'address',
          },
        ],
        name: 'withdrawERC',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];
    const busdAbi = [
      {
        inputs: [
          {
            internalType: 'string',
            name: 'name_',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol_',
            type: 'string',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint8',
            name: '',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'subtractedValue',
            type: 'uint256',
          },
        ],
        name: 'decreaseAllowance',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'addedValue',
            type: 'uint256',
          },
        ],
        name: 'increaseAllowance',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    erc20Contract = new web3.eth.Contract(busdAbi, busd_contract);

    privateContract = new web3.eth.Contract(privateAbi, smart_contract, {
      gasPrice: "30000000000"
    } );

    hmeContract = new web3.eth.Contract(busdAbi, hme_contract);

    // console.log("hme contract "+hmeContract.methods);

    privateContract.methods
      .getPrice(busd_contract)
      .call(function (err, result) {
        if (!err) {
			if(networkId == 137){
				// console.log(Web3.utils.fromWei(result));
				setPrice(result / 1000000);
			}else{
				setPrice(Web3.utils.fromWei(result));
			}
        }
      });

    privateContract.methods.getAddrAllocation().call(function (err, result) {
      if (!err) {
        setmaxallocation(Web3.utils.fromWei(result));
      }
    });

    privateContract.methods
      .getAddrParm(selectedAccount)
      .call(function (err, result) {
        if (!err) {
          // console.log(result);
          let totalpur = Web3.utils.fromWei(result[1]);
          setTotalPurchased(totalpur);
          privateContract.methods
            .getAddrAllocation()
            .call(function (err, result) {
              if (!err) {
                let totalallo = Web3.utils.fromWei(result);
                let leftallo = totalallo - totalpur;
                setremainallocation(leftallo);
              }
            });
        }
      });

    erc20Contract.methods
      .balanceOf(selectedAccount)
      .call(function (err, result) {
        if (!err) {
          console.log("type os"+ type);
          console.log("result is"+ result);
          if(networkId == 137){
            setInnerBalance(result/1000000);
          }else{
            setInnerBalance(Web3.utils.fromWei(result));
          }
        }
      });

      hmeContract.methods.balanceOf(smart_contract).call(function (err, result) {
        if (!err) {
          let leftsupply = Web3.utils.fromWei(result);
          setMaxHme(25000000);
          setBuyHme(leftsupply);
          let getwidth = 100 - ((leftsupply / 25000000) * 100);
          setWidth(getwidth);
         
        }
      });

    isInitialized = true;
  }};



  const getOwnBalance = async () => {
    setbtntext('Purchasing...');
    setbtndisabled(true);
    if (!isInitialized) {
      await init();
    }
    let provider = window.ethereum;
    if (typeof provider !== 'undefined') {
      const web3 = new Web3(provider);
      let networkId = await web3.eth.net.getId();
      //console.log(networkId)
      if (
        networkId == 97 ||
        networkId == 80001 ||
        networkId == 56 ||
		networkId == 137
      ) {
        if (amount < 0.0008) {
          swal('Please enter Amount greater than 0.0008!');
         // alert('Please enter Amount greater than 0.055!');
          setbtntext('Purchase');
          setbtndisabled(false);
        } else {
          if(type == 'busd' && networkId == 56){
            busd_contract = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
          }
          if(type == 'usdt' && networkId == 56){
              busd_contract = '0x55d398326f99059ff775485246999027b3197955'
          }
          if(type == 'busd' && networkId == 137){
            busd_contract = '0xa8d394fe7380b8ce6145d5f85e6ac22d4e91acde';
          }
          if(type == 'usdt' && networkId == 137){
              busd_contract = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
          }
          if(type == 'usdc' && networkId == 137){
            busd_contract = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
          }
          if(networkId == 56){
            smart_contract = "0x5796c08627d4c96db1943b11b4de8824eb953da4";
            hme_contract = "0x92964B2b5a4F708Dc622B8D613263f6811517Aa1";
          }else{
            smart_contract = "0xc4919ae262e43b8bc0722ad29841ffe9a3ea1c67";
            hme_contract = "0xf8277513cef36CfC6e222e0F828b845472082E74";
          }
          erc20Contract.methods.allowance(selectedAccount,smart_contract)
            .call(function (err, res) {
              if (!err) {
                  console.log("busd contract is "+busd_contract);
                  console.log("checkallowance value is "+res);
                 if(networkId == 137){
                  var inv = amount*1000000;
                }else{
                  var inv = Web3.utils.toWei(amount);
                }
                 
                if (res > inv) {
                  directbuy();
                  console.log("my res: "+ res);
                }else{
                  myfunction();
                }
              } else {
                console.log("Error 2" + err);
                setbtntext('Purchase');
                setbtndisabled(false);
              }
            });

          const myfunction = async () => {
            if(networkId == 137){
              var inv = amount*1000000;
              var approveamount = Web3.utils.toWei("100000000"); 
            }else{
              var inv = Web3.utils.toWei(amount);
              var approveamount = Web3.utils.toWei("100000000"); 
            }
            console.log("smart contract is"+ smart_contract);
            await erc20Contract.methods
              .approve(smart_contract, approveamount)
              .send({ from: selectedAccount })
              .then((approve) => {
                if (approve.status == true) {
                  privateContract.methods
                    .checkAllowance(busd_contract)
                    .call(function (err, res) {
                      if (!err) {
                        return privateContract.methods
                          .buyToken(busd_contract, inv)
                          .send({ from: selectedAccount })
                          .then((balance) => {
                            if (balance.status == true) {
                              swal('Transaction Confirmed');
                              window.location.reload();
                            } else {
                              setbtntext('Purchase');
                              swal('Transaction Failed');
                              setbtndisabled(false);
                            }
                          })
                          .catch((err) => {
                            console.log("Error 1" + err);
                            // swal(err.stack);
                            setbtntext('Purchase');
                            setbtndisabled(false);
                            return;
                          });
                      }
                    });
                }else{
                  setbtntext('Purchase');
                  setbtndisabled(false);
                }
              })
              .catch((err) => {
                console.log(err);
                setbtndisabled(false);
                setbtntext('Purchase');
              });
          };

          const directbuy = async () => {
            if(networkId == 137){
              var inv = amount*1000000;
            }else{
              var inv = Web3.utils.toWei(amount);
            }
                  privateContract.methods
                    .checkAllowance(busd_contract)
                    .call(function (err, res) {
                      if (!err) {
                        return privateContract.methods
                          .buyToken(busd_contract, inv)
                          .send({ from: selectedAccount })
                          .then((balance) => {
                            if (balance.status === true) {
                              swal('Transaction Confirmed');
                              window.location.reload();
                            } else {
                              setbtntext('Purchase');
                              swal('Transaction Failed');
                              setbtndisabled(false);
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                            // swal(err.stack);
                            setbtntext('Purchase');
                            setbtndisabled(false);
                            return;
                          });
                      }
                    });
            
         
        }}
      } else {
        setbtntext('Purchase');
        setbtndisabled(false);
        swal('Please Select BSC or Polygon Network in your metamask!');
      }
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
    init();
  }, []);
  return (
    <div className='App'>
      {/* Nabar */}
      <div className='nav'>
        <div className='container'>
          <div className='logo'>
            <img src={logo} alt='' />
          </div>

          <div className='navHeader'>
            <h5 className='smallHeader d-none d-md-block'>
              HOMWERE - BSC NETWORK AND POLYGON NETWORK SUPPORTED ONLY
            </h5>
          </div>

          {/* connect wallet button */}
          <a
            href='javascript:void(0)'
            onClick={connectWalletHandler}
            className='customBtn'
          >
            {text}
          </a>
        </div>
      </div>

      {/* Hero */}
      <section id='sales' className='px-3 px-lg-0'>
        {/* Wrapper */}
        <div className='container'>
          <div className='row justify-content-around py-5'>
            <div className='col-12 text-center marginHeader'>
              <h1 className='smallHeader colorYellow'>HOMWERE PRESALE IDO</h1>
			  <h1 className='smallHeader colorYellow'>PHASE II</h1>
              <div className='row'>
                <div className='col-md-12 d-flex justify-content-center mx-auto mt-4'>
                  <img src={polygonLog} alt='' className='img-fluid mx-3' />
                  <img src={bscLog} alt='' className='img-fluid mx-3' />
                </div>
              </div>
            </div>

            {/* Left */}
            <div className='col-lg-6 bgDark my-3 my-lg-0'>
              <div className='row justify-content-between align-items-center'>
                {/* Header details */}
                <div className='col-lg-5 d-flex align-items-center my-3'>
                  <img src={logo} alt='logo' />
                  <div className='group ms-2'>
                    <h3 className='smallHeader'>HOMWERE</h3>
                    <div className='webAddress'>
                      <img src={webIcon} alt='' />
                      <a href='https://www.homwere.com'>www.homwere.com</a>
                    </div>
                  </div>
                </div>

                {/* Social Icons */}
                <div className='col-lg-5 my-3'>
                  <ul className='socialIcons'>
                    <li>
                      <img src={facebookIcon} alt='' />
                    </li>
                    <li>
                      <a
                        href='https://www.linkedin.com/company/homwere'
                        target='_blank'
                        rel='noreferrer noopener'
                      >
                        <img src={linkedinIcon} alt='' />
                      </a>
                    </li>
                    <li>
                      <a
                        href='https://www.twitter.com/homwere_'
                        target='_blank'
                        rel='noreferrer noopener'
                      >
                        <img src={twitterIcon} alt='' />
                      </a>
                    </li>
                    <li>
                      <a
                        href='https://youtube.com/channel/UCN8Y_DGxVf4Nq7lq4x5EcpA'
                        target='_blank'
                        rel='noreferrer noopener'
                      >
                        <img src={youtubeIcon} alt='' />
                      </a>
                    </li>
                    <li>
                      <a
                        href='https://t.me/homwereupdates'
                        target='_blank'
                        rel='noreferrer noopener'
                      >
                        <img src={telegramIcon} alt='' />
                      </a>
                    </li>
                    <li>
                      <a
                        href='https://www.medium.com/homwere'
                        target='_blank'
                        rel='noreferrer noopener'
                      >
                        <img src={mediumIcon} alt='' />
                      </a>
                    </li>
                    <li>
                      <a
                        href='https://www.github.com/homwere'
                        target='_blank'
                        rel='noreferrer noopener'
                      >
                        <img src={githubIcon} alt='' />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* divider */}
              <div className='row spacer'>
                <div className='col-12'>
                  <div className='divider'></div>
                </div>
              </div>

              <div className='row spacer'>
                <div className='col-12'>
                  <p className='bodyCopy'>
                    We introduce a new way to build, design and access your
                    favourite Apps and Ideas on an Integrated Development
                    Environment(IDE). All your ideas built on our IDE will have
                    all blockchain functionalities and will propel
                    interoperability between Decentralized and Centralized
                    Modules. Our vision products are built based on the problems
                    encountered on the decentralized and centralized ecosystems.
                    Homwere will prove a new way to building applications with
                    blockchain functionalities available. You can now create and
                    demonstrate your ideas with a secure, fast and cheap IDE
                    without going through the trouble to thinking about
                    monetization as we already implement that for you on your
                    Applications also available on our Exchange.
                  </p>
                </div>
              </div>

              <div className='row spacer'>
                <div className='col-12'>
                  <h3 className='smallHeader'>Sales details</h3>

                  <div className='row'>
                    <div className='col-12 d-flex justify-content-between'>
                      <p className='bodyCopy'>IDO Access:</p>
                      <p className='bodyCopy value'>Members & Guest</p>
                    </div>
                    <div className='col-12 d-flex justify-content-between flex-wrap'>
                      <p className='bodyCopy'>Token Distribution:</p>
                      <p className='bodyCopy value'>
                        50% on BSC & 50% on Polygon
                      </p>
                    </div>
                    <div className='col-12 d-flex justify-content-between'>
                      <p className='bodyCopy'>Token Price:</p>
                      <p className='bodyCopy value'>{price} {type.toUpperCase()}</p>
                    </div>
                    <div className='col-12 d-flex justify-content-between'>
                      <p className='bodyCopy'>Sales Pool size:</p>
                      <p className='bodyCopy value'>50,000,000</p>
                    </div>
                    <div className='col-12 d-flex justify-content-between'>
                      <p className='bodyCopy'>Symbol:</p>
                      <p className='bodyCopy value'>HME</p>
                    </div>
                    <div className='col-12 d-flex justify-content-between'>
                      <p className='bodyCopy'>Total Supply:</p>
                      <p className='bodyCopy value'>450,000,000</p>
                    </div>
                    <div className='col-12 d-flex justify-content-between'>
                      <p className='bodyCopy'>Softcap/Hardcap:</p>
                      <p className='bodyCopy value'>1000K/2500K</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* divider */}
              <div className='row spacer'>
                <div className='col-12'>
                  <div className='divider'></div>
                </div>
              </div>

              <div className='row spacer'>
                <div className='col-12'>
                  <div className='webAddress'>
                    <img src={helpIcon} alt='' />
                    <span className='bodyCopy ms-2'>
                      View full overview and details{' '}
                      <a
                        href='https://drive.google.com/file/d/19MtDPSwbXhIWaxpgTngY0yyZ74GfPGqX/view'
                        target='_blank'
                        rel='noreferrer noopener'
                      >
                        here
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Left */}

            {/* RIght */}
            <div className='col-lg-5 bgDark my-3 my-lg-0'>
              {/* header */}
              <div className='row d-flex justify-content-between align-items-center'>
                <div className='col-lg-6 my-3'>
                  <h3 className='smallHeader'>This sale will end in:</h3>
                </div>
                <div className='col-lg-5 my-3 d-flex justify-content-end'>
                  <h3 className='smallHeader colorGreen'>Ongoing</h3>
                </div>
              </div>

              {/* Timer */}
              <div className='row justify-content-between my-3'>
                <div className='col-3'>
                  <div className='timer' id='day'></div>
                </div>
                <div className='col-3'>
                  <div className='timer' id='hour'></div>
                </div>
                <div className='col-3'>
                  <div className='timer' id='minute'></div>
                </div>
                <div className='col-3'>
                  <div className='timer' id='second'></div>
                </div>
              </div>

              {/* after timer */}
              <div className='row'>
                <div className='col-12 d-flex justify-content-between'>
                  <p className='bodyCopy'>Wallet Balance:</p>
                  <p className='bodyCopy value'>{innerbalance} {type.toUpperCase()}</p>
                </div>
                <div className='col-12 d-flex justify-content-between flex-wrap'>
                  <p className='bodyCopy'>Max Allocation:</p>
                  <p className='bodyCopy value'>{remainallocation} HME</p>
                </div>
                <div className='col-12 d-flex justify-content-between'>
                  <p className='bodyCopy'>Purchased:</p>
                  <p className='bodyCopy value'>{totalpurchased} HME</p>
                </div>
              </div>

              {/* divider */}
              <div className='row spacer'>
                <div className='col-12'>
                  <div className='divider'></div>
                </div>
              </div>

              <div className='row'>
                <div className='col-12 d-flex justify-content-between'>
                  <p className='smallHeader'>Swap Ratio:</p>
                  <p className='smallHeader value'>1 HME = {price} {type.toUpperCase()}</p>
                </div>
              </div>

              {/* Form */}
              <form action=''>
                {/* Input for From */}
                <div className='form-group my-3'>
                  <label
                    htmlFor='fromInput'
                    className='d-flex justify-content-between'
                  >
                    <span className='bodyCopy'>From</span>
                    <span className='bodyCopy'>Allocation:</span>
                  </label>
                  <div className='inputGroup'>
                    <input
                      type='number'
                      className='form-control form-control-sm amount'
                      placeholder='0'
                      value={amount}
                      onChange={(e) => {
                        getHME(e.target.value);
                      }}
                    />
                    <select
                      name=''
                      id=''
                      className='floatInput type'
                      value={type}
                      onChange={(e) => {
                        changeType(e.target.value);
                      }}
                    >
                      <option value='usdt' selected>
                        USDT
                      </option>
                      <option value={option}>
                        {option.toUpperCase()}
                      </option>
                     

                      {/*<option value='0xFd4BDA8272b866647fEaea2DC5FC09F9e524872A'>BUSD</option> */}
                    </select>
                  </div>
                </div>

                {/* Input for To */}
                <div className='col-12 text-center'>
                  <img src={arrowDownIcon} alt='' />
                </div>
                {/* Input for To */}
                <div className='form-group my-3'>
                  <label
                    htmlFor='toInput'
                    className='d-flex justify-content-between'
                  >
                    <span className='bodyCopy'>To</span>
                    <span className='bodyCopy'>Max Allocation:</span>
                  </label>
                  <div className='inputGroup'>
                    <input
                      type='text'
                      className='form-control form-control-sm'
                      placeholder='0'
                      value={hme}
                    />
                  </div>
                </div>

                {/* submit button */}
                <button
                  className='formBtn active'
                  type='button'
                  onClick={getOwnBalance} disabled = {btndisabled}
                >
                  {btntext}
                </button>
              </form>

              {/* divider */}
              <div className='row spacer'>
                <div className='col-12'>
                  <div className='divider'></div>
                </div>
              </div>

              <div className='row'>
                <div className='col-12 d-flex justify-content-between'>
                  <p className='smallHeader'>Progress</p>
                  <p className='smallHeader value'>{buyhme} HME</p>
                </div>

                <div className='col-12'>
                  <div class='progress'>
                    <div
                      class='progress-bar'
                      role='progressbar'
                      aria-valuenow= {buyhme}
                      aria-valuemin='0'
                      aria-valuemax={maxhme}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Right */}
          </div>
        </div>
        {/* End of Container */}
      </section>

      <footer>
        <div className='container'>
          <div className='row d-flex justify-content-between'>
            <div className='col-lg-3'>
              <img src={logo} alt='' />
              <p className='bodyCopy mt-3'>
                Build all your favourite ideas on Apps that has access to all
                blockchain functionalities, Interoperability between
                Decentralized and Centralized Modules with DApps, CApps & WApps
                <br />
                <br />
                <a href='mailto:official@homwere.com' className='mailLink'>
                  Email: official@homwere.com
                </a>
                <br />
                <br />
                Homwere © 2022
              </p>
            </div>
            {/* Company */}
            <div className='col-lg-2'>
              <h3 className='smallHeader colorYellow'>Company</h3>
              <ul>
                <li>
                  <a
                    href='https://drive.google.com/file/d/19MtDPSwbXhIWaxpgTngY0yyZ74GfPGqX/view'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    View Whitepaper
                  </a>
                </li>
                <li>
                  <a href='https://polygonscan.com/token/0xf8277513cef36cfc6e222e0f828b845472082e74' target='_blank' rel='noreferrer noopener'>
                    Polygon Contract
                  </a>
                </li>
                <li>
                  <a href='https://bscscan.com/token/0x92964b2b5a4f708dc622b8d613263f6811517aa1' target='_blank' rel='noreferrer noopener'>
                    Bsc Contract
                  </a>
                </li>
                <li>
                  <a href='#' target='_blank' rel='noreferrer noopener'>
                    Mobile App
                  </a>
                </li>
                <li>
                  <a href='#' target='_blank' rel='noreferrer noopener'>
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className='col-lg-2'>
              <h3 className='smallHeader colorYellow'>Support</h3>
              <ul>
                <li>
                  <a href='mailto:official@homwere.com' target='_blank' rel='noreferrer noopener'>
                    Contact & Support
                  </a>
                </li>
                <li>
                  <a href='mailto:official@homwere.com' target='_blank' rel='noreferrer noopener'>
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal*/}
            <div className='col-lg-2'>
              <h3 className='smallHeader colorYellow'>Legal</h3>
              <ul>
                <li>
                  <a href='#' target='_blank' rel='noreferrer noopener'>
                    Terms & Condition
                  </a>
                </li>
                <li>
                  <a href='#' target='_blank' rel='noreferrer noopener'>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* divider */}
          <div className='row spacer'>
            <div className='col-12'>
              <div className='divider'></div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-5 mx-auto my-3'>
              <ul className='socialIcons'>
                <li>
                  <img src={facebookIcon} alt='' />
                </li>
                <li>
                  <a
                    href='https://www.linkedin.com/company/homwere'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    <img src={linkedinIcon} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.twitter.com/homwere_'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    <img src={twitterIcon} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://youtube.com/channel/UCN8Y_DGxVf4Nq7lq4x5EcpA'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    <img src={youtubeIcon} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://t.me/homwereupdates'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    <img src={telegramIcon} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.medium.com/homwere'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    <img src={mediumIcon} alt='' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.github.com/homwere'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    <img src={githubIcon} alt='' />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
