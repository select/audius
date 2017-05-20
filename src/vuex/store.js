import Vue from 'vue';
import Vuex from 'vuex';

import { indexDB, injectScript, duration, s2time, searchYoutube, debounce } from '../utils';
import { videoBaseObject } from './video';
import { youtubeApiKey, pastebinApiKey } from '../utils/config';

const searchYoutubeDebounced = debounce((...args) => searchYoutube(...args), 500);


Vue.use(Vuex);


function _play(state, mediaId, currentMedia) {
	if (!mediaId) mediaId = !state.mediaId ? state.playList[0] : state.mediaId;
	state.mediaId = mediaId;
	state.currentMedia = currentMedia || state.entities[mediaId];
	state.sessionHistory.push(mediaId);
	state.sessionHistoryPos = 0;
	if (currentMedia) state.entities[mediaId] = currentMedia;
	state.isPlaying = !!(state.currentMedia || state.playList.length);
}

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
			sessionHistoryPos: 0,
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
			sessionHistoryPos: 0,
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
			sessionHistoryPos: 0,
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
		sessionHistoryPos: 0,
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
		youtube: {
			query: '',
			isSearching: false,
			results: [],
		},
	},
	getters: {
		tags(state) {
			return Object.keys(state.tags).map(key => ({ name: key, playList: state.tags[key] }));
		},
		playList(state) {
			if (state.currentPlayList) return state.tags[state.currentPlayList];
			return state.playList;
		},
		playListLength(state) {
			return state.playList.length;
		},
		filteredPlayList(state) {
			const playList = state.currentPlayList && !state.editPlayList
				? state.tags[state.currentPlayList]
				: state.playList;
			if (!state.filterQuery) return playList.filter(id => state.entities[id]);
			return playList.filter(id =>
				state.entities[id].title.toLowerCase().includes(state.filterQuery)
			);
		},
		filteredPlayListLength(state, getters) {
			return getters.filteredPlayList.length;
		},
		currentEntities(state, getters) {
			const playList = state.currentPlayList ? state.tags[state.currentPlayList] : state.playList;
			return playList.reduce((entities, id) => ({ ...entities, [id]: state.entities[id] }), {});
		},
		currentTimeObj(state) {
			return s2time(state.currentTime);
		},
		progressWidth(state) {
			if (!state.currentMedia) return 0;
			return state.currentTime / state.currentMedia.durationS * 100;
		},
	},
	/* eslint-disable no-param-reassign */
	mutations: {
		YOUTUBE_SEARCH_REQUEST(state, query) {
			state.youtube.query = query;
			state.youtube.isSearching = true;
		},
		YOUTUBE_SEARCH_ERROR(state) {
			state.youtube.isSearching = false;
		},
		searchYoutubeSuccess(state, results) {
			state.website.mainRightTab = 'search';
			state.youtube.isSearching = false;
			state.youtube.results = results.map(v =>
				Object.assign({}, videoBaseObject, {
					title: v.snippet.title,
					duration: duration(v.contentDetails.duration),
					isPlaying: false,
					id: v.id,
					deleted: false,
				})
			);
		},
		// -----------------------------------------------
		toggleSearch(state, toggleState) {
			state.website.showSearch = toggleState !== undefined
				? toggleState
				: !state.website.showSearch;
		},
		toggleJump(state, toggleState) {
			state.website.showJump = toggleState !== undefined ? toggleState : !state.website.showJump;
		},
		setMainRightTab(state, id) {
			state.website.mainRightTab = id === state.mainRightTab ? '' : id;
		},
		showChat(state) {
			state.website.mainRightTab = 'search';
			state.website.showChat = true;
		},
		showSettings(state) {
			state.website.showSettings = true;
			state.website.mainRightTab = 'settings';
		},
		toggleImport(state, toggleState) {
			state.website.showImport = toggleState !== undefined
				? toggleState
				: !state.website.showImport;
		},
		toggleExport(state, toggleState) {
			state.website.showExport = toggleState !== undefined
				? toggleState
				: !state.website.showExport;
		},
		togglePlayLists(state) {
			state.website.showPlayLists = !state.website.showPlayLists;
		},
		// ----------------------------------------------------------
		ERROR(state, message) {
			state.errorMessages = [...state.errorMessages, message];
		},
		DB_INIT_SUCCESS(state, db) {
			state.db = db;
		},
		DB_SET_SUCCESS(state, data) {
			state.entities[data.id].saved = true;
		},
		DB_GETALL_SUCCESS(state, entities) {
			state.entities = Object.assign({}, state.entities, entities);
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
			state = Object.assign({}, next(state), {
				entities,
			});
		},
		ADD_VIDEOS(state, videos) {
			const entities = Object.assign({}, state.entities);
			videos.forEach(v => {
				entities[v.id] = Object.assign({}, videoBaseObject, {
					title: v.snippet.title,
					duration: duration(v.contentDetails.duration),
					id: v.id,
				});
			});
			state.playList = [
				...state.playList,
				...videos.map(v => v.id).filter(id => !state.playList.includes(id)),
			];
			state.entities = entities;
		},
		UPGRADE_PLAYLIST(state) {
			const seen = {};
			const filteredPlaylist = [];
			state.playList.forEach(id => {
				if (!seen[id] && state.entities[id]) {
					seen[id] = true;
					filteredPlaylist.push(id);
				}
			});
			const entities = {};
			Object.keys(state.entities).forEach(key => {
				entities[key] = Object.assign({}, videoBaseObject, state.entities[key]);
			});
			state.playList = [...filteredPlaylist];
			state.entities = entities;
		},
		IMPORT_PLAYLIST(state, data) {
			let playList = state.currentPlayList ? state.tags[state.currentPlayList] : state.playList;
			const entities = Object.assign({}, state.entities, data.entities);
			playList = [...playList, ...data.playList.filter(id => !playList.includes(id))];
			if (state.currentPlayList) {
				const tags = Object.assign({}, state.tags);
				tags[state.currentPlayList] = playList;
				state.tags = tags;
				state.entities = entities;
			} else {
				state.playList = playList;
				state.entities = entities;
			}
		},
		IMPORT_OTHER_PLAYLIST(state, playListName) {
			if (!state.currentPlayList) {
				state.playList = [
					...state.playList,
					...state.tags[playListName].filter(id => !state.playList.includes(id)),
				];
			} else {
				const tags = Object.assign({}, state.tags);
				const currentPlayList = [...tags[state.currentPlayList]];
				tags[state.currentPlayList] = [
					...currentPlayList,
					...state.tags[playListName].filter(id => !currentPlayList.includes(id)),
				];
				state.tags = tags;
			}
		},
		renamePlayList(state, { newName, oldName }) {
			if (state.tags[newName]) return;
			const tags = Object.assign({}, state.tags);
			tags[newName] = tags[oldName];
			const tagsOrdered = [...state.tagsOrdered];
			tagsOrdered[tagsOrdered.indexOf(oldName)] = newName;
			delete tags[oldName];
			state.tags = tags;
			state.tagsOrdered = tagsOrdered;
			state.currentPlayList = newName;
		},
		removeVideo(state, video) {
			state.playList = state.playList.filter(id => id !== video.id);
			state.entities[video.id].deleted = true;
		},
		addSearchResult(state, video) {
			state.entities[video.id] = video;
			const id = video.id;
			if (state.currentPlayList) {
				if (!state.tags[state.currentPlayList].includes(id)) {
					state.tags[state.currentPlayList].push(video.id);
				}
			} else if (!state.playList.includes(id)) {
				state.playList.push(id);
			}
		},
		pause(state) {
			state.isPlaying = false;
		},
		play(state, { mediaId, currentMedia }) {
			_play(state, mediaId, currentMedia);
		},
		playPause(state) {
			if (state.isPlaying) state.isPlaying = false;
			else if (state.playList.length) _play(state);
		},
		toggleShuffle(state) {
			state.shuffle = !state.shuffle;
		},
		toggleMute(state) {
			state.mute = !state.mute;
		},
		nextVideo(state) {
			Object.assign(state, next(state));
		},
		previousVideo(state) {
			if (state.sessionHistory.length >= -1 * state.sessionHistoryPos) {
				const mediaId =
					state.sessionHistory[state.sessionHistory.length - state.sessionHistoryPos - 1];
				return Object.assign({}, state, {
					mediaId,
					sessionHistoryPos: state.sessionHistoryPos - 1,
					sessionHistory: [...state.sessionHistory, state.currentMedia.id],
					currentMedia: state.entities[mediaId],
					isPlaying: true,
				});
			}
			return state;
		},
		queueMedia(state, id) {
			state.queue.push(id);
			state.website.mainRightTab = 'queue';
		},
		queuePlayIndex(state, index) {
			const mediaId = state.queue.splice(index, 1)[0];
			state.mediaId = mediaId;
			state.isPlaying = true;
			state.currentMedia = state.entities[mediaId];
			state.sessionHistoryPos = 0;
			state.sessionHistory.push(state.currentMedia.id);
		},
		queueRemoveIndex(state, index) {
			state.queue.splice(index, 1);
		},
		filterPlayList(state, query) {
			state.filterQuery = query;
		},
		SET_CURRENT_TIME(state, time) {
			state.currentTime = time;
		},
		skipToTime(state, s) {
			state.skipToTime = s;
		},
		movePlayListMedia(state, playList) {
			if (state.currentPlayList) state.tags[state.currentPlayList] = playList;
			else state.playList = playList;
		},
		addTags(state, { mediaIds = [], tagIn }) {
			let tag = tagIn || state.currentPlayList;
			if (tag === '') {
				// if we want to use the current playlist action.tag === undefined
				let counter = 1;
				do {
					tag = `Playlist ${counter}`;
				} while (state.tags[`Playlist ${counter++}`]);
			}

			if (!state.tagsOrdered.includes(tag)) state.tagsOrdered.push(tag);

			if (state.tags[tag]) state.tags[tag].concat(mediaIds);
			else state.tags[tag] = mediaIds;
		},
		removeTags(state, { mediaIds = [], tag }) {
			tag = tag || state.currentPlayList;
			if (tag && state.tags[tag]) {
				state.tags[tag] = state.tags[tag].filter(id => !mediaIds.includes(id));
			}
		},
		selectPlayList(state, playListName) {
			state.currentPlayList = playListName;
			state.editPlayList = false;
		},
		deletePlayList(state, playListName) {
			delete state.tags[playListName];
		},
		toggleEditPlayList(state, { toggleState, playListName }) {
			state.editPlayList = toggleState !== undefined ? toggleState : !state.editPlayList;
			state.currentPlayList = playListName || state.currentPlayList;
		},
		RECOVER_STATE(state, toggleState) {
			state.toggleState = toggleState;
		},
		setYoutubeApiKey(state, youtubeApiKeyIn) {
			if (!youtubeApiKeyIn) state.youtubeApiKey = youtubeApiKey;
			else state.youtubeApiKey = youtubeApiKeyIn;
		},
		pastebinApiKey(state, pastebinApiKeyIn) {
			if (!pastebinApiKeyIn) state.pastebinApiKey = pastebinApiKey;
			else state.pastebinApiKey = pastebinApiKeyIn;
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
	actions: {
		register({ commit }, userId) {
			setTimeout(() => {
				commit('register', userId);
			}, 1000);
		},
		importURL({ commit }, url) {
			const pastebinRegEx = /http:\/\/pastebin.com\/(\w{8})/;
			if (pastebinRegEx.test(url)) {
				const match = pastebinRegEx.exec(url);
				url = `http://pastebin.com/raw/${match[1]}`;
			}
			injectScript(url, () => {
				commit('importPlayList', window.getAudiusPlaylist());
			});
		},
		search({ commit, state }, query) {
			searchYoutubeDebounced(state.youtubeApiKey, query, (result) => {
				commit('searchYoutubeSuccess', result);
			});
		},
	},
});

