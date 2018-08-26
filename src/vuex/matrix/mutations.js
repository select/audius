// Matrix Radio
import { hashCode } from '../../utils';

const matrixRoomTemplate = () =>
	JSON.parse(
		JSON.stringify({
			name: '',
			playList: [],
			archive: [],
			members: 0,
		})
	);

function stringToColour(str) {
	return `hsl(${hashCode(str) % 360},100%,30%)`;
}

const matrixNameRegEx = /@(.+):matrix.org/;

/* eslint-disable no-param-reassign */
function updateMembers(state, rooms) {
	// Dedublicate list of members
	const members = rooms.reduce((acc, room) => {
		if (room.currentState) {
			Object.assign(acc, room.currentState.members);
		}
		return acc;
	}, {});

	// Commit member names to the store.
	Object.values(members).forEach(member => {
		// console.log("member", member);
		if (!member) return { userid: null };
		const { userId, name } = member;
		const match = name.match(matrixNameRegEx);
		const newMember = {
			userId,
			name: match ? match[1] : name,
			nameColor: stringToColour(name),
		};
		if (userId in state.membersIndex) Object.assign(state.membersIndex[userId], newMember);
		else state.membersIndex[userId] = newMember;
	});
	state.membersIndex = Object.assign({}, state.membersIndex);
}

function updateClientRooms(state, rooms) {
	console.log('rooms', rooms);
	const { userId } = state.credentials;
	rooms.forEach(room => {
		const { roomId } = room;

		// Create room if not known yet.
		if (!(roomId in state.sources)) {
			state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { roomId, name: room.name });
		}

		if (room.currentState) {
			// Set members of the room.
			state.sources[roomId].members = Object.entries(room.currentState.members).map(
				([id, member]) => ({ id, powerLevel: member.powerLevel })
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
}

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
		state.sourcesOrdered = [roomId, ...state.sourcesOrdered];
	},
	setMemberInfo(state, member) {
		Object.assign(state.membersIndex[member.userId], member);
		state.membersIndex = Object.assign({}, state.membersIndex);
	},
	setMatrixLoggedIn(state, rooms) {
		state.showMatrixLoginModal = false;
		state.matrixLoggedIn = true;
		updateClientRooms(state, rooms);
		updateMembers(state, rooms);
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
	addChatlog(state, originalEvents) {
		originalEvents.forEach(originalEvent => {
			const { roomId, type } = originalEvent;
			if (!(roomId in state.sources)) {
				state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { roomId, name: roomId });
			}
			if (
				type !== 'text' &&
				!state.sources[roomId].playList.some(({ eventId }) => originalEvent.eventId === eventId)
			) {
				const { playList, archive } = state.sources[roomId];
				playList.push(originalEvent);
				playList.sort(sortEventsChonologically);
				playList.reverse();
				while (playList.length > 3000) {
					const media = playList.shift();
					archive.push(media.id);
				}
			}

			const event = Object.assign({}, originalEvent, {
				childEvent: null,
				parentEvent: null,
			});
			if (!(roomId in state.chatLog)) {
				state.chatLog[roomId] = [event];
			} else {
				const chatLog = state.chatLog[roomId];
				chatLog.push(event);
				chatLog.sort(sortEventsChonologically);
				chatLog.forEach((_event, index) => {
					if (!index) return;
					const previousEvent = chatLog[index - 1];
					if (previousEvent.createdAt === _event.createdAt) {
						if (previousEvent.type !== 'text') ++previousEvent.createdAt;
						else ++_event.createdAt;
					}
					// If the previus message is from the same sender group the messages.
					// 	previousEvent.childEvent = event;
					// 	event.parentEvent = previousEvent;
					// }
					if (
						previousEvent.type === 'text' &&
						_event.type === 'text' &&
						previousEvent.sender === _event.sender
					) {
						previousEvent.childEvent = _event;
						_event.parentEvent = previousEvent;
					} else {
						previousEvent.childEvent = null;
						_event.parentEvent = null;
					}
				});
			}
		});
		state.sources = Object.assign({}, state.sources);
		state.chatLog = Object.assign({}, state.chatLog);
	},
};

const sortEventsChonologically = (a, b) => (a.createdAt <= b.createdAt ? -1 : 1);
