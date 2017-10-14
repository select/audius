import 'babel-polyfill';
import { webScraper } from '../utils/webScraper.extension';

const browser = chrome || window.browser;
const logger = window.console.log;
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
	logger('## background to webpage', data);
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

/* eslint-disable no-await-in-loop */
window.addEventListener('message', async event => {
	logger('## background event sandbox', event.data);
	if (['ajaxJSON', 'ajaxRaw'].includes(event.data.type)) {
		const urls = Array.isArray(event.data.data) ? event.data.data : [event.data.data];
		const promises = urls.map(url => webScraper[event.data.type](url));
		for (let i = 0; i < promises.length; i++) {
			try {
				const data = await promises[i];
				sandbox.contentWindow.postMessage(
					Object.assign(event.data.responseTemplate, { id: event.data.id, data }),
					'*'
				);
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
		// webScraper[event.data.type](event.data.data).then(data => {
		// 	sandbox.contentWindow.postMessage(
		// 		Object.assign(event.data.responseTemplate, { id: event.data.id, data }),
		// 		'*'
		// 	);
		// });
	} else if (['getYouTubeInfo', 'scanOneUrl'].includes(event.data.type)) {
		webScraper[event.data.type](event.data).then(mediaList => {
			sendMessageToAudius({
				audius: true,
				vuex: 'dispatch',
				type: 'webScraperUpdateSuccess',
				data: {
					id: event.data.id,
					mediaList,
				},
			});
		});
	} else if (event.data.audius) {
		sendMessageToAudius(event.data);
	}
});

setTimeout(() => {
	sandbox.contentWindow.postMessage({ type: 'handshakeSandbox' }, '*');
}, 500);

/* eslint-disable no-await-in-loop */
// I use await inside a loop to queue the requests.
// One a request is finished, wait 2s and then start the next one
browser.runtime.onMessage.addListener(async request => {
	if (request.audius) {
		sandbox.contentWindow.postMessage({ type: 'handshakeSandbox' }, '*');
		logger('## background event webpage', request);
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
