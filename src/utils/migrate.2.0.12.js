import { indexDB } from './indexDB2';
import { presistMutation as presistA } from '../vuex/audius/presistMutation';
import { presistMutation as presistM } from '../vuex/matrix/presistMutation';
import { presistMutation as presistW } from '../vuex/webScraper/presistMutation';
import { getDotPath } from './dotPath';

const migrationVersion = 'audius_2.0.12';

/* eslint max-len: 'off' */
export function migrateState(data) {
	const newData = Object.assign({}, data, { webScraper: {} });
	if (data.matrixRooms !== undefined) newData.matrix.sources = data.matrixRooms;
	if (data.matrixRoomsOrdered !== undefined) {
		newData.matrix.sourcesOrdered = data.matrixRoomsOrdered;
	}
	if (data.matrix.matrix !== undefined) {
		newData.matrix = Object.assign(newData.matrix, data.matrix.matrix);
	}
	if (data.tags !== undefined) newData.sources = data.tags;
	if (data.tagsOrdered !== undefined) newData.sourcesOrdered = data.tagsOrdered;

	if (data.webScrapers !== undefined) newData.webScraper.sources = data.webScrapers;
	if (data.webScrapersOrdered !== undefined) {
		newData.webScraper.sourcesOrdered = data.webScrapersOrdered;
	}
	newData.migration[migrationVersion] = true;

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

const storeKeys = [['', presistA], ['webScraper.', presistW], ['matrix.', presistM]].reduce(
	(acc, pm) => {
		return acc.concat(
			Object.values(pm[1]).forEach(paths => {
				paths.forEach(path => {
					const p = `${pm[0]}${path}`;
					if (!acc.includes(p)) acc.push(p);
				});
			})
		);
	},
	[]
);

export function migrateIndexDb2012(oldState) {
	const newState = migrateState(oldState);
	oldStatesToDelete.forEach(stateName => {
		indexDB
			.writeStore(stateName, {}, { delete: true })
			.then()
			.catch(error => console.warn('error', `IndexDB error deleting ${stateName}. ${error}`));
	});
	storeKeys.filter(k => !!k).forEach(path => {
		indexDB
			.writeStore(path, getDotPath(newState, path))
			.then()
			.catch(error => console.warn('error', `IndexDB error writing ${path} migration. ${error}`));
	});
	return newState;
}

export function migrate2012(store, oldState) {
	if (oldState.migration && !oldState.migration[migrationVersion]) {
		const newState = migrateIndexDb2012(store.state);
		store.commit('recoverState', newState);
		store.commit('migrationSuccess', { version: migrationVersion, toggleState: true });
	}
}
