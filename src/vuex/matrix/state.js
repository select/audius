// Matrix
export const state = {
	matrixLoggedIn: false,
	currentMatrixRoom: null,
	sources: {},
	chatLog: {},
	roomSearchResults: [],
	membersIndex: {},
	sourcesOrdered: [],
	createMatrixRoomModal: false,
	showMatrixRoomDirectory: false,
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
