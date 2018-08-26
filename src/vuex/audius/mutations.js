import { youtubeApiKey } from '../../utils/config';
import {
	getCurrentPlayListEntities,
	getCurrentPlayList,
	getCurrentName,
	getMediaEntity,
} from './getCurrentPlayList';
import { migrateIndexDb2012 } from '../../utils/migrate.2.0.12';

/* eslint-disable no-param-reassign */
function playMedia(state, media) {
	const { playedMedia } = state;
	if (media.id in playedMedia) {
		++playedMedia[media.id].count;
		playedMedia[media.id].lastPlay = Date.now();
	} else {
		playedMedia[media.id] = { lastPlay: Date.now(), count: 1 };
	}

	Object.assign(state, {
		sessionHistoryPos: -1,
		sessionHistory: [...state.sessionHistory, media],
		currentMedia: media,
		isPlaying: true,
		playedMedia: Object.assign({}, playedMedia),
	});
}

function selectMediaSource(state, { type, id }) {
	state.currentMediaSource = { type, id };
	state.leftMenuTab = type;
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

function uniqById(a) {
	const seen = new Set();
	return a.filter(({ id }) => (seen.has(id) ? false : seen.add(id)));
}

function updateMediaIndex(state, entities) {
	if (Array.isArray(entities)) {
		state.mediaIndex = entities.reduce(
			(acc, media) => Object.assign(acc, { [media.id]: media }),
			state.mediaIndex
		);
	} else {
		state.mediaIndex = Object.assign({}, state.mediaIndex, entities);
	}
}

/* eslint-disable no-param-reassign */
export const mutations = {
	recoverState(state, recoveredState) {
		['matrix', 'webScraper'].forEach(moduleName => {
			Object.assign(state[moduleName], recoveredState[moduleName]);
			delete recoveredState[moduleName];
			state[moduleName].sourcesOrdered.forEach(sourceId => {
				updateMediaIndex(state, state[moduleName].sources[sourceId].playList);
			});
		});
		Object.assign(state, recoveredState);
		updateMediaIndex(state, state.entities);
	},
	loadBackup(state, backup) {
		if (backup.AudiusBackup) {
			if (backup.AudiusBackup < '2.0.12') {
				const data = migrateIndexDb2012(backup.data);
				state = Object.assign(state, data);
			} else {
				state = Object.assign(state, backup.data);
			}
		}
		updateMediaIndex(state, state.entities);
	},
	searchSuccess(state, { mediaList = [], id = null, isPlayList }) {
		if (!mediaList.length) {
			state.errorMessages = [...state.errorMessages, { error: 'No media found (҂⌣̀_⌣́)ᕤ' }];
		} else {
			state.mainRightTab = 'search';
		}

		updateMediaIndex(state, mediaList);

		state.search.isPlayList = isPlayList;
		if (state.search.id !== id) {
			state.search.results = uniqById(mediaList);
			state.search.id = id;
		} else {
			state.search.results = uniqById([...state.search.results, ...mediaList]);
		}
	},
	toggleSearch(state, toggleState) {
		state.website.showSearch = toggleState !== undefined ? toggleState : !state.website.showSearch;
	},
	setMainRightTab(state, id) {
		state.mainRightTab = state.mainRightTab === id ? '' : id;
	},
	setMainLeftTab(state, id) {
		state.mainLeftTab = state.mainLeftTab === id ? '' : id;
	},
	setShowSettings(state) {
		state.showSettings = true;
		state.mainRightTab = 'settings';
	},
	setShowMediaEdit(state, toggleState) {
		state.showMediaEdit = toggleState !== undefined ? toggleState : !state.showMediaEdit;
		if (state.showMediaEdit) state.mainRightTab = 'mediaEdit';
	},
	setShowMediumSettings(state, { medium, id }) {
		state.showMediumSettings[medium] = true;
		if (medium === 'webScraper') {
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
		state.errorMessages = [
			...state.errorMessages,
			Object.assign(message, { id: state.errorMessages.length }),
		];
	},
	videoError(state, message) {
		const video = state.currentMedia;
		state.entities[video.id] = Object.assign({}, video, {
			hasError: true,
		});
		next(state);
	},
	updateCurrentMedia(state, media) {
		Object.assign(state.currentMedia, media);
	},
	updateMediaIndex,
	importPlayList(state, { data, tagName }) {
		let playList;
		if (tagName !== undefined) {
			if (tagName) {
				if (!state.sourcesOrdered.includes(tagName)) {
					state.sourcesOrdered.push(tagName);
					state.sources[tagName] = [];
				}
				playList = state.sources[tagName];
			} else ({ playList } = state);
		} else {
			playList = getCurrentPlayList(state);
		}
		playList = [...data.playList.filter(id => !playList.includes(id)), ...playList];
		if (tagName !== undefined) {
			if (tagName) {
				state.sources[tagName] = playList;
			} else state.playList = playList;
			state.currentMediaSource.id = tagName;
		} else if (state.currentMediaSource.id) {
			state.sources[state.currentMediaSource.id] = playList;
		} else {
			state.playList = playList;
		}
		state.entities = Object.assign({}, state.entities, data.entities);
		updateMediaIndex(state, data.entities);
		state.sources = Object.assign({}, state.sources);
	},
	importOtherPlayList(state, playListName) {
		const { id } = state.currentMediaSource;
		if (!id) {
			state.playList = [
				...state.playList,
				...state.sources[playListName].filter(_id => !state.playList.includes(_id)),
			];
		} else {
			const sources = Object.assign({}, state.sources);
			const currentSource = [...sources[id]];
			sources[id] = [
				...currentSource,
				...(playListName ? state.sources[playListName] : state.playList).filter(_id => !currentSource.includes(_id)),
			];
			state.sources = sources;
		}
	},
	renamePlayList(state, { newName, oldName }) {
		if (state.sources[newName]) return;
		const sources = Object.assign({}, state.sources);
		sources[newName] = sources[oldName];
		// const sourcesOrdered = [...state.sourcesOrdered];
		// sourcesOrdered[sourcesOrdered.indexOf(oldName)] = newName;
		delete sources[oldName];
		state.sources = sources;
		state.sourcesOrdered[state.sourcesOrdered.indexOf(oldName)] = newName;
		state.currentMediaSource.id = newName;
	},
	removeMedia(state, { mediaIds, tagName }) {
		if (tagName === '') {
			state.playList = state.playList.filter(id => !mediaIds.includes(id));
		} else {
			state.sources[tagName] = state.sources[tagName].filter(id => !mediaIds.includes(id));
		}
	},
	addSearchResult(state, { media, tagName }) {
		if (media.trackId) {
			media = Object.assign({}, media);
			delete media.trackId;
			delete media.isTrack;
		}
		const { id } = media;
		state.entities[id] = media;
		if (tagName) {
			if (!state.sources[tagName].includes(id)) {
				state.sources[tagName].unshift(media.id);
			}
		} else if (!state.playList.includes(id)) {
			state.playList.unshift(id);
		}
	},
	dropMoveItem(state, { itemId, to }) {
		if (state.leftMenuTab === 'playList') {
			const media = getMediaEntity(state, itemId);
			if (media.id) state.entities[media.id] = media;

			if (to) {
				if (!state.sources[to].includes(itemId)) {
					state.sources[to].unshift(itemId);
					state.sources = Object.assign({}, state.sources);
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
	toggleFullscreen(state, toggleState) {
		state.fullscreen = toggleState !== undefined ? toggleState : !state.fullscreen;
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
		state.queueClickCount++;
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
		const seen = new Set();
		const cleanPlayList = playList.filter(id => (seen.has(id) ? false : seen.add(id)));
		addMissingMediaToEntities(state, playList);
		const { id } = state.currentMediaSource;
		if (id) state.sources[id] = cleanPlayList;
		else state.playList = cleanPlayList;
	},
	moveTagsOrdered(state, sourcesOrdered) {
		state.sourcesOrdered = sourcesOrdered;
	},
	moveQueue(state, queue) {
		state.queue = [...queue];
	},
	addTags(state, { mediaIds = [], tag }) {
		if (mediaIds.length) tag = tag || state.currentMediaSource.id;
		if (!tag) {
			// if we want to use the current playlist action.tag === undefined
			let counter = 1;
			tag = `Playlist ${counter}`;
			while (tag in state.sources) {
				tag = `Playlist ${counter++}`;
			}
		}

		if (!state.sourcesOrdered.includes(tag)) state.sourcesOrdered.push(tag);

		if (state.sources[tag]) {
			state.sources[tag] = [
				...state.sources[tag],
				...mediaIds.filter(id => !state.sources[tag].includes(id)),
			];
		} else state.sources[tag] = mediaIds;
		selectMediaSource(state, { type: 'playList', id: tag });
	},
	setLeftMenuTab(state, id) {
		state.leftMenuTab = id;
		state.showLeftMenu = true;
	},
	selectMediaSource,
	deletePlayList(state, playListName) {
		delete state.sources[playListName];
		state.sourcesOrdered = state.sourcesOrdered.filter(name => name !== playListName);
		if (state.currentMediaSource.id === playListName) {
			state.currentMediaSource = { id: '', type: 'playList' };
		}
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
	setExtensionAvilable(state, data) {
		state.extensionAvilable = data;
	},
	setLoadedModules(state, moduleName) {
		state.loadedModules = Object.assign({ [moduleName]: true }, state.loadedModules);
	},
	increasePaginationIndex(state, id) {
		const index = state.paginationIndex[id] || 0;
		state.paginationIndex = Object.assign({}, state.paginationIndex, { [id]: index + 1 });
	},
	toggleIsLoading(state, { id, loading }) {
		state.isLoading = Object.assign({}, state.isLoading, { [id]: loading });
	},
	setShowWatched(state, { id, toggleState }) {
		state.showWatched[id] = toggleState;
		state.showWatched = Object.assign({}, state.showWatched);
	},
};
