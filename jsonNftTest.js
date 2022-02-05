//This is a DEMO of a JSON File being sent as an NFT, Received and Accessed
//We Will use HEDERA as the blockchain, going to create, mint, associate and transfer an NFT
//The NFT file (in this case the sample-json.json will be stored in web3.storage)
//The json file name is hardcoded and not used as a variable for demo porpuses. 
//Feel free to use and do whatever you want with the code.

import { transferNFT, getBalance } from "./hederaWallet.js";
import { associateTokenWallet, createNFTToken, mintNFTToken } from "./hederaToken.js";
import { fetchFile } from "./web3NFTStorage.js";
import {} from 'dotenv/config';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrivateKey, AccountId } = require("@hashgraph/sdk");


console.clear();

async function main() {

    //Variables to use as the NFT Token - Name and Symbol
    var tokenName = "Json As NFT";
    var tokenSymbol = "JSON";

    //ENV Variables used to associate and transfer the NFTs
    const userId = AccountId.fromString(process.env.RECEIVER_ID);
    const userKey = PrivateKey.fromString(process.env.RECEIVER_PVKEY) ;
    const supplyKey = PrivateKey.generate();
    
    //Creates the NFT then prints the ID
    var createNftTx = await createNFTToken(tokenName, tokenSymbol, supplyKey)
    console.log('NFT Id: ', createNftTx.toString());

    //Mints the NFT - Returns the Serial and the CID (web3.storage CID for the json file)
    //The CID only needs to be returned for this example/demo
    var mintNftTx = await mintNFTToken(createNftTx.toString(), supplyKey)
    var serial = mintNftTx[0];
    var cid = mintNftTx[1];
    console.log('NFT Serial: ', serial, 'NFT Cid: ', cid);

    //Associate the NFT with the destination wallet
    var associateNftTx = await associateTokenWallet(userId, userKey, createNftTx.toString())
    console.log('NFT Associated: ', associateNftTx.toString());
    
    //Transfer the NFT from the SENDER to the RECEIVER
    var transferNftTx = await transferNFT(createNftTx, userId)
    console.log('Transfer status: ', transferNftTx.toString());

    //fetch the file using a link and extracting the json from it.
    var fetchJson = await fetchFile(cid);
    console.log("JSON response: ", fetchJson); 

    //Gets the balance of the Receiver address
    //var getNftBalance = await getBalance(process.env.RECEIVER_ID, createNftTx)
    //console.log('NFT Balance: ', getNftBalance.toString());
}

main();