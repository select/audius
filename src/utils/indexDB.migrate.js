/* eslint no-param-reassign: 'off' */

import { store } from '../vuex/store';

function getDb(version) {
	return new Promise((resolve, reject) => {
		indexedDB.open(version, 1).onsuccess = event => {
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

function migrate0() {
	return new Promise((resolve, reject) => {
		const migrationVersion = 'audius_0.03';
		if (!store.state.migration[migrationVersion]) {
			const stores = ['mediaEntities', 'state'];
			try {
				indexedDB.webkitGetDatabaseNames().onsuccess = event => {
					if (!Array.from(event.target.result).includes(migrationVersion)) {
						store.commit('migrationSuccess', { version: migrationVersion, toggleState: true });
					} else {
						getDb(migrationVersion)
							.then(db => Promise.all(stores.map(name => getObjectStore(db, name))))
							.then(([entities, state]) => Object.assign(state, { entities }))
							.then(data => {
								store.commit('selectPlayList', undefined);
								if (data.playList && data.entities) {
									data.playList.reverse();
									store.commit('importPlayList', {data: { playList: data.playList, entities: data.entities }});
								}
								if (data.tags) {
									Object.keys(data.tags).forEach(tagName => {
										const playList = data.tags[tagName];
										playList.reverse();
										store.commit('addTags', { tag: tagName, mediaIds: playList });
									});
								}
								resolve(migrationVersion);
							});
					}
				};
			} catch (e) {
				console.warn('error migrating ', e);
				resolve(migrationVersion);
			}
		} else {
			resolve();
		}
	});
}

function migrate1() {
	return new Promise((resolve, reject) => {
		const migrationVersion = 'audius_0.03.2';
		if (!store.state.migration[migrationVersion]) {
			const newEtities = Object.entries(store.state.entities).reduce((acc, [key, video])=> {
				if (!video.type) video.type = 'youtube';
				return { ...acc, [key]: video };
			}, {});
			store.commit('upgradeEntities', newEtities);
			resolve(migrationVersion);
		} else {
			resolve();
		}
	});
}

export function migrate() {
	migrate0()
		.then((migrationVersion) => {
			if (migrationVersion) store.commit('migrationSuccess', { version: migrationVersion, toggleState: true });
			return migrate1();
		}).then((migrationVersion) => {
			if (migrationVersion) store.commit('migrationSuccess', { version: migrationVersion, toggleState: true });
		});
}

