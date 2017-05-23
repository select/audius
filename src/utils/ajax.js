export function ajax(url, callback, params) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200) callback(JSON.parse(xmlhttp.responseText));
			else console.warn('error loading ' + url);
		}
	};
	xmlhttp.open(params ? 'POST' : 'GET', url, true);
	xmlhttp.send(params);
}

export function ajaxPostJSON(url, params, callback) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status >= 200 && xmlhttp.status < 300) callback(xmlhttp.responseText);
			else console.warn('error loading ' + url);
		}
	};

	xmlhttp.open(params ? 'POST' : 'GET', url, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xmlhttp.send(params);
}
