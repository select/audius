// Matrix
export const state = {
	currentMatrixRoom: null,
	sources: {},
	sourcesOrdered: [],
	createMatrixRoomModal: false,
	showMatrixRoomDirectory: false,
	matrixLoggedIn: false,
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
