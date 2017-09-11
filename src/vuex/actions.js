import {
	searchYoutube,
	isYouTubeVideoRegEx,
	youTubePlaylistRexEx,
	isVimeoVideoRegEx,
	searchVimeo,
	getPlayList,
	importPlayListFromString,
	ajaxPostJSON,
	ajax,
	findYouTubeIdsText,
	getYouTubeInfo,
	webScraper,
	getMediaDuration,
	s2time,
	hashCode,
} from '../utils';
import { videoBaseObject } from './video';
import { getCurrentPlayListEntities, getMediaEntity } from './getCurrentPlayList';
// the matrix client will be lazy loaded since it's not need on startup

// This must be avialable in the whole module since it's lazy loaded.
// Do not delete;
let matrixClient;

const audioRegEx = /\.(mp3|oga|m4a|flac|wav|aiff|aif|wma|asf)$/i;
const videoRegEx = /\.(avi|mkv|mp4|webm|ogg)$/i;

function refineWebSearchResult(media) {
	let title = media.title;
	if (media.url) {
		const urlParts = media.url.split('/');
		if (!title) title = urlParts.length ? urlParts[urlParts.length - 1] : media.url;
	}
	return Object.assign({}, videoBaseObject, media, {
		title,
		duration: media.durationS ? s2time(media.durationS) : undefined,
		id: media.id || `${hashCode(media.url)}`,
	});
}

function addMatrixMessage(state, commit, roomId, results) {
	const room = state.matrixRooms[roomId];
	if (!results.length) return;
	const playList = [...room.playList, ...results];
	const archive = [...room.archive];
	while (playList.length > 3000) {
		const media = playList.shift();
		archive.push(media.id);
	}
	commit('updateMatrixRoom', {
		roomId,
		values: {
			playList,
			archive,
		},
	});
}

