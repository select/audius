import { youtubeApiKey } from '../../utils/config';
import { s2time } from '../../utils';

import { getCurrentPlayListEntities, getCurrentName } from './getCurrentPlayList';

export const getters = {
	exportTypeName(state) {
		return state.currentWebScraper ? 'channel' : state.currentMatrixRoom ? 'room' : 'playlist';
	},
	playList(state) {
		const { type, id } = state.currentMediaSource;
		if (type === 'playList' && id) return state.sources[id];
		return state.playList;
	},
	playListLength(state) {
		return state.playList.length;
	},
	currentExportData(state, _getters) {
		if (state.currentWebScraper) {
			const ws = state.webScrapers[state.currentWebScraper];
			return Object.assign({}, ws, {
				AudiusChannel: true,
				playList: ws.playList,
				archive: [],
				playedMedia: {},
			});
		}
		return {
			AudiusDump: true,
			playList: _getters.filteredPlayList.map(({ id }) => id),
			entities: _getters.playListEntities,
		};
	},
	filteredPlayList(state) {
		const playListEntities = getCurrentPlayListEntities(state);
		if (!state.filterQuery) return playListEntities;
		return playListEntities.filter(media =>
			media.title.toLowerCase().includes(state.filterQuery)
		);
	},
	filteredPlayListLength(state, _getters) {
		if (!_getters.filteredPlayList) return 0;
		return _getters.filteredPlayList.length;
	},
	playListEntities(state) {
		return getCurrentPlayListEntities(state)
			.reduce((entities, media) => ({ ...entities, [media.id]: media }), {});
	},
	currentName(state) {
		return getCurrentName(state);
	},
	currentTimeObj(state) {
		const currentTime = state.currentMedia.start
			? state.currentTime - state.currentMedia.start
			: state.currentTime;
		return s2time(currentTime);
	},
	progressWidth(state) {
		const d = state.currentMedia.durationAlbum || state.currentMedia.durationS;
		return state.currentTime / d * 100;
	},
	youtubeApiKeyUI(state) {
		return state.youtubeApiKey === youtubeApiKey ? '' : state.youtubeApiKey;
	},
	sessionHistoryHasPrev(state) {
		const hlength = state.sessionHistory.length;
		return hlength > 0 && state.sessionHistoryPos < hlength - 2;
	},
};
