// Matrix Radio

const matrixRoomTemplate = () =>
	JSON.parse(
		JSON.stringify({
			name: '',
			playList: [],
			playedMedia: {},
			archive: [],
			members: 0,
		})
	);

const matrixNameRegEx = /@(.+):matrix.org/;

/* eslint-disable no-param-reassign */
export const mutations = {
	recoverState_matrix(state, recoveredState) {
		Object.assign(state, recoveredState);
	},
	setPublicRooms(state, rooms) {
		state.publicRooms = rooms;
	},
	setMatrixCredentials(state, { credentials, isGuest }) {
		state.hasCredentials = true;
		state.credentials = credentials;
		state.isGuest = isGuest;
	},
	joinRoom(state, room) {
		const { roomId } = room;
		if (roomId in state.sources) return;
		state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { name: room.name });
		state.sourcesOrdered = [...state.sourcesOrdered, roomId];
	},
	setMatrixLoggedIn(state, { rooms }) {
		state.showMatrixLoginModal = false;
		state.matrixLoggedIn = true;
		const { userId } = state.credentials;

		rooms.forEach(room => {
			const { roomId } = room;

			// Create room if not known yet.
			if (!(roomId in state.sources)) {
				state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { name: room.name });
			}

			if (room.currentState) {
				// Set members of the room.
				state.sources[roomId].members = Object.entries(room.currentState.members).map(
					([id, member]) => ({ id, powerLevel: member.powerLevel })
				);
				state.memberNames = Object.entries(room.currentState.members).reduce(
					(acc, [id, member]) => {
						const match = member.name.match(matrixNameRegEx);
						const name = match ? match[1] : member.name;
						return Object.assign(acc, { [id]: name });
					},
					state.memberNames
				);

				// Set flag indicating if current user is admin.
				const myuser = room.currentState.members[userId] || {};
				state.sources[roomId].isAdmin = myuser.powerLevel >= 100;

				try {
					[state.sources[roomId].alias] = room.currentState.events['m.room.aliases'][
						'matrix.org'
					].event.content.aliases;
				} catch (e) {
					console.warn('could not get alias, well it is bad code anyway');
				}
			}

			// Add to room list if not on the list.
			if (!state.sourcesOrdered.includes(roomId)) {
				state.sourcesOrdered.unshift(roomId);
			}
			// Set room name if it changed and is not a matrix id.
			if (state.sources[roomId].name !== room.name && !room.name.includes(':matrix.org')) {
				state.sources[roomId].name = room.name;
			}
		});
		// Remove room from room list if it does not exist any more.
		// Do not do that if length is one, sice this function is also
		// called when adding "one" new room
		if (rooms.length >= 1) {
			const roomIndex = new Set(rooms.map(({ roomId }) => roomId));
			state.sourcesOrdered = [
				// remove old
				...state.sourcesOrdered.filter(id => roomIndex.has(id)),
				// add missing
				...rooms.filter(({ roomId }) => !state.sourcesOrdered.includes(roomId)),
			];
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
	toggleMatrixConsentModal(state, options) {
		if (typeof options === 'boolean') {
			state.showMatrixConsentModal = options;
			return;
		}
		const { toggleState, message } = options;
		if (message) state.matrixConsentMessage = message;
		state.showMatrixConsentModal =
			toggleState !== undefined ? toggleState : !state.showMatrixConsentModal;
	},
	toggleMatrixRoomDirectory(state, toggleState) {
		state.showMatrixRoomDirectory =
			toggleState !== undefined ? toggleState : !state.showMatrixRoomDirectory;
	},
	matrixRemoveAccount(state) {
		Object.assign(state, {
			hasCredentials: false,
			matrixLoggedIn: false,
			isGuest: null,
			credentials: {
				accessToken: '',
				userId: '',
				deviceId: '',
			},
		});
	},
	matrixLogout(state) {
		state.matrixLoggedIn = false;
		// state.sources = {};
		// state.sourcesOrdered = [];
		state.currentMatrixRoom = '';
	},
	deleteMatrixRoom(state, roomId) {
		state.sourcesOrdered = state.sourcesOrdered.filter(id => id !== roomId);
		delete state.sources[roomId];
	},
	toggleHideRoom(state, roomId) {
		Object.assign(state.sources[roomId], { hidden: !state.sources[roomId].hidden });
		state.sources = Object.assign({}, state.sources);
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
	setLastPageReached(state, roomId) {
		state.lastPageReached[roomId] = true;
	},
	addChatlog(state, options) {
		const { roomId, message } = options;
		const event = Object.assign({}, options, { type: typeof message });
		if (!(roomId in state.chatlog)) {
			state.chatlog[roomId] = [event];
		} else if (state.chatlog[roomId][0].createdAt < event.createdAt) {
			state.chatlog[roomId] = [...state.chatlog[roomId], event];
		} else {
			state.chatlog[roomId] = [event, ...state.chatlog[roomId]];
		}
		state.chatlog = Object.assign({}, state.chatlog);
	},
};
