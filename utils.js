import {} from 'dotenv/config';
//require("dotenv").config();
import { Web3Storage, getFilesFromPath} from 'web3.storage';

export async function storeFiles() {
    const token = process.env.WEB3_TOKEN;
	const webClient = new Web3Storage({ token });
    const files = await getFilesFromPath('buhh.jpg');
    const cid = await webClient.put(files);
    return cid;
}

export async function retrieveFiles (cid) {
    const token = process.env.WEB3_TOKEN;
	const webClient = new Web3Storage({ token });
    // You can fetch data using any CID, even from IPFS Nodes or Gateway URLs!
    const res = await webClient.get(cid)
    const files = await res.files()
    return files;
    //for (const file of files) {
    //  console.log(`${file.cid}: ${file.name} (${file.size} bytes)`);
    //}
  }
