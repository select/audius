import 'babel-polyfill';
import { webScraper } from '../utils/webScraper.extension';

const browser = chrome || window.browser;
const sandbox = document.getElementById('sandboxFrame');

// Get the tab where Audius is running.
function getAudiusTabs(callback) {
	browser.tabs.getAllInWindow(null, tabs => {
		const tabsFiltered = [
			...tabs.filter(tab => tab.url === 'http://localhost:8080/'),
			...tabs.filter(tab => tab.url === 'https://audius.rockdapus.org/'),
		];
		if (tabsFiltered.length) {
			callback(tabsFiltered);
			return;
		}
		callback();
	});
}

function delay(time) {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
}

function sendMessageToAudius(data) {
	getAudiusTabs(tabs => {
		if (!(tabs && tabs.length)) {
			window.console.warn('Could not find audius tab');
			return;
		}
		tabs.forEach(tab => {
			chrome.tabs.sendMessage(
				tab.id,
				data,
				() => {} // response callback
			);
		});
	});
}

window.addEventListener('message', event => {
	console.log('pluginSandbox event in background.js ', event.data);
	if (event.data.ajaxJSON) {
		webScraper.ajaxJSON(event.data.ajaxJSON).then(data => {
			sandbox.contentWindow.postMessage({ type: 'parse', id: event.data.id, data }, '*');
		});
	}
	if (event.data.handshakeSandbox) {
		return;
	}
	sendMessageToAudius(event.data);
});

setTimeout(() => {
	sandbox.contentWindow.postMessage({ handshakeSandbox: true }, '*');
}, 500);

browser.runtime.onMessage.addListener(async request => {
	if (request.audius) {
		console.log('AudiusExtension got message ', request);
		if (['loadScript', 'getNext'].includes(request.type)) {
			sandbox.contentWindow.postMessage(request, '*');
		} else if (request.type === 'scanUrl') {
			const promises = webScraper.scanUrl(request);
			for (let i = 0; i < promises.length; i++) {
				try {
					const mediaList = await promises[i];
					const data = Object.assign({}, request.responseTemplate.data, { mediaList });
					sendMessageToAudius(Object.assign({}, request.responseTemplate, { data }));
					await delay(2000);
				} catch (error) {
					sendMessageToAudius({
						audius: true,
						vuex: 'commit',
						type: 'error',
						data: `${error}`,
					});
				}
			}
		}
	}
});

// chrome.browserAction.onClicked.addListener(() => {
// 	const iframe = document.getElementById('sandboxFrame');
// 	console.log("iframe", iframe);
// 	const message = {
// 		command: 'render',
// 		context: { thing: 'world' },
// 	};
// 	iframe.contentWindow.postMessage(message, '*');
// 	// new Notification('Templated!', {
// 	// 	icon: 'icon.png',
// 	// 	body: 'HTML Received for "dddd": dddd',
// 	// });
// });
