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
};

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
	default:
		return state;
	}
};
