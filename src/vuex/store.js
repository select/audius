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
	ajax,
	matrixClient,
	findYouTubeIdsText,
	getYouTubeInfo,
	hashCode
} from '../utils';
import { videoBaseObject } from './video';
import { youtubeApiKey } from '../utils/config';

const searchYoutubeDebounced = debounce((...args) => searchYoutube(...args), 500);

Vue.use(Vuex);

const presistMutation = {
	addSearchResult: ['entities', 'playList', 'tags'],
	dropSearchResult: ['entities', 'playList', 'tags'],
	importPlayList: ['entities', 'playList', 'tags'],
	toggleLeftMenu: ['showLeftMenu'],
	addTags: ['tagsOrdered', 'tags'],
	removeTags: ['tags'],
	selectPlayList: ['currentPlayList'],
	renamePlayList: ['tagsOrdered', 'tags', 'currentPlayList'],
	deletePlayList: ['tagsOrdered', 'tags'],
	toggleShuffle: ['shuffle'],
	setExportURL: ['exportURL'],
	movePlayListMedia: ['playList', 'tags'],
	moveTagsOrderd: ['tagsOrdered'],
	migrationSuccess: ['migration'],
	removeVideo: ['playList', 'entities'],
	setMatrixCredentials: ['matrix'],
};

/* eslint-disable no-param-reassign */
function play(state, mediaId, currentMedia) {
	if (!mediaId) {
		if (currentMedia) mediaId = currentMedia.id;
		else if (state.currentMedia) mediaId = state.currentMedia.id;
		else if (state.currentPlayList) mediaId = state.tags[state.currentPlayList][0];
		else mediaId = state.playList[0];
	}
	if (currentMedia) state.entities[mediaId] = currentMedia;
	state.mediaUrl = null;
	state.currentMedia = currentMedia || state.entities[mediaId];
	state.sessionHistory.push(mediaId);
	state.sessionHistoryPos = -1;
	state.isPlaying = !!(state.currentMedia || state.playList.length);
}

const getCurrenPlayList = state => {
	if (state.leftMenuTab === 'radio' && state.currentRadioStation) {
		return state.radioStations[state.currentRadioStation].playList;
	}
	return state.currentPlayList && !state.editPlayList
		? state.tags[state.currentPlayList]
		: state.playList;
};

