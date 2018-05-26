import { indexDB } from './indexDB2';

/* eslint max-len: 'off' */
export function migrateState(data) {
	const newData = Object.assign({}, data);
	if (data.matrixRooms !== undefined) newData.matrix.sources = data.matrixRooms;
	if (data.matrixRoomsOrdered !== undefined) newData.matrix.sourcesOrdered = data.matrixRoomsOrdered;
	if (data.matrix.matrix !== undefined) newData.matrix = Object.assign(newData.matrix, data.matrix.matrix);
	if (data.tags !== undefined) newData.sources = data.tags;
	if (data.tagsOrdered !== undefined) newData.sourcesOrdered = data.tagsOrdered;
	if (newData.webScraper === undefined) newData.webScraper = {};
	if (data.webScrapers !== undefined) newData.webScraper.sources = data.webScrapers;
	if (data.webScrapersOrdered !== undefined) newData.webScraper.sourcesOrdered = data.webScrapersOrdered;

	delete newData.matrix.matrix;

	[
		'tags',
		'tagsOrdered',
		'currentPlayList',
		'webScrapers',
		'webScrapersOrdered',
		'matrixRooms',
		'matrixRoomsOrdered',
		'tags',
		'tagsOrdered',
	].forEach(key => {
		delete newData[key];
	});
	return Object.assign({}, newData);
}

const oldStatesToDelete = [
	'webScrapers',
	'webScrapersOrderd',
	'webScrapersOrdered',
	'matrixRooms',
	'matrixRoomsOrdered',
	'webScrapersOrdered',
	'matrix',
	'matrix.matrix',
];

export function deleteOldKeys() {
	oldStatesToDelete.forEach(stateName => {
		indexDB
			.writeStore(stateName, {}, { delete: true })
			.then()
			.catch(error => console.warn('error', `IndexDB error deleting ${stateName}. ${error}`));
	});
}

export function migrate2(store) {
	console.log('xxstore.state', store.state);
	return new Promise(resolve => {
		const migrationVersion = 'audius_2.0.12';
		if (true || store.state.migration[migrationVersion]) {
			resolve(migrationVersion);
			const newState = migrateState(store.state);
			console.log('newState', newState);
			deleteOldKeys();
			store.commit('recoverState', newState);
			// store.commit('migrationSuccess', { version, toggleState: true });
		} else {
			resolve();
		}
	});
}
