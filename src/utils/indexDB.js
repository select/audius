import Actions from '../actions';
import store from '../store';

function getAllMediaEntities(db) {
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
		}
	};
}
export function getPlayList(db) {
	const request = db
		.transaction(['playLists'], 'readonly')
		.objectStore('playLists')
		.get('default');
	request.onsuccess = event => store.dispatch(Actions.getDbPlayListSuccess(event.target.result.playList));
	request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
}

if (!('indexedDB' in window)) {
	store.dispatch(Actions.error('Error: indexDB missing.'));
} else {
	const openRequest = indexedDB.open('audius_0.02', 1);
	openRequest.onupgradeneeded = (event) => {
		const thisDB = event.target.result;
		if (!thisDB.objectStoreNames.contains('mediaEntities')) {
			thisDB.createObjectStore('mediaEntities', { keyPath: 'id' });
		}
		if (!thisDB.objectStoreNames.contains('playLists')) {
			thisDB.createObjectStore('playLists', { keyPath: 'id' });
		}
	};
	openRequest.onsuccess = (event) => {
		getAllMediaEntities(event.target.result);
		getPlayList(event.target.result);
		store.dispatch(Actions.initDbSuccess(event.target.result));
	};
	openRequest.onerror = () => store.dispatch(Actions.error('Error: could not connect to indexDB.'));
}


function setPlayList() {
	const requestExists = store.getState().mediaPlayer.db
		.transaction(['playLists'], 'readonly')
		.objectStore('playLists')
		.get('default');
	requestExists.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
	requestExists.onsuccess = (event) => {
		const dbStore = store.getState().mediaPlayer.db
			.transaction(['playLists'], 'readwrite')
			.objectStore('playLists');
		const action = event.target.result ? 'put' : 'add';
		const request = dbStore[action]({ id: 'default', playList: store.getState().mediaPlayer.playList });
		request.onerror = event2 => store.dispatch(Actions.error(`DB Error ${event2.target.error.name}`));
	};
}

export function setMediaEntity(data) {
	const request = store.getState().mediaPlayer.db
		.transaction(['mediaEntities'], 'readwrite')
		.objectStore('mediaEntities')
		.add(data);
	request.onsuccess = () => store.dispatch(Actions.setDbSuccess(data));
	request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
	setPlayList();
}

export function getMediaEntity(id) {
	const request = store.getState().mediaPlayer.db
		.transaction(['mediaEntities'], 'readonly')
		.objectStore('mediaEntities')
		.get(id);
	request.onsuccess = event => store.dispatch(Actions.getDbSuccess(event.target.result));
	request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
	setPlayList();
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
