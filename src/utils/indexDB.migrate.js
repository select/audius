/* eslint no-param-reassign: 'off' */

import { store } from '../vuex/store';

const DB_VERSION = 'audius_0.03';

function getDb() {
	return new Promise((resolve, reject) => {
		indexedDB.open(DB_VERSION, 1).onsuccess = event => {
			resolve(event.target.result);
		};
	});
}

function getObjectStore(db, name) {
	return new Promise((resolve, reject) => {
		const state = {};
		db.transaction(name, 'readonly').objectStore(name).openCursor().onsuccess = event => {
			const cursor = event.target.result;
			if (cursor) {
				state[cursor.key] = cursor.value;
				cursor.continue();
			} else {
				resolve(state);
			}
		};
	});
}

export function migrate() {
	if (!store.state.migration[DB_VERSION]) {
		console.log('migrate! ');
		const stores = ['mediaEntities', 'state'];
		indexedDB.webkitGetDatabaseNames().onsuccess = event => {
			if (!Array.from(event.target.result).includes(DB_VERSION)) {
				store.commit('migrationSuccess', { version: DB_VERSION, toggleState: true });
			} else {
				getDb()
					.then(db => Promise.all(stores.map(name => getObjectStore(db, name))))
					.then(([entities, state]) => Object.assign(state, { entities }))
					.then(data => {
						store.commit('selectPlayList', undefined);
						if (data.playList && data.entities) {
							data.playList.reverse();
							store.commit('importPlayList', { playList: data.playList, entities: data.entities });
						}
						if (data.tags) {
							Object.keys(data.tags).forEach(tagName => {
								const playList = data.tags[tagName];
								playList.reverse();
								store.commit('addTags', { tag: tagName, mediaIds: playList });
							});
						}
						store.commit('migrationSuccess', { version: DB_VERSION, toggleState: true });
					});
			}
		};
	}
}
