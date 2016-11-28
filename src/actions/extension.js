export const extensionAddVideos = videos => ({
	type: 'EXTENSION_ADD_VIDEOS',
	videos,
});

export const toggleExtension = state => ({
	type: 'TOGGLE_EXTENSION',
	state,
});

export const searchAudiusTab = () => ({
	type: 'SEARCH_AUDIUS_TAB',
});

export const audiusTabFound = () => ({
	type: 'AUDIUS_TAB_FOUND',
});
