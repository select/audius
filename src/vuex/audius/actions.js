import { presistMutation } from './presistMutation';
import {
	searchYoutube,
	youTubePlaylistRexEx,
	getPlayList,
	importPlayListFromString,
	streamlyUrlRegEx,
	ajaxPostJSON,
	ajaxJSON,
	findMediaText,
} from '../../utils';
import { getCurrentPlayListEntities } from './getCurrentPlayList';
// the matrix client will be lazy loaded since it's not need on startup

/* eslint-disable no-param-reassign */
export const actions = {
	search({ commit, state }, query) {
		query = query.trim();
		findMediaText(query, state.youtubeApiKey, { extendPlayLists: true }).then(res => {
			if (res.mediaList.length) {
				commit('searchSuccess', Object.assign(res, { id: query }));
				return;
			}

			if (/^https?:\/\//.test(query)) {
				if (!state.extensionAvilable) {
					commit('error', 'The audius extension is not installed. Please install it.');
					commit('setShowSettings');
					return;
				}
				window.dispatchEvent(
					new CustomEvent('audiusExtension', {
						detail: {
							audius: true,
							type: 'scanUrl',
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
			ajaxJSON(url)
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
		ajaxPostJSON('https://api.myjson.com/bins', JSON.stringify(data))
			.then(res => {
				commit('setExportURL', JSON.parse(res).uri);
			})
			.catch(error => {
				commit('error', error);
			});
	},
	nextVideo({ state, commit, dispatch }) {
		console.log('check if next viedo works');
		if (state.currentMediaSource.type === 'webScraper') {
			const cp = getCurrentPlayListEntities(state);
			if (cp.length < 7) {
				dispatch('runWebScraper', state.currentMediaSource.id);
			}
		}
		if (state.currentMediaSource.type === 'matrix') {
			const cp = getCurrentPlayListEntities(state);
			if (cp.length < 7) {
				dispatch('matrixPaginate', state.currentMediaSource.id);
			}
		}
		commit('nextVideo');
	},
	toggleFullscreen({ state, commit }, toggleState) {
		commit('toggleFullscreen', toggleState);
		// Launch fullscreen for browsers that support it!
		if (state.fullscreen) {
			const element = document.querySelector('.media-player'); // any individual element
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			}
		} else {
			// Cancel fullscreen for browsers that support it!
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	},
	saveBackup({ state, dispatch }) {
		const now = new Date();
		const fileName = `Audius.${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.backup`;
		const data = {
			AudiusBackup: '2.0.10',
			data: Array.from(
				new Set(Object.values(presistMutation).reduce((acc, item) => [...acc, ...item], []))
			).reduce((acc, key) => Object.assign(acc, { [key]: state[key] }), {}),
		};
		dispatch('exportToFile', { fileName, data });
	},
	// https://stackoverflow.com/a/46613898/1436151
	exportToFile(store, { data, fileName }) {
		const u8arr = new TextEncoder('utf-8').encode(JSON.stringify(data, null, 2));
		const url = window.URL.createObjectURL(new Blob([u8arr], { type: 'application/json' }));
		const element = document.createElement('a');
		element.setAttribute('href', url);
		element.setAttribute('download', fileName);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	},
};
