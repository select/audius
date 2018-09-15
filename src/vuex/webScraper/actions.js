import { webScraper, findMediaText } from '../../utils';

function extensionMessage(detail) {
	window.dispatchEvent(
		new CustomEvent('audiusExtension', {
			detail,
		})
	);
}

export const actions = {
	renameWebScraper({ state, commit }, { oldName, newName }) {
		if (state.sources[newName]) return;
		commit('renameWebScraper', { oldName, newName });
		commit('selectMediaSource', { type: 'webScraper', id: newName });
	},
	webScraperUpdateSuccess({ state, rootState, commit, dispatch }, { id, mediaList }) {
		commit('toggleIsLoading', { id, loading: false });
		if (!mediaList) {
			commit('error', `Requesting ${id} did not return results.`);
			return;
		}

		findMediaText('', rootState.youtubeApiKey, rootState.mediaIndex, { mediaList }).then(
			res => {
				const { newMedia } = res;
				const _mediaList = res.mediaList;
				if (newMedia.length) commit('updateMediaIndex', newMedia);

				const ws = state.sources[id];
				const pl = ws ? ws.playList : [];
				const archive = ws && ws.archive ? ws.archive : [];
				const index = new Set([...pl.map(v => v.id), ...archive]);
				const newVideos = Object.values(
					_mediaList.reduce((acc, v) => {
						if (!index.has(v.id) && !(v.id in acc)) acc[v.id] = v;
						return acc;
					}, {})
				);
				if (!newVideos.length) {
					commit('error', `No new videos found for ${id}. Try agin.`);
					return;
				}
				commit('updateMediaIndex', newVideos);
				const playList = [...pl, ...newVideos];
				while (playList.length > 3000) {
					const media = playList.shift();
					archive.push(media.id);
				}
				if (newVideos.length) {
					commit('updateWebScraper', { id, values: { playList, archive } });
				}

				// Forward media to matrix room.
				if (rootState.matrix.matrixLoggedIn && state.forward[id]) {
					state.forward[id].forEach(forward => {
						_mediaList.forEach(newMedia => {
							dispatch('matrixSend', { roomId: forward.id, media: newMedia, silent: true });
						});
					});
				}
			}
		);
	},
	initWebScraper({ state, commit, dispatch }, id) {
		if (id && !(id in state.sources)) {
			commit('addWebScraper', id);
		}
		const ws = state.sources[id];
		if (!ws.playList.length) {
			dispatch('webScraperLoadMore', id);
		}
	},
	webScraperLoadMore({ state, commit, dispatch, rootState }, id) {
		if (!id) {
			commit('error', `Can not find channel "${id}".`);
			return;
		}
		if (rootState.isLoading[id]) return;
		commit('toggleIsLoading', { id, loading: true });
		setTimeout(() => {
			commit('toggleIsLoading', { id, loading: false });
		}, 10000);

		const ws = state.sources[id];
		const index = rootState.paginationIndex[id] || 0;
		if (id === 'Imgur') {
			commit('toggleIsLoading', { id, loading: true });
			commit('increasePaginationIndex', id);
			webScraper
				.getImgurMedia(rootState.paginationIndex[id])
				.then(mediaList => {
					dispatch('webScraperUpdateSuccess', { id, mediaList });
				})
				.catch(error => commit('error', `Could not get Imgur. ${error}`))
				.finally(() => commit('toggleIsLoading', { id, loading: false }));
		} else if (ws.settings.type === 'watch') {
			// Watch jobs are started at the beginning, they dont need an interaction.
			commit('toggleIsLoading', { id, loading: false });
		} else if (ws.settings.type === 'script') {
			commit('increasePaginationIndex', id);
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
					youtubeApiKey: rootState.youtubeApiKey,
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
				if (!rootState.extensionAvilable) {
					commit('error', 'The audius extension is not installed. Please install it.');
					commit('setShowSettings');
					return;
				}
				commit('increasePaginationIndex', id);
				extensionMessage({
					audius: true,
					type: 'scanUrl',
					url: webScraper.patternToUrls(requestUrl)[requestIndex],
					youtubeApiKey: rootState.youtubeApiKey,
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
