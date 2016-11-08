import duration from '../utils/duration';
import { videoBaseObject } from './video.js';

const initialState = {
	db: undefined,
	dbErrorMessage: '',
	isPlaying: false,
	youtubeId: '',
	playList: [],
	queue: [],
	showPlayList: true,
	shuffle: false,
	repeat1: false,
	repeatAll: false,
	entities: {},
	showSearch: false,
};

function next(state) {
	const idx = state.playList.indexOf(state.youtubeId);
	// if last song stop
	if (state.shuffle) {
		return Object.assign({}, state , {
			youtubeId: state.playList[Math.floor(Math.random()*state.playList.length)],
			isPlaying: true,
		});
	} else if (idx === state.playList.length - 1) {
		return Object.assign({}, state , {
			isPlaying: false,
		});
	// next song
	} else if (idx < state.playList.length - 1) {
		const youtubeId = state.playList[idx + 1];
		return Object.assign({}, state, {
			youtubeId,
			isPlaying: true,
		});
	}
	return state;
}

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
	case 'VIDEO_ERROR':
		state.entities[action.id] = Object.assign({}, state.entities[action.id], {
			errorMessage: action.message,
			hasError: true,
		})
		return Object.assign({}, next(state), {
			entities: state.entities,
		});
	case 'ADD_VIDEOS':
		entities = Object.assign({}, state.entities);
		action.videos.forEach((v) => {
			entities[v.id] = Object.assign(videoBaseObject, {
				title: v.snippet.title,
				duration: duration(v.contentDetails.duration),
				id: v.id,
				thumbnail: v.snippet.thumbnails.default.url,
			});
		});
		return Object.assign({}, state, {
			playList: [...state.playList, ...action.videos.map(v => v.id).filter(id => !state.playList.includes(id))],
			entities,
		});
	case 'IMPORT_PLAYLIST':
		return Object.assign({}, state, {
			playList: [...state.playList, ...action.data.playList.filter(id => !state.playList.includes(id))],
			entities: Object.assign({}, state.entities, action.data.entities),
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
		if (state.playList.includes(action.video.id)) return state;
		return Object.assign({}, state, {
			playList: [...state.playList, action.video.id],
			entities,
		});
	case 'PLAY_VIDEO':
		youtubeId = action.id;
		return Object.assign({}, state, {
			isPlaying: true,
			youtubeId,
		});
	case 'PAUSE':
		return Object.assign({}, state, {
			isPlaying: false,
			entities: state.entities,
		});
	case 'PLAY':
		if (state.playList.length) {
			youtubeId = !state.youtubeId ? state.playList[0] : state.youtubeId;
			return Object.assign({}, state, {
				isPlaying: true,
				youtubeId,
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
	case 'TOGGLE_MUTE':
		return Object.assign({}, state, {
			mute: !state.mute,
		});
	case 'NEXT_VIDEO':
		return next(state);
	case 'PREV_VIDEO':
		idx = state.playList.indexOf(state.youtubeId);
		if (idx > 0) {
			youtubeId = state.playList[idx - 1];
			return Object.assign({}, state, {
				youtubeId: state.playList[idx - 1],
				isPlaying: true,
			});
		}
		return state;
	default:
		return state;
	}
};

export default mediaPlayer;
