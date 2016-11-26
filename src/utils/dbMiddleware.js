import Actions from '../actions';
import { time2s } from './timeConverter';

function dbFromStore(store) {
	return store.getState().mediaPlayer.db;
}

function saveState(store, action) {
	const dbStore = dbFromStore(store)
		.transaction(['state'], 'readwrite')
		.objectStore('state');
	const request = dbStore.put(store.getState().mediaPlayer[action.persistState], action.persistState);
	request.onerror = event2 => store.dispatch(Actions.error(`DB Error ${event2.target.error.name}`));
}

// function savePlayList(store) {
// 	const dbStore = dbFromStore(store)
// 		.transaction(['playLists'], 'readwrite')
// 		.objectStore('playLists');
// 	const request = dbStore.put({ id: 'default', playList: store.getState().mediaPlayer.playList });
// 	request.onerror = event2 => store.dispatch(Actions.error(`DB Error ${event2.target.error.name}`));
// }

function setMediaEntity(store, data) {
	const dbStore = dbFromStore(store)
		.transaction(['mediaEntities'], 'readwrite')
		.objectStore('mediaEntities');
	const request = dbStore.put(data);
	request.onerror = event2 => store.dispatch(Actions.error(`DB Error ${event2.target.error.name}`));
	// savePlayList(store);
}

export const dbMiddleware = store => next => (action) => {
	const result = next(action);
	if (['ADD_SEARCH_RESULT', 'REMOVE_VIDEO', 'VIDEO_ERROR'].includes(action.type)) {
		setMediaEntity(store, action.video, action.type);
	}
	if (action.persistState) {
		saveState(store, action);
	}
	return result;
};

export const upgradePlayListMiddleware = store => next => (action) => {
	const result = next(action);
	if (action.type === 'UPGRADE_PLAYLIST') {
		const entities = store.getState().mediaPlayer.entities;
		Object.keys(entities).forEach((key) => {
			if (entities[key].durationS === 0) entities[key].durationS = time2s(entities[key].duration);
			setMediaEntity(store, entities[key], action.type);
		});
	}
	return result;
};
