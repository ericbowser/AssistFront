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
   /* // Send a POST request
    axios({
        method: 'post',
        url: '/user/12345',
        data: {
            firstName: 'Fred',
            lastName: 'Flintstone'
        }
    });*/
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log('POST body', data);
    const raw = JSON.stringify({
        "content": data.content,
        "instructions": data.instructions || "test"
    });
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: data,
        redirect: "follow"
    };
    try {
        const response = await axios.post(url, {...data});
/*
        const response = await fetch(url, requestOptions);
*/
        if (response?.status === 200) {
            const content = await response;
            const res = {
                status: 200,
                data: content?.data.message.content
            }
            console.log('response', res);
            SetAnswerAsCallback(res);
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