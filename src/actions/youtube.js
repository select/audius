export const searchYoutube = (query = '') => ({
	type: 'YOUTUBE_SEARCH_REQUEST',
	query,
});

export const searchYoutubeError = (reason = '') => ({
	type: 'YOUTUBE_SEARCH_ERROR',
	reason,
});

export const searchYoutubeSuccess = (results = []) => ({
	type: 'YOUTUBE_SEARCH_SUCCESS',
	results,
});
