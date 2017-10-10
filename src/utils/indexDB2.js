export const indexDB = {
	db: {},
	writeStore(stateName, data) {
		return new Promise((resolve, reject) => {
			const transaction = indexDB.db.transaction(['state'], 'readwrite');
			transaction.onerror = error => {
				reject(error);
			};
			const objectStore = transaction.objectStore('state');
			transaction.onerror = error => {
				reject(error);
			};
			const putRequest = objectStore.put(data, stateName);
			putRequest.onerror = event => {
				reject(event.target.error.name);
			};
			putRequest.onsuccess = event => {
				resolve();
			};
			// FIXME add a get here to to check if the value changed, if not raise "disk full" exception
		});
	},
	init() {
		return new Promise((resolve, reject) => {
			if (!('indexedDB' in window)) {
				reject('Error: indexDB missing.');
			} else {
				const openRequest = indexedDB.open('audius_0.04', 1);

				openRequest.onupgradeneeded = event => {
					const thisDB = event.target.result;
					if (!thisDB.objectStoreNames.contains('state')) {
						thisDB.createObjectStore('state');
					}
				};

				openRequest.onsuccess = event => {
					indexDB.db = event.target.result;
					resolve();
				};

				openRequest.onerror = event =>
					reject(`Could not connect to indexDB. ${event.target.error}`);
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
			request.onsuccess = event => {
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
	// getQuota() {
	// 	return new Promise((resolve, reject) => {
	// 		navigator.webkitPersistentStorage.queryUsageAndQuota(
	// 			(usedBytes, grantedBytes) => {
	// 				console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes');
	// 				if (!grantedBytes) reject('Local storage quota exeeded. Please free up disk space.');
	// 				if (!usedBytes) resolve(100);
	// 				const quota = grantedBytes / usedBytes * 100;
	// 				if (quota <= 0) reject('Local storage quota exeeded. Please free up disk space.');
	// 				else resolve(grantedBytes / usedBytes * 100);
	// 			},
	// 			error => {
	// 				reject(error);
	// 			}
	// 		);
	// 	});
	// },
};
window.indexDB = indexDB;
