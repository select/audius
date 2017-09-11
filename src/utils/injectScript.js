export function injectScript(url) {
	return new Promise((resolve, reject) => {
		const tag = document.createElement('script');
		let r = false;
		tag.src = url;
		tag.onload = tag.onreadystatechange = function() {
			if (!r && (!this.readyState || this.readyState === 'complete')) {
				r = true;
				resolve();
			}
		};
		tag.onerror = () => {
			reject(`Could not load ${url} `);
		};
		document.head.appendChild(tag);
	});
}
