import { webScraper } from '../../utils';

function extensionMessage(detail) {
	window.dispatchEvent(
		new CustomEvent('audiusExtension', {
			detail,
		})
	);
}

export const actions = {
	webScraperUpdateSuccess({ state, commit }, { id, mediaList }) {
		if (!mediaList) {
			commit('error', `Requesting ${id} did not return results.`);
			return;
		}
		const ws = state.sources[id];
		const pl = ws ? ws.playList : [];
		const archive = ws && ws.archive ? ws.archive : [];
		const index = new Set([...pl.map(v => v.id), ...archive]);
		const newVideos = mediaList.filter(v => !index.has(v.id));
		if (!newVideos.length) {
			commit('error', `No new videos found for ${id}. Try agin.`);
			return;
		}
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
		if (id && !(id in state.sources)) {
			commit('addWebScraper', id);
		}
		const ws = state.sources[id];
		if (!ws.playList.length) {
			dispatch('runWebScraper', id);
		}
	},
	runWebScraper({ state, commit, dispatch }, id) {
		if (!id) {
			commit('error', `Can not find channel "${id}".`);
			return;
		}
		const ws = state.sources[id];
		const index = state.paginationIndex[id] || 0;
		if (id === 'Imgur') {
			commit('setPaginationIndex', { id, index: index + 1 });
			webScraper.getImgurMedia(state.paginationIndex[id]).then(mediaList => {
				dispatch('webScraperUpdateSuccess', { id, mediaList });
			}).catch(error => commit('error', `Could not get Imgur. ${error}`));
		} else if (ws.settings.type === 'script') {
			commit('setPaginationIndex', { id, index: index + 1 });
			if (state.sourcesInitialized[id]) {
				extensionMessage({
					audius: true,
					type: 'getNext',
					id,
				});
			} else {
				extensionMessage({
					audius: true,
					type: 'loadScript',
					id,
					code: ws.settings.script,
					youtubeApiKey: state.youtubeApiKey,
					responseTemplate: {
						audius: true,
						vuex: 'commit',
						type: 'initScraperSuccess',
						data: id,
					},
				});
			}
		} else if (ws.settings.type === 'urls') {
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
				extensionMessage({
					audius: true,
					type: 'scanUrl',
					url: webScraper.patternToUrls(requestUrl)[requestIndex],
					youtubeApiKey: state.youtubeApiKey,
					responseTemplate: {
						audius: true,
						vuex: 'dispatch',
						type: 'webScraperUpdateSuccess',
						data: { id },
					},
				});
			}
		}
	},
};
