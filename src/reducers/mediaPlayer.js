import { duration } from '../utils/timeConverter';
import { videoBaseObject } from './video';
import { youtubeApiKey, pastebinApiKey } from '../utils/config';

const initialState = {
	db: undefined,
	errorMessages: '',
	entities: {},
	mediaId: '',
	playList: [],
	tags: {},
	tagsOrdered: [],
	stepsHistoryBack: 0,
	sessionHistory: [],
	queue: [],
	isPlaying: false,
	shuffle: false,
	repeat1: false,
	repeatAll: false,
	showSearch: false,
	filterQuery: '',
	currentTime: 0,
	skipToTime: 0,
	mute: false,
	currentMedia: {},
	currentPlayList: '',
	editPlayList: false,
	youtubeApiKey,
	pastebinApiKey,
};

function next(state) {
	const playList = state.currentPlayList ? state.tags[state.currentPlayList] : state.playList;
	const idx = playList.indexOf(state.mediaId);
	let mediaId;
	if (state.queue.length) {
		// Play next song from queue.
		const queue = [...state.queue];
		mediaId = queue.shift();
		return Object.assign({}, state, {
			mediaId,
			stepsHistoryBack: 0,
			sessionHistory: [...state.sessionHistory, state.currentMedia.id],
			currentMedia: state.entities[mediaId],
			queue: [...queue],
			isPlaying: true,
		});
	} else if (state.shuffle) {
		// Play a random song.
		mediaId = playList[Math.floor(Math.random() * playList.length)];
		return Object.assign({}, state, {
			mediaId,
			stepsHistoryBack: 0,
			sessionHistory: [...state.sessionHistory, state.currentMedia.id],
			currentMedia: state.entities[mediaId],
			isPlaying: true,
		});
	} else if (idx === state.playList.length - 1) {
		// If last song on play list, stop playing.
		return Object.assign({}, state, {
			isPlaying: false,
		});
	} else if (idx < state.playList.length - 1) {
		// Play the next song.
		mediaId = playList[idx + 1];
		return Object.assign({}, state, {
			mediaId,
			stepsHistoryBack: 0,
			sessionHistory: [...state.sessionHistory, state.currentMedia.id],
			currentMedia: state.entities[mediaId],
			isPlaying: true,
		});
	}
	return state;
}

