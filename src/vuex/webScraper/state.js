// Web scraper
export const state = {
	sources: { Imgur: { playList: [], archive: [] } },
	sourcesOrdered: ['Imgur'],
	sourcesInitialized: {}, // e.g. `{'pr0gramm': true}`
	forward: {}, // {imgur: [{type: 'matrix', id: '!sdfsdf:matrix.org'}, {type: 'matrix', id: '!babaaba:matrix.org'}]}
};
