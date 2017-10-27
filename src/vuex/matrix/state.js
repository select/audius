/* eslint-disable no-multiple-empty-lines */

// Matrix

export const state = {
	currentMatrixRoom: null,
	matrixRooms: {},
	matrixRoomsOrdered: [],
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
};
