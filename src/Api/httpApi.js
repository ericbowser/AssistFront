import axios from 'axios';

async function get(url, params = {}) {
    try {
/*
        const response = await fetch(url, params);
*/
        const response = await axios(url, params);
        console.log('axios response: ', response);
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function post(url, data = {}, SetAnswerAsCallback) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log('POST body', data);
    
    try {
        const response = await axios.post(url, {...data});
        return response.data;
/*
        const response = await fetch(url, requestOptions);
*/
       /* if (response?.status === 200) {
            const content = await response;
            const res = {
                status: 200,
                data: content?.data.choices[0].message.content,
                thread: content.data.id
            }
            console.log('response', res);
            SetAnswerAsCallback(res);
            return res;
        } else {
           console.error(response); 
           return null;
        }*/
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export {get, post};