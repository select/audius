export default function injectScript(url, callback) {
	const tag = document.createElement('script');
	let r = false;
	tag.src = url;
	tag.onload = tag.onreadystatechange = function() {
		if (!r && (!this.readyState || this.readyState === 'complete')) {
			r = true;
			if(callback) callback();
		}
	};
	document.head.appendChild(tag);
}
