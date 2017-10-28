export function getMediaEntity(state, mediaId) {
	if (state.search.results) {
		const media = state.search.results.find(item => item.id === mediaId);
		if (media) return media;
	}
	const { id, type } = state.currentMediaSource;
	if (['matrix', 'webScraper'].includes(type)) {
		const store = state[type][type === 'matrix' ? 'matrixRooms' : 'webScrapers'][id];
		return Object.assign({}, store.playList.find(({ _id }) => _id === mediaId));
	}
	return state.entities[mediaId];
}

export function getCurrentPlayList(state) {
	const { id, type } = state.currentMediaSource;
	if (['webScraper', 'matrix'].includes(type)) {
		return state[type].sources[id].playList.map(m => m.id);
	}
	return id ? state.sources[id] : state.playList;
}

export function getCurrentPlayListEntities(state) {
	const { sourceId, type } = state.currentMediaSource;
	if (type === 'playList') {
		return (getCurrentPlayList(state) || []).map(id => state.entities[id] || { id });
	}
	const room = state[type].sources[sourceId];
	const fiveMinutes = 5 * 60 * 1000; /* ms */
	if (room) {
		if (state.showWatched[sourceId]) return room.playList;
		return room.playList.filter(
			({ id }) => !(id in room.playedMedia) || new Date() - room.playedMedia[id] < fiveMinutes
		);
	}
	return [];
}

export function getCurrentName(state) {
	const { id, type } = state.currentMediaSource;
	if (type === 'matrix') return state.matrix.matrixRooms[id].name;
	return id;
}
