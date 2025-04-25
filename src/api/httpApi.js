import axios from 'axios';

async function get(url, params = {}) {
    console.log('url', url);
    try {
        const response = await axios(url, params);
        console.log('axios response: ', response);
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function postUrlData(url, data = {}) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log('POST body', data);

    try {
        const response = await axios.post(url, {...data});
        console.log('axios response: ', response);
        if (response?.status === 200) {
            const res = await response;
            console.log('response: ', response);
            if(res.status === 200) {
                const data = {
                    status: 200,
                    content: res.data.content,
                    urls: res.data.links
                };
                console.log('response', res);
                return data;
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

async function postImage(url, data = {}) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log('POST body', data);

    try {
        const response = await axios.post(url, {...data});
        if (response?.status === 200) {
            const data = await response;
            console.log('response: ', data);
            if (data) {
                const response = {
                    status: 200,
                    created: data.data.created,
                    answer: data.data.b64_json,
                    thread: data.data.thread,
                };
                if (response?.multiple) {
                    
                }
                console.log('response', response);
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

async function post(url, data = {}) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const body = {
        content: data,
    }
    console.log('post data: ', body);
    
    try {
        const response = await axios.post(url, body);
        if (response?.status === 200) {
            const res = await response;
            console.log('response: ', res);
            if(res) {
                const response = {
                    status: 200,
                    content: res.data.answer,
                    thread: res.data.thread,
                };
                console.log('response', response);
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

export {get, post, postUrlData, postImage};