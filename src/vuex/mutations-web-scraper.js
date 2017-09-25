import { webScraper } from '../utils';
import { rename } from './mutations-rename';

/* eslint-disable no-param-reassign */
export const mutationsWebScraper = {
	// Web Scraper
	// ---
	addWebScraper(state, name) {
		if (!name) {
			let counter = 1;
			name = `Channel ${counter}`;
			while (name in state.webScrapers) {
				name = `Channel ${counter++}`;
			}
		}

		state.webScrapers[name] = { playList: [], playedMedia: {}, settings: {}, archive: [] };
		if (!state.webScrapersOrdered.includes(name)) state.webScrapersOrdered.push(name);
		state.currentWebScraper = name;
	},
	deleteWebScraper(state, id) {
		delete state.webScrapers[id];
		state.webScrapersOrdered = state.webScrapersOrdered.filter(n => n !== id);
	},
	addUrlPattern(state, { id, urlPattern }) {
		const urls = state.webScrapers[id].settings.urls || [];
		const { settings } = state.webScrapers[id];
		if (!urls.some(p => p === urlPattern)) {
			settings.urls = [
				...urls,
				{ url: urlPattern, numPages: webScraper.patternToUrls(urlPattern).length },
			];
			settings.numPages = settings.urls.reduce((acc, { numPages }) => acc + numPages, 0);
		}
		state.webScrapers = Object.assign({}, state.webScrapers);
	},
	setShowWatched(state, { id, toggleState }) {
		state.showWatched[id] = toggleState;
		state.showWatched = Object.assign({}, state.showWatched);
	},
	setPaginationIndex(state, { id, index }) {
		state.paginationIndex[id] = index;
		state.paginationIndex = Object.assign({}, state.paginationIndex);
	},
	updateWebScraper(state, { id, values }) {
		state.webScrapers[id] = Object.assign({}, state.webScrapers[id], values);
		state.webScrapers = Object.assign({}, state.webScrapers);
	},
	renameWebScraper(state, { newName, oldName }) {
		rename(state, 'webScrapers', newName, oldName);
	},

	setReloadScript(state, id) {
		// upp the reload count so the component detects the change
		state.reloadScript[id]++;
	},
};
