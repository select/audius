export const presistMutation = {
	recoverState: ['sources'], // migration, remov 2.0.18
	updateWebScraper: ['sources'],
	addUrlPattern: ['sources'],
	addWebScraper: ['sourcesOrdered', 'sources'],
	renameWebScraper: ['sourcesOrdered', 'sources'],
};
