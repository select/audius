import '@babel/polyfill';
import browser from 'webextension-polyfill';

import { webScraper } from '../utils/webScraper.extension';

// const browser = chrome || window.browser;
const logger = window.console.log;
const sandbox = document.getElementById('sandboxFrame');
const watchList = {};

function delay(time) {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
}

function sendMessageToAudius(data) {
	logger('## background to webpage', data);
	Promise.all([
		browser.tabs.query({ url: 'http://localhost:8080/' }),
		browser.tabs.query({ url: 'https://audius.rockdapus.org/' }),
	])
		.then(tabsLists => tabsLists.reduce((acc, tabs) => [...acc, ...tabs], []))
		.then(tabs => {
			if (!(tabs && tabs.length)) {
				window.console.warn('Could not find audius tab');
				return;
			}
			Promise.all(tabs.map(tab => chrome.tabs.sendMessage(tab.id, data))).then();
		});
}

// Events from the sandbox.

/* eslint-disable no-await-in-loop */
window.addEventListener('message', async event => {
	logger('## background.js event from sandbox', event.data);
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
	} else if (event.data.type === 'scanUrl') {
		const promises = webScraper.scanUrl(event.data);
		for (let i = 0; i < promises.length; i++) {
			try {
				const mediaList = await promises[i];
				sendMessageToAudius({
					audius: true,
					vuex: 'dispatch',
					type: 'webScraperUpdateSuccess',
					data: {
						id: event.data.id,
						mediaList,
					},
				});
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
	} else if (event.data.type === 'scanOneUrl') {
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

function patternMatcher2regEx(text) {
	const pattern = text
		.split('*')
		.map(s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
		.join('.*');
	return `^${pattern}$`;
}

browser.tabs.onUpdated.addListener(event => {
	browser.tabs.get(event).then(tab => {
		if (tab.status === 'complete') {
			const watch = Object.values(watchList).find(({ urlRegEx }) => urlRegEx.test(tab.url));
			if (watch) {
				browser.tabs.sendMessage(tab.id, {
					audius: true,
					type: 'startWatching',
					id: watch.id,
					css: watch.css,
				}).then();
			} else {
				browser.tabs.sendMessage(tab.id, {
					audius: true,
					type: 'stopWatching',
				}).then();
			}
		}
	});
});

// Events from the audius page.

/* eslint-disable no-await-in-loop */
// I use await inside a loop to queue the requests.
// Once a request is finished, wait 2s and then start the next one
browser.runtime.onMessage.addListener(async request => {
	if (!request.audius) {
		return;
	}
	sandbox.contentWindow.postMessage({ type: 'handshakeSandbox' }, '*');
	logger('## background.js event from webpage', request);
	if (['loadScript', 'getNext'].includes(request.type)) {
		sandbox.contentWindow.postMessage(request, '*');
	} else if (request.type === 'watch') {
		// Send message to conten script to watch site with URL
		request.watchList.forEach(item => {
			if (item.id in watchList && watchList[item.id].url !== item.url) {
				browser.tabs
					.query({ url: watchList[item.id].url })
					.then(tabs =>
						Promise.all(
							tabs.map(tab =>
								browser.tabs.sendMessage(tab.id, { audius: true, type: 'stopWatching' })
							)
						)
					)
					.then();
			}
			browser.tabs
				.query({ url: item.url })
				.then(tabs =>
					Promise.all(
						tabs.map(tab => {
							return browser.tabs.sendMessage(tab.id, {
								audius: true,
								type: 'startWatching',
								id: item.id,
								css: item.css,
							});
						})
					)
				)
				.then();
			watchList[item.id] = Object.assign(item, { urlRegEx: new RegExp(patternMatcher2regEx(item.url)) });
		});
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
	} else if (request.type === 'webScraperUpdateSuccess') {
		sendMessageToAudius(request);
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
