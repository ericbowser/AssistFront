/*
import { AnkrProvider } from '@ankr.com/ankr.js';
*/

/*
const apiKey = '48c639ec476893bc53abe929360857454b618c4426700fe7a1c83612a990e6a3';
const baseTestnetAddress = '0xd9fefdfce7150e86b380F669005e062Cc255c3C1';
const provider = new AnkrProvider('https://rpc.ankr.com/multichain/48c639ec476893bc53abe929360857454b618c4426700fe7a1c83612a990e6a3');
*/

/*
const provider = new AnkrProvider('https://rpc.ankr.com/multichain/48c639ec476893bc53abe929360857454b618c4426700fe7a1c83612a990e6a3');

const balances = async () => {
    const response = await provider.getAccountBalance({
        blockchain: ['bsc', 'eth', 'base', 'polygon', 'avalanche'],
        walletAddress: '0xd9fefdfce7150e86b380F669005e062Cc255c3C1',
    });
    console.log('response adv api:', response)
    return response;
};

*/
export default balances;