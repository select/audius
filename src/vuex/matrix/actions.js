import { findMediaText, getMediaLink } from '../../utils';
import { getMediaEntity } from '../audius/getCurrentPlayList';
// This must be avialable in the whole module since it's lazy loaded.
// Do not delete;
let matrixClient;

function addMatrixMessage(state, commit, roomId, eventId, results) {
	const room = state.sources[roomId];
	if (!results.length) return;
	const playList = [
		...room.playList,
		...results.filter(({ id }) => id).map(media => Object.assign({}, media, { roomId, eventId })),
	];
	const archive = [...room.archive];
	while (playList.length > 3000) {
		const media = playList.shift();
		archive.push(media.id);
	}
	commit('updateMatrixRoom', {
		roomId,
		values: {
			playList,
			archive,
		},
	});
}

/* eslint-disable no-param-reassign */
export const actions = {
	initMatrix({ commit, state, dispatch }) {
		import(/* webpackChunkName: "utils/matrixClient" */ '../../utils/matrixClient').then(mc => {
			({ matrixClient } = mc);
			if (!state.matrix.hasCredentials) {
				matrixClient
					.getCredentials()
					.then(credentials => commit('setMatrixCredentials', { credentials, isGuest: true }))
					.then(() =>
						matrixClient.login(state.matrix.credentials, state.matrix.isGuest, dispatch, commit)
					)
					.then(rooms => {
						commit('setMatrixLoggedIn', { rooms });
						dispatch('updatePublicRooms');
					});
			} else if (!state.matrixLoggedIn) {
				matrixClient
					.login(state.matrix.credentials, state.matrix.isGuest, dispatch, commit)
					.then(rooms => {
						commit('setMatrixLoggedIn', { rooms });
						dispatch('updatePublicRooms');
					});
			}
		});
	},
	loginMatrixWithPassword({ commit, state, dispatch }, { username, password }) {
		import(/* webpackChunkName: "matrix-client" */ '../../utils/matrixClient').then(mc => {
			({ matrixClient } = mc);
			matrixClient
				.getCredentialsWithPassword(username, password)
				.then(credentials => commit('setMatrixCredentials', { credentials, isGuest: false }))
				.then(() =>
					matrixClient.login(state.matrix.credentials, state.matrix.isGuest, dispatch, commit)
				)
				.then(rooms => commit('setMatrixLoggedIn', { rooms }))
				.catch(error => commit('error', `${error}`));
		});
	},
	matrixSend({ state, commit }, { itemId, roomId, media }) {
		const curMedia = media || getMediaEntity(state, itemId);
		if (state.sources[roomId].playList.some(({ id }) => id === curMedia.id)) {
			commit('error', 'The media item was already posted.');
			return;
		}
		if (state.sources[roomId].humanReadablePosts) {
			matrixClient
				.sendMessage(roomId, getMediaLink(curMedia))
				.catch(error => commit('error', `Posting message to matrix room failed. ${error}`));
		} else {
			matrixClient
				.sendEvent(roomId, curMedia)
				.catch(error => commit('error', `Posting media to matrix room failed. ${error}`));
		}
	},
	matrixRedact({ state, commit }, media) {
		if (!(media.roomId && media.eventId)) {
			commit('error', 'Not enough information to remove media from matrix room.');
			return;
		}
		matrixClient
			.redactEvent(media.roomId, media.eventId)
			.then(() => {
				commit('updateMatrixRoom', {
					roomId: media.roomId,
					values: {
						playList: state.sources[media.roomId].playList.filter(
							({ eventId }) => eventId !== media.eventId
						),
					},
				});
			})
			.catch(error => commit('error', `Could not remove media from matrix room. ${error}`));
	},
	matrixPaginate({ state, commit }, id) {
		// const id = state.currentMatrixRoom;
		matrixClient
			.paginate(state.currentMatrixRoom)
			.then(res => {
				if (res) {
					commit('setPaginationIndex', {
						id,
						index: (state.paginationIndex[id] || 0) + 1,
					});
				} else {
					commit('error', 'You reached the last page of this room.');
				}
			})
			.catch(() => commit('error', 'Paginating matrix room failed'));
	},
	joinMatrixRoom({ commit }, { id, name }) {
		matrixClient
			.joinRoom(id)
			.then(room => {
				room.name = name || id;
				commit('setMatrixLoggedIn', { rooms: [room] });
				commit('selectMediaSource', { type: 'webScraper', id: room.roomId });
				commit('setLeftMenuTab', 'webScraper');
			})
			.catch(error => {
				// {"errcode":"M_FORBIDDEN","error":"Guest access not allowed"}
				console.log('err', error);
				if (error.message === 'Guest access not allowed') commit('toggleMatrixLoginModal', true);
				commit('error', `Could not join room: ${error.message}`);
			});
	},
	createMatrixRoom({ commit }, options) {
		matrixClient
			.createRoom(options)
			.then(room => {
				room.name = options.name;
				room.roomId = room.room_id;
				commit('setMatrixLoggedIn', { rooms: [room] });
				commit('updateMatrixRoom', {
					roomId: room.roomId,
					values: { isHidden: options.visibility === 'private' },
				});
				commit('toggleMatrixRoomModal', false);
				commit('selectMediaSource', { type: 'radio', id: room.room_id });
				commit('setLeftMenuTab', 'radio');
			})
			.catch(error => {
				commit('error', `Could not create room. ${error}`);
			});
	},
	setRoomName({ commit }, { id, name }) {
		matrixClient
			.setRoomName(id, name)
			.then(() => commit('setMatrixLoggedIn', { rooms: [{ roomId: id, name }] }))
			.catch(error => commit('error', `Could not rename matrix room: ${error}`));
	},
	setRoomTag({ commit }, { roomId, tagName }) {
		matrixClient
			.setRoomTag(roomId, tagName)
			.then(() => commit('error', { error: 'room tag is set', type: 'success' }))
			.catch(error => commit('error', `Could not set tagName. ${error}`));
	},
	updateRoomOptions({ commit }, options) {
		if ('humanReadablePosts' in options) {
			commit('updateMatrixRoom', {
				roomId: options.id,
				values: { humanReadablePosts: options.humanReadablePosts },
			});
		}
		if ('allowGuests' in options) {
			matrixClient
				.setRoomAllowGuests(options.id, options.allowGuests)
				.then(() =>
					commit('updateMatrixRoom', {
						roomId: options.id,
						values: { allowGuests: options.allowGuests },
					})
				)
				.catch(error =>
					commit('error', `Could not set allow guests to ${options.allowGuests}. ${error}`)
				);
		}
		if ('isHidden' in options) {
			matrixClient
				.setRoomVisibility(options.id, options.isHidden)
				.then(() =>
					commit('updateMatrixRoom', { roomId: options.id, values: { isHidden: options.isHidden } })
				)
				.catch(error => commit('error', `Could not set room private. ${error}`));
		}
	},
	leaveMatrixRoom({ commit }, roomIdOrAlias) {
		matrixClient
			.leaveRoom(roomIdOrAlias)
			.then(() => commit('deleteMatrixRoom', roomIdOrAlias))
			.catch(() => commit('error', 'Leaving matrix room failed'));
	},
	updatePublicRooms({ commit }) {
		const blacklist = new Set(['!hUkskxfIMmwAQuZIjz:matrix.org']);
		matrixClient
			.listPublicRooms()
			.then(res => {
				const rooms = res.chunk.filter(({ room_id }) => !blacklist.has(room_id));
				commit(
					'setPublicRooms',
					rooms.map(room => ({
						name: room.name.replace('[Audius]', ''),
						id: room.room_id,
						numberOfMembers: room.num_joined_members,
						topic: room.topic,
					}))
				);
			})
			.catch(() => commit('error', 'Getting public matrix Rooms failed'));
	},
	matrixLogout({ commit }) {
		// FIXIME this is async and could return a promis
		// after witch the state should be saved
		matrixClient.logout();
		commit('matrixLogout');
	},
	parseMatrixMessage({ state, commit }, { roomId, eventId, message }) {
		// Get the room for the message.
		const room = state.sources[roomId];
		if (!(roomId in state.sources)) {
			commit('error', `Could not find matrix room ${roomId}`);
			commit('updateMatrixRoom', { roomId });
			return;
		}

		// Build an index of all known media items from this room.
		// This is used by `findMediaText` to minimize the number of requests.
		const index = new Set([...room.playList.map(v => v.id), ...room.archive]);
		if (typeof message === 'object') {
			// message is a media object
			if (!index.has(message.id)) addMatrixMessage(state, commit, roomId, eventId, [message]);
			window.console.log(`[Matrix-Media] %c${message.title}`, 'color: #2DA7EF;');
		} else {
			window.console.log(`[Matrix-Text] %c${message}`, 'color: #2DA7EF;');
			findMediaText(message, state.youtubeApiKey, { indexKnown: index }).then(({ mediaList }) => {
				addMatrixMessage(state, commit, roomId, eventId, mediaList);
			});
		}
	},
};
