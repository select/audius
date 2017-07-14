import {
	duration,
	time2s,
	searchYoutube,
	debounce,
	importPlayListFromString,
	ajaxPostJSON,
	ajax,
	findYouTubeIdsText,
	getYouTubeInfo,
	webScraper,
	getMediaDuration
} from '../utils';
import { videoBaseObject } from './video';
import { getCurrentPlayListEntities } from './getCurrentPlayList';
// the matrix client will be lazy loaded since it's not need on startup
let matrixClient = null;
const searchYoutubeDebounced = debounce((...args) => searchYoutube(...args), 500);

const audioRegEx = /\.(mp3|oga|m4a|flac|wav|aiff|aif|wma|asf)$/i;
const videoRegEx = /\.(avi|mkv|mp4|webm|ogg)$/i;

/* eslint-disable no-param-reassign */
export const actions = {
	search({ commit, state }, query) {
		if (audioRegEx.test(query)) {
			getMediaDuration(query, 'video').then(durationS => {
				commit('webMediaSearchSuccess', {
					url: query,
					durationS,
					type: 'audio',
				});
			});
		} else if (videoRegEx.test(query)) {
			getMediaDuration(query, 'video').then(durationS => {
				commit('webMediaSearchSuccess', {
					url: query,
					durationS,
					type: 'video',
				});
			});
		} else if (/^https?:\/\//.test(query)) {

			console.warn('Please install the audius extension');
			// webScraper.scanUrl(query).then(videos => {
			// 	console.log('schan url, ', videos);
			// });
		} else if (query.length > 1) {
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
				commit('importPlayList', { data });
			}
		});
	},
	importURL({ commit }, { url, name }) {
		ajax(url, data => {
			commit('importPlayList', { data, tagName: name });
			commit('setPendingImportURL', null);
		});
	},
	exportToURL({ commit, getters }) {
		const data = getters.currentExportData;
		ajaxPostJSON('https://api.myjson.com/bins', JSON.stringify(data), res => {
			commit('setExportURL', JSON.parse(res).uri);
		});
	},
	initMatrix({ commit, state, dispatch }) {
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(module => {
			matrixClient = module.matrixClient;
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
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(module => {
			matrixClient = module.matrixClient;
			matrixClient
				.getCredentialsWithPassword(username, password)
				.then(credentials => commit('setMatrixCredentials', credentials))
				.then(() => matrixClient.login(state.matrix.credentials, dispatch))
				.then(rooms => commit('setMatrixLoggedIn', rooms));
		});
	},
	matrixPaginate({ state }) {
		matrixClient.paginate(state.currentRadioStation);
	},
	joinRadioStation({ commit }, roomIdOrAlias) {
		matrixClient.joinRoom(roomIdOrAlias).then(room => {
			room.name = roomIdOrAlias;
			commit('setMatrixLoggedIn', [room]);
		});
	},
	leaveRadioStation({ commit }, roomIdOrAlias) {
		matrixClient.leaveRoom(roomIdOrAlias).then(() => commit('deleteRadioStation', roomIdOrAlias));
	},
	matrixLogout({ commit }) {
		// FIXIME this is async and could return a promis
		// after witch the state should be saved
		matrixClient.logout();
		commit('matrixLogout');
	},
	parseMatrixMessage({ state, commit }, { roomId, message }) {
		console.log('parse ', message);
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
							type: 'youtube',
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
	initWebScraper({ state, commit, dispatch }, name) {
		if (name && !(name in state.webScrapers)) {
			commit('addWebScraper', name);
		}
		if (!state.webScrapers[name].playList.length) {
			dispatch('runWebScraper');
		}
	},
	runWebScraper({ state, commit }) {
		if (!state.webScrapersIndex[state.currentWebScraper]) {
			commit('incrementWebScraperIndex', state.currentWebScraper);
		}
		webScraper.getVideosFromIndex(state.webScrapersIndex[state.currentWebScraper]).then(videos => {
			const name = state.currentWebScraper;
			if (videos) commit('updateWebScraper', { name, videos });
			commit('incrementWebScraperIndex', state.currentWebScraper);
		});
	},
	nextVideo({ state, commit, dispatch }) {
		if (state.leftMenuTab === 'tv' && state.currentWebScraper) {
			const cp = getCurrentPlayListEntities(state);
			const idx = cp.findIndex(m => m.id === state.currentMedia.id);
			if (idx >= cp.length - 4) {
				dispatch('runWebScraper');
			}
		}
		commit('nextVideo');
	},
};
