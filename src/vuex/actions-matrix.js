import { findYouTubeIdsText, getYouTubeInfo, getMediaLink } from '../utils';
import { getMediaEntity } from './getCurrentPlayList';
// This must be avialable in the whole module since it's lazy loaded.
// Do not delete;
let matrixClient;

function addMatrixMessage(state, commit, roomId, eventId, results) {
	const room = state.matrixRooms[roomId];
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
export const actionsMatrix = {
	initMatrix({ commit, state, dispatch }) {
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(mc => {
			matrixClient = mc.matrixClient;
			if (!state.matrix.hasCredentials) {
				matrixClient
					.getCredentials()
					.then(credentials => commit('setMatrixCredentials', credentials))
					.then(() => matrixClient.login(state.matrix.credentials, dispatch, commit))
					.then(rooms => {
						commit('setMatrixLoggedIn', rooms);
						dispatch('updatePublicRooms');
					})
					.catch(error => commit('error', `Login failed. ${error}`));
			} else if (!state.matrixLoggedIn) {
				matrixClient
					.login(state.matrix.credentials, dispatch, commit)
					.then(rooms => {
						commit('setMatrixLoggedIn', rooms);
						dispatch('updatePublicRooms');
					})
					.catch(error => commit('error', `Login failed. ${error}`));
			}
		});
	},
	loginMatrixWithPassword({ commit, state, dispatch }, { username, password }) {
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(mc => {
			matrixClient = mc.matrixClient;
			matrixClient
				.getCredentialsWithPassword(username, password)
				.then(credentials => commit('setMatrixCredentials', credentials))
				.then(() => matrixClient.login(state.matrix.credentials, dispatch))
				.then(rooms => commit('setMatrixLoggedIn', rooms))
				.catch(error => commit('error', `${error}`));
		});
	},
	matrixSend({ state, commit }, { itemId, roomId, media }) {
		const curMedia = media || getMediaEntity(state, itemId);
		if (state.matrixRooms[roomId].humanReadablePosts) {
			matrixClient
				.sendMessage(roomId, getMediaLink(curMedia))
				.catch(() => commit('error', 'Posting media to matrix room failed'));
		} else {
			matrixClient
				.sendEvent(roomId, curMedia)
				.catch(() => commit('error', 'Posting media to matrix room failed'));
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
						playList: state.matrixRooms[media.roomId].playList.filter(
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
				commit('setMatrixLoggedIn', [room]);
				commit('selectMediaSource', { type: 'radio', id: room.roomId });
				commit('setLeftMenuTab', 'radio');
			})
			.catch(error => {
				commit('error', `Could not join room: ${error}`);
			});
	},
	createMatrixRoom({ commit }, options) {
		console.log('options', options);
		matrixClient
			.createRoom(options)
			.then(room => {
				room.name = options.name;
				room.roomId = room.room_id;
				commit('setMatrixLoggedIn', [room]);
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
			.then(() => commit('setMatrixLoggedIn', [{ roomId: id, name }]))
			.catch(error => commit('error', `Could not rename matrix room: ${error}`));
	},
	setRoomTag({ commit }, { roomId, tagName }) {
		matrixClient
			.setRoomTag(roomId, tagName)
			.then(() => console.log('room tag is set'))
			.catch(error => commit('error', `Could not set tagName. ${error}`));
	},
	updateRoomOptions({ commit }, options) {
		if ('humanReadablePosts' in options) {
			commit('updateMatrixRoom', {
				roomId: options.id,
				values: { humanReadablePosts: options.humanReadablePosts },
			});
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
				commit('setPublicRooms', rooms.map(room => ({
					name: room.name.replace('[Audius]', ''),
					id: room.room_id,
					numberOfMembers: room.num_joined_members,
					topic: room.topic,
				})));
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
		const room = state.matrixRooms[roomId];
		if (!(roomId in state.matrixRooms)) {
			commit('error', `Could not find matrix room ${roomId}`);
			commit('updateMatrixRoom', { roomId });
			return;
		}

		const index = new Set([...room.playList.map(v => v.id), ...room.archive]);
		if (typeof message === 'object') {
			if (!index.has(message.id)) addMatrixMessage(state, commit, roomId, eventId, [message]);
			console.log(`[Matrix-Media] %c${message.title}`, 'color: #2DA7EF;');
			return;
		}
		console.log(`[Matrix-Text] %c${message}`, 'color: #2DA7EF;');

		const ids = findYouTubeIdsText(message)
			.filter(id => id && !index.has(id)) // filter empty
			.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates

		if (ids.length) {
			// get info for all new unknown ids
			getYouTubeInfo(ids, state.youtubeApiKey).then(results => {
				addMatrixMessage(state, commit, roomId, eventId, results);
			});
		}
	},
};
