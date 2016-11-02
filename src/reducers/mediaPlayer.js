function duration(durationString) {
	var durationMatch = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
	return {
		h: parseInt(durationMatch[1], 10) || 0,
		m: parseInt(durationMatch[2], 10) || 0,
		s: parseInt(durationMatch[3], 10) || 0,
	};
}

const initialState = {
	isPlaying: false,
	youtubeId: '',
	playList: [],
	showPlayList: true,
	shuffle: false,
	repeat1: false,
	repeatAll: false,
	entities: {},
	showSearch: false,
}
const mediaPlayer = (state = initialState, action) => {
	let idx;
	let youtubeId;
	let entities;
	switch (action.type) {
		case 'ADD_VIDEOS':
			entities = state.entities;
			action.videos.forEach(v => {
				entities[v.id] = {
			 		title: v.snippet.title,
			 		duration: duration(v.contentDetails.duration),
			 		isPlaying: false,
			 		id: v.id,
			 		thumbnail: v.snippet.thumbnails.default.url,
			 	}
			});
			return Object.assign({}, state, {
				playList: [...state.playList, ...action.videos.map(v => v.id).filter(id => !state.playList.includes(id))],
				entities,
			});
		case 'PLAY_VIDEO':
			youtubeId = action.id;
			if (state.youtubeId) state.entities[state.youtubeId].isPlaying = false;
			state.entities[youtubeId].isPlaying = true;
			return Object.assign({}, state, {
				isPlaying: true,
				youtubeId,
				entities: state.entities,
			});
		case 'PAUSE':
			if (state.youtubeId) state.entities[state.youtubeId].isPlaying = false;
			return Object.assign({}, state, {
				isPlaying: false,
				entities: state.entities,
			});
		case 'PLAY':
			if(state.playList.length) {
				youtubeId = !state.youtubeId ? state.playList[0] : state.youtubeId;
				if (state.youtubeId) state.entities[state.youtubeId].isPlaying = false;
				state.entities[youtubeId].isPlaying = true;
				return Object.assign({}, state, {
					isPlaying: true,
					youtubeId,
					entities: state.entities,
				});
			}
		case 'TOGGLE_SHUFFLE':
			return Object.assign({}, state, {
				shuffle: !state.shuffle,
			});
		case 'TOGGLE_SEARCH':
			return Object.assign({}, state, {
				showSearch: !state.showSearch,
			});
		case 'TOGGLE_PLAYLIST':
			return Object.assign({}, state, {
				showPlayList: !state.showPlayList,
			});
		case 'NEXT_VIDEO':
			idx = state.playList.indexOf(state.youtubeId)
			if (idx < state.playList.length - 1) {
				youtubeId = state.playList[idx + 1];
				if (state.youtubeId) state.entities[state.youtubeId].isPlaying = false;
				state.entities[youtubeId].isPlaying = true;
				return Object.assign({}, state, {
					youtubeId,
					isPlaying: true,
					entities: state.entities,
				});
			} else {
				return state;
			}
		case 'PREV_VIDEO':
			idx = state.playList.indexOf(state.youtubeId);
			if (idx > 0) {
				youtubeId = state.playList[idx - 1];
				if (state.youtubeId) state.entities[state.youtubeId].isPlaying = false;
				state.entities[youtubeId].isPlaying = true;
				return Object.assign({}, state, {
					youtubeId: state.playList[idx - 1],
					isPlaying: true,
					entities: state.entities,
				});
			} else {
				return state;
			}

		default:
			return state
	}
};

export default mediaPlayer
