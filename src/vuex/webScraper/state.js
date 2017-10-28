// Web scraper
export const state = () => ({
	paginationIndex: {},
	sources: { Imgur: { playList: [], playedMedia: {}, archive: [] } },
	sourcesOrdered: ['Imgur'],
	sourcesInitialized: {}, // e.g. `{'pr0gramm': true}`
});
