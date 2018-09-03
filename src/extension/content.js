// import '../utils/domObserver';
const isRunningInAudiusApp = !!document.querySelector('#audius-website');

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

// Listen to messages from background script and forward them to the audius website.
chrome.runtime.onMessage.addListener((request, sender) => {
	// if we are on a audius player page.
	if (request.audius && isRunningInAudiusApp) {
		window.dispatchEvent(
			new CustomEvent('audius', {
				detail: request,
			})
		);
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
