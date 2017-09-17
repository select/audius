import {
	findYouTubeIdsText,
	getYouTubeInfo,
} from '../utils';
import { getMediaEntity } from './getCurrentPlayList';
// This must be avialable in the whole module since it's lazy loaded.
// Do not delete;
let matrixClient;

function addMatrixMessage(state, commit, roomId, results) {
	const room = state.matrixRooms[roomId];
	if (!results.length) return;
	const playList = [...room.playList, ...results];
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

export const actionsMatrix = {
	initMatrix({ commit, state, dispatch }) {
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(mc => {
			matrixClient = mc.matrixClient;
			if (!state.matrix.hasCredentials) {
				matrixClient
					.getCredentials()
					.then(credentials => commit('setMatrixCredentials', credentials))
					.then(() => matrixClient.login(state.matrix.credentials, dispatch))
					.then(rooms => commit('setMatrixLoggedIn', rooms))
					.catch(error => commit('error', `Login failed. ${error}`));
			} else if (!state.matrixLoggedIn) {
				matrixClient
					.login(state.matrix.credentials, dispatch)
					.then(rooms => commit('setMatrixLoggedIn', rooms))
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
		import(/* webpackChunkName: "matrix-client" */ '../utils/matrixClient').then(mc => {
			matrixClient = mc.matrixClient;
			matrixClient
				.sendEvent(roomId, media || getMediaEntity(state, itemId))
				.catch(() => commit('error', 'Posting media to matrix room failed'));
		});
	},
	matrixPaginate({ state, commit }, id) {
		// const id = state.currentMatrixRoom;
		matrixClient.paginate(state.currentMatrixRoom).then(res => {
			if (res) {
				commit('setPaginationIndex', {
					id,
					index: (state.paginationIndex[id] || 0) + 1,
				});
			} else {
				commit('error', 'You reached the last page of this room.');
			}
		}).catch(() => commit('error', 'Paginating matrix room failed'));
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
	leaveMatrixRoom({ commit }, roomIdOrAlias) {
		matrixClient.leaveRoom(roomIdOrAlias)
			.then(() => commit('deleteMatrixRoom', roomIdOrAlias))
			.catch(() => commit('error', 'Leaving matrix room failed'));
	},
	matrixLogout({ commit }) {
		// FIXIME this is async and could return a promis
		// after witch the state should be saved
		matrixClient.logout();
		commit('matrixLogout');
	},
	parseMatrixMessage({ state, commit }, { roomId, message }) {
		const room = state.matrixRooms[roomId];
		if (!(roomId in state.matrixRooms)) {
			commit('error', `Could not find matrix room ${roomId}`);
			commit('updateMatrixRoom', { roomId });
			return;
		}

		const index = new Set([...room.playList.map(v => v.id), ...room.archive]);
		if (typeof message === 'object') {
			if (!index.has(message.id)) addMatrixMessage(state, commit, roomId, [message]);
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
				addMatrixMessage(state, commit, roomId, results);
			});
		}
	},

};
