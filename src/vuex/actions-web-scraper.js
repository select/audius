import {
	webScraper,
} from '../utils';

const webScraperInstances = {};

export const actionsWebScraper = {
	webScraperUpdateSuccess({ state, commit }, { id, mediaList }) {
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
		}
	},
	initWebScraper({ state, commit, dispatch }, id) {
		if (id && !(id in state.webScrapers)) {
			commit('addWebScraper', id);
		}
		const ws = state.webScrapers[id];
		if (ws.settings && ws.settings.type === 'script' && !(id in webScraperInstances)) {
			// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Language_Bindings/Components.utils.evalInSandbox
			// Components.utils.evalInSandbox does not seem to be available in Chrome, is this a FireFox feature?
			// But I can create a sandboxed script in an extension.
			// https://developer.chrome.com/extensions/sandboxingEval
			// webScraperInstances[id] =
		}
		if (!ws.playList.length) {
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
		} else if (state.webScrapers[id].settings.type === 'urls') {
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
				if (!state.extensionAvilable) {
					commit('error', 'The audius extension is not installed. Please install it.');
					commit('setShowSettings');
					return;
				}
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
}
