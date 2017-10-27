/* eslint-disable no-multiple-empty-lines */

// Matrix

export const initialState = {
	currentMatrixRoom: null,
	matrixRooms: {},
	matrixRoomsOrdered: [],
	createMatrixRoomModal: false,
	showMatrixRoomDirectory: false,
	matrixEnabled: false,
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
};
