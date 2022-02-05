import React from "react";
import {ethers} from "ethers";
import axios from "axios";
import { Routes, Route, BrowserRouter } from 'react-router-dom'

// HTML render js files:

import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Transfer } from "./Transfer";
import { Loading } from "./Loading";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { GetPlayerInfo} from "./GetPlayerInfo";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme.js"
import FightClub from "./FightClub";
import {Register} from "./Register.js";
import {Fail} from "./Fail.js";

const addresses = require("../contracts/addresses.json")
const TokenArtifact = require("../contracts/MockToken.json")

// send to local ROUTE first
const ROUTE = "http://localhost:8000"
const REDIS = "http://localhost:3000"

const HARDHAT_NETWORK_ID = '80001';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const TEST_SC_ADDRESS = addresses.multiPayAddress;

export default class Dapp extends React.Component {
    constructor(props) {
        super(props);

        this.initState = {
            error: false,
            showBuy: true,
            userAddress: undefined,
            numUsers: 0, 

            // retrieved from getPlayerInfo
            userHash: undefined,
            userName: undefined,
            userFixedEntranceFee: 10,
            

            // token data
            tokenData: undefined,
            balance: undefined, 

            // Game components loaded from redis recordbook server
            // onlineGames:
            /*
                {
                    game-type: Minecraft,
                    server-uid: Bargo1, 
                    server-status: online,
                    players-current: 193, 
                    players-cap: 500,
                    // UID list of players
                }
            */

            
            // ID of sent transaction
            sentTx: undefined,
            txError: undefined,
            nwError: undefined,
        };

        this.state = this.initState;
    }

    // return info about servers
    componentDidMount(){
        axios.get(REDIS + "/get/information",
        ).then((resp)=>{
            console.log(resp.data)
            console.log(resp.status)
            const users = resp.data.users;
            this.setState({numUsers: users})
        })
    }

    componentDidUpdate(){
        console.log(this.state)
    }

    render(){
        // check if Ethereum wallet has been injected to window. If not present,
        // prompt user to download MetaMask
        if (window.ethereum === undefined){
            <FightClub/>
            return <NoWalletDetected />;
        }

        // connect user wallet address
        if (!this.state.userAddress) {
            return (
                <div>
                <FightClub/>
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.nwError}
                    dismiss={()=>this._dismissNetworkError()}
                    />
                </div>
            );
        }
        
    

        // TODO:
        // show boxes with available servers (get information from redis 
        // server info record RAM-databse) and respective players in it. 
        // user types-in their name: react does insta-search for it on 
        // retrieved array of playerList from redis server
        // user can thus confirm they are sending transaction to correct
        // game-server
        // )

        
        // mjsong dev 14:
        // get token data  + balance of user on token SC
        if (!this.state.numUsers){
            return (
                <div>
                <FightClub/>
                <Loading />
                </div>
            )
        }

        // retrieve player INFO before payment
        if (!this.state.userHash){
            return (
                <div>
                <FightClub/>
                <GetPlayerInfo
                    getPlayerInfo={(hash, name)=> {
                        this.setState({
                             userHash: hash,
                             userName: name
                            });
                    }} 
                />
                </div>
            )
        }

        // load these beforehand... 

        // load application
        if (this.state.error){
            {console.log('bro')}
            return(
            <div>
                <FightClub/>
                <Fail
                    fail={()=> {
                        this.setState({error: false})
                    }}/>
            </div>
            )
        }
     
