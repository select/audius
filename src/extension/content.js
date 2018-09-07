import { webScraper } from '../utils/webScraper.extension';
import { debounce } from '../utils/debounce';

const isRunningInAudiusApp = !!document.querySelector('#audius-website');
let watchChanges = false;

// When the audius website sends a handshake it's ready to set the extensionAvailable
// flag in the store.
window.addEventListener(
	'audiusExtensionHandshake',
	event => {
		window.dispatchEvent(
			new CustomEvent('audius', {
				detail: { vuex: 'commit', type: 'setExtensionAvilable', data: true },
			})
		);
	},
	false
);
let observer;
const knownMedia = new Set();
// Listen to messages from background script and forward them to the audius website.
chrome.runtime.onMessage.addListener((request, sender) => {
	// if we are on a audius player page.
	if (request.audius) {
		if (isRunningInAudiusApp) {
			window.dispatchEvent(
				new CustomEvent('audius', {
					detail: request,
				})
			);
		} else if (request.type === 'startWatching') {
			watchChanges = true;
			if (!observer) {
				window.console.log('## Audius startWatching request observer', request, observer);
				observer = new MutationObserver(
					debounce(() => {
						if (!watchChanges) return;
						const mediaList = webScraper
							.findMediaInElement(document.body)
							.filter(({ id }) => !knownMedia.has(id));
						mediaList.forEach(({ id }) => knownMedia.add(id));
						// window.console.log('## Audius searching ', mediaList.length);
						if (mediaList.length) {
							chrome.runtime.sendMessage(
								{
									audius: true,
									vuex: 'dispatch',
									type: 'webScraperUpdateSuccess',
									data: {
										id: request.id,
										mediaList,
									},
								},
								() => {}
							);
						}
					}),
					1000
				);
				const mediaList = webScraper.findMediaInElement(document.body).filter(({ id }) => !knownMedia.has(id));
				mediaList.forEach(({ id }) => knownMedia.add(id));
				window.console.log('## Audius inital scrape: ', mediaList.length);
				if (mediaList.length) {
					chrome.runtime.sendMessage(
						{
							audius: true,
							vuex: 'dispatch',
							type: 'webScraperUpdateSuccess',
							data: {
								id: request.id,
								mediaList,
							},
						},
						() => {}
					);
				}
			}
			// Start observing the DOM again
			observer.observe(document.body, {
				subtree: true,
				childList: true,
				characterData: true,
			});
		} else if (observer && request.type === 'stopWatching') {
			watchChanges = false;
			window.console.log('## Audius stopWatching');
			observer.disconnect();
		}
	}
});

// Forward messages from audius website to the background script of this extension.
window.addEventListener(
	'audiusExtension',
	event => {
		// window.console.log('content message relay request ', event.detail);
		chrome.runtime.sendMessage(event.detail, response => {});
	},
	false
);

// Watch requested url
// const url = new URL($el.value);
// console.log("url.hostname", url.hostname);
