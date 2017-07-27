import {
	duration,
	time2s,
	searchYoutube,
	isYouTubeVideoRegEx,
	debounce,
	importPlayListFromString,
	ajaxPostJSON,
	ajax,
	findYouTubeIdsText,
	getYouTubeInfo,
	webScraper,
	getMediaDuration,
	s2time,
	hashCode
} from '../utils';
import { videoBaseObject } from './video';
import { getCurrentPlayListEntities } from './getCurrentPlayList';
// the matrix client will be lazy loaded since it's not need on startup
let matrixClient = null;
const searchYoutubeDebounced = debounce((...args) => searchYoutube(...args), 500);
const webScraperDebounced = debounce((...args) => window.dispatchEvent(...args), 500);

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

/* eslint-disable no-param-reassign */
export const actions = {
	search({ commit, state }, query) {
		if (audioRegEx.test(query)) {
			getMediaDuration(query, 'video')
				.then(durationS => refineWebSearchResult({ url: query, durationS, type: 'audio' }))
				.then(media => commit('webMediaSearchSuccess', { mediaList: [media], id: query }));
		} else if (videoRegEx.test(query)) {
			getMediaDuration(query, 'video')
				.then(durationS => refineWebSearchResult({ url: query, durationS, type: 'video' }))
				.then(media => commit('webMediaSearchSuccess', { mediaList: [media], id: query }));
		} else if (isYouTubeVideoRegEx.test(query)) {
			searchYoutubeDebounced(state.youtubeApiKey, query, result => {
				commit('searchYoutubeSuccess', result);
			});
		} else if (/^https?:\/\//.test(query)) {
			console.warn('Please install the audius extension');
			webScraperDebounced(new CustomEvent('audiusExtension', {
				detail: { audius: true, type: 'scanUrl', url: query, youtubeApiKey: state.youtubeApiKey },
			}));
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
			getYouTubeInfo(ids.filter(id => !(id in state.entities)), state.youtubeApiKey)
				.then(results => {
					commit('updateRadioStation', {
						roomId,
						entities: results.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
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
			dispatch('runWebScraper', name);
		}
	},
	runWebScraper({ state, commit, dispatch }, name) {
		if (!name) {
			commit('error', 'Run web scraper name is missing.');
			return;
		}
		if (!state.webScrapersIndex[name]) {
			commit('incrementWebScraperIndex', name);
		}
		webScraper.getVideosFromIndex(state.webScrapersIndex[name]).then(videos => {
			const ws = state.webScrapers[name];
			const pl = ws ? ws.playList : [];
			const archive = ws && ws.archive ? ws.archive : [];
			const index = new Set([...pl.map(({ id }) => id), ...archive]);
			const newVideos = videos.filter(v => !index.has(v.id));
			const playList = [...pl, ...newVideos];

			if (videos) commit('updateWebScraper', { name, values: { playList } });
			commit('incrementWebScraperIndex', name);

			if (!newVideos.length) {
				commit('setWebScraperEmptyCount', { name, count: (state.webScraperEmptyCount[name] + 1) });
				dispatch('runWebScraper', name);
			} else {
				commit('setWebScraperEmptyCount', { name, count: 0 });
			}
		});
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
