import {} from 'dotenv/config';
import fetch from 'node-fetch';
import { Web3Storage, getFilesFromPath} from 'web3.storage';

//Store the file in the web3.storage website - add ur token in the .env
export async function storeFiles() {
    const token = process.env.WEB3_TOKEN;
	const webClient = new Web3Storage({ token });
    const files = await getFilesFromPath('sample-json.json');
    const cid = await webClient.put(files);
    return cid;
}

//Access the link and retrieve the json data from it.
//for this demo the name of the file is hardcoded into the link!
export async function fetchFile(cid) {
    const address = "https://" + cid + ".ipfs.dweb.link/sample-json.json";
    const response = await fetch(address);
    const jsonData = await response.json();
    return jsonData;
}
