import 'olm/olm';
// console.log("Olm", Olm);
import Matrix from 'matrix-js-sdk';
import { throttle } from './debounce';

let eventQueue = [];

export const matrixClient = {
	client: null,
	firstEvent: {},
	syncFailCount: 0,
	paginate(roomId) {
		const room = this.client.getRoom(roomId);
		if (!room) throw { errcode: 'PAGINATE_NO_ROOM' };
		const tls = room.getTimelineSets()[0];
		// this._timelineSet.getLiveTimeline()
		return this.client
			.getEventTimeline(tls, this.firstEvent[roomId])
			.then(et => this.client.paginateEventTimeline(et, { backwards: true }));
	},
	login(credentials, isGuest, dispatch, commit) {
		const throttledDispatchQueue = throttle(() => {
			if (eventQueue.length) {
				dispatch('parseMatrixMessages', eventQueue);
				eventQueue = [];
			}
		}, 250);
		return new Promise(resolve => {
			this.client = Matrix.createClient({
				...credentials,
				baseUrl: 'https://matrix.org',
				// guest: isGuest,
				timelineSupport: true,
			});

			// this.client.on('event', event => {
			// 	console.log('Matix event ', event.getType(), event);
			// });

			this.client.on('Room.localEchoUpdated', event => {
				const { status, _txnId } = event;
				if (status !== 'sent') return;
				const roomId = event.getRoomId();
				const oldEventId = `~${roomId}:${_txnId}`;
				const eventId = event.getId();
				commit('updateMatrixEvent', { eventId: oldEventId, data: { eventId, status } });
			});

			this.client.on('Room.timeline', event => {
				const eventId = event.getId();
				const roomId = event.getRoomId();
				const sender = event.getSender();
				const createdAt = event.getTs();
				const type = event.getType();
				if (!(roomId in this.firstEvent)) this.firstEvent[roomId] = eventId;
				const baseEvent = {
					roomId,
					sender,
					createdAt,
					eventId,
					status: event.status,
				};
				let outEvent;
				if (type === 'm.room.redaction') {
					commit('matrixRedact', { eventId: event.event.redacts, roomId });
				} else if (type === 'audiusMedia') {
					// legacy event, remove 2019
					eventQueue.push(Object.assign(event.event.content, baseEvent));
				} else if (type === 'org.rockdapus.audius') {
					// another legacy event, remove 2019
					if (event.event.content.type === 'media') {
						eventQueue.push(Object.assign(event.event.content.data, baseEvent));
					}
				} else if (type === 'm.room.message') {
					const content = event.getContent();
					const { body, msgtype } = content;
					const isAudiusMessage = 'org.rockdapus.audius.media' in content;

					if (msgtype === 'm.image') {
						const url = this.client.mxcUrlToHttp(
							content.url,
							window.innerWidth,
							window.innerHeight,
							'scale'
						);
						eventQueue.push(Object.assign({ url, type: 'text', parse: false }, baseEvent));
					}

					if (isAudiusMessage) {
						eventQueue.push(Object.assign(content['org.rockdapus.audius.media'], baseEvent));
					}

					if (body) {
						eventQueue.push(
							Object.assign({ body, type: 'text', parse: !isAudiusMessage }, baseEvent)
						);
					}
				}
				if (outEvent) eventQueue.push(outEvent);
				throttledDispatchQueue();
			});

			this.client.on('sync', (syncState, a, event) => {
				if (syncState === 'ERROR') {
					if (event) {
						commit('error', `${event.error.data.error}`);
						if (event.error.data.errcode === 'M_UNKNOWN_TOKEN') {
							commit('toggleMatrixLoginModal', true);
						}
						this.stop();
						return;
					}
					if (this.syncFailCount >= 3) {
						commit('error', 'Could not connect to matrix more than 3 time. Disconnecting.');
						this.stop();
					} else {
						commit(
							'error',
							`Could not connect to matrix server. ${
								this.syncFailCount ? 'Attempt ' + this.syncFailCount : ''
							}`
						);
						this.syncFailCount++;
					}
				} else if (syncState === 'SYNCING') {
					// update UI to remove any "Connection Lost" message
					this.syncFailCount = 0;
				} else if (syncState === 'PREPARED') {
					resolve(this.client.getRooms());
				}
			});
			if (isGuest === undefined || isGuest) this.client.setGuest(true);
			this.client.startClient({ initialSyncLimit: 4 });
		});
	},
	// return promise
	register(options) {
		const { username, password, sessionId, auth, bindThreepids, guestAccessToken } = options;
		return this.client.register(
			username,
			password,
			sessionId,
			auth,
			bindThreepids,
			guestAccessToken
		);
	},
	stop() {
		this.client.stopClient();
	},
	getAvatarUrl(userId) {
		return this.client.getProfileInfo(userId, 'avatar_url').then(result => {
			if (result.avatar_url) return this.client.mxcUrlToHttp(result.avatar_url, undefined, 100);
			return null;
		});
	},
	isGuest() {
		return this.client.isGuest();
	},
	joinRoom(roomIdOrAlias) {
		return this.client.joinRoom(roomIdOrAlias);
	},
	leaveRoom(roomIdOrAlias) {
		return this.client.leave(roomIdOrAlias);
	},
	sendMediaMessage(roomId, media, body) {
		const removeKeys = new Set(['eventId', 'roomId', 'sender']);
		const newMedia = Object.entries(media).reduce((acc, [key, value]) => {
			if (!removeKeys.has(key)) Object.assign(acc, { [key]: value });
			return acc;
		}, {});
		return this.client.sendEvent(roomId, 'm.room.message', {
			body,
			msgtype: 'm.text',
			'org.rockdapus.audius.media': newMedia,
		});
	},
	sendMessage(roomId, media) {
		return this.client.sendTextMessage(roomId, media);
	},
	redactEvent(roomId, eventId) {
		return this.client.redactEvent(roomId, eventId);
	},
	setRoomAllowGuests(roomId, toggleState) {
		return this.client.sendStateEvent(roomId, 'm.room.guest_access', {
			guest_access: toggleState ? 'can_join' : 'forbidden',
		});
	},
	setRoomHistoryVisibility(roomId, state) {
		// m.room.history_visibility
		if (['invited', 'joined', 'shared', 'world_readable'].includes(state)) {
			throw `setRoomHistoryVisibility unknown state ${state}`;
		}
		return this.client.sendStateEvent(roomId, 'm.room.history_visibility', {
			history_visibility: state,
		});
	},
	setRoomName(roomId, name) {
		return this.client.setRoomName(roomId, name);
	},
	setRoomVisibility(roomId, setPrivate = true) {
		return this.client.setRoomDirectoryVisibility(roomId, setPrivate ? 'private' : 'public');
	},
	// setRoomTag(roomId, tagName) {
	// 	return this.client.setRoomTag(roomId, tagName, {});
	// },
	// deleteRoomTag(roomId, tagName) {
	// 	return this.client.deleteRoomTag(roomId, tagName);
	// },
	invite(roomId, userId) {
		return this.client.invite(roomId, userId);
	},
	createDirectMessageRoom(userId) {
		return this.client.createRoom({
			preset: 'trusted_private_chat',
			invite: [userId],
			is_direct: true,
		});
	},
	createRoom(options) {
		return this.client.createRoom(
			Object.assign(options, {
				initial_state: [
					{
						type: 'm.room.guest_access',
						state_key: '',
						content: { guest_access: 'can_join' },
					},
					{
						type: 'm.room.history_visibility',
						state_key: '',
						content: { history_visibility: 'world_readable' },
					},
				],
				// room_alias_name: 'blaa-audius',
				// visibility: 'public', // or 'private'
				// invite: [
				// 	'@bllakd:matrix.org',
				// 	'@user1:matrix.org',
				// ],
				// name: 'Blaaa [Audius]',
				// topic: 'Join this room with https://audius.rockdapus.org',
			})
		);
	},
	searchRoom(query) {
		const blacklist = new Set(['!hUkskxfIMmwAQuZIjz:matrix.org']);
		return this.client
			.publicRooms({
				filter: {
					generic_search_term: query,
				},
			})
			.then(res => res.chunk.filter(({ room_id }) => !blacklist.has(room_id)));
	},
	getCredentialsWithPassword(username, password) {
		return new Promise(resolve => {
			Matrix.createClient('https://matrix.org')
				.loginWithPassword(username, password)
				.then(credentials => {
					resolve({
						accessToken: credentials.access_token,
						userId: credentials.user_id,
						deviceId: credentials.device_id,
					});
				});
		});
	},
	getCredentials() {
		return new Promise(resolve => {
			const client = Matrix.createClient('https://matrix.org');
			client.registerGuest().then(credentials => {
				resolve({
					accessToken: credentials.access_token,
					userId: credentials.user_id,
					deviceId: credentials.device_id,
				});
			});
		});
	},
};

window.matrixClient = matrixClient;
