// Matrix
export const state = () => ({
	paginationIndex: {},
	currentMatrixRoom: null,
	sources: {},
	sourcesOrdered: [],
	createMatrixRoomModal: false,
	showMatrixRoomDirectory: false,
	matrixLoggedIn: false,
	showMatrixLoginModal: false,
	matrix: {
		hasCredentials: false,
		credentials: {
			accessToken: '',
			userId: '',
			deviceId: '',
		},
		publicRooms: [],
	},
	extensionAvilable: false,
});
