function duration(durationString) {
	var durationMatch = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
	return {
		h: parseInt(durationMatch[1], 10) || 0,
		m: parseInt(durationMatch[2], 10) || 0,
		s: parseInt(durationMatch[3], 10) || 0,
	};
}

const initialState = {
	entities: {},
}
const videos = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_VIDEOS':
			const entities = {};
			action.videos.forEach(v => {
			 	v.duration = duration(v.contentDetails.duration);
				entities[v.id] = v;
			});
			return {
				entities,
			};
		// case 'PLAY_VIDEO':
		// 	return state.map(t =>
		// 		video(t, action)
		// 	)
		default:
			return state
	}
}

export default videos
