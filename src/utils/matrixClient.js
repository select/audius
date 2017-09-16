import Matrix from 'matrix-js-sdk';

export const matrixClient = {
	client: null,
	firstEvent: {},
	paginate(roomId) {
		const room = this.client.getRoom(roomId);
		const tls = room.getTimelineSets()[0];
		// this._timelineSet.getLiveTimeline()
		return this.client
			.getEventTimeline(tls, this.firstEvent[roomId])
			.then(et => this.client.paginateEventTimeline(et, { backwards: true }));
	},
	login(credentials, dispatch) {
		return new Promise((resolve, reject) => {
			this.client = Matrix.createClient({
				...credentials,
				baseUrl: 'https://matrix.org',
				// guest: true,
				timelineSupport: true,
			});

			this.client.on('Room.timeline', (event) => {
				const message = event.event.content.body;
				const roomId = event.event.room_id;
				if (!(roomId in this.firstEvent)) this.firstEvent[roomId] = event.event.event_id;
				if (event.event.type === 'audiusMedia') dispatch('parseMatrixMessage', { roomId, eventId: event.event.eventId, message: event.event.content });
				else if (message) dispatch('parseMatrixMessage', { roomId, message });
			});

			this.client.on('sync', (syncState, prevState, data) => {
				if (syncState === 'ERROR') {
					dispatch('error', 'Could not connect to matrix server');
				} else if (syncState === 'SYNCING') {
					// update UI to remove any "Connection Lost" message
				} else if (syncState === 'PREPARED') {
					resolve(this.client.getRooms());
				}
			});

			this.client.setGuest(true);
			this.client.startClient({ initialSyncLimit: 20 });
		});
	},
	logout() {
		this.client.logout();
	},
	joinRoom(roomIdOrAlias) {
		return this.client.joinRoom(roomIdOrAlias);
	},
	leaveRoom(roomIdOrAlias) {
		return this.client.leave(roomIdOrAlias);
	},
	sendEvent(roomId, media) {
		return this.client.sendEvent(roomId, 'audiusMedia', media);
	},
	redactEvent(roomId, eventId) {
		return this.client.redactEvent(roomId, eventId);
	},
	sendMessage(roomId, media) {
		return this.client.sendTextMessage(roomId, JSON.stringify(media));
	},
	setRoomName(roomId, name) {
		return this.client.setRoomName(roomId, name);
	},
	setRoomVisibility(roomId, setPublic = true) {
		return this.client.setRoomDirectoryVisibility(roomId, setPublic ? 'public' : 'private');
	},
	creatRoom(options) {
		const opt = {
			room_alias_name: 'blaa-audius',
			visibility: 'public', // 'private'
			invite: [
				'bllakd:matrix.org',
				'user1:matrix.org',
			],
			name: 'Blaaa [Audius]',
			topic: 'Join this room with https://audius.rockdapus.org',
		};
		return this.client.creatRoom(opt);
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
