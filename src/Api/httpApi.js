async function get(url, params = {}) {
	try {
		const response = await fetch(url, params);
		console.log('response: ', response);
		return response.json();
	} catch(err) {
		console.log(err);
		throw err;
	}
}

async function post(url, body = {}, SetAnswerAsCallback) {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "*");
	myHeaders.append("Accept", "*");

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: JSON.stringify(body),
		redirect: 'follow',
		mode: 'cors'
	};
	
	try {
		const response = await fetch(url, requestOptions);
		let res = {
			status: null,
			data: null
		};
		if (response?.ok) {
			res.status = 200;
			res.data = await response.json()
			SetAnswerAsCallback(res);
		}
		return response;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

export {get, post};