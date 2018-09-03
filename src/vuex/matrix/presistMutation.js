export const presistMutation = {
	recoverState: ['sources'], // migration, remov 2.0.18
	setMatrixCredentials: ['credentials', 'hasCredentials', 'isGuest'],
	setPublicRooms: ['publicRooms'],
	matrixRemoveAccount: ['credentials', 'hasCredentials', 'isGuest'],
	toggleHideRoom: ['sources'],
	updateMatrixRoom: ['sources', 'sourcesOrdered'],
	setMatrixLoggedIn: ['sources', 'sourcesOrdered'],
	deleteMatrixRoom: ['sources', 'sourcesOrdered'],
	joinRoom: ['sources', 'sourcesOrdered'],
	saveMatrix: [
		'sources',
		'sourcesOrdered',
		'credentials',
		'hasCredentials',
		'isGuest',
		'publicRooms',
	],
	setMemberInfo: ['membersIndex'],
	addChatlog: ['sources'],
	moveMatrixSourcesOrdered: ['sourcesOrdered'],
	updateMatrixEvent: ['sources'],
};
