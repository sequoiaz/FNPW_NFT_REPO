import React from 'react';
import AppViews from './views/AppViews.js';
import {renderDOM, renderView} from './views/render.js';
import './views/index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
import { createAsset, indexNFTlist } from './NFT_api.js';
import { NFT_list} from './NFT_list.js';
//import dotenv from 'dotenv';
//dotenv.config();

//import MyAlgoConnect from '@randlabs/myalgo-connect';

//import {tableDemo}  from './dbconnect.js';

const reach = loadStdlib(process.env.REACT_APP_CONNECTOR);


import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';
reach.setWalletFallback(reach.walletFallback({
  providerEnv: 'TestNet', MyAlgoConnect }));


/*
reach.setWalletFallback(reach.walletFallback({
  providerEnv: {
    ALGO_TOKEN: '',
    ALGO_SERVER: "https://testnet-api.algonode.cloud",
    ALGO_PORT: '',
    ALGO_INDEXER_TOKEN: '',
    ALGO_INDEXER_SERVER: "https://testnet-idx.algonode.cloud",
    ALGO_INDEXER_PORT: '',
  }, MyAlgoConnect }));
*/


const {standardUnit} = reach;
const defaults = {NFT_list, standardUnit};
let creatoraccount = null;
   

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'ConnectAccount', ...defaults};
  }
  async componentDidMount() {
 
    if (creatoraccount == null){
      //let creatoraccount = await reach.newAccountFromMnemonic(creator_mn);
      let creatoraccount = await reach.newAccountFromMnemonic(process.env.REACT_APP_CREATOR_MNEMONIC);  


       //const serverdata = this.callBackendAPI_CreatorAcc();
      
      //console.log(creatoraccount.networkAccount.addr);
      //const indexresult = await indexNFTlist(creatoraccount.networkAccount.addr);
      //console.log(indexresult);


      this.setState({creatoraccount});
   }

  //  const table = tableDemo();
    this.setState({view: 'ConnectWallet'});  
  
  }
  
  async callBackendAPI_CreatorAcc() {
    const response = await fetch('http://localhost:3001/api');
      console.log(response);
      const body = await response.json();
      console.log(body);

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };





  async connectWallet() {

    const acc = await reach.getDefaultAccount();
    /*const myAlgoWallet = new MyAlgoConnect();
    const acc = await myAlgoWallet.connect();*/
    const creatoracc = this.state.creatoraccount;

   
    let nftindex = await indexNFTlist(creatoracc.networkAccount.addr);

    
    if (nftindex < this.state.NFT_list.length ){

      const balAtomic = await reach.balanceOf(acc);
      const bal = reach.formatCurrency(balAtomic, 4);
      this.setState({acc, bal, nftindex});
      this.setState({view: 'MintNFT'});  

    }else{
      this.setState({view: 'nftSoldout'}); 
    }

  }


  async mintAnotherNFT() {

    const owneracc = this.state.acc;
    const creatoracc = this.state.creatoraccount;

   
    let nftindex = await indexNFTlist(creatoracc.networkAccount.addr);


    if (nftindex < this.state.NFT_list.length ){

      const balAtomic = await reach.balanceOf(owneracc);
      const bal = reach.formatCurrency(balAtomic, 4);
      this.setState({bal, nftindex});
      this.setState({view: 'MintNFT'});   

    }else{
      this.setState({view: 'nftSoldout'}); 
    }


  }


  async selectMintNFT() { 
 
    const owneracc = this.state.acc;
    const creatoracc = this.state.creatoraccount;
    const ownerbal = this.state.bal;

    let nftindex = await indexNFTlist(creatoracc.networkAccount.addr);
   

    if (nftindex < this.state.NFT_list.length && ownerbal >= this.state.NFT_list[nftindex].price){

      const nftDat = await createAsset(creatoracc.networkAccount, this.state.NFT_list[nftindex].assetMetadatajson, this.state.NFT_list[nftindex].assetMetadatajson_url);
      
     
      const nft = {...nftDat, id: reach.bigNumberify(nftDat.id)};
      console.log(nftDat);
      console.log(`nft id: ${nft.id.toNumber()} has been minted on Algorand blockchain and will be sold for ${this.state.NFT_list[nftindex].price/1000000} Algo`);
  
  
  
      const creatorinteract = {
        tokenId: async() => nft.id,
        initialPrice: async() => this.state.NFT_list[nftindex].price,
        ready: async() => console.log(`NFT tranction has been completed.`)
      }
  
      const ownerinteract = {
        newOwner: async() => { owneracc.tokenAccept(nft.id);
            return owneracc.networkAccount.addr},
       
        showOwner:async() => console.log(`The NFT has a new owner: ${owneracc.networkAccount.addr}`)
      }
  
  
      const creatorctc = creatoracc.contract(backend);
      const ownerctc = owneracc.contract(backend, creatorctc.getInfo());
  
      creatorctc.getInfo().then(async (info) => {
          console.log(`contract id: ${JSON.stringify(info.toNumber())}`);
          });
      
  
         try{
  
          await Promise.all([
      
              backend.Creator(creatorctc, creatorinteract),
              backend.Owner(ownerctc, ownerinteract),
      
              ]);
           }catch(error){
               console.log(error)
           }
  
        const nftId = nft.id.toNumber();
       // const purchased_assetMetadatajson = this.state.NFT_list[nftindex].assetMetadatajson;
        
        this.setState({nftId, NFT_list:this.state.NFT_list});   
        this.setState({view: 'transactionCompleted'}); 
      

    }else{

      this.setState({view: 'nftSoldout'}); 

    }


  }
 
  
  render() { return renderView(this, AppViews); }
}

renderDOM(<App />);
