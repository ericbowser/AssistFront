async function get(url, params = {}) {
    try {
        const response = await fetch(url, params);
        console.log('response: ', response);
        return response.json();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function post(url, body = {}, SetAnswerAsCallback) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log('POST body', body);
    const raw = JSON.stringify({
        "content": body.content,
        "instructions": "test"
    });
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    try {
        console.log('request options ', {...requestOptions})
        const response = await fetch(url, requestOptions);
        console.log('response body', );
        if (response?.ok) {
            console.log('gets here')
            const content = await response.json();
            console.log('response json: ', content.message.content)
            const res = {
                status: 200,
                data: content.message.content
            }
            console.table('going to callback response: ', res);
            SetAnswerAsCallback(res);
            return res;
        }
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export {get, post};