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
export const mutations = {
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
		const { userId } = state.matrix.credentials;

		rooms.forEach(room => {
			const { roomId } = room;

			// Create room if not known yet.
			if (!(roomId in state.sources)) {
				state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { name: room.name });
			}

			if (room.currentState) {
				// Set members of the room.
				state.sources[roomId].members = Object
					.entries(room.currentState.members)
					.map(([id, member]) => ({ id, powerLevel: member.powerLevel }));

				// Set flag indicating if current user is admin.
				const myuser = room.currentState.members[userId] || {};
				state.sources[roomId].isAdmin = myuser.powerLevel >= 100;

				try {
					state.sources[roomId].alias = room.currentState.events['m.room.aliases']['matrix.org'].event.content.aliases[0];
				} catch (e) {
					console.warn('could not get alias, well it is bad code anyway');
				}
			}

			// Add to room list if not on the list.
			if (!state.sourcesOrdered.includes(roomId)) {
				state.sourcesOrdered.unshift(roomId);
			}
			// Set room name if it changed and is not a matrix id.
			if (
				state.sources[roomId].name !== room.name &&
				!room.name.includes(':matrix.org')
			) {
				state.sources[roomId].name = room.name;
			}
		});
		// Remove room from room list if it does not exist any more.
		// Do not do that if length is one, sice this function is also
		// called when adding "one" new room
		if (rooms.length > 1) {
			const roomIndex = new Set(rooms.map(({ roomId }) => roomId));
			state.sourcesOrdered = state.sourcesOrdered.filter(id => roomIndex.has(id));
		}
	},
	toggleMatrixLoginModal(state, toggleState) {
		state.showMatrixLoginModal =
			toggleState !== undefined ? toggleState : !state.showMatrixLoginModal;
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
		state.sources = {};
		state.sourcesOrdered = [];
		state.currentMatrixRoom = '';
	},
	deleteMatrixRoom(state, roomId) {
		state.sourcesOrdered = state.sourcesOrdered.filter(id => id !== roomId);
	},
	updateMatrixRoom(state, { roomId, values }) {
		// Create room if it does not exist.
		if (!state.sources[roomId]) {
			state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { name: roomId });
		}
		// Assign values to room. This assumes that merging ect was done in the function
		// that triggered this mutation.
		state.sources[roomId] = Object.assign({}, state.sources[roomId], values);
		// Update the reference so the UI redraws.
		state.sources = Object.assign({}, state.sources);
	},
	setPaginationIndex(state, { id, index }) {
		state.paginationIndex[id] = index;
		state.paginationIndex = Object.assign({}, state.paginationIndex);
	},
};
