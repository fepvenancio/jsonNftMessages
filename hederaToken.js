import { hederaClient } from './hederaClient.js';
import { storeFiles } from './web3NFTStorage.js';
import {} from 'dotenv/config';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrivateKey, TokenCreateTransaction, TokenAssociateTransaction, TokenMintTransaction, TokenType, TokenSupplyType } = require("@hashgraph/sdk");

//Create NFTs
export async function createNFTToken(nftName, nftSymbol, supplyKey) {
    const client = hederaClient();

    let nftCreateTx = await new TokenCreateTransaction()
        .setTokenName(nftName)
        .setTokenSymbol(nftSymbol)
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(process.env.TREASURY_ID)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(250)
        .setSupplyKey(supplyKey)
        .freezeWith(client);

    //Sign the transaction with the treasury key
    let nftCreateTxSign = await nftCreateTx.sign(PrivateKey.fromString(process.env.TREASURY_PVKEY));

    //Submit the transaction to a Hedera network
    let nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    let nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    let nftId = nftCreateRx.tokenId;

    //return the token ID
    return nftId;
}

export async function mintNFTToken(tokenId, supplyKey) {
    const client = hederaClient();
    //IPFS content identifiers for which we will create a NFT
    const cid = await storeFiles();
    
	// Mint new NFT
	let mintTx = await new TokenMintTransaction()
		.setTokenId(tokenId)
		.setMetadata([Buffer.from(cid)])
		.freezeWith(client);

	//Sign the transaction with the supply key
	let mintTxSign = await mintTx.sign(supplyKey);

	//Submit the transaction to a Hedera network
	let mintTxSubmit = await mintTxSign.execute(client);

	//Get the transaction receipt
	let mintRx = await mintTxSubmit.getReceipt(client);

    const arr = new Array(mintRx.serials[0].low.toString(), cid);
	//return the serial number
    return arr;
    	
}

// Associate the token with the wallet to start using it - string walletId. 
export async function associateTokenWallet(userId, userKey, token) {
    const client = hederaClient();
    
    //associate the token with the wallet - Permission
    let associateTokenTx = await new TokenAssociateTransaction()
        .setAccountId(userId)
        .setTokenIds([token])
        .freezeWith(client)
        .sign(userKey);
    
    let associateTokenSubmit = await associateTokenTx.execute(client);
        
    //Get the transaction Receipt
    let associateTokenRx = await associateTokenSubmit.getReceipt(client);

    //return the receipt
    return associateTokenRx.status;
}
