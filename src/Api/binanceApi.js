import crypto from 'crypto';
import {forEach} from "lodash";

const walletRelativeAPI = "/api/v3/account";

async function getAllAssets() {
    const timestamp = Date.now();
    const params = {
        timestamp
    }

    let queryString = Object
        .keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    
    console.log('query string', queryString);

    const signature = crypto.createHmac("sha256", process.env.BINANCE_API_SECRET)
        .update(queryString)
        .digest("hex");
    
    console.log('signature', signature);

    const completeQueryString = 'signature=' + signature + '&' + queryString;
    console.log('query string', completeQueryString);
    const url = binanceAPIBaseUrl + walletRelativeAPI;

    const fullUrl = url + '?' + completeQueryString;
    console.log('full url', fullUrl);
    
    try {
        const response = (await fetch(fullUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }));
        const res = await response.json();
        if (res) {
            forEach(res.balances, balance => {
                if (balance.free > 0) {
                    console.log(balance)
                }
            })
        }
        return res;
    } catch(err) {
        console.log(err)
    }
}

export default getAllAssets;