function next(state) {
	const playList = getCurrenPlayList(state);
	const idx = playList.indexOf(state.currentMedia.id);
	let mediaId;
	if (state.queue.length) {
		// Play next song from queue.
		const queue = [...state.queue];
		mediaId = queue.shift();
		Object.assign(state, {
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
		currentMedia: {},
		mediaUrl: '',
		playList: [],
		tags: {},
		tagsOrdered: [],
		radioStations: {},
		radioStationsOrderd: [],
		currentRadioStation: '',
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
			'audius_0.03.1': false,
		},
		showLeftMenu: false,
		leftMenuTab: 'playList',
		showSettings: false,
		website: {
			showSearch: false,
			mainRightTab: 'about',
			showChat: false,
		},
		search: {
			query: '',
			isSearching: false,
			results: [],
		},
		matrixLoggedIn: false,
		matrixRooms: [],
		matrix: {
			hasCredentials: false,
			credentials: {
				accessToken: '',
				userId: '',
				deviceId: '',
			},
		},
	},
	getters: {
		playList(state) {
			if (state.currentPlayList) return state.tags[state.currentPlayList];
			return state.playList;
		},
		playListLength(state) {
			return state.playList.length;
		},
		filteredPlayList(state) {
			const playList = getCurrenPlayList(state);
			if (!state.filterQuery) return playList.filter(id => state.entities[id]);
			return playList.filter(id =>
				state.entities[id].title.toLowerCase().includes(state.filterQuery)
			);
		},
		filteredPlayListLength(state, getters) {
			if (!getters.filteredPlayList) return 0;
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
			return hlength > 0 && state.sessionHistoryPos < hlength - 1;
		},
	},
	/* eslint-disable no-param-reassign */
	mutations: {
		recoverState(state, recoveredState) {
			state = Object.assign(state, recoveredState);
		},
		searchYoutubeSuccess(state, results) {
			state.website.mainRightTab = 'search';
			state.search.isSearching = false;
			state.search.results = results.map(v =>
				Object.assign({}, videoBaseObject, {
					title: v.snippet.title,
					duration: duration(v.contentDetails.duration),
					durationS: time2s(duration(v.contentDetails.duration)),
					isPlaying: false,
					id: v.id,
					deleted: false,
					type: 'youtube',
				})
			);
		},
		audioSearchSuccess(state, url) {
			state.website.mainRightTab = 'search';
			state.search.isSearching = false;
			state.search.results = [
				Object.assign({}, videoBaseObject, {
					url,
					title: url,
					duration: 0,
					durationS: { h: 0, m: 0, s: 0 },
					isPlaying: false,
					id: hashCode(url),
					deleted: false,
					type: 'audio',
				}),
			];
		},
		toggleSearch(state, toggleState) {
			state.website.showSearch = toggleState !== undefined
				? toggleState
				: !state.website.showSearch;
		},
		setMainRightTab(state, id) {
			state.website.mainRightTab = id === state.mainRightTab ? '' : id;
		},
		setLeftMenuTab(state, id) {
			state.leftMenuTab = id;
		},
		showChat(state) {
			state.website.mainRightTab = 'search';
			state.website.showChat = true;
		},
		setShowSettings(state) {
			state.showSettings = true;
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
		toggleLeftMenu(state) {
			state.showLeftMenu = !state.showLeftMenu;
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
			if (state.leftMenuTab === 'playList') {
				state.entities[video.id] = video;
				const id = video.id;
				if (state.currentPlayList) {
					if (!state.tags[state.currentPlayList].includes(id)) {
						state.tags[state.currentPlayList].unshift(video.id);
					}
				} else if (!state.playList.includes(id)) {
					state.playList.unshift(id);
				}
			}
		},
		dropSearchResult(state, { itemId, playList }) {
			const video = state.search.results.find(item => item.id === itemId);
			state.entities[video.id] = video;
			const id = video.id;
			if (state.currentPlayList) {
				if (!state.tags[state.currentPlayList].includes(id)) {
					state.tags[state.currentPlayList] = playList;
				}
			} else if (!state.playList.includes(id)) {
				state.playList = playList;
			}
		},
		pause(state) {
			state.isPlaying = false;
		},
		play(state, options = {}) {
			const { mediaId, currentMedia } = options;
			play(state, mediaId, currentMedia);
			state.mediaUrl = null;
		},
		playPause(state) {
			if (state.mediaUrl) state.isPlaying = !state.isPlaying;
			else if (state.isPlaying) state.isPlaying = false;
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
				const mediaId = state.sessionHistory[state.sessionHistory.length - 1 - sessionHistoryPos];
				state.mediaUrl = null;
				Object.assign(state, {
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
			state.mediaUrl = null;
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
		moveTagsOrderd(state, tagsOrdered) {
			console.log('tagsOrdered', tagsOrdered);
			state.tagsOrdered = tagsOrdered;
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

			if (state.tags[tag]) {
				state.tags[tag] = [
					...state.tags[tag],
					...mediaIds.filter(id => !state.tags[tag].includes(id)),
				];
			} else state.tags[tag] = mediaIds;
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

		// Matrix Radio

		setMatrixCredentials(state, credentials) {
			state.matrix.hasCredentials = true;
			state.matrix.credentials = credentials;
		},
		setMatrixLoggedIn(state, rooms) {
			state.matrixLoggedIn = true;
			state.matrixRooms = rooms;
			rooms.forEach(room => {
				if (!(room.roomId in state.radioStations)) {
					state.radioStations[room.roomId] = { name: room.name, playList: [] };
					state.radioStationsOrderd.unshift(room.roomId);
				} else if (state.radioStations[room.roomId].name !== room.name) {
					state.radioStations[room.roomId].name = room.name;
				}
			});
		},
		matrixRemoveAccount(state) {
			state.matrix = {
				hasCredentials: false,
				credentials: {
					accessToken: '',
					userId: '',
					deviceId: '',
				},
			};
		},
		matrixLogout(state) {
			console.log('matrix log out');
			state.matrixLoggedIn = false;
			state.radioStations = {};
			state.radioStationsOrderd = [];
			state.currentRadioStation = '';
			// FIXIME this is async and could return a promis
			// after witch the state should be saved
			matrixClient.logout();
		},
		selectRadioStation(state, roomId) {
			state.currentRadioStation = roomId;
		},
		updateRadioStation(state, { roomId, entities, playList = [] }) {
			console.log('updateRadioStation ', roomId, playList, entities);
			const rs = state.radioStations[roomId];
			state.radioStations[roomId].playList = [...playList, ...rs.playList];
			state.entities = { ...state.entities, ...entities };
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
			const mp3RegEx = /.mp3$/;
			if (mp3RegEx.test(query) ) {
				commit('audioSearchSuccess', query);
			} else if (query) {
				searchYoutubeDebounced(state.youtubeApiKey, query, result => {
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
			ajax(url, data => {
				commit('importPlayList', data);
			});
		},
		exportToURL({ commit, getters }) {
			const data = {
				AudiusDump: true,
				playList: getters.filteredPlayList,
				entities: getters.currentEntities,
			};
			ajaxPostJSON('https://api.myjson.com/bins', JSON.stringify(data), res => {
				commit('setExportURL', JSON.parse(res).uri);
			});
		},
		initMatrix({ commit, state, dispatch }) {
			if (!state.matrix.hasCredentials) {
				console.log('create new matrix user');
				matrixClient
					.getCredentials()
					.then(credentials => commit('setMatrixCredentials', credentials))
					.then(() => matrixClient.login(state.matrix.credentials, dispatch))
					.then(rooms => commit('setMatrixLoggedIn', rooms));
			} else if (!state.matrixLoggedIn) {
				console.log('log into matrix');
				matrixClient
					.login(state.matrix.credentials, dispatch)
					.then(rooms => commit('setMatrixLoggedIn', rooms));
			}
		},
		loginMatrixWithPassword({ commit, state, dispatch }, { username, password }) {
			matrixClient
				.getCredentialsWithPassword(username, password)
				.then(credentials => commit('setMatrixCredentials', credentials))
				.then(() => matrixClient.login(state.matrix.credentials, dispatch))
				.then(rooms => commit('setMatrixLoggedIn', rooms));
		},
		parseMatrixMessage({ state, commit }, { roomId, message }) {
			const ids = findYouTubeIdsText(message)
				.filter(id => id) // filter empty
				.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates

			if (ids.length) {
				// get info for all new unknown ids
				getYouTubeInfo(
					ids.filter(id => !(id in state.entities)),
					state.youtubeApiKey
				).then(results => {
					const entities = results.reduce(
						(acc, v) => ({
							// covert the raw result
							...acc,
							[v.id]: Object.assign({}, videoBaseObject, {
								title: v.snippet.title,
								duration: duration(v.contentDetails.duration),
								durationS: time2s(duration(v.contentDetails.duration)),
								isPlaying: false,
								id: v.id,
								deleted: false,
							}),
						}),
						{}
					);

					commit('updateRadioStation', {
						roomId,
						entities,
						playList: ids,
					});
				});
			}
		},
		matrixPaginate({ state }) {
			console.log('store paginate');
			matrixClient.paginate(state.currentRadioStation);
		},
		joinRadioStation({ commit }, roomIdOrAlias) {
			matrixClient.joinRoom(roomIdOrAlias).then(rooms => commit('setMatrixLoggedIn', rooms));
		},
	},
});