import Vue from 'vue';
import Vuex from 'vuex';

import {
	indexDB,
	duration,
	time2s,
	s2time,
	searchYoutube,
	debounce,
	importPlayListFromString,
	ajaxPostJSON,
	ajax
} from '../utils';
import { videoBaseObject } from './video';
import { youtubeApiKey } from '../utils/config';

const searchYoutubeDebounced = debounce((...args) => searchYoutube(...args), 500);


Vue.use(Vuex);

const presistMutation = {
	addSearchResult: ['entities', 'playList', 'tags'],
	importPlayList: ['entities', 'playList', 'tags'],
	togglePlayLists: ['website'],
	addTags: ['tagsOrdered', 'tags'],
	removeTags: ['tags'],
	selectPlayList: ['currentPlayList'],
	renamePlayList: ['tagsOrdered', 'tags', 'currentPlayList'],
	deletePlayList: ['tagsOrdered', 'tags'],
	toggleShuffle: ['shuffle'],
	setExportURL: ['exportURL'],
	movePlayListMedia: ['playList', 'tags'],
	migrationSuccess: ['migration'],
};

/* eslint-disable no-param-reassign */
function play(state, mediaId, currentMedia) {
	if (!mediaId) {
		if (currentMedia) mediaId = currentMedia.id;
		else if (state.mediaId) mediaId = state.mediaId;
		else if (state.currentPlayList) mediaId = state.tags[state.currentPlayList][0];
		else mediaId = state.playList[0];
	}
	if (currentMedia) state.entities[mediaId] = currentMedia;
	state.mediaId = mediaId;
	state.currentMedia = currentMedia || state.entities[mediaId];
	state.sessionHistory.push(mediaId);
	state.sessionHistoryPos = -1;
	state.isPlaying = !!(state.currentMedia || state.playList.length);
}

const getCurrenPlayList = state => state.currentPlayList ? state.tags[state.currentPlayList] : state.playList;

