import duration from '../utils/duration';

const initialState = {
	db: undefined,
	dbErrorMessage: '',
	isPlaying: false,
	youtubeId: '',
	playList: [],
	showPlayList: true,
	shuffle: false,
	repeat1: false,
	repeatAll: false,
	entities: {},
	showSearch: false,
};

const mediaPlayer = (state = initialState, action) => {
	let idx;
	let youtubeId;
	let entities;
	switch (action.type) {
	case 'DB_INIT_SUCCESS':
		return Object.assign({}, state, { db: action.db });
	case 'DB_ERROR':
		return Object.assign({}, state, { dbErrorMessage: action.message });
	case 'DB_SET_SUCCESS':
		entities = Object.assign({}, state.entities);
		entities[action.data.id].saved = true;
		return Object.assign({}, state, {
			entities,
		});
	// case 'DB_GET_SUCCESS':
	case 'DB_GETALL_SUCCESS':
		return Object.assign({}, state, {
			entities: Object.assign({}, state.entities, action.entities),
		});
	case 'DB_GET_PLAYLIST_SUCCESS':
		return Object.assign({}, state, {
			playList: action.playList,
		});
	case 'ADD_VIDEOS':
		entities = Object.assign({}, state.entities);
		action.videos.forEach((v) => {
			entities[v.id] = {
				title: v.snippet.title,
				duration: duration(v.contentDetails.duration),
				isPlaying: false,
				id: v.id,
				thumbnail: v.snippet.thumbnails.default.url,
				deleted: false,
			};
		});
		return Object.assign({}, state, {
			playList: [...state.playList, ...action.videos.map(v => v.id).filter(id => !state.playList.includes(id))],
			entities,
		});
	case 'REMOVE_VIDEO':
		entities = Object.assign({}, state.entities);
		entities[action.id].deleted = true;
		return Object.assign({}, state, {
			playList: state.playList.filter(id => id !== action.id),
			entities,
		});
	case 'ADD_SEARCH_RESULT':
		entities = Object.assign({}, state.entities);
		entities[action.video.id] = action.video;
		return Object.assign({}, state, {
			playList: [...state.playList, action.video.id],
			entities,
		});
	case 'PLAY_VIDEO':
		youtubeId = action.id;
		if (state.youtubeId) state.entities[state.youtubeId].isPlaying = false;
		if (state.entities[youtubeId]) state.entities[youtubeId].isPlaying = true;
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
		if (state.playList.length) {
			youtubeId = !state.youtubeId ? state.playList[0] : state.youtubeId;
			if (state.youtubeId) state.entities[state.youtubeId].isPlaying = false;
			state.entities[youtubeId].isPlaying = true;
			return Object.assign({}, state, {
				isPlaying: true,
				youtubeId,
				entities: state.entities,
			});
		}
		return state;
	case 'TOGGLE_SHUFFLE':
		return Object.assign({}, state, {
			shuffle: !state.shuffle,
		});
	case 'TOGGLE_PLAYLIST':
		return Object.assign({}, state, {
			showPlayList: !state.showPlayList,
		});
	case 'NEXT_VIDEO':
		idx = state.playList.indexOf(state.youtubeId);
		if (idx < state.playList.length - 1) {
			youtubeId = state.playList[idx + 1];
			if (state.youtubeId) state.entities[state.youtubeId].isPlaying = false;
			state.entities[youtubeId].isPlaying = true;
			return Object.assign({}, state, {
				youtubeId,
				isPlaying: true,
				entities: state.entities,
			});
		}
		return state;
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
		}
		return state;
	default:
		return state;
	}
};

export default mediaPlayer;
