import { webScraper } from '../utils';
import { youtubeApiKey } from '../utils/config';
import {
	getCurrentPlayListEntities,
	getCurrentPlayList,
	getCurrentName,
	getMediaEntity
} from './getCurrentPlayList';

const matrixRoomTemplate = () =>
	JSON.parse(
		JSON.stringify({
			name: '',
			playList: [],
			playedMedia: {},
			archive: [],
		})
	);

/* eslint-disable no-param-reassign */
function playMedia(state, media) {
	if (state.currentMatrixRoom) {
		state.matrixRooms[state.currentMatrixRoom].playedMedia[media.id] = new Date();
		state.matrixRooms = Object.assign({}, state.matrixRooms);
	} else if (state.currentWebScraper) {
		state.webScrapers[state.currentWebScraper].playedMedia[media.id] = new Date();
		state.webScrapers = Object.assign({}, state.webScrapers);
	}
	Object.assign(state, {
		sessionHistoryPos: -1,
		sessionHistory: [...state.sessionHistory, media],
		currentMedia: media,
		isPlaying: true,
	});
}

function selectMediaSource(state, { type, id }) {
	if (type === 'tv' || type === 'webscraper') {
		state.currentPlayList = null;
		state.currentMatrixRoom = null;
		state.currentWebScraper = id;
	} else if (type === 'radio' || type === 'matrix') {
		state.currentWebScraper = null;
		state.currentPlayList = null;
		state.currentMatrixRoom = id;
	} else if (type === 'playList') {
		state.currentWebScraper = null;
		state.currentMatrixRoom = null;
		state.currentPlayList = id;
	}
	if (state.isMobile) {
		state.leftMenuTab = '';
		state.mainRightTab = '';
	}
}

function addMissingMediaToEntities(state, playList) {
	playList
		.filter(id => !(id in state.entities))
		.map(id => state.search.results.find(item => item.id === id))
		.filter(media => media)
		.forEach(media => {
			state.entities[media.id] = media;
		});
}

function rename(state, type, newName, oldName) {
	if (state[type][newName]) return;
	const itemsObject = Object.assign({}, state[type]);
	itemsObject[newName] = itemsObject[oldName];
	const itemsOrdered = [...state[`${type}Ordered`]];
	itemsOrdered[itemsOrdered.indexOf(oldName)] = newName;
	delete itemsObject[oldName];
	state[type] = itemsObject;
	state[`${type}Ordered`] = itemsOrdered;
	state[type.includes('web') ? 'currentWebScraper' : 'currentPlayList'] = newName;
}

export function next(state) {
	const playListEntities = getCurrentPlayListEntities(state);
	const idx = playListEntities.findIndex(m => m.id === state.currentMedia.id);
	let media;
	if (state.repeat1) {
		state.skipToTime = state.currentMedia.start || 0;
	} else if (state.queue.length) {
		// Play next song from queue.
		const queue = [...state.queue];
		media = queue.shift();
		state.queue = [...queue];
		playMedia(state, media);
	} else if (state.shuffle) {
		// Play a random song.
		let count = 0;
		do {
			media = playListEntities[Math.floor(Math.random() * playListEntities.length)];
			count++;
			// Only try to find a new song 50 times or we can end up in an endless loop.
		} while (state.sessionHistory.some(m => m.id === media.id) && count < 50);
		playMedia(state, media);
	} else if (state.sessionHistoryPos > 0) {
		// we are in the history, replay history don't change the history while replaying
		const sessionHistoryPos = --state.sessionHistoryPos;
		media = state.sessionHistory[sessionHistoryPos];
		Object.assign(state, {
			sessionHistoryPos,
			currentMedia: media,
			isPlaying: true,
		});
	} else if (idx === playListEntities.length - 1) {
		if (state.repeatAll) {
			// Repeat all is set, so stat from the beginning again.
			media = playListEntities[0];
			playMedia(state, media);
		} else {
			// If last song on play list, stop playing.
			state.isPlaying = false;
			state.currentMedia = {};
		}
	} else if (idx < playListEntities.length - 1) {
		// Play the next song.
		let isLastTrack = false;
		if (state.currentMedia.isTrack) {
			const parent = state.entities[state.currentMedia.id];
			media = parent.tracks[state.currentMedia.trackId];
			if (state.currentMedia.trackId <= parent.tracks.length) {
				playMedia(state, media);
			} else {
				isLastTrack = true;
			}
		}
		if (!(state.currentMedia.isTrack || isLastTrack)) {
			media = playListEntities[idx + 1];
			playMedia(state, media);
		}
	}
}

