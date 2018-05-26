// Matrix
export const state = {
	currentMatrixRoom: null,
	sources: {},
	sourcesOrdered: [],
	createMatrixRoomModal: false,
	showMatrixRoomDirectory: false,
	matrixLoggedIn: false,
	showMatrixLoginModal: false,
	hasCredentials: false,
	credentials: {
		accessToken: '',
		userId: '',
		deviceId: '',
	},
	publicRooms: [],
};
