import 'babel-polyfill';
import { webScraper } from '../utils/webScraper.extension';

const browser = chrome || window.browser;

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

browser.runtime.onMessage.addListener(request => {
	if (request.audius) {
		getAudiusTabs(async tabs => {
			if (!tabs.length) console.warn('Could not find audius tab');
			else if (request.type === 'scanUrl') {
				const promises = webScraper.scanUrl(request);
				for (let i = 0; i < promises.length; i++) {
					try {
						const mediaList = await promises[i];
						console.log("mediaList", mediaList);
						tabs.forEach(tab => {
							chrome.tabs.sendMessage(
								tab.id,
								{
									audius: true,
									vuex: 'commit',
									type: 'webMediaSearchSuccess',
									data: { mediaList, id: request.url },
								},
								() => {} // response callback
							);
						});
					} catch(error) {
						tabs.forEach(tab => {
							chrome.tabs.sendMessage(
								tab.id,
								{
									audius: true,
									vuex: 'commit',
									type: 'error',
									data: `${error}`,
								},
								() => {} // response callback
							);
						});
					}
				}
			} else if (request.type in webScraper) {
				// webScraper[request.type](request).then(data => {
				// 	console.log(`background.js ${request.type} `, data);
				// 	chrome.tabs.sendMessage(
				// 		tab.id,
				// 		{ audius: true, vuex: 'commit', type: 'webMediaSearchSuccess', data },
				// 		response => {}
				// 	);
				// });
			}
		});
	}
});
