export function getCurrentPlayList(state) {
	if (state.currentWebScraper) {
		return state.webScrapers[state.currentWebScraper].playList.map(m => m.id);
	}
	if (state.currentRadioStation) {
		return state.radioStations[state.currentRadioStation].playList;
	}
	return state.currentPlayList ? state.tags[state.currentPlayList] : state.playList;
}

export function getCurrentPlayListEntities(state) {
	if (state.currentWebScraper) {
		const ws = state.webScrapers[state.currentWebScraper];
		const fiveMinutes = 5 * 60 * 1000; /* ms */
		if (ws) {
			return ws.playList.filter(
				({ id }) => !(id in ws.playedMedia) || new Date() - ws.playedMedia[id] < fiveMinutes
			);
		}
		return [];
	}
	return getCurrentPlayList(state).filter(id => state.entities[id]).map(id => state.entities[id]);
}

export function getCurrentName(state) {
	const names = ['currentPlayList', 'currentRadioStation', 'currentWebScraper'];
	const id = state[names.find(n => !!state[n])];
	if (state.currentRadioStation) return state.radioStations[id].name;
	return id;
}
