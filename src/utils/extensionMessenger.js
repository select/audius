import store from '../store';
import Actions from '../actions';

const isRunningInAudiusApp = document.querySelectorAll('#audius-website').length;
// Listen to messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// if we are on a audius player page.
	if (request.audius && isRunningInAudiusApp) {
		window.dispatchEvent(new CustomEvent('audius', {
			detail: request.action
		}));
		sendResponse(`Send custom event to Audius website app ${request.action.type}`);
		// if we are on a regular page where the extension can render
	} else if (request.audiusToContentScript) {
		store.dispatch(request.action);
		sendResponse(`Dispatched Action to extension store: ${request.action.type}`)
	}
});
