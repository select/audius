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

const eventIndex = {};
const playListEvents = {};

/* eslint-disable no-param-reassign */
function updateMembers(state, rooms) {
	// Commit member names to the store.
	rooms.forEach(room => {
		if (!room.getJoinedMembers) return;
		room.getJoinedMembers().forEach(member => {
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
	});
	state.membersIndex = Object.assign({}, state.membersIndex);
}

function updateClientRooms(state, rooms) {
	// console.log('rooms', rooms);
	const { userId } = state.credentials;
	rooms.forEach(room => {
		const { roomId } = room;

		// Create room if not known yet.
		if (!(roomId in state.sources)) {
			state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { roomId, name: room.name });
		}

		state.sources[roomId].roomId = roomId;

		// Set members of the room.
		state.sources[roomId].members = room.getJoinedMembers().map(
			(member) => ({ id: member.userId, powerLevel: member.powerLevel })
		);


		// Set room name if it changed and is not a matrix id.
		state.sources[roomId].name = room.name;
		state.sources[roomId].avatarUrl = room.getAvatarUrl('https://matrix.org', 200, 200, 'scale');
		// Check if the user is only ivited but not joined.
		// States to check ["invite", "join", "leave", "ban"]
		state.sources[roomId].membership = room.getMyMembership();
		// Find out if this is a direct message room.
		let type = room.getDMInviter() ? 'directMessage' : 'room';
		if (type === 'directMessage') {
			state.directMessages[room.getDMInviter()] = roomId;
			state.sources[roomId].name = room.name.replace(/@(\w+):.+/, '$1');
			state.sources[roomId].avatarUrl = room.getMember(room.getDMInviter()).getAvatarUrl('https://matrix.org', 200, 200, 'scale');
		}
		const allMembers = room.currentState.getMembers();
		if (type === 'room' && allMembers.length <= 2) {
			const inviter = allMembers.find(m => m.getDMInviter());
			if (inviter) {
				type = 'directMessage';
				state.sources[roomId].avatarUrl = inviter.getAvatarUrl('https://matrix.org', 200, 200, 'scale');
			}
		}
		state.sources[roomId].type = type;

		// Set flag indicating if current user is admin.
		const myuser = room.getMember(userId);
		state.sources[roomId].isAdmin = myuser.powerLevel >= 100;

		state.sources[roomId].aliases = room.getAliases();

		// Add to room list if not on the list.
		if (!state.sourcesOrdered.includes(roomId)) {
			state.sourcesOrdered.unshift(roomId);
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
		if (!state.sourcesOrdered.includes(roomId)) {
			state.sourcesOrdered = [roomId, ...state.sourcesOrdered];
		}
		if (!(roomId in state.sources)) {
			state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { name: room.name });
		} else {
			console.log("room.status", room.getMyMembership());
			state.sources[roomId].membership = 'join';
		}
		state.sources = Object.assign({}, state.sources);
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
	moveMatrixSourcesOrdered(state, sourcesOrdered) {
		state.sourcesOrdered = sourcesOrdered;
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
	setRoomSearchResults(state, rooms) {
		state.roomSearchResults = rooms;
	},
	setLastPageReached(state, roomId) {
		state.lastPageReached[roomId] = true;
	},
	updateMatrixEvent(state, update) {
		// Update all events (text, media (could be multiple links in one text message)) with this id
		eventIndex[update.eventId].forEach(event => {
			Object.assign(event, update.data);
		});
		// If the id changed create another entry with the new id.
		if (update.eventId !== update.data.eventId) {
			eventIndex[update.data.eventId] = eventIndex[update.eventId];
		}
		state.sources = Object.assign({}, state.sources);
	},
	matrixRedact(state, { eventId, roomId }) {
		if (roomId in state.chatLog) {
			state.chatLog[roomId] = state.chatLog[roomId].filter(event => event.eventId !== eventId);
			state.chatLog = Object.assign({}, state.chatLog);
		}

		if (roomId in state.sources) {
			state.sources[roomId].playList = state.sources[roomId].playList.filter(event => event.eventId !== eventId);
			state.sources = Object.assign({}, state.sources);
		}
	},
	addChatlog(state, originalEvents) {
		originalEvents.forEach(originalEvent => {
			const { roomId, type } = originalEvent;

			if (originalEvent.eventId in eventIndex) {
				// The `eventIndex` is used to update all events if the temp id and status changes
				eventIndex[originalEvent.eventId].push(originalEvent);
			} else {
				eventIndex[originalEvent.eventId] = [originalEvent];
			}

			// Create room if it does not exist
			if (!(roomId in state.sources)) {
				state.sources[roomId] = Object.assign({}, matrixRoomTemplate(), { roomId, name: roomId });
			}
			if (!(roomId in playListEvents)) {
				// Remove events with temporary id
				state.sources[roomId].playList = state.sources[roomId].playList
					.filter(media => typeof media === 'object')
					.filter(
						({ eventId }) => !eventId || eventId[0] !== '~'
					);
				// Build index of known events on playlist
				playListEvents[roomId] = new Set(
					state.sources[roomId].playList
						.filter(({ eventId }) => eventId)
						.map((media) => `${media.eventId}-${media.id}`)
				);
			}

			// Add media to source[xxx].playList
			const uuidEvent = `${originalEvent.eventId}-${originalEvent.id}`;
			if (type !== 'text' && !playListEvents[roomId].has(uuidEvent)) {
				const { playList, archive } = state.sources[roomId];
				playListEvents[roomId].add(uuidEvent);
				playList.push(originalEvent);
				playList.sort(sortEventsChonologically);
				playList.reverse();
				while (playList.length > 3000) {
					const media = playList.shift();
					archive.push(media.id);
				}
			}

			const event = Object.assign(originalEvent, {
				childEvent: null,
				parentEvent: null,
			});
			eventIndex[originalEvent.eventId].push(event);
			if (!state.chatLog) {
				console.warn('This should not happen. state.chatLog is ', state.chatLog);
				state.chatLog = {};
			}
			if (!(roomId in state.chatLog)) {
				state.chatLog[roomId] = [event];
			} else {
				const chatLog = state.chatLog[roomId];
				chatLog.push(event);
				chatLog.sort(sortEventsChonologically);
				// If a `text` event and a media event have the same timestamp
				// the media event should be displayed below the text event.
				chatLog.forEach((_event, index) => {
					if (!index) return;
					const previousEvent = chatLog[index - 1];
					if (previousEvent.createdAt === _event.createdAt) {
						if (previousEvent.type !== 'text') ++previousEvent.createdAt;
						else ++_event.createdAt;
					}
				});
				// Sort again since order might have changed in the step before
				chatLog.sort(sortEventsChonologically);
				// Group / ungroup messages.
				chatLog.forEach((_event, index) => {
					if (!index) return;
					const previousEvent = chatLog[index - 1];
					// If the previus message is from the same sender and also of
					// type `text` group the messages.
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
