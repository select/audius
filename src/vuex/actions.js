import { actionsMatrix } from './actions-matrix';
import { actionsWebScraper } from './actioins-web-scraper';
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
	getMediaDuration,
	s2time,
	hashCode
} from '../utils';
import { videoBaseObject } from './video';
import { getCurrentPlayListEntities } from './getCurrentPlayList';
// the matrix client will be lazy loaded since it's not need on startup


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
	...actionsMatrix,
	...actionsWebScraper,
	search({ commit, state }, query) {
		query = query.trim();
		if (audioRegEx.test(query)) {
			getMediaDuration(query, 'video')
				.then(durationS => refineWebSearchResult({ url: query, href: query, durationS, type: 'audio' }))
				.then(media => commit('webMediaSearchSuccess', { mediaList: [media], id: query }));
		} else if (videoRegEx.test(query)) {
			getMediaDuration(query, 'video')
				.then(durationS => refineWebSearchResult({ url: query, href: query, durationS, type: 'video' }))
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
