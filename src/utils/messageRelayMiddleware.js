// relay messages from store to background script
export default store => next => (action) => {
	const result = next(action);
	if (['NEXT_VIDEO', 'PREV_VIDEO'].includes(action.type)) {
		const extension = store.getState().extension;
		chrome.runtime.sendMessage({
			audius: true,
			action: {
				type: 'PLAY',
				mediaId: extension.mediaId,
				currentMedia: extension.currentMedia,
			},
		}); // Send message to background script.
	} else if (['PLAY', 'PAUSE', 'TOGGLE_MUTE', 'QUEUE_MEDIA', 'ADD_SEARCH_RESULT', 'SEARCH_AUDIUS_TAB'].includes(action.type)) {
		chrome.runtime.sendMessage({
			audius: true,
			action,
		}); // Send message to background script.
	}
	return result;
};
