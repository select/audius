import Vue from 'vue';
import Vuex from 'vuex';

import { indexDB } from '../utils';
import { videoBaseObject } from './video';
import { youtubeApiKey, pastebinApiKey } from '../utils/config';
import { duration } from '../utils/timeConverter';

Vue.use(Vuex);

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

export const store = new Vuex.Store({
	state: {
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
		website: {
			showSearch: false,
			showJump: false,
			mainRightTab: 'about',
			showChat: false,
			showImport: false,
			showPlayLists: false,
		},
	},
	getters: {
		totalMovies(state, getters) {
			return getters.movies.length;
		},
	},
	mutations: {
		// toggleRemoved(state, { imdbId }) {
		// 	if (state.removed.includes(imdbId)) state.removed = state.removed.filter(id => id !== imdbId);
		// 	else state.removed.push(imdbId);
		// },
		ERROR(state, message) {
			return Object.assign({}, state, {
				errorMessages: [...state.errorMessages, message],
			});
		},
		DB_INIT_SUCCESS(state, db) {
			return Object.assign({}, state, { db });
		},
		DB_SET_SUCCESS(state, data) {
			const entities = Object.assign({}, state.entities);
			entities[data.id].saved = true;
			return Object.assign({}, state, {
				entities,
			});
		},
		DB_GETALL_SUCCESS(state, entities) {
			return Object.assign({}, state, {
				entities: Object.assign({}, state.entities, entities),
			});
			// DB_GET_PLAYLIST_SUCCE(state)':
			// 	return Object.assign({}, state, {
			// 		playList: action.playList,
			// 	});
		},
		VIDEO_ERROR(state, { video, message }) {
			const entities = Object.assign({}, state.entities);
			entities[video.id] = Object.assign({}, video, {
				errorMessage: message,
				hasError: true,
			});
			return Object.assign({}, next(state), {
				entities,
			});
		},
		ADD_VIDEOS(state, videos) {
			const entities = Object.assign({}, state.entities);
			videos.forEach((v) => {
				entities[v.id] = Object.assign({}, videoBaseObject, {
					title: v.snippet.title,
					duration: duration(v.contentDetails.duration),
					id: v.id,
				});
			});
			return Object.assign({}, state, {
				playList: [
					...state.playList,
					...videos.map(v => v.id).filter(id => !state.playList.includes(id)),
				],
				entities,
			});
		},
		UPGRADE_PLAYLIST(state) {
			const seen = {};
			const filteredPlaylist = [];
			state.playList.forEach((id) => {
				if (!seen[id] && state.entities[id]) {
					seen[id] = true;
					filteredPlaylist.push(id);
				}
			});
			const entities = {};
			Object.keys(state.entities).forEach(key => {
				entities[key] = Object.assign({}, videoBaseObject, state.entities[key]);
			});
			return Object.assign({}, state, {
				playList: [...filteredPlaylist],
				entities,
			});
		},
		IMPORT_PLAYLIST(state, data) {
			let playList = state.currentPlayList ? state.tags[state.currentPlayList] : state.playList;
			const entities = Object.assign({}, state.entities, data.entities);
			playList = [...playList, ...data.playList.filter(id => !playList.includes(id))];
			if (state.currentPlayList) {
				const tags = Object.assign({}, state.tags);
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
		},
		IMPORT_OTHER_PLAYLIST(state, playListName) {
			if (!state.currentPlayList) {
				return Object.assign({}, state, {
					playList: [
						...state.playList,
						...state.tags[playListName].filter(id => !state.playList.includes(id)),
					],
				});
			}
			const tags = Object.assign({}, state.tags);
			const currentPlayList = [...tags[state.currentPlayList]];
			tags[state.currentPlayList] = [
				...currentPlayList,
				...state.tags[playListName].filter(id => !currentPlayList.includes(id)),
			];
			return Object.assign({}, state, {
				tags,
			});
		},
		RENAME_PLAYLIST(state, { newName, oldName }) {
			if (state.tags[newName]) return state;
			const tags = Object.assign({}, state.tags);
			tags[newName] = tags[oldName];
			const tagsOrdered = [...state.tagsOrdered];
			tagsOrdered[tagsOrdered.indexOf(oldName)] = newName;
			delete tags[oldName];
			return Object.assign({}, state, {
				tags,
				tagsOrdered,
				currentPlayList: newName,
			});
		},
		REMOVE_VIDEO(state, video) {
			const entities = Object.assign({}, state.entities);
			entities[video.id].deleted = true;
			return Object.assign({}, state, {
				playList: state.playList.filter(id => id !== video.id),
				entities,
			});
		},
		ADD_SEARCH_RESULT(state, video) {
			const entities = Object.assign({}, state.entities);
			entities[video.id] = video;
			const tags = Object.assign({}, state.tags);
			if (state.currentPlayList) {
				tags[state.currentPlayList] = [...tags[state.currentPlayList], video.id];
			}
			if (state.playList.includes(video.id)) {
				return Object.assign({}, state, {
					tags,
				});
			}
			return Object.assign({}, state, {
				playList: [...state.playList, video.id],
				entities,
				tags,
			});
		},
		PAUSE(state) {
			return Object.assign({}, state, {
				isPlaying: false,
				entities: state.entities,
			});
		},
		PLAY(state, { mediaIdIn, currentMediaIn }) {
			let mediaId = mediaIdIn;
			if (!mediaIdIn) mediaId = !state.mediaId ? state.playList[0] : state.mediaId;
			let currentMedia = {};
			let entities;
			if (currentMediaIn) {
				const newEntity = {};
				newEntity[mediaId] = currentMedia;
				entities = Object.assign({}, state.entities, newEntity);
				currentMedia = currentMediaIn;
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
		},
		TOGGLE_SHUFFLE(state) {
			return Object.assign({}, state, {
				shuffle: !state.shuffle,
			});
		},
		TOGGLE_MUTE(state) {
			return Object.assign({}, state, {
				mute: !state.mute,
			});
		},
		NEXT_VIDEO(state) {
			return next(state);
		},
		PREV_VIDEO(state) {
			if (state.sessionHistory.length >= -1 * state.stepsHistoryBack) {
				const mediaId =
					state.sessionHistory[state.sessionHistory.length - state.stepsHistoryBack - 1];
				return Object.assign({}, state, {
					mediaId,
					stepsHistoryBack: state.stepsHistoryBack - 1,
					sessionHistory: [...state.sessionHistory, state.currentMedia.id],
					currentMedia: state.entities[mediaId],
					isPlaying: true,
				});
			}
			return state;
		},
		QUEUE_MEDIA(state, id) {
			return Object.assign({}, state, {
				queue: [...state.queue, id],
			});
		},
		QUEUE_PLAY_INDEX(state, index) {
			const queue = [...state.queue];
			const mediaId = queue.splice(index, 1)[0];
			return Object.assign({}, state, {
				queue: [...queue],
				mediaId,
				stepsHistoryBack: 0,
				sessionHistory: [...state.sessionHistory, state.currentMedia.id],
				currentMedia: state.entities[mediaId],
				isPlaying: true,
			});
		},
		QUEUE_REMOVE_INDEX(state, index) {
			const queue = [...state.queue];
			queue.splice(index, 1);
			return Object.assign({}, state, {
				queue: [...queue],
			});
		},
		FILTER_PLAYLIST(state, query) {
			return Object.assign({}, state, {
				filterQuery: query,
			});
		},
		SET_CURRENT_TIME(state, time) {
			return Object.assign({}, state, {
				currentTime: time,
			});
		},
		SKIP_TO_TIME(state, s) {
			return Object.assign({}, state, {
				skipToTime: s,
			});
		},
		MOVE_PLAYLIST_MEDIA(state, playList) {
			if (state.currentPlayList) {
				const tags = Object.assign({}, state.tags);
				tags[state.currentPlayList] = playList;
				return Object.assign({}, state, {
					tags,
				});
			}
			return Object.assign({}, state, {
				playList,
			});
		},
		ADD_TAGS(state, { mediaIdsIn = [], tagIn }) {
			let mediaIds = mediaIdsIn;
			let tag = tagIn || state.currentPlayList;
			if (tag === '') {
				// if we want to use the current playlist action.tag === undefined
				let counter = 1;
				do {
					tag = `Playlist ${counter}`;
				} while (state.tags[`Playlist ${counter++}`]);
			}
			const tagsOrdered = [...state.tagsOrdered];
			if (!tagsOrdered.includes(tag)) tagsOrdered.push(tag);
			if (state.tags[tag]) mediaIds = [...state.tags[tag], ...mediaIds];
			const tags = Object.assign({}, state.tags);
			tags[tag] = mediaIds;
			return Object.assign({}, state, {
				tags,
				tagsOrdered,
			});
		},
		REMOVE_TAGS(state, { mediaIdsIn = [], tagIn }) {
			let mediaIds = mediaIdsIn;
			const tag = tagIn || state.currentPlayList;
			if (!tag) return state;
			if (state.tags[tag]) mediaIds = state.tags[tag].filter(id => !mediaIds.includes(id));
			const tags = Object.assign({}, state.tags);
			tags[tag] = mediaIds;
			return Object.assign({}, state, {
				tags,
			});
		},
		SELECT_PLAYLIST(state, playListName) {
			return Object.assign({}, state, {
				currentPlayList: playListName,
				editPlayList: false,
			});
		},
		DELETE_PALYLIST(state, playListName) {
			const tags = Object.assign({}, state.tags);
			delete tags[playListName];
			return Object.assign({}, state, {
				tags,
			});
		},
		TOGGLE_EDIT_PALYLIST(state, { toggleState, playListName }) {
			return Object.assign({}, state, {
				editPlayList: toggleState !== undefined ? toggleState : !state.editPlayList,
				currentPlayList: playListName || state.currentPlayList,
			});
		},
		RECOVER_STATE(state, toggleState) {
			return Object.assign({}, state, toggleState);
		},
		SET_YOUTUBE_API_KEY(state, youtubeApiKeyIn) {
			if (!youtubeApiKeyIn) return Object.assign({}, state, { youtubeApiKey });
			return Object.assign({}, state, { youtubeApiKey: youtubeApiKeyIn });
		},
		SET_PASTEBIN_API_KEY(state, pastebinApiKeyIn) {
			if (!pastebinApiKeyIn) return Object.assign({}, state, { pastebinApiKey });
			return Object.assign({}, state, { pastebinApiKey: pastebinApiKeyIn });
		},
	},
	plugins: [
		vstore => {
			vstore.subscribe((mutation, state) => {
				if (mutation.payload && mutation.payload.presist) {
					indexDB
						.writeStore()
						.put(state[mutation.payload.presist], mutation.payload.presist).onerror = event =>
						console.warn(`DB Error ${event.target.error.name}`);
				}
			});
		},
	],
	// actions: {
	// 	register({ commit }, userId) {
	// 		setTimeout(() => {
	// 			commit('register', userId);
	// 		}, 1000);
	// 	},
	// },
});
