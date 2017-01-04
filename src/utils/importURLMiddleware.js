import Actions from '../actions';
import injectScript from './injectScript';

const pastebinRegEx = /http:\/\/pastebin.com\/(\w{8})/

// relay messages from store to background script
export const importURLMiddleware = store => next => action => {
	const result = next(action);
	if (action.type === 'IMPORT_URL') {
		if(pastebinRegEx.test(action.url)) {
			const match = pastebinRegEx.exec(action.url);
			action.url = `http://pastebin.com/raw/${match[1]}`;
		}
		injectScript(action.url, () => {
			store.dispatch(Actions.importPlayList(window.getAudiusPlaylist()));
		});
	}
	return result;
};
