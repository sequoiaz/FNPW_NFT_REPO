import algosdk from 'algosdk';
import CryptoJS from 'crypto-js';
//import dotenv from 'dotenv';
//dotenv.config();



export const indexNFTlist = async(address) => {

  const token = { 'X-API-Key': process.env.REACT_APP_NODE_TOKEN};
  const server = process.env.REACT_APP_INDEX_SERVER;
  const port = "";


  const indexerClient = new algosdk.Indexer(token, server, port);
  
  let limit = 1000;
  let response = await indexerClient.lookupAccountCreatedAssets(address).limit(limit).do();

  //console.log(response.assets.length); 

  /*
  let response1 = await indexerClient.lookupAccountCreatedAssets(address).limit(limit).nextToken(response['next-token']).do();
  console.log(response1.assets.length); 
  */
  //console.log(JSON.stringify(response, undefined, 2));

  return response.assets.length;

}


 export const createAsset = async(creatorAccount, assetMetadatajson, assetMetadatajson_url) => {
    const token = { 'X-API-Key': process.env.REACT_APP_NODE_TOKEN};
    const server = process.env.REACT_APP_SERVER;
    const port = "";
    const client = new algosdk.Algodv2(token, server, port);
    let params = await client.getTransactionParams().do();


    let note = algosdk.encodeObj(assetMetadatajson.description);
    let creatorAddress = creatorAccount.addr;
    
    let defaultFrozen = false;
    let decimals = 0;
    let totalIssuance = 1;
    let unitName = assetMetadatajson.name;
    let assetName = "NFT-" + assetMetadatajson.name + "@arc3";
    let assetURL = assetMetadatajson_url + "#arc3";
    let manager = creatorAddress;
    let reserve = undefined;
    let freeze = undefined;
    let clawback = undefined;

    // the SHA-256 digest of the JSON Metadata file as a 32-byte 
   let hash   = CryptoJS.SHA256(JSON.stringify(assetMetadatajson));
   let buffer = Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex');
   let assetMetadataHash  = new Uint8Array(buffer);

    let createTxn = algosdk.makeAssetCreateTxnWithSuggestedParams(creatorAddress, note,
        totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
       clawback, unitName, assetName, assetURL, assetMetadataHash, params);
    let rawSignedCreateTxn = createTxn.signTxn(creatorAccount.sk);
    

    let createTx = (await client.sendRawTransaction(rawSignedCreateTxn).do());
    await waitForConfirmation(client, createTx.txId);
    
    // Get the new asset's information from the creator account
    let ptx = await client.pendingTransactionInformation(createTx.txId).do();
   
    console.log(ptx);
    let assetId = ptx["asset-index"];
    
    return {id: assetId, name: assetName, sym: unitName};
  }




  
  const waitForConfirmation = async function (algodclient, txId) {
    let response = await algodclient.status().do();
    let lastround = response["last-round"];
    while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            //Got the completed Transaction
            console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
            break;
        }
        lastround++;
        await algodclient.statusAfterBlock(lastround).do();
    }
  };