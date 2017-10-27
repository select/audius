export function getMediaEntity(state, mediaId) {
	if (state.search.results) {
		const media = state.search.results.find(item => item.id === mediaId);
		if (media) return media;
	}
	if (state.currentWebScraper || state.currentMatrixRoom) {
		const store = state.currentWebScraper
			? state.webScrapers[state.currentWebScraper]
			: state.matrixRooms[state.currentMatrixRoom];
		return Object.assign({}, store.playList.find(({ id }) => id === mediaId));
	}
	return state.entities[mediaId];
}

export function getCurrentPlayList(state) {
	if (state.currentWebScraper) {
		return state.webScrapers[state.currentWebScraper].playList.map(m => m.id);
	}
	if (state.currentMatrixRoom) {
		return state.matrixRooms[state.currentMatrixRoom].playList;
	}
	return state.currentPlayList ? state.tags[state.currentPlayList] : state.playList;
}

export function getCurrentPlayListEntities(state) {
	if (!(state.currentMatrixRoom || state.currentWebScraper)) {
		return (getCurrentPlayList(state) || []).map(id => state.entities[id] || { id });
	}
	let room;
	let id;
	if (state.currentMatrixRoom) {
		room = state.matrixRooms[state.currentMatrixRoom];
		id = state.currentMatrixRoom;
	} else if (state.currentWebScraper) {
		room = state.webScrapers[state.currentWebScraper];
		id = state.currentWebScraper;
	}
	const fiveMinutes = 5 * 60 * 1000; /* ms */
	if (room) {
		if (state.showWatched[id]) return room.playList;
		return room.playList.filter(
			({ id }) => !(id in room.playedMedia) || new Date() - room.playedMedia[id] < fiveMinutes
		);
	}
	return [];
}

export function getCurrentName(state) {
	const names = ['currentPlayList', 'currentMatrixRoom', 'currentWebScraper'];
	const id = state[names.find(n => !!state[n])];
	if (state.currentMatrixRoom) return state.matrixRooms[id].name;
	return id;
}
