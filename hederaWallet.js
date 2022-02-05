import { hederaClient } from "./hederaClient.js";
import {} from 'dotenv/config';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrivateKey, TransferTransaction, AccountBalanceQuery, AccountId } = require("@hashgraph/sdk");

export async function getBalance(userId, tokenId) {
    const client = hederaClient();

    //get the user balance
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(userId).execute(client);

    return balanceCheckTx.tokens._map.get(tokenId.toString());
}

export async function transferNFT(nftId, userId) {
    const client = hederaClient(); //connects to the hederaClient
    // Transfer the NFT from treasury to Receiver
	// Sign with the treasury key to authorize the transfer
    let tokenTransferTx = await new TransferTransaction()
        .addNftTransfer(nftId, 1, AccountId.fromString(process.env.TREASURY_ID), userId)
        .freezeWith(client)
        .sign(PrivateKey.fromString(process.env.SENDER_PVKEY));

    //Submit the transaction to Hedera network
    let tokenTransferSubmit = await tokenTransferTx.execute(client);

    //Get the transaction receipt
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    return tokenTransferRx.status
}

