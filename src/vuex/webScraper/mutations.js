import { webScraper } from '../../utils';

/* eslint-disable no-param-reassign */
export const mutations = {
	// Web Scraper
	// ---
	recoverState_webScraper(state, recoveredState) {
		Object.assign(state, recoveredState);
	},
	addWebScraper(state, name) {
		if (!name) {
			let counter = 1;
			name = `Channel ${counter}`;
			while (name in state.sources) {
				name = `Channel ${counter++}`;
			}
		}

		state.sources[name] = { playList: [], settings: {}, archive: [] };
		if (!state.sourcesOrdered.includes(name)) state.sourcesOrdered.push(name);
		state.currentWebScraper = name;
	},
	deleteWebScraper(state, id) {
		delete state.sources[id];
		state.sourcesOrdered = state.sourcesOrdered.filter(n => n !== id);
		// TODO find a cleaner solution that this clean up code
		state.sourcesOrdered = state.sourcesOrdered.filter(n => n in state.sources);
		Object.keys(state.sources).forEach(id => {
			if (!state.sourcesOrdered.includes(id)) delete state.sources[id];
		});
	},
	initScraperSuccess(state, id) {
		state.sourcesInitialized[id] = true;
	},
	addUrlPattern(state, { id, urlPattern }) {
		const urls = state.sources[id].settings.urls || [];
		const { settings } = state.sources[id];
		if (!urls.some(p => p === urlPattern)) {
			settings.urls = [
				...urls,
				{ url: urlPattern, numPages: webScraper.patternToUrls(urlPattern).length },
			];
			settings.numPages = settings.urls.reduce((acc, { numPages }) => acc + numPages, 0);
		}
		state.sources = Object.assign({}, state.sources);
	},
	updateWebScraper(state, { id, values }) {
		state.sources[id] = Object.assign({}, state.sources[id], values);
		state.sources = Object.assign({}, state.sources);
	},
	renameWebScraper(state, { newName, oldName }) {
		const itemsObject = Object.assign({}, state.sources);
		itemsObject[newName] = itemsObject[oldName];
		const itemsOrdered = [...state.sourcesOrdered];
		itemsOrdered[itemsOrdered.indexOf(oldName)] = newName;
		delete itemsObject[oldName];
		state.sources = itemsObject;
		state.sourcesOrdered = itemsOrdered;
		if (oldName in state.forward) {
			state.forward[newName] = state.forward[oldName];
			delete state.forward[oldName];
			state.forward = Object.assign({}, state.forward);
		}
	},
	editWebScraperForward(state, { id, forward }) {
		state.forward[id] = forward;
		state.forward = Object.assign({}, state.forward);
	},
};
