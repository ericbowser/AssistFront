import axios from 'axios';

async function get(url, params = {}) {
    try {
        const response = await axios(url, params);
        console.log('axios response: ', response);
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function post(url, data = {}) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log('POST body', data);
    
    try {
        const response = await axios.post(url, {...data});
        if (response?.status === 200) {
            const content = await response;
            console.log(content);
            const res = {
                status: 200,
                data: content?.data,
                thread: content.data.id
            }
            console.log('response', res);
            return res;
        } else {
           console.error(response);
           return null;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export {get, post};