function play(state, mediaId, media) {
	if (!(mediaId || media)) {
		if (state.currentMedia.id) state.isPlaying = true;
		else next(state);
	} else {
		const _media = media || state.entities[mediaId];
		if (_media) playMedia(state, _media);
	}
}

/* eslint-disable no-param-reassign */
export const mutations = {
	recoverState(state, recoveredState) {
		state = Object.assign(state, recoveredState);
		if (state.currentPlayList === null) state.currentPlayList = '';
	},
	searchYoutubeSuccess(state, { result, isPlayList, id }) {
		state.search.id = id;
		state.mainRightTab = 'search';
		state.search.isSearching = false;
		state.search.isPlayList = isPlayList;
		state.search.results = result;
	},
	webMediaSearchSuccess(state, { mediaList = [], id = null }) {
		console.log('webMediaSearchSuccess', id, mediaList);
		if (!mediaList.length) {
			state.errorMessages = [...state.errorMessages, { error: 'No media found (҂⌣̀_⌣́)ᕤ' }];
		} else {
			state.mainRightTab = 'search';
		}
		if (state.search.id !== id) {
			state.search.results = mediaList;
			state.search.id = id;
		} else {
			state.search.results = [...state.search.results, ...mediaList];
		}
	},
	toggleSearch(state, toggleState) {
		state.website.showSearch = toggleState !== undefined ? toggleState : !state.website.showSearch;
	},
	setMainRightTab(state, id) {
		state.mainRightTab = id === state.mainRightTab ? '' : id;
	},
	setLeftMenuTab(state, id) {
		state.leftMenuTab = id;
	},
	showTabChat(state) {
		state.website.showChat = true;
		state.mainRightTab = 'chat';
	},
	setShowSettings(state) {
		state.showSettings = true;
		state.mainRightTab = 'settings';
	},
	setShowMediumSettings(state, { medium, id }) {
		state.showMediumSettings[medium] = true;
		if (medium === 'tv') {
			state.mainRightTab = 'webScraperSettings';
			selectMediaSource(state, { type: medium, id });
		} else if (medium === 'matrix') {
			state.mainRightTab = 'matrixRoomSettings';
			selectMediaSource(state, { type: medium, id });
		}
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
	toggleLeftMenu(state, toggleState) {
		state.showLeftMenu = toggleState !== undefined ? toggleState : !state.showLeftMenu;
	},
	setIsMobile(state, toggleState) {
		if (state.isMobile !== toggleState) {
			if (toggleState) {
				state.leftMenuTab = '';
				state.mainRightTab = '';
			} else {
				state.leftMenuTab = 'playList';
				state.mainRightTab = 'about';
			}
		}
		state.isMobile = toggleState;
	},
	// ----------------------------------------------------------
	error(state, message) {
		if (typeof message === 'string') message = { error: message };
		state.errorMessages = [...state.errorMessages, message];
	},
	videoError(state, message) {
		const video = state.currentMedia;
		state.entities[video.id] = Object.assign({}, video, {
			errorMessage: message,
			hasError: true,
		});
		next(state);
	},
	updateCurrentMedia(state, media) {
		Object.assign(state.currentMedia, media);
	},
	upgradeEntities(state, entities) {
		state.entities = entities;
	},
	importPlayList(state, { data, tagName }) {
		let playList;
		if (tagName !== undefined) {
			if (tagName) {
				if (!state.tagsOrdered.includes(tagName)) {
					state.tagsOrdered.push(tagName);
					state.tags[tagName] = [];
				}
				playList = state.tags[tagName];
			} else playList = state.playList;
		} else {
			playList = getCurrentPlayList(state);
		}
		playList = [...data.playList.filter(id => !playList.includes(id)), ...playList];
		if (tagName !== undefined) {
			if (tagName) {
				state.tags[tagName] = playList;
			} else state.playList = playList;
			state.currentPlayList = tagName;
		} else if (state.currentPlayList) {
			state.tags[state.currentPlayList] = playList;
		} else {
			state.playList = playList;
		}
		state.entities = Object.assign({}, state.entities, data.entities);
		state.tags = Object.assign({}, state.tags);
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
		rename(state, 'tags', newName, oldName);
	},
	removeVideo(state, video) {
		state.playList = state.playList.filter(id => id !== video.id);
		if (video.id in state.entities) state.entities[video.id].deleted = true;
	},
	addSearchResult(state, media) {
		if (state.leftMenuTab === 'playList') {
			if (media.trackId) {
				media = Object.assign({}, media);
				media.id += `-Track${media.trackId}`;
				delete media.trackId;
				delete media.isTrack;
			}
			const id = media.id;
			state.entities[id] = media;
			if (state.currentPlayList) {
				if (!state.tags[state.currentPlayList].includes(id)) {
					state.tags[state.currentPlayList].unshift(media.id);
				}
			} else if (!state.playList.includes(id)) {
				state.playList.unshift(id);
			}
		}
	},
	dropMoveItem(state, { itemId, to }) {
		if (state.leftMenuTab === 'playList') {
			const media = getMediaEntity(state, itemId);
			if (media) {
				state.entities[media.id] = media; // Dropped item comes from a web scraper / matrix room.
			} else {
				addMissingMediaToEntities(state, [itemId]); // Dropped item comes from the search results.
			}

			if (to) {
				if (!state.tags[to].includes(itemId)) {
					state.tags[to].unshift(itemId);
					state.tags = Object.assign({}, state.tags);
				}
			} else if (!state.playList.includes(itemId)) {
				state.playList.unshift(itemId);
			}
		}
	},
	pause(state) {
		state.isPlaying = false;
	},
	play(state, options = {}) {
		const { mediaId, media } = options;
		play(state, mediaId, media);
	},
	playPause(state) {
		if (state.isPlaying) state.isPlaying = false;
		else if (state.currentMedia.id) state.isPlaying = true;
		else play(state);
	},
	nextVideo(state) {
		next(state);
	},
	toggleShuffle(state) {
		state.shuffle = !state.shuffle;
		state.repeatAll = false;
	},
	toggleMute(state) {
		state.mute = !state.mute;
	},
	toggleRepeat(state) {
		if (!(state.repeatAll || state.repeat1)) {
			state.repeat1 = true;
		} else if (state.repeat1) {
			if (state.shuffle) {
				state.repeatAll = false;
				state.repeat1 = false;
			} else {
				state.repeatAll = true;
				state.repeat1 = false;
			}
		} else if (state.repeatAll) {
			state.repeatAll = false;
			state.repeat1 = false;
		}
	},
	previousVideo(state) {
		if (state.sessionHistory.length >= -1 * state.sessionHistoryPos) {
			const sessionHistoryPos = state.sessionHistoryPos + 1;
			const media = state.sessionHistory[state.sessionHistory.length - 2 - sessionHistoryPos];
			Object.assign(state, {
				sessionHistoryPos,
				currentMedia: media,
				isPlaying: true,
			});
		}
	},
	queue(state, media) {
		state.queue.push(media);
		state.mainRightTab = 'queue';
	},
	queuePlayIndex(state, index) {
		const media = state.queue.splice(index, 1)[0];
		state.isPlaying = true;
		state.currentMedia = media;
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
		state.currentTime = s;
	},
	movePlayListMedia(state, playList) {
		addMissingMediaToEntities(state, playList);
		if (state.currentPlayList) state.tags[state.currentPlayList] = playList;
		else state.playList = playList;
	},
	moveTagsOrdered(state, tagsOrdered) {
		state.tagsOrdered = tagsOrdered;
	},
	moveQueue(state, queue) {
		state.queue = [...queue];
	},
	addTags(state, { mediaIds = [], tag }) {
		if (mediaIds.length) tag = tag || state.currentPlayList;
		if (!tag) {
			// if we want to use the current playlist action.tag === undefined
			let counter = 1;
			tag = `Playlist ${counter}`;
			while (tag in state.tags) {
				tag = `Playlist ${counter++}`;
			}
		}

		if (!state.tagsOrdered.includes(tag)) state.tagsOrdered.push(tag);

		if (state.tags[tag]) {
			state.tags[tag] = [
				...state.tags[tag],
				...mediaIds.filter(id => !state.tags[tag].includes(id)),
			];
		} else state.tags[tag] = mediaIds;
		selectMediaSource(state, { type: 'playList', id: tag });
	},
	removeTags(state, { mediaIds = [], tag }) {
		tag = tag || state.currentPlayList;
		if (tag && state.tags[tag]) {
			state.tags[tag] = state.tags[tag].filter(id => !mediaIds.includes(id));
		}
	},
	selectMediaSource,
	deletePlayList(state, playListName) {
		delete state.tags[playListName];
		state.tagsOrdered = state.tagsOrdered.filter(name => name !== playListName);
		if (state.currentPlayList === playListName) state.currentPlayList = '';
	},
	setYoutubeApiKey(state, youtubeApiKeyIn) {
		if (!youtubeApiKeyIn) state.youtubeApiKey = youtubeApiKey;
		else state.youtubeApiKey = youtubeApiKeyIn;
	},
	setExportURL(state, url) {
		const now = new Date();
		const name = getCurrentName(state);
		state.exportURLs.unshift({
			url,
			name,
			date: now.toString(),
			type: state.currentWebScraper ? 'channel' : state.currentMatrixRoom ? 'room' : 'playList',
		});
		while (state.exportURLs.length > 5) {
			state.exportURLs.pop();
		}
	},
	migrationSuccess(state, { version, toggleState }) {
		state.migration[version] = toggleState;
	},
	setStartStopMarker(state, { type, seconds }) {
		if (type === 'start') {
			if (seconds > 3) state.currentMedia.start = seconds;
			else delete state.currentMedia.start;
		} else if (type === 'stop') {
			if (seconds < state.currentMedia.durationS - 3) state.currentMedia.stop = seconds;
			else delete state.currentMedia.stop;
		}
	},
	setPendingImportURL(state, data) {
		state.pendingImportURL = data;
	},

	// Matrix Radio
	// ---

	setMatrixEnabled(state) {
		state.matrixEnabled = !state.matrixEnabled;
	},
	setMatrixCredentials(state, credentials) {
		state.matrix.hasCredentials = true;
		state.matrix.credentials = credentials;
	},
	setMatrixLoggedIn(state, rooms) {
		console.log("rooms", rooms);
		state.matrixLoggedIn = true;
		const userId = state.matrix.credentials.userId;
		rooms.forEach(room => {
			const roomId = room.roomId;

			// Create room if not known yet.
			if (!(roomId in state.matrixRooms)) {
				state.matrixRooms[roomId] = Object.assign({}, matrixRoomTemplate(), { name: room.name });
			}

			// Set members of the room.
			state.matrixRooms[roomId].members = Object
				.entries(room.currentState.members)
				.map(([id, member]) => ({ id, powerLevel: member.powerLevel }));

			// Set flag indicating if current user is admin.
			const myuser = room.currentState.members[userId] || {};
			state.matrixRooms[roomId].isAdmin = myuser.powerLevel >= 100;

			// Add to ordered rooms list if not on the list yet.
			if (!state.matrixRoomsOrdered.includes(roomId)) {
				state.matrixRoomsOrdered.unshift(roomId);
			}
			// Set room name if it changed and is not a matrix id.
			if (
				state.matrixRooms[roomId].name !== room.name &&
				!room.name.includes(':matrix.org')
			) {
				state.matrixRooms[roomId].name = room.name;
			}
		});
	},
	toggleMatrixRoomModal(state, toggleState) {
		state.createMatrixRoomModal =
			toggleState !== undefined ? toggleState : !state.createMatrixRoomModal;
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
		state.matrixLoggedIn = false;
		state.matrixRooms = {};
		state.matrixRoomsOrdered = [];
		state.currentMatrixRoom = '';
	},
	deleteMatrixRoom(state, roomId) {
		state.matrixRoomsOrdered = state.matrixRoomsOrdered.filter(id => id !== roomId);
	},
	updateMatrixRoom(state, { roomId, values }) {
		if (!state.matrixRooms[roomId]) {
			state.matrixRooms[roomId] = Object.assign({}, matrixRoomTemplate(), { name: roomId });
		}
		if (!state.matrixRoomsOrdered.includes(roomId)) {
			state.matrixRoomsOrdered.unshift(roomId);
		}
		state.matrixRoomsOrdered = state.matrixRoomsOrdered.filter(id => id in state.matrixRooms);
		state.matrixRooms[roomId] = Object.assign({}, state.matrixRooms[roomId], values);
		state.matrixRooms = Object.assign({}, state.matrixRooms);
	},

	// Web Scraper
	// ---
	addWebScraper(state, name) {
		if (!name) {
			let counter = 1;
			name = `Channel ${counter}`;
			while (name in state.webScrapers) {
				name = `Channel ${counter++}`;
			}
		}

		state.webScrapers[name] = { playList: [], playedMedia: {}, settings: {}, archive: [] };
		if (!state.webScrapersOrdered.includes(name)) state.webScrapersOrdered.push(name);
		state.currentWebScraper = name;
	},
	deleteWebScraper(state, id) {
		delete state.webScrapers[id];
		state.webScrapersOrdered = state.webScrapersOrdered.filter(n => n !== id);
	},
	addUrlPattern(state, { id, urlPattern }) {
		const urls = state.webScrapers[id].settings.urls || [];
		const { settings } = state.webScrapers[id];
		if (!urls.some(p => p === urlPattern)) {
			settings.urls = [
				...urls,
				{ url: urlPattern, numPages: webScraper.patternToUrls(urlPattern).length },
			];
			settings.numPages = settings.urls.reduce((acc, { numPages }) => acc + numPages, 0);
		}
		state.webScrapers = Object.assign({}, state.webScrapers);
	},
	setShowWatched(state, { id, toggleState }) {
		state.showWatched[id] = toggleState;
		state.showWatched = Object.assign({}, state.showWatched);
	},
	setPaginationIndex(state, { id, index }) {
		state.paginationIndex[id] = index;
		state.paginationIndex = Object.assign({}, state.paginationIndex);
	},
	updateWebScraper(state, { id, values }) {
		state.webScrapers[id] = Object.assign({}, state.webScrapers[id], values);
		state.webScrapers = Object.assign({}, state.webScrapers);
	},
	renameWebScraper(state, { newName, oldName }) {
		rename(state, 'webScrapers', newName, oldName);
	},

	setReloadScript(state, id) {
		// upp the reload count so the component detects the change
		state.reloadScript[id]++;
	},
};
