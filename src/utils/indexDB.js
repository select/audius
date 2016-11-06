import Actions from '../actions';
import store from '../store';

function getAll(db) {
	const request = db
		.transaction('mediaEntities', 'readonly')
		.objectStore('mediaEntities')
		.openCursor();
	request.onerror = event => store.dispatch(Actions.error('DB Error can not get entities from DB'));
	const entities = {};
	request.onsuccess = event => {
		const cursor = event.target.result;
		if (cursor) {
			entities[cursor.value.id] = cursor.value
			cursor.continue();
		}else {
			store.dispatch(Actions.getAllDbSuccess(entities));
		}
	};
}

if (!('indexedDB' in window)) {
	store.dispatch(Actions.error('Error: indexDB missing.'));
} else {
	const openRequest = indexedDB.open('audius_0.01', 1);
	openRequest.onupgradeneeded = event => {
		const thisDB = event.target.result;
		if (!thisDB.objectStoreNames.contains('mediaEntities')) {
			thisDB.createObjectStore('mediaEntities', {
				keyPath: 'id',
			});
		}
	};
	openRequest.onsuccess = event => {
		getAll(event.target.result);
		store.dispatch(Actions.initDbSuccess(event.target.result));
	};
	openRequest.onerror = event => store.dispatch(Actions.error('Error: could not connect to indexDB.'));
}


export function set(data) {
	const request = store.getState().mediaPlayer.db
		.transaction(['mediaEntities'], 'readwrite')
		.objectStore('mediaEntities')
		.add(data);
	request.onsuccess = () => store.dispatch(Actions.setDbSuccess(data));
	request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
}

export function get(id) {
	const promise = new Promise((resolve, reject) => {
		const request = store.getState().mediaPlayer.db
			.transaction(['mediaEntities'], 'readonly')
			.objectStore('mediaEntities')
			.get(id);
		request.onsuccess = event => store.dispatch(Actions.getDbSuccess(event.target.result));
		request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
	});
	return promise;
}


// Request storage usage and capacity left
export function storageStats() {
	navigator.webkitTemporaryStorage.queryUsageAndQuota(
		(used, granted) => {
			console.log('granted: ',granted);
			const percent = 100 * used / granted;
			if (percent === 100) gui.warn('IndexDB full!');
			console.log(`## ${percent.toPrecision(2)}% storage used`);
		},
		error => {
			console.log('Error', error);
		}
	);
}