const mediaPlayer = (state = initialState, action) => {
	let idx;
	let mediaId;
	let entities;
	let queue;
	let tags;
	let mediaIds;
	let tag;
	let tagsOrdered;
	let playList = state.currentPlayList ? state.tags[state.currentPlayList] : state.playList;
	switch (action.type) {
	case 'ERROR': {
		return Object.assign({}, state, {
			errorMessages: [...state.errorMessages, action.message],
		});
	}
	case 'DB_INIT_SUCCESS': {
		return Object.assign({}, state, { db: action.db });
	}
	case 'DB_SET_SUCCESS': {
		entities = Object.assign({}, state.entities);
		entities[action.data.id].saved = true;
		return Object.assign({}, state, {
			entities,
		});
	}
	case 'DB_GETALL_SUCCESS': {
		return Object.assign({}, state, {
			entities: Object.assign({}, state.entities, action.entities),
		});
		// case 'DB_GET_PLAYLIST_SUCCESS':
		// 	return Object.assign({}, state, {
		// 		playList: action.playList,
		// 	});
	}
	case 'VIDEO_ERROR': {
		entities = Object.assign({}, state.entities);
		entities[action.video.id] = Object.assign({}, action.video, {
			errorMessage: action.message,
			hasError: true,
		});
		return Object.assign({}, next(state), {
			entities,
		});
	}
	case 'ADD_VIDEOS': {
		entities = Object.assign({}, state.entities);
		action.videos.forEach((v) => {
			entities[v.id] = Object.assign({}, videoBaseObject, {
				title: v.snippet.title,
				duration: duration(v.contentDetails.duration),
				id: v.id,
			});
		});
		return Object.assign({}, state, {
			playList: [...state.playList, ...action.videos.map(v => v.id).filter(id => !state.playList.includes(id))],
			entities,
		});
	}
	case 'UPGRADE_PLAYLIST': {
		const seen = {};
		const filteredPlaylist = [];
		state.playList.forEach((id) => {
			if (!seen[id] && state.entities[id]) {
				seen[id] = true;
				filteredPlaylist.push(id);
			}
		});
		entities = {};
		Object.keys(state.entities).forEach((key) => {
			entities[key] = Object.assign({}, videoBaseObject, state.entities[key]);
		});
		return Object.assign({}, state, {
			playList: [...filteredPlaylist],
			entities,
		});
	}
	case 'IMPORT_PLAYLIST': {
		entities = Object.assign({}, state.entities, action.data.entities);
		playList = [...playList, ...action.data.playList.filter(id => !playList.includes(id))];
		if (state.currentPlayList) {
			tags = Object.assign({}, state.tags);
			tags[state.currentPlayList] = playList;
			return Object.assign({}, state, {
				tags,
				entities,
			});
		}
		return Object.assign({}, state, {
			playList,
			entities,
		});
	}
	case 'IMPORT_OTHER_PLAYLIST': {
		if (!state.currentPlayList) {
			return Object.assign({}, state, {
				playList: [...state.playList, ...state.tags[action.playListName].filter(id => !state.playList.includes(id))],
			});
		}
		tags = Object.assign({}, state.tags);
		const currentPlayList = [...tags[state.currentPlayList]];
		tags[state.currentPlayList] = [...currentPlayList, ...state.tags[action.playListName].filter(id => !currentPlayList.includes(id))];
		return Object.assign({}, state, {
			tags,
		});
	}
	case 'RENAME_PLAYLIST': {
		if (state.tags[action.newName]) return state;
		tags = Object.assign({}, state.tags);
		tags[action.newName] = tags[action.oldName];
		tagsOrdered = [...state.tagsOrdered];
		tagsOrdered[tagsOrdered.indexOf(action.oldName)] = action.newName;
		delete tags[action.oldName];
		return Object.assign({}, state, {
			tags,
			tagsOrdered,
			currentPlayList: action.newName,
		});
	}
	case 'REMOVE_VIDEO': {
		entities = Object.assign({}, state.entities);
		entities[action.video.id].deleted = true;
		return Object.assign({}, state, {
			playList: state.playList.filter(id => id !== action.video.id),
			entities,
		});
	}
	case 'ADD_SEARCH_RESULT': {
		entities = Object.assign({}, state.entities);
		entities[action.video.id] = action.video;
		tags = Object.assign({}, state.tags);
		if (state.currentPlayList) tags[state.currentPlayList] = [...tags[state.currentPlayList], action.video.id];
		if (state.playList.includes(action.video.id)) {
			return Object.assign({}, state, {
				tags,
			});
		}
		return Object.assign({}, state, {
			playList: [...state.playList, action.video.id],
			entities,
			tags,
		});
	}
	case 'PAUSE': {
		return Object.assign({}, state, {
			isPlaying: false,
			entities: state.entities,
		});
	}
	case 'PLAY': {
		if (action.mediaId) mediaId = action.mediaId;
		else mediaId = !state.mediaId ? state.playList[0] : state.mediaId;
		let currentMedia = {};
		if (action.currentMedia) {
			const newEntity = {};
			newEntity[mediaId] = action.currentMedia;
			entities = Object.assign({}, state.entities, newEntity);
			currentMedia = action.currentMedia;
		} else {
			currentMedia = state.entities[mediaId];
			entities = state.entities;
		}
		return Object.assign({}, state, {
			isPlaying: !!(currentMedia || state.playList.length),
			mediaId,
			stepsHistoryBack: 0,
			sessionHistory: [...state.sessionHistory, state.currentMedia.id],
			currentMedia,
			entities,
		});
	}
	case 'TOGGLE_SHUFFLE': {
		return Object.assign({}, state, {
			shuffle: !state.shuffle,
		});
	}
	case 'TOGGLE_MUTE': {
		return Object.assign({}, state, {
			mute: !state.mute,
		});
	}
	case 'NEXT_VIDEO': {
		return next(state);
	}
	case 'PREV_VIDEO': {
		if (state.sessionHistory.length >= (-1 * state.stepsHistoryBack)) {
			mediaId = state.sessionHistory[state.sessionHistory.length - state.stepsHistoryBack - 1 ];
			return Object.assign({}, state, {
				mediaId,
				stepsHistoryBack: state.stepsHistoryBack - 1,
				sessionHistory: [...state.sessionHistory, state.currentMedia.id],
				currentMedia: state.entities[mediaId],
				isPlaying: true,
			});
		}
		return state;
	}
	case 'QUEUE_MEDIA': {
		return Object.assign({}, state, {
			queue: [...state.queue, action.id],
		});
	}
	case 'QUEUE_PLAY_INDEX': {
		queue = [...state.queue];
		mediaId = queue.splice(action.idx, 1)[0];
		return Object.assign({}, state, {
			queue: [...queue],
			mediaId,
			stepsHistoryBack: 0,
			sessionHistory: [...state.sessionHistory, state.currentMedia.id],
			currentMedia: state.entities[mediaId],
			isPlaying: true,
		});
	}
	case 'QUEUE_REMOVE_INDEX': {
		queue = [...state.queue];
		queue.splice(action.idx, 1);
		return Object.assign({}, state, {
			queue: [...queue],
		});
	}
	case 'FILTER_PLAYLIST': {
		return Object.assign({}, state, {
			filterQuery: action.query,
		});
	}
	case 'SET_CURRENT_TIME': {
		return Object.assign({}, state, {
			currentTime: action.time,
		});
	}
	case 'SKIP_TO_TIME': {
		return Object.assign({}, state, {
			skipToTime: action.s,
		});
	}
	case 'MOVE_PLAYLIST_MEDIA': {
		if (state.currentPlayList) {
			tags = Object.assign({}, state.tags);
			tags[state.currentPlayList] = action.playList;
			return Object.assign({}, state, {
				tags,
			});
		}
		return Object.assign({}, state, {
			playList: action.playList,
		});
	}
	case 'ADD_TAGS': {
		mediaIds = action.mediaIds || [];
		tag = action.tag || state.currentPlayList;
		if (action.tag === '') { // if we want to use the current playlist action.tag === undefined
			let counter = 1;
			do {
				tag = `Playlist ${counter}`;
			} while (state.tags[`Playlist ${counter++}`]);
		}
		tagsOrdered = [...state.tagsOrdered];
		if (!tagsOrdered.includes(tag)) tagsOrdered.push(tag);
		if (state.tags[tag]) mediaIds = [...state.tags[tag], ...mediaIds];
		tags = Object.assign({}, state.tags);
		tags[tag] = mediaIds;
		return Object.assign({}, state, {
			tags,
			tagsOrdered,
		});
	}
	case 'REMOVE_TAGS': {
		mediaIds = action.mediaIds || [];
		tag = action.tag || state.currentPlayList;
		if (!tag) return state;
		if (state.tags[tag]) mediaIds = state.tags[tag].filter(id => !mediaIds.includes(id));
		tags = Object.assign({}, state.tags);
		tags[tag] = mediaIds;
		return Object.assign({}, state, {
			tags,
		});
	}
	case 'SELECT_PLAYLIST': {
		return Object.assign({}, state, {
			currentPlayList: action.playListName,
			editPlayList: false,
		});
	}
	case 'DELETE_PALYLIST': {
		tags = Object.assign({}, state.tags);
		delete tags[action.playListName];
		return Object.assign({}, state, {
			tags,
		});
	}
	case 'TOGGLE_EDIT_PALYLIST': {
		return Object.assign({}, state, {
			editPlayList: action.state !== undefined ? action.state : !state.editPlayList,
			currentPlayList: action.playListName ? action.playListName : state.currentPlayList,
		});
	}
	case 'RECOVER_STATE': {
		return Object.assign({}, state, action.state);
	}
	case 'SET_YOUTUBE_API_KEY': {
		if (!action.youtubeApiKey) return Object.assign({}, state, { youtubeApiKey });
		return Object.assign({}, state, { youtubeApiKey: action.youtubeApiKey });
	}
	case 'SET_PASTEBIN_API_KEY': {
		if (!action.pastebinApiKey) return Object.assign({}, state, { pastebinApiKey });
		return Object.assign({}, state, { pastebinApiKey: action.pastebinApiKey });
	}
	default: {
		return state;
	}
	}
};

export default mediaPlayer;
