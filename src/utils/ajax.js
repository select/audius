export function ajax(url, callback, params) {
	return new Promise((resolve, reject) => {
		const xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					try {
						const json = JSON.parse(xmlhttp.responseText);
						if (callback !== undefined) callback(json);
						resolve(json);
					} catch (e) {
						reject(`Ajax JSON parse failed ${e}`);
					}
				} else {
					if (callback !== undefined) console.warn(`Ajax error ${xmlhttp.status} loading ${url}`);
					reject(`Ajax error ${xmlhttp.status} loading ${url}`);
				}
			}
		};
		xmlhttp.open(params ? 'POST' : 'GET', url, true);
		xmlhttp.send(params);
	});
}

export function ajaxPostJSON(url, params) {
	return new Promise((resolve, reject) => {
		const xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status >= 200 && xmlhttp.status < 300) resolve(xmlhttp.responseText);
				else reject(`Ajax error ${xmlhttp.status} posting data to ${url}`);
			}
		};

		xmlhttp.open(params ? 'POST' : 'GET', url, true);
		xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		xmlhttp.send(params);
	});
}
