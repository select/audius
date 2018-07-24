export function getMediaEntity(state, mediaId) {
	if (mediaId in state.entities) return state.entities[mediaId];
	let media = state.search.results.find(item => item.id === mediaId);
	if (media) return media;
	for (const sourceName of ['matrix', 'webScraper']) {
		for (const sourceId of state[sourceName].sourcesOrdered) {
			media = state[sourceName].sources[sourceId].playList.find(({ id }) => id === mediaId)
			if (media) return media;
		}
	}
	return {};
}

export function getCurrentPlayList(state) {
	const { id, type } = state.currentMediaSource;
	if (['webScraper', 'matrix'].includes(type)) {
		return state[type].sources[id].playList.map(m => m.id);
	}
	return id ? state.sources[id] : state.playList;
}

export function getCurrentPlayListEntities(state) {
	const { type } = state.currentMediaSource;
	const sourceId = state.currentMediaSource.id;
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
	if (type === 'matrix') return state.matrix.sources[id].name;
	return id;
}