        return (
            <div className="container p-4">
                <FightClub/>
                <hr />

                <div className="row">
                <div className="col-12">
                    {/* 
                    Sending a transaction isn't an immidiate action. You have to wait
                    for it to be mined.
                    If we are waiting for one, we show a message here.
                    */}
                    {this.state.sentTx && (
                    <WaitingForTransactionMessage txHash={this.state.sentTx} />
                    )}

                    {/* 
                    Sending a transaction can fail in multiple ways. 
                    If that happened, we show a message here.
                    */}
                    {this.state.txError && (
                    <TransactionErrorMessage
                        message={this._getRpcErrorMessage(this.state.txError)}
                        dismiss={() => this._dismissTransactionError()}
                    />
                    )}

                    {this.state.txSuccess && (
                        <div>
                            Transaction Success!
                        </div>
                    )}
                </div>
                </div>

                <div className="row">
                <div className="col-12">
                    <div role="presentation" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                     }}>
                         
                         <ThemeProvider theme={theme}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                            underline="hover"
                            sx={{ display: 'flex', alignItems: 'center' }}
                            color="primary"
                            >
                            <AccountCircleIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Users in Pot: {this.state.numUsers * 1}
                            </Link>
                            <Link
                            underline="hover"
                            sx={{ display: 'flex', alignItems: 'center' }}
                            color="primary"
                            >
                            <FavoriteBorderIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Total Pot: {this.state.numUsers * this.state.userFixedEntranceFee}
                            </Link>
                        </Breadcrumbs>
                        </ThemeProvider>
                    </div>
                </div>
                </div>

                <div className="row">
                <div className="col-12">
                         <div role="presentation" style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                         }}>
                             
                             <ThemeProvider theme={theme}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link
                                underline="hover"
                                sx={{ display: 'flex', alignItems: 'center' }}
                                color="primary"
                                >
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                 Server Status: Online
                                </Link>
                            </Breadcrumbs>
                            </ThemeProvider>
                        </div>
                </div>
                </div>

                

                <div className="row">
                <div className="col-12">
                    <Transfer
                        transfer={() =>{
                            this._transfer()
                        }
                        }
                    />
                </div>
                </div>


                <div className="row">
                <div className="col-12">
                    <Register
                        register={() =>{
                            this._register()
                        }
                        }
                    />
                </div>
                </div>


            </div>
    
        )

        // add a new componenet above for users who are already registered

    }

    componentWillUnmount(){
        this._stopPollingData();
    }

    async _connectWallet(){
        // connect to user's wallet
        const [userAddress] = await window.ethereum.enable();

        // initialize the application
        // return if network error
        if (!this._checkNetwork()){
            return;
        }
        this._initialize(userAddress);

        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData();
            // `accountsChanged` event can be triggered with an undefined newAddress.
            // This happens when the user removes the Dapp from the "Connected
            // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
            // To avoid errors, we reset the dapp state 
            if (newAddress === undefined) {
              return this._resetState();
            }
            
            this._initialize(newAddress);
          });

           // We reset the dapp state if the network is changed
        window.ethereum.on("networkChanged", ([networkId]) => {
            this._stopPollingData();
            this._resetState();
        });
        }

    _initialize(address){
        // method to initialize dapp

        // store user's address in component state


        this.setState({userAddress:address});

        this._initializeEthers();
        this._getTokenData();
        this._startPollingData();
    }

    _startPollingData(){
        this._pollDataInternval = setInterval(() => this._updateBalance(), 1000);

        this._updateBalance();
    }

    _stopPollingData(){
        clearInterval(this._pollDataInternval);
        this._pollDataInterval = undefined;
    }

    async _initializeEthers(){
        this._provider = new ethers.providers.Web3Provider(window.ethereum);

        this._token = new ethers.Contract(
            // TODO: add address of deployed contract in JSON file and then export it
            addresses.mockTokenAddress,
            TokenArtifact.abi,
            this._provider.getSigner(0)
        )
    }

    async _getTokenData(){
        const name = await this._token.name();
        const symbol = await this._token.symbol();

        this.setState({tokenData: {name, symbol}});
    }

    async _updateBalance(){
        const balance = await this._token.balanceOf(this.state.userAddress);
        this.setState({balance: balance});
    }

    /*
    _getPlayerInfo(gamerID){
        // assume serverUID known
        // later, automatically set serverUID when player inputs playerName 
        const serverUID = this.state.servers[0].serverUID;
        return axios.post("http://localhost:3000/get/playerinfo",
            {
            player: gamerID,
            serverUID: serverUID,
            } 
        )
    }
    */

    // register new User to trash club
    _informUserPurchase(txHash, userPubKey, userHash, userName){
        const data = {
             txHash: txHash,
            pubKey: userPubKey, 
            hash: userHash,
            userName: userName
        }
        return axios.post(ROUTE+"/route/newuser", {
            // axios automatically serializes json object to string
            data: data,
        })
    }


    async _register(){
        const data = {
            hash: this.state.userHash,
            userName: this.state.userName
        }
        const registerData = await axios.post(ROUTE+"/route/user",{
            data: data,
        })
        console.log('response from redis for /register/user', registerData)
        const registerSuccess = registerData.data.success;

        if (registerSuccess){

        } else {
            console.log("fail");
            this.setState({error:true});
        }
    }

    // send transaction
    async _transfer(){

        console.log(this.state)
        if (this.state.userFixedEntranceFee){
            try {
                /*
                const signer = this._provider.getSigner(0); 
                const tx = await signer.sendTransaction({
                    to: TEST_SC_ADDRESS,
                    value: ethers.utils.parseEther(totalFee.toString()),
                })
                */

                this._dismissTransactionError();
                const tx = await this._token.transfer(addresses.multiPayAddress, ethers.utils.parseEther(this.state.userFixedEntranceFee.toString()));
                // if tx fails, save its hash in Dapp's state

                // send tx, and save its hash in Dapp's state. Waiting for it to be mined
                this.setState({sendTx: tx.hash}, function(){
                    console.log("setState complete,", this.state)
                });

                const receipt = await tx.wait();
                
                // if receipt contains status 0, error
                if (receipt.status === 0){
                    // throw generic error because don't know what made tx fail
                    throw new Error("tx failed")
                }
                
                // tx was successful!
                // TODO: send to redis user-book server the tx success msg
                // if informPlayerPurcahse fails, poll till suceeds... add later
                console.log('tx success... waiting for redis server resp')
                const userPubKey = this.state.userAddress;
                const txHash = tx.hash;
                const trashHash = this.state.userHash;
                const userName = this.state.userName;
                const resp = await this._informUserPurchase(
                    txHash,
                    userPubKey,
                    trashHash,
                    userName,
                    );
                // works!
                console.log('reply from redis server to transaciton confirm:', resp)
            } catch (error) {
                // if error because user rejected tx, do nothing
                if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                    return;
                }
                // log errors
                console.error(error)
                // useful for debugging
                this.setState({txError: error})
            } finally {
                // not sending tx anymore, clear state
                this.setState({sentTx: undefined});
            }
        }

       
    }

    _dismissTransactionError(){
        this.setState({txError: undefined});
    }

    _dismissNetworkError(){
        this.setState({ nwError: undefined});
    }
    
    // return RPC error into human readable format
    _getRpceErrorMessage(error){
        if (error.data){
            return error.data.message;
        } 

        return error.message;
    }

    _resetState(){
        this.setState(this.initState);
    }

    // checks if metamask selected network is localhost:8545
    _checkNetwork(){
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID){
            return true;
        }

        this.setState({nwError: "connect metamask to localhost:8545"});

        return false;
    }

}

 