// Matrix Radio

const matrixRoomTemplate = () =>
	JSON.parse(
		JSON.stringify({
			name: '',
			playList: [],
			playedMedia: {},
			archive: [],
		})
	);

/* eslint-disable no-param-reassign */
export const mutationsMatrix = {
	setMatrixEnabled(state) {
		state.matrixEnabled = !state.matrixEnabled;
	},
	setPublicRooms(state, rooms) {
		state.matrix = Object.assign(
			{},
			state.matrix,
			{ publicRooms: rooms }
		);
	},
	setMatrixCredentials(state, { credentials, isGuest }) {
		state.matrix.hasCredentials = true;
		state.matrix.credentials = credentials;
		state.matrix.isGuest = isGuest;
	},
	setMatrixLoggedIn(state, { rooms }) {
		state.matrixLoggedIn = true;
		const userId = state.matrix.credentials.userId;

		rooms.forEach(room => {
			const roomId = room.roomId;

			// Create room if not known yet.
			if (!(roomId in state.matrixRooms)) {
				state.matrixRooms[roomId] = Object.assign({}, matrixRoomTemplate(), { name: room.name });
			}

			if (room.currentState) {
				// Set members of the room.
				state.matrixRooms[roomId].members = Object
					.entries(room.currentState.members)
					.map(([id, member]) => ({ id, powerLevel: member.powerLevel }));

				// Set flag indicating if current user is admin.
				const myuser = room.currentState.members[userId] || {};
				state.matrixRooms[roomId].isAdmin = myuser.powerLevel >= 100;

				try {
					state.matrixRooms[roomId].alias = room.currentState.events['m.room.aliases']['matrix.org'].event.content.aliases[0];
				} catch (e) {
					console.warn('could not get alias, well it is bad code anyway');
				}
			}

			// Add to ordered rooms list if not on the list yet.
			if (!state.matrixRoomsOrdered.includes(roomId)) {
				state.matrixRoomsOrdered.unshift(roomId);
			}
			// Set room name if it changed and is not a matrix id.
			if (
				state.matrixRooms[roomId].name !== room.name &&
				!room.name.includes(':matrix.org')
			) {
				state.matrixRooms[roomId].name = room.name;
			}
		});
	},
	toggleMatrixRoomModal(state, toggleState) {
		state.createMatrixRoomModal =
			toggleState !== undefined ? toggleState : !state.createMatrixRoomModal;
	},
	toggleMatrixRoomDirectory(state, toggleState) {
		state.showMatrixRoomDirectory =
			toggleState !== undefined ? toggleState : !state.showMatrixRoomDirectory;
	},
	matrixRemoveAccount(state) {
		state.matrix = {
			hasCredentials: false,
			credentials: {
				accessToken: '',
				userId: '',
				deviceId: '',
			},
		};
	},
	matrixLogout(state) {
		state.matrixLoggedIn = false;
		state.matrixRooms = {};
		state.matrixRoomsOrdered = [];
		state.currentMatrixRoom = '';
	},
	deleteMatrixRoom(state, roomId) {
		state.matrixRoomsOrdered = state.matrixRoomsOrdered.filter(id => id !== roomId);
	},
	updateMatrixRoom(state, { roomId, values }) {
		// Create room if it does not exist.
		if (!state.matrixRooms[roomId]) {
			state.matrixRooms[roomId] = Object.assign({}, matrixRoomTemplate(), { name: roomId });
		}
		// Add to room list if not on the list.
		if (!state.matrixRoomsOrdered.includes(roomId)) {
			state.matrixRoomsOrdered.unshift(roomId);
		}
		// Remove room from room list if it does not exist any more.
		state.matrixRoomsOrdered = state.matrixRoomsOrdered.filter(id => id in state.matrixRooms);
		// Assign values to room. This assumes that merging ect was done in the function
		// that triggered this mutation.
		state.matrixRooms[roomId] = Object.assign({}, state.matrixRooms[roomId], values);
		// Update the reference so the UI redraws.
		state.matrixRooms = Object.assign({}, state.matrixRooms);
	},
};