function next(state) {
	const playList = getCurrenPlayList(state);
	const idx = playList.indexOf(state.mediaId);
	let mediaId;
	if (state.queue.length) {
		// Play next song from queue.
		const queue = [...state.queue];
		mediaId = queue.shift();
		Object.assign(state, {
			mediaId,
			sessionHistoryPos: -1,
			sessionHistory: [...state.sessionHistory, mediaId],
			currentMedia: state.entities[mediaId],
			queue: [...queue],
			isPlaying: true,
		});
	} else if (state.shuffle) {
		// Play a random song.
		let count = 0;
		do {
			mediaId = playList[Math.floor(Math.random() * playList.length)];
			count++;
			// only try to find a new song 50 times or we can end up in an endless loop
		} while (state.sessionHistory.includes(mediaId) && count < 50);
		Object.assign(state, {
			mediaId,
			sessionHistoryPos: -1,
			sessionHistory: [...state.sessionHistory, mediaId],
			currentMedia: state.entities[mediaId],
			isPlaying: true,
		});
	} else if (state.sessionHistoryPos > 0) {
		// we are in the history, replay history don't change the history while replaying
		const sessionHistoryPos = --state.sessionHistoryPos;
		mediaId = state.sessionHistory[sessionHistoryPos];
		Object.assign(state, {
			mediaId,
			sessionHistoryPos,
			currentMedia: state.entities[mediaId],
			isPlaying: true,
		});
	} else if (idx === playList.length - 1) {
		// If last song on play list, stop playing.
		state.isPlaying = false;
	} else if (idx < playList.length - 1) {
		// Play the next song.
		mediaId = playList[idx + 1];
		Object.assign(state, {
			mediaId,
			sessionHistoryPos: -1,
			sessionHistory: [...state.sessionHistory, mediaId],
			currentMedia: state.entities[mediaId],
			isPlaying: true,
		});
	}
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
		sessionHistoryPos: -1,
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
		showImport: false,
		showExport: false,
		showJump: false,
		jumpCursor: '',
		exportURL: '',
		migration: {
			'audius_0.03': false,
		},
		website: {
			showSearch: false,
			mainRightTab: 'about',
			showChat: false,
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
			return state.tagsOrdered.map(tagName => ({ name: tagName, playList: state.tags[tagName] }));
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
		currentEntities(state) {
			const playList = getCurrenPlayList(state);
			return playList.reduce((entities, id) => ({ ...entities, [id]: state.entities[id] }), {});
		},
		currentTimeObj(state) {
			return s2time(state.currentTime);
		},
		progressWidth(state) {
			return state.currentTime / state.currentMedia.durationS * 100;
		},
		youtubeApiKeyUI(state) {
			return state.youtubeApiKey === youtubeApiKey ? '' : state.youtubeApiKey;
		},
		sessionHistoryHasPrev(state) {
			const hlength = state.sessionHistory.length;
			return (hlength > 0) && state.sessionHistoryPos < (hlength - 1);
		},
	},
	/* eslint-disable no-param-reassign */
	mutations: {
		recoverState(state, recoveredState) {
			state = Object.assign(state, recoveredState);
		},
		searchYoutubeSuccess(state, results) {
			state.website.mainRightTab = 'search';
			state.youtube.isSearching = false;
			state.youtube.results = results.map(v =>
				Object.assign({}, videoBaseObject, {
					title: v.snippet.title,
					duration: duration(v.contentDetails.duration),
					durationS: time2s(duration(v.contentDetails.duration)),
					isPlaying: false,
					id: v.id,
					deleted: false,
				})
			);
		},
		toggleSearch(state, toggleState) {
			state.website.showSearch = toggleState !== undefined
				? toggleState
				: !state.website.showSearch;
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
		toggleJump(state, toggleState) {
			state.showJump = toggleState !== undefined ? toggleState : !state.showJump;
			state.showImport = false;
			state.showExport = false;
			if (!state.showJump && state.jumpCursor) state.jumpCursor = '';
		},
		toggleImport(state, toggleState) {
			state.showImport = toggleState !== undefined ? toggleState : !state.showImport;
			if (state.showImport) state.showExport = false;
		},
		toggleExport(state, toggleState) {
			state.showExport = toggleState !== undefined ? toggleState : !state.showExport;
			if (state.showExport) state.showImport = false;
		},
		togglePlayLists(state) {
			state.website.showPlayLists = !state.website.showPlayLists;
		},
		// ----------------------------------------------------------
		error(state, message) {
			state.errorMessages = [...state.errorMessages, message];
		},
		videoError(state, message) {
			const video = state.currentMedia;

			const entities = Object.assign({}, state.entities);
			entities[video.id] = Object.assign({}, video, {
				errorMessage: message,
				hasError: true,
			});
			next(state);
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
		importPlayList(state, data) {
			let playList = getCurrenPlayList(state);
			playList = [...playList, ...data.playList.filter(id => !playList.includes(id))];
			if (state.currentPlayList) {
				state.tags[state.currentPlayList] = playList;
			} else {
				state.playList = playList;
			}
			state.entities = Object.assign({}, state.entities, data.entities);
		},
		importOtherPlayList(state, playListName) {
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
					state.tags[state.currentPlayList].unshift(video.id);
				}
			} else if (!state.playList.includes(id)) {
				state.playList.unshift(id);
			}
		},
		pause(state) {
			state.isPlaying = false;
		},
		play(state, options = {}) {
			const { mediaId, currentMedia } = options;
			play(state, mediaId, currentMedia);
		},
		playPause(state) {
			if (state.isPlaying) state.isPlaying = false;
			else if (state.playList.length) play(state);
		},
		toggleShuffle(state) {
			state.shuffle = !state.shuffle;
		},
		toggleMute(state) {
			state.mute = !state.mute;
		},
		nextVideo(state) {
			next(state);
		},
		previousVideo(state) {
			if (state.sessionHistory.length >= -1 * state.sessionHistoryPos) {
				const sessionHistoryPos = state.sessionHistoryPos + 1;
				const mediaId =
					state.sessionHistory[state.sessionHistory.length - 1 - sessionHistoryPos];
				Object.assign(state, {
					mediaId,
					sessionHistoryPos,
					currentMedia: state.entities[mediaId],
					isPlaying: true,
				});
			}
		},
		queue(state, id) {
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
		setCurrentTime(state, time) {
			state.currentTime = time;
		},
		skipToTime(state, s) {
			state.skipToTime = s;
		},
		movePlayListMedia(state, playList) {
			if (state.currentPlayList) state.tags[state.currentPlayList] = playList;
			else state.playList = playList;
		},
		addTags(state, { mediaIds = [], tag }) {
			if (mediaIds.length) tag = tag || state.currentPlayList;
			if (!tag) {
				// if we want to use the current playlist action.tag === undefined
				let counter = 1;
				do {
					tag = `Playlist ${counter}`;
				} while (state.tags[`Playlist ${counter++}`]);
			}

			if (!state.tagsOrdered.includes(tag)) state.tagsOrdered.push(tag);

			if (state.tags[tag]) state.tags[tag] = [...state.tags[tag], ...mediaIds.filter(id => !state.tags[tag].includes(id))];
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
			state.tagsOrdered = state.tagsOrdered.filter(name => name !== playListName);
		},
		toggleEditPlayList(state, { toggleState, playListName }) {
			state.editPlayList = toggleState !== undefined ? toggleState : !state.editPlayList;
			state.currentPlayList = playListName || state.currentPlayList;
		},
		setYoutubeApiKey(state, youtubeApiKeyIn) {
			if (!youtubeApiKeyIn) state.youtubeApiKey = youtubeApiKey;
			else state.youtubeApiKey = youtubeApiKeyIn;
		},
		setExportURL(state, url) {
			state.exportURL = url;
		},
		migrationSuccess(state, { version, toggleState }) {
			state.migration[version] = toggleState;
		},
	},
	plugins: [
		vstore => {
			vstore.subscribe((mutation, state) => {
				const presistStates = presistMutation[mutation.type];
				if (presistStates !== undefined) {
					presistStates.forEach(stateName => {
						indexDB.writeStore().put(state[stateName], stateName).onerror = event =>
							console.warn(`DB Error ${event.target.error.name}`);
					});
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
		search({ commit, state }, query) {
			if (query) {
				searchYoutubeDebounced(state.youtubeApiKey, query, (result) => {
					commit('searchYoutubeSuccess', result);
				});
			}
		},
		importPlayListFromString({ commit }, importString) {
			importPlayListFromString(importString).then((data, error) => {
				if (error) {
					commit('error', error);
				} else {
					commit('importPlayList', data);
				}
			});
		},
		importURL({ commit }, url) {
			ajax(url, (data) => { commit('importPlayList', data); });
		},
		exportToURL({ commit, getters }) {
			const data = {
				AudiusDump: true,
				playList: getters.filteredPlayList,
				entities: getters.currentEntities,
			};
			ajaxPostJSON('https://api.myjson.com/bins', JSON.stringify(data), (res) => {
				commit('setExportURL', JSON.parse(res).uri);
			});
		},
	},
});
