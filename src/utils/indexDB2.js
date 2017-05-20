export const indexDB = {
	db: {},
	writeStore() {
		return indexDB.db
			.transaction(['state'], 'readwrite')
			.objectStore('state');
	},
	init() {
		return new Promise((resolve, reject) => {
			if (!('indexedDB' in window)) {
				reject('Error: indexDB missing.');
			} else {
				const openRequest = indexedDB.open('audius_0.04', 1);

				openRequest.onupgradeneeded = (event) => {
					const thisDB = event.target.result;
					if (!thisDB.objectStoreNames.contains('state')) {
						thisDB.createObjectStore('state');
					}
				};

				openRequest.onsuccess = (event) => {
					indexDB.db = event.target.result;
					resolve();
				};

				openRequest.onerror = () => reject('Error: could not connect to indexDB.');
			}
		});
	},

	recoverState() {
		return new Promise((resolve, reject) => {
			const request = indexDB.db
				.transaction(['state'], 'readonly')
				.objectStore('state')
				.openCursor();

			request.onerror = event => reject(`DB Error ${event.target.error.name}`);

			const state = {};
			request.onsuccess = (event) => {
				const cursor = event.target.result;
				if (cursor) {
					state[cursor.key] = cursor.value;
					cursor.continue();
				} else {
					resolve(state);
				}
			};
		});
	},
};
