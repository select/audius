import Actions from '../actions';
import { time2s } from './timeConverter';

function exists(store, storeName, id, callback) {
	const request = store.getState().mediaPlayer.db
		.transaction(['playLists'], 'readonly')
		.objectStore('playLists')
		.get('default');
	request.onerror = event => store.dispatch(Actions.error(`DB Error ${event.target.error.name}`));
	request.onsuccess = callback;
}

export function setPlayList(store) {
	exists(store, 'playList', 'default', (event) => {
		const dbStore = store.getState().mediaPlayer.db
			.transaction(['playLists'], 'readwrite')
			.objectStore('playLists');
		const action = event.target.result ? 'put' : 'add';
		const request = dbStore[action]({
			id: 'default',
			playList: store.getState().mediaPlayer.playList,
		});
		request.onerror = event2 => store.dispatch(Actions.error(`DB Error ${event2.target.error.name}`));
	});
}

export function setMediaEntity(store, data, actionType) {
	exists(store, 'mediaEntities', 'default', (event) => {
		const dbStore = store.getState().mediaPlayer.db
			.transaction(['mediaEntities'], 'readwrite')
			.objectStore('mediaEntities');
		const action = event.target.result ? 'put' : 'add';
		const request = dbStore[action](data);
		// request.onsuccess = () => store.dispatch({type: `${actionType}_SUCCESS`});
		request.onerror = event2 => store.dispatch(Actions.error(`DB Error ${event2.target.error.name}`));
		setPlayList(store);
	});
}

export const dbMiddleware = store => next => action => {
	const result = next(action);
	if (action.type === 'MOVE_PLAYLIST_MEDIA') {
		setPlayList(store);
	}
	if (['ADD_SEARCH_RESULT', 'REMOVE_VIDEO', 'VIDEO_ERROR'].includes(action.type)) {
		setMediaEntity(store, action.video, action.type);
	}
	return result;
};

export const upgradePlayListMiddleware = store => next => action => {
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
