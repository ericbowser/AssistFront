
async function get(url, params = {}) {
    const response = await fetch(url, params);
    console.log(response);
    return response.json();
}

async function post(url, data = {}) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Accept", "*/*");

    const raw = JSON.stringify({
        "username": data.username,
        "password": data.password,
        "loginType": data.loginType
    });

    console.log(raw);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        mode: 'cors'
    };

    try {
        // const response = await fetch(url, requestOptions);
      const response = await fetch(url, requestOptions);
      // console.log(response?.status);
      return response;
    } catch(err) {
       console.log(err);
    }
}

export {get, post};