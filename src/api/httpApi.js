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
            console.log('response: ', content);
            if(content) {
                const response = {
                    status: 200,
                    answer: content.data.answer,
                    thread: content.data.thread
                };
                return response;
            } else {
                return null;
            }
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