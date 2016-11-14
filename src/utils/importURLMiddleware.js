import Actions from '../actions';
import injectScript from './injectScript';

// relay messages from store to background script
export const importURLMiddleware = store => next => action => {
	const result = next(action);
	if (action.type === 'IMPORT_URL') {
		injectScript(action.url, () => {
			store.dispatch(Actions.importPlayList(window.getAudiusPlaylist()));
		});
	}
	return result;
};
