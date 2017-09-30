import { actionsMatrix } from './actions-matrix';
import { actionsWebScraper } from './actioins-web-scraper';
import {
	searchYoutube,
	youTubePlaylistRexEx,
	getPlayList,
	importPlayListFromString,
	streamlyUrlRegEx,
	ajaxPostJSON,
	ajax,
	findMediaText,
} from '../utils';
import { getCurrentPlayListEntities } from './getCurrentPlayList';
// the matrix client will be lazy loaded since it's not need on startup

/* eslint-disable no-param-reassign */
export const actions = {
	...actionsMatrix,
	...actionsWebScraper,
	search({ commit, state }, query) {
		query = query.trim();
		findMediaText(query, state.youtubeApiKey).then(res => {
			if (res.mediaList.length) {
				commit('searchSuccess', Object.assign(res, { id: query }));
				return;
			}

			if (/^https?:\/\//.test(query)) {
				console.warn('Please install the audius extension');
				window.dispatchEvent(
					new CustomEvent('audiusExtension', {
						detail: {
							audius: true,
							wsAction: 'scanUrl',
							url: query,
							youtubeApiKey: state.youtubeApiKey,
							responseTemplate: {
								audius: true,
								type: 'searchSuccess',
								vuex: 'commit',
								data: { id: query },
							},
						},
					})
				);
			} else if (query.length > 1) {
				searchYoutube(state.youtubeApiKey, query).then(mediaList => {
					commit('searchSuccess', { mediaList, id: query });
				});
			}
		});
	},

	importPlayListFromString({ commit }, importString) {
		importPlayListFromString(importString)
			.then(data => commit('importPlayList', { data }))
			.catch(error => commit('error', `Can not read playlist. ${error}`));
	},
	importURL({ state, commit }, { url, name }) {
		if (youTubePlaylistRexEx.test(url)) {
			getPlayList(state.youtubeApiKey, url).then(data => {
				const entities = data.reduce((acc, media) => Object.assign(acc, { [media.id]: media }), {});
				const playList = data.map(({ id }) => id);
				commit('importPlayList', { data: { playList, entities }, tagName: name });
			});
		} else if (streamlyUrlRegEx.test(url)) {
			importPlayListFromString(url)
				.then(data => commit('importPlayList', { data }))
				.catch(error => commit('error', `Could not import streamly playlist. ${error}`));
		} else {
			ajax(url)
				.then(data => {
					commit('importPlayList', { data, tagName: name });
					commit('setPendingImportURL', null);
				})
				.catch(error => {
					commit('error', error);
				});
		}
	},
	exportToURL({ commit, getters }) {
		const data = getters.currentExportData;
		ajaxPostJSON('https://api.myjson.com/bins', JSON.stringify(data)).then(res => {
			commit('setExportURL', JSON.parse(res).uri);
		}).catch(error => {
			commit('error', error);
		});
	},
	nextVideo({ state, commit, dispatch }) {
		if (state.currentWebScraper) {
			const cp = getCurrentPlayListEntities(state);
			const idx = cp.findIndex(m => m.id === state.currentMedia.id);
			if (idx >= cp.length - 6) {
				dispatch('runWebScraper', state.currentWebScraper);
			}
		}
		commit('nextVideo');
	},
};
