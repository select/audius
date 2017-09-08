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

			this.client.on('Room.timeline', (event, room, toStartOfTimeline) => {
				const message = event.event.content.body;
				const roomId = event.event.room_id;
				if (!(roomId in this.firstEvent)) this.firstEvent[roomId] = event.event.event_id;
				if (event.event.type === 'audiusMedia') dispatch('parseMatrixMessage', { roomId, message: event.event.content });
				else if (message) dispatch('parseMatrixMessage', { roomId, message });
			});

			this.client.on('sync', (syncState, prevState, data) => {
				if (syncState === 'ERROR') {
					reject();
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
		return new Promise(resolve => {
			this.client.joinRoom(roomIdOrAlias).then((room) => {
				resolve(room);
			});
		});
	},
	leaveRoom(roomIdOrAlias) {
		return new Promise(resolve => {
			this.client.leave(roomIdOrAlias).done(() => {
				resolve(this.client.getRooms());
			});
		});
	},
	sendEvent(roomId, media) {
		this.client.sendEvent(roomId, 'audiusMedia', media);
	},
	sendMessage(roomId, media) {
		this.client.sendTextMessage(roomId, JSON.stringify(media));
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
