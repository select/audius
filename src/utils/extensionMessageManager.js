import store from '../store';
import Actions from '../actions';

let mediaId = '';
store.subscribe(() => {
	const extension = store.getState().extension;
	if (extension.mediaId !== mediaId) {
		mediaId = extension.mediaId;
		console.log('extension play ', extension.entities[mediaId].title);
		// Send message to background script.
		chrome.runtime.sendMessage(
			{
				audius: true,
				action: {
					type: 'PLAY',
					mediaId,
					currentMedia: extension.entities[mediaId],
				},
			}
		);
	}
});


if (document.querySelectorAll('#audius-website').length) {
	// Listen to messages from background script if we are on a audius player page.
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.audius) {
			window.dispatchEvent(new CustomEvent('audius', { detail: request.action }));
			sendResponse('revieved message!');
		}
	});
}
