import Actions from '../actions';
import store from '../store';

function getAllMediaEntities(db, callback) {
	const request = db
		.transaction('mediaEntities', 'readonly')
		.objectStore('mediaEntities')
		.openCursor();
	request.onerror = () => store.dispatch(Actions.error('DB Error can not get entities from DB'));
	const entities = {};
	request.onsuccess = (event) => {
		const cursor = event.target.result;
		if (cursor) {
			entities[cursor.value.id] = cursor.value;
			cursor.continue();
		} else {
			store.dispatch(Actions.getAllDbSuccess(entities));
			callback();
		}
	};
}

function recoverState(db) {
	const request = db
		.transaction(['state'], 'readonly')
		.objectStore('state')
		.openCursor();

	request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));

	const state = {};
	request.onsuccess = (event) => {
		const cursor = event.target.result;
		if (cursor) {
			state[cursor.key] = cursor.value;
			cursor.continue();
		} else {
			store.dispatch(Actions.recoverState(state));
		}
	};
}

// export function getPlayList(db) {
// 	const request = db
// 		.transaction(['playLists'], 'readonly')
// 		.objectStore('playLists')
// 		.get('default');
// 	request.onsuccess = event => store.dispatch(Actions.getDbPlayListSuccess(
// 		event.target.result ? event.target.result.playList : []
// 	));
// 	request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
// }

function migrate(db) {
	// TODO migrate old db
	indexedDB.open('audius_0.02', 1).onsuccess = (event) => {
		event.target.result
			.transaction(['playLists'], 'readonly')
			.objectStore('playLists')
			.get('default')
			.onsuccess = (event2) => {
				db
					.transaction(['state'], 'readwrite')
					.objectStore('state')
					.put(event2.target.result.playList, 'playList');
				event.target.result
					.transaction('mediaEntities', 'readonly')
					.objectStore('mediaEntities')
					.openCursor()
					.onsuccess = (event3) => {
						const cursor = event3.target.result;
						if (cursor) {
							db
								.transaction(['mediaEntities'], 'readwrite')
								.objectStore('mediaEntities')
								.put(cursor.value);
							cursor.continue();
						} else {
							console.log('load upgraded');
							getAllMediaEntities(db, () => {
								recoverState(db);
								indexedDB.deleteDatabase('audius_0.02');
							});
						}
					};
			};
	};
}


if (!('indexedDB' in window)) {
	store.dispatch(Actions.error('Error: indexDB missing.'));
} else {
	const openRequest = indexedDB.open('audius_0.03', 1);
	openRequest.onupgradeneeded = (event) => {
		const thisDB = event.target.result;
		if (!thisDB.objectStoreNames.contains('mediaEntities')) {
			thisDB.createObjectStore('mediaEntities', { keyPath: 'id' });
		}
		// if (!thisDB.objectStoreNames.contains('playLists')) {
		// 	thisDB.createObjectStore('playLists', { keyPath: 'id' });
		// }
		if (!thisDB.objectStoreNames.contains('state')) {
			thisDB.createObjectStore('state');
		}
	};
	openRequest.onsuccess = (event) => {
		indexedDB.webkitGetDatabaseNames().onsuccess = (sender) => {
			const dbs = Object.keys(sender.target.result).map(key => sender.target.result[key]);
			if (dbs.includes('audius_0.02')) {
				console.log('%c Upgrading Audius from 0.02 to 0.03!', 'background: red; color: white');
				migrate(event.target.result);
			}
		};
		getAllMediaEntities(event.target.result, () => {
			recoverState(event.target.result);
			// getPlayList(event.target.result);
		});
		store.dispatch(Actions.initDbSuccess(event.target.result));
	};
	openRequest.onerror = () => store.dispatch(Actions.error('Error: could not connect to indexDB.'));
}

// -----------------
export function getMediaEntity(id) {
	const request = store.getState().mediaPlayer.db
		.transaction(['mediaEntities'], 'readonly')
		.objectStore('mediaEntities')
		.get(id);
	request.onsuccess = event => store.dispatch(Actions.getDbSuccess(event.target.result));
	request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
}


// Request storage usage and capacity left
export function storageStats() {
	navigator.webkitTemporaryStorage.queryUsageAndQuota(
		(used, granted) => {
			console.log('granted: ', granted);
			const percent = 100 * used / granted;
			if (percent === 100) console.warn('IndexDB full!');
			console.log(`## ${percent.toPrecision(2)}% storage used`);
		},
		error => {
			console.log('Error', error);
		}
	);
}
