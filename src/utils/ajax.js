export default function ajax(url, callback) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200) callback(JSON.parse(xmlhttp.responseText));
			else console.warn('error loading ' + url);
		}
	};
	xmlhttp.open('GET', url, true);
	xmlhttp.send();
}
