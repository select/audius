// import '../utils/domObserver';
const isRunningInAudiusApp = !!document.querySelector('#audius-website');

// Listen to messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// if we are on a audius player page.
	if (request.audius && isRunningInAudiusApp) {
		window.dispatchEvent(
			new CustomEvent('audius', {
				detail: request,
			})
		);
		// sendResponse(`Send custom event to Audius website app ${request.action.type}`);
	}
});

if (isRunningInAudiusApp) {
	setTimeout(() => {
		window.dispatchEvent(
			new CustomEvent('audius', {
				detail: { vuex: 'commit', type: 'setExtensionAvilable', data: true },
			})
		);
	}, 500);
}

window.addEventListener(
	'audiusExtension',
	event => {
		console.log('content message relay request ', event.detail)
		chrome.runtime.sendMessage(event.detail, response => {});
	},
	false
);
