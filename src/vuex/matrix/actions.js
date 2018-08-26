import { findMediaText, getMediaLink } from '../../utils';
import { getMediaEntity } from '../audius/getCurrentPlayList';
// This must be avialable in the whole module since it's lazy loaded.
// Do not delete;
let matrixClient;

const urlRegex = /(https?:\/\/[^\s]+)/g;
function urlify(text) {
	return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}


// function getRoomMembers(commit, state, rooms) {
	// Get member avatar with async request to matrix.
	// Object.values(members).forEach(member => {
	// 	const { userId } = member;
	// 	if (state.membersIndex[userId].avatarUrl === undefined) {
	// 		matrixClient.getAvatarUrl(member.userId).then((avatarUrl) => {
	// 			commit('setMemberInfo', { userId, avatarUrl: avatarUrl });
	// 		}).catch(error => {
	// 			commit('setMemberInfo', { userId, avatarUrl: null });
	// 		});
	// 	}
	// });
// }

/* eslint-disable no-param-reassign */
export const actions = {
	initMatrix({ commit, state, dispatch }) {
		import(/* webpackChunkName: "utils/matrixClient" */ '../../utils/matrixClient').then(mc => {
			({ matrixClient } = mc);
			if (!state.hasCredentials) {
				matrixClient
					.getCredentials()
					.then(credentials => commit('setMatrixCredentials', { credentials, isGuest: true }))
					.then(() => matrixClient.login(state.credentials, state.isGuest, dispatch, commit))
					.then(rooms => {
						commit('setMatrixLoggedIn', rooms);
						dispatch('updatePublicRooms');
					})
					.catch(error => commit('error', `${error}1`));
			} else if (!state.matrixLoggedIn) {
				matrixClient
					.login(state.credentials, state.isGuest, dispatch, commit)
					.then(rooms => {
						commit('setMatrixLoggedIn', rooms);
					})
					.catch(error => commit('error', `${error} initMatrix with credentials`));
			}
		});
	},
	loginMatrixWithPassword({ commit, state, dispatch }, { username, password }) {
		import(/* webpackChunkName: "matrix-client" */ '../../utils/matrixClient').then(mc => {
			({ matrixClient } = mc);
			matrixClient
				.getCredentialsWithPassword(username, password)
				.then(credentials => commit('setMatrixCredentials', { credentials, isGuest: false }))
				.then(() => matrixClient.login(state.credentials, state.isGuest, dispatch, commit))
				.then(rooms => {
					commit('setMatrixLoggedIn', rooms);
				})
				.catch(error => commit('error', `${error}3`));
		});
	},
	registerMatrixUser({ state, commit, dispatch }, options) {
		Object.assign(
			{
				sessionId: '',
				auth: undefined,
				bindThreepids: { email: true },
				guestAccessToken: undefined,
			},
			options
		);
		import(/* webpackChunkName: "matrix-client" */ '../../utils/matrixClient').then(mc => {
			({ matrixClient } = mc);
			matrixClient
				.register(options)
				.then(credentials => commit('setMatrixCredentials', { credentials, isGuest: false }))
				.then(() => matrixClient.login(state.credentials, state.isGuest, dispatch, commit))
				.catch(error => commit('error', `Register: ${error}`));
		});
	},
	matrixSendText({ state, rootState, commit }, { roomId, message }) {
		matrixClient
			.sendMessage(roomId, message)
			.catch(error => commit('error', `Posting message to matrix room failed. ${error}`));
	},
	matrixSend({ state, rootState, commit }, { itemId, roomId, media }) {
		const curMedia = media || getMediaEntity(rootState, itemId);
		if (state.sources[roomId].playList.some(({ id }) => id === curMedia.id)) {
			commit('error', 'The media item was already posted.');
			return;
		}
		matrixClient
			.sendMediaMessage(roomId, curMedia, getMediaLink(curMedia))
			.catch(error => commit('error', `Posting media to matrix room failed. ${error}`));
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
	matrixLoadMore({ state, commit, rootState }, roomId) {
		if (rootState.isLoading[roomId] || state.lastPageReached[roomId]) return;
		commit('toggleIsLoading', { id: roomId, loading: true });
		setTimeout(() => {
			commit('toggleIsLoading', { id: roomId, loading: false });
		}, 40000);
		matrixClient
			.paginate(roomId)
			.then(res => {
				if (res) {
					commit('increasePaginationIndex', roomId);
				} else {
					commit('error', 'You reached the last page of this room.');
					commit('setLastPageReached', roomId);
				}
			})
			.catch(() => {
				commit('error', 'Paginating matrix room failed');
			})
			.finally(() => {
				commit('toggleIsLoading', { id: roomId, loading: false });
			});
	},
	joinMatrixRoom({ commit, dispatch }, { id, name }) {
		commit('toggleMatrixRoomDirectory', false);
		matrixClient
			.joinRoom(id)
			.then(room => {
				room.name = name || id;
				commit('joinRoom', room);
				commit('selectMediaSource', { type: 'matrix', id: room.roomId });
				commit('setLeftMenuTab', 'matrix');
				setTimeout(() => {
					dispatch('matrixLoadMore', room.roomId);
				}, 2000);
			})
			.catch(error => {
				if (error.errcode === 'PAGINATE_NO_ROOM') {
					return;
				}
				// {"errcode":"M_FORBIDDEN","error":"Guest access not allowed"}
				if (error.message === 'Guest access not allowed') commit('toggleMatrixLoginModal', true);
				if (error.errcode === 'M_CONSENT_NOT_GIVEN') {
					commit('setLeftMenuTab', 'matrix');
					commit('toggleMatrixConsentModal', {
						toggleState: true,
						message: urlify(error.message.replace(/\.$/, '')),
					});
				} else {
					commit('error', `Could not join room: ${error.message}`);
				}
			});
	},
	createMatrixRoom({ commit }, options) {
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
				commit('selectMediaSource', { type: 'matrix', id: room.room_id });
				commit('setLeftMenuTab', 'radio');
			})
			.catch(error => {
				commit('error', `Could not create room. ${error}`);
			});
	},
	setRoomName({ commit }, { id, name }) {
		matrixClient
			.setRoomName(id, name)
			.then(() => commit('updateMatrixRoom', { roomId: id, values: { name } }))
			.catch(error => commit('error', `Could not rename matrix room: ${error}`));
	},
	setRoomTag({ commit }, { roomId, tagName }) {
		matrixClient
			.setRoomTag(roomId, tagName)
			.then(() => commit('error', { error: 'room tag is set', type: 'success' }))
			.catch(error => commit('error', `Could not set tagName. ${error}`));
	},
	updateRoomOptions({ commit }, options) {
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
		commit('deleteMatrixRoom', roomIdOrAlias);
		matrixClient
			.leaveRoom(roomIdOrAlias)
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
			.catch(error => commit('error', `Getting public matrix Rooms failed. ${error}`));
	},
	matrixLogout({ commit }) {
		// FIXIME this is async and could return a promis
		// after witch the state should be saved
		matrixClient.logout();
		commit('matrixLogout');
	},
	parseMatrixMessages({ state, commit, rootState }, matrixEvents) {
		matrixEvents.forEach(matrixEvent => {
			const { type, body, msgtype } = matrixEvent;
			if (body) matrixEvent.body = urlify(body);
			if (type === 'text' && msgtype !== 'm.audius.media') {
				// window.console.log(`[Matrix-Text] %c${body}`, 'color: #2DA7EF;');
				findMediaText(body, rootState.youtubeApiKey, rootState.mediaIndex).then(
					({ mediaList, newMedia }) => {
						if (newMedia.length) commit('updateMediaIndex', newMedia);
						mediaList.forEach(media => {
							const newEvent = Object.assign({}, matrixEvent, media);
							delete newEvent.body;
							commit('addChatlog', [newEvent]);
						});
					}
				);
			} else if (type !== 'text') {
				// window.console.log(`[Matrix-Media] %c${matrixEvent.title}`, 'color: #2DA7EF;');
				if (!(matrixEvent.id in rootState.mediaIndex)) commit('updateMediaIndex', matrixEvent);
			}
		});
		commit('addChatlog', matrixEvents);
	},
};
