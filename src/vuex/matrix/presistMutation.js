export const presistMutation = {
	play: ['sources'],
	nextVideo: ['sources'],
	setMatrixCredentials: ['credentials', 'hasCredentials', 'isGuest'],
	setPublicRooms: ['publicRooms'],
	updateMatrixRoom: ['sourcesOrdered', 'sources'],
	matrixRemoveAccount: ['credentials', 'hasCredentials', 'isGuest'],
	deleteMatrixRoom: ['sourcesOrdered', 'sources'],
	setMatrixLoggedIn: ['sourcesOrdered'],
	toggleHideRoom: ['sources'],
	saveMatrix: [
		'sources',
		'sourcesOrdered',
		'credentials',
		'hasCredentials',
		'isGuest',
		'publicRooms',
	],
};