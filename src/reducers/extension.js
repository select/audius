import { duration } from '../utils/timeConverter';
import { videoBaseObject } from './video';
import { time2s } from '../utils/timeConverter';

const initialState = {
	errorMessages: '',
	entities: {},
	mediaId: '',
	playList: [],
	isPlaying: false,
	showPlayList: true,
	shuffle: false,
	mute: false,
	currentMedia: {},
	queue: [],
	show: true,
	audiusTabMissing: false,
};


function next(state) {
	const idx = state.playList.indexOf(state.mediaId);
	let mediaId;
	if (state.queue.length) {
		// Play next song from queue.
		const queue = [...state.queue];
		mediaId = queue.shift();
		return Object.assign({}, state, {
			mediaId: mediaId,
			queue: [...queue],
			isPlaying: true,
		});
	} else if (state.shuffle) {
		// Play a random song.
		return Object.assign({}, state, {
			mediaId: state.playList[Math.floor(Math.random() * state.playList.length)],
			isPlaying: true,
		});
	} else if (idx === state.playList.length - 1) {
		// If last song on play list, stop playing.
		return Object.assign({}, state, {
			isPlaying: false,
		});
	} else if (idx < state.playList.length - 1) {
		// Play the next song.
		mediaId = state.playList[idx + 1];
		return Object.assign({}, state, {
			mediaId,
			isPlaying: true,
		});
	}
	return state;
}

export default function extension(state = initialState, action) {
	let idx;
	let mediaId;
	let entities;
	let queue;
	switch (action.type) {
	case 'ERROR':
		return Object.assign({}, state, {
			errorMessages: [...state.errorMessages, action.message],
		});
	case 'EXTENSION_ADD_VIDEOS':
		entities = Object.assign({}, state.entities);
		action.videos.forEach((v) => {
			entities[v.id] = Object.assign({}, videoBaseObject, {
				title: v.snippet.title,
				duration: duration(v.contentDetails.duration),
				durationS: time2s(duration(v.contentDetails.duration)),
				id: v.id,
			});
		});
		return Object.assign({}, state, {
			playList: [...state.playList, ...action.videos.map(v => v.id).filter(id => !state.playList.includes(id))],
			entities,
		});
	case 'TOGGLE_PLAYLIST':
		return Object.assign({}, state, {
			showPlayList: !state.showPlayList,
		});
	case 'TOGGLE_MUTE':
		return Object.assign({}, state, {
			mute: !state.mute,
		});
	case 'TOGGLE_SHUFFLE':
		return Object.assign({}, state, {
			shuffle: !state.shuffle,
		});
	case 'PLAY':
		if (state.playList.length) {
			if (action.mediaId) mediaId = action.mediaId;
			else mediaId = !state.mediaId ? state.playList[0] : state.mediaId;
			return Object.assign({}, state, {
				isPlaying: true,
				mediaId,
				currentMedia: state.entities[mediaId],
			});
		}
		return state;
	case 'NEXT_VIDEO':
		return next(state);
	case 'PREV_VIDEO':
		idx = state.playList.indexOf(state.mediaId);
		if (idx > 0) {
			mediaId = state.playList[idx - 1];
			return Object.assign({}, state, {
				mediaId: state.playList[idx - 1],
				isPlaying: true,
			});
		}
		return state;
	case 'TOGGLE_EXTENSION':
		return Object.assign({}, state, {
			show: action.state !== undefined ? action.state : !state.show,
		})
	case 'ERROR_AUDIUS_TAB_MISSING':
		return Object.assign({}, state, {
			audiusTabMissing: true,
		});
	case 'AUDIUS_TAB_FOUND':
		return Object.assign({}, state, {
			audiusTabMissing: false,
		});
	default:
		return state;
	}
};
