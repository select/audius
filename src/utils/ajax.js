export default function ajax(url, callback, params) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200) callback(JSON.parse(xmlhttp.responseText));
			else console.warn('error loading ' + url);
		}
	};
	xmlhttp.open(params ? 'POST': 'GET', url, true);
	xmlhttp.send(params);
}
