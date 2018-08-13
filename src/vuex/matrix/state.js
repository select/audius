// Matrix
export const state = {
	currentMatrixRoom: null,
	sources: {},
	chatlog: {},
	memberNames: {},
	sourcesOrdered: [],
	createMatrixRoomModal: false,
	showMatrixRoomDirectory: false,
	matrixLoggedIn: false,
	lastPageReached: {},
	showMatrixLoginModal: false,
	showMatrixConsentModal: false,
	matrixConsentMessage: '',
	hasCredentials: false,
	isGuest: null,
	credentials: {
		accessToken: '',
		userId: '',
		deviceId: '',
	},
	publicRooms: [],
};
