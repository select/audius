import duration from '../utils/duration.js';

const initialState = {
	query: '',
	isSearching: false,
	results: [],
}
const config = (state = initialState, action) => {
	switch (action.type) {
		case 'YOUTUBE_SEARCH_REQUEST':
			return Object.assign({}, state, {
				query: action.query,
				isSearching: true,
			})
		case 'YOUTUBE_SEARCH_ERROR':
			return Object.assign({}, state, {
				isSearching: false,
			})
		case 'YOUTUBE_SEARCH_SUCCESS':
			return Object.assign({}, state, {
				isSearching: false,
				results: action.results.map((v) => ({
					title: v.snippet.title,
					duration: duration(v.contentDetails.duration),
					isPlaying: false,
					id: v.id.videoId,
					thumbnail: v.snippet.thumbnails.default.url,
				})),
			})
		default:
			return state
	}
};

export default config
