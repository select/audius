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

function delay(time) {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
}

browser.runtime.onMessage.addListener(request => {
	if (request.audius) {
		getAudiusTabs(async tabs => {
			console.log('background got request ', request);
			if (!tabs.length) window.console.warn('Could not find audius tab');
			else if (request.wsAction === 'scanUrl') {
				const promises = webScraper.scanUrl(request);
				for (let i = 0; i < promises.length; i++) {
					try {
						const mediaList = await promises[i];
						const data = Object.assign({}, request.responseTemplate.data, { mediaList });
						tabs.forEach(tab => {
							chrome.tabs.sendMessage(
								tab.id,
								Object.assign({}, request.responseTemplate, { data }),
								() => {} // response callback
							);
						});
						await delay(2000);
					} catch (error) {
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
			}
		});
	}
});