/* eslint-disable no-param-reassign */
export const actions = {
	search({ commit, state }, query) {
		query = query.trim();
		if (audioRegEx.test(query)) {
			getMediaDuration(query, 'video')
				.then(durationS => refineWebSearchResult({ url: query, durationS, type: 'audio' }))
				.then(media => commit('webMediaSearchSuccess', { mediaList: [media], id: query }));
		} else if (videoRegEx.test(query)) {
			getMediaDuration(query, 'video')
				.then(durationS => refineWebSearchResult({ url: query, durationS, type: 'video' }))
				.then(media => commit('webMediaSearchSuccess', { mediaList: [media], id: query }));
		} else if (isVimeoVideoRegEx.test(query)){
			searchVimeo(query).then(result => {
				commit('searchYoutubeSuccess', { result, id: query });
			});
		} else if (isYouTubeVideoRegEx.test(query)) {
			// debounce((...args) => searchYoutube(...args), 500)
			searchYoutube(state.youtubeApiKey, query).then(result => {
				commit('searchYoutubeSuccess', { result, id: query });
			}).catch(error => { commit('error', error); });
			if (youTubePlaylistRexEx.test(query)) {
				getPlayList(state.youtubeApiKey, query).then(result => {
					commit('searchYoutubeSuccess', { result, isPlayList: true, id: query });
				}).catch(error => { commit('error', error); });
			}
		} else if (youTubePlaylistRexEx.test(query)) {
			getPlayList(state.youtubeApiKey, query).then(result => {
				commit('searchYoutubeSuccess', { result, isPlayList: true, id: query });
			});
		} else if (/^https?:\/\//.test(query)) {
			console.warn('Please install the audius extension');
			window.dispatchEvent(new CustomEvent('audiusExtension', {
				detail: {
					audius: true,
					wsAction: 'scanUrl',
					url: query,
					youtubeApiKey: state.youtubeApiKey,
					response: {
						audius: true,
						type: 'webMediaSearchSuccess',
						vuex: 'commit',
						data: { id: query },
					},
				},
			}));
		} else if (query.length > 1) {
			searchYoutube(state.youtubeApiKey, query).then(result => {
				commit('searchYoutubeSuccess', { result, id: query });
			});
		}
	},

	importPlayListFromString({ commit }, importString) {
		importPlayListFromString(importString).then((data, error) => {
			if (error) {
				commit('error', error);
			} else {
				commit('importPlayList', { data });
			}
		});
	},
	importURL({ state, commit }, { url, name }) {
		if (youTubePlaylistRexEx.test(url)) {
			getPlayList(state.youtubeApiKey, url).then(data => {
				const entities = data.reduce((acc, media) => Object.assign(acc, { [media.id]: media }), {});
				const playList = data.map(({ id }) => id);
				commit('importPlayList', { data: { playList, entities }, tagName: name });
			});
		} else {
			ajax(url).then(data => {
				commit('importPlayList', { data, tagName: name });
				commit('setPendingImportURL', null);
			}).catch(error => { commit('error', error); });
		}
	},
	exportToURL({ commit, getters }) {
		const data = getters.currentExportData;
		ajaxPostJSON('https://api.myjson.com/bins', JSON.stringify(data), res => {
			commit('setExportURL', JSON.parse(res).uri);
		}).catch(error => { commit('error', error); });
	},
	initMatrix({ commit, state, dispatch }) {
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(mc => {
			matrixClient = mc.matrixClient;
			if (!state.matrix.hasCredentials) {
				matrixClient
					.getCredentials()
					.then(credentials => commit('setMatrixCredentials', credentials))
					.then(() => matrixClient.login(state.matrix.credentials, dispatch))
					.then(rooms => commit('setMatrixLoggedIn', rooms));
			} else if (!state.matrixLoggedIn) {
				matrixClient
					.login(state.matrix.credentials, dispatch)
					.then(rooms => commit('setMatrixLoggedIn', rooms));
			}
		});
	},
	loginMatrixWithPassword({ commit, state, dispatch }, { username, password }) {
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(mc => {
			matrixClient = mc.matrixClient;
			matrixClient
				.getCredentialsWithPassword(username, password)
				.then(credentials => commit('setMatrixCredentials', credentials))
				.then(() => matrixClient.login(state.matrix.credentials, dispatch))
				.then(rooms => commit('setMatrixLoggedIn', rooms));
		});
	},
	matrixSend({ state }, { itemId, roomId, media }) {
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(mc => {
			matrixClient = mc.matrixClient;
			matrixClient.sendEvent(roomId, media || getMediaEntity(state, itemId));
		});
	},
	matrixPaginate({ state, commit }, id) {
		// const id = state.currentMatrixRoom;
		matrixClient.paginate(state.currentMatrixRoom).then(res => {
			if (res) {
				commit('setPaginationIndex', {
					id,
					index: (state.paginationIndex[id] || 0) + 1,
				});
			} else {
				commit('error', 'You reached the last page of this room.');
			}
		});
	},
	joinMatrixRoom({ commit }, { id, name }) {
		matrixClient
			.joinRoom(id)
			.then(room => {
				room.name = name || id;
				commit('setMatrixLoggedIn', [room]);

				commit('selectMediaSource', { type: 'radio', id: room.roomId });
				commit('setLeftMenuTab', 'radio');
			})
			.catch(error => {
				commit('error', `Could not join room: ${error}`);
			});
	},
	leaveMatrixRoom({ commit }, roomIdOrAlias) {
		matrixClient.leaveRoom(roomIdOrAlias).then(() => commit('deleteMatrixRoom', roomIdOrAlias));
	},
	matrixLogout({ commit }) {
		// FIXIME this is async and could return a promis
		// after witch the state should be saved
		matrixClient.logout();
		commit('matrixLogout');
	},
	parseMatrixMessage({ state, commit }, { roomId, message }) {
		const room = state.matrixRooms[roomId];
		if (!(roomId in state.matrixRooms)) {
			commit('error', `could not find matrix room ${roomId}`);
			commit('updateMatrixRoom', { roomId });
			return;
		}

		const index = new Set([...room.playList.map(v => v.id), ...room.archive]);
		if (typeof message === 'object') {
			if (!index.has(message.id)) addMatrixMessage(state, commit, roomId, [message]);
			console.log(`[Matrix-Media] %c${message.title}`, 'color: #2DA7EF;');
			return;
		}
		console.log(`[Matrix-Text] %c${message}`, 'color: #2DA7EF;');

		const ids = findYouTubeIdsText(message)
			.filter(id => id && !index.has(id)) // filter empty
			.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates

		if (ids.length) {
			// get info for all new unknown ids
			getYouTubeInfo(ids, state.youtubeApiKey).then(results => {
				addMatrixMessage(state, commit, roomId, results);
			});
		}
	},
	webScraperUpdateSuccess({ state, commit, dispatch }, { id, mediaList }) {
		const ws = state.webScrapers[id];
		const pl = ws ? ws.playList : [];
		const archive = ws && ws.archive ? ws.archive : [];
		const index = new Set([...pl.map(v => v.id), ...archive]);
		const newVideos = mediaList.filter(v => !index.has(v.id));
		const playList = [...pl, ...newVideos];
		while (playList.length > 3000) {
			const media = playList.shift();
			archive.push(media.id);
		}
		if (newVideos.length) {
			commit('updateWebScraper', { id, values: { playList, archive } });
		} else {
			// Only scrape websites every 2 seconds.
			setTimeout(() => {
				dispatch('runWebScraper', id);
			}, 2000);
		}
	},
	initWebScraper({ state, commit, dispatch }, id) {
		if (id && !(id in state.webScrapers)) {
			commit('addWebScraper', id);
		}
		if (!state.webScrapers[id].playList.length) {
			dispatch('runWebScraper', id);
		}
	},
	runWebScraper({ state, commit, dispatch }, id) {
		if (!id) {
			commit('error', `Can not find channel "${id}".`);
			return;
		}
		const ws = state.webScrapers[id];
		const index = state.paginationIndex[id] || 0;
		if (id === 'Imgur') {
			commit('setPaginationIndex', { id, index: index + 1 });
			webScraper.getVideosFromIndex(state.paginationIndex[id]).then(mediaList => {
				dispatch('webScraperUpdateSuccess', { id, mediaList });
			});
		} else {
			let requestIndex = index;
			if (index >= ws.settings.numPages - 1) {
				commit('error', 'Checked all URLs in channel, try again next time.');
			} else if (!ws.settings.urls) {
				commit('error', 'Channel URLs missing');
			} else {
				let acc = 0;
				let requestUrl;
				ws.settings.urls.every(url => {
					acc += url.numPages;
					if (acc > index) {
						requestUrl = url.url;
						return false;
					}
					requestIndex -= url.numPages;
					return true;
				});
				commit('setPaginationIndex', { id, index: index + 1 });
				window.dispatchEvent(
					new CustomEvent('audiusExtension', {
						detail: {
							audius: true,
							wsAction: 'scanUrl',
							url: webScraper.patternToUrls(requestUrl)[requestIndex],
							youtubeApiKey: state.youtubeApiKey,
							response: {
								audius: true,
								vuex: 'dispatch',
								type: 'webScraperUpdateSuccess',
								data: { id },
							},
						},
					})
				);
			}
		}
	},

	nextVideo({ state, commit, dispatch }) {
		if (state.leftMenuTab === 'tv' && state.currentWebScraper) {
			const cp = getCurrentPlayListEntities(state);
			const idx = cp.findIndex(m => m.id === state.currentMedia.id);
			if (idx >= cp.length - 4) {
				dispatch('runWebScraper', state.currentWebScraper);
			}
		}
		commit('nextVideo');
	},
};
