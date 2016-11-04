const initialState = {
	youtubeApiKey: 'AIzaSyCHVgsa5owudn4G79IX9pcRcrVNOmgKHuM',
}
const config = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_YOUTUBE_API_KEY':
			return {
				youtubeApiKey: action.youtubeApiKey
			};
		default:
			return state
	}
};

export default config
