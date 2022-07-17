import React from 'react';
import background from "./background.png";

const exports = {};


const divStyle = {
  width: '100%',
  height: '100px',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover'   
};

/*
style={{backgroundImage: `url(${background})`, backgroundPosition: 'center',
backgroundSize: 'cover',
backgroundRepeat: 'no-repeat',
width: '100vw',
height: '100vh'}} */



exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="App" >
        <header style={divStyle}  className="App-header" id="root" >
          {content}
        </header>
      </div>
    );
  }
}

exports.ConnectAccount = class extends React.Component {
  render() {
    return (
      <div>
        Please wait while we connect to your account.
        If this takes more than a few seconds, there may be something wrong.
      </div>
    )
  }
}



exports.MintNFT = class extends React.Component {
  render() {
    const {acc, bal, NFT_list, nftindex, standardUnit, parent} = this.props;
    return (
      <div>
        <h3>Foundation for National Parks & Wildlife Genesis Mint</h3>
        <br /> 
        Wallet Address: <p style={{ fontSize: 20 }}> {acc.networkAccount.addr} </p>
        Balance: {bal} {standardUnit}
        <hr />
        <img src = {NFT_list[nftindex].assetMetadatajson.image} height={400} width={400}/>
        <br />
        NFT Price: {NFT_list[nftindex].price/1000000} {standardUnit}
        <br />
        <p style={{ fontSize: 20 }}>The first genesis FNPW CryptoPark NFTs, on the Algorand blockchain. 
        The genesis king represents a thank you  <br /> for your early contribution, 
        and grants the holder whitelist access to the main release and more benefits TBA.</p>
        
        <button style = {{backgroundColor: 'Green',color:"White" }}
           onClick={() => parent.selectMintNFT()}>Mint NFT</button>
        <br /> 
        <br /> 
      </div>
    );
  }
}


exports.ConnectWallet = class extends React.Component {
  render() {
    const {parent} = this.props;
    return (
      <div >
        <br />
        <h3>Welcome to the Foundation for National Parks & Wildlife Algorand Genesis Edition</h3>
        <br /><br /><br /><br /><br /><br /><br />
        <p>
        <h2>Connect your Algorand wallet to explore more!</h2>
        <br /><br />
        </p>
        <p>
          <button style = {{backgroundColor: 'Green',color:"White" }}
            onClick={() => parent.connectWallet()}
          >Connect Wallet</button>
          <br /> <br /><br /><br /><br /><br /><br /><br /><br /><br />
        </p>
      </div>
    );
  }
}



exports.nftSoldout = class extends React.Component {
  render() {
    const {parent} = this.props;
    return (
      <div >
        <br />
        <h3>Welcome to the Foundation for National Parks & Wildlife Algorand Genesis Edition</h3>
        <br /><br /><br /><br /><br /><br /><br />
        <p>
        <h2>Sorry, all NFTs have been sold out.</h2>
        <br /><br />
        </p>
        <p>
          <br /> <br /><br /><br /><br /><br /><br /><br /><br /><br />
        </p>
      </div>
    );
  }
}


exports.transactionCompleted = class extends React.Component {
  render() {
    const {acc, standardUnit, nftId,parent} = this.props;
    return (
      <div>
        <h3>Foundation for National Parks & Wildlife Genesis Mint</h3>
        <br />
        
        <br />
        <h3>Transaction has been Completed!</h3>
        <br />
        <p style={{ fontSize: 23 }}> You are now the owner of an Algorand CryptoPark Genesis King NFT, 
        with AssetID: {nftId}   <br />
        Your purchase was donated entirely to charity, helping our Australian environment. <br /> <br />
        For more information on the Foundation for National Parks & Wildlife, click <a href={"https://fnpw.org.au"}>here</a>. </p>
        <br />
        <br />
        <br />
        <br />
        Please Click <a href={"https://arc3.xyz/nft/"+nftId}> here </a> to view the metadata and content of the NFT Genesis King 
        <br /> 
        <br /> 
        <br />
        <button style = {{backgroundColor: 'Green',color:"White" }}
           onClick={() => parent.mintAnotherNFT()}>Mint Another NFT</button>
        <br /> 
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}



export default exports;