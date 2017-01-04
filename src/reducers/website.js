const initialState = {
	showSearch: false,
	showJump: false,
	mainRightTab: 'about',
	showChat: false,
	showImport: false,
	showPlayLists: false,
};

const website = (state = initialState, action) => {
	switch (action.type) {
	case 'TOGGLE_SEARCH':
		return Object.assign({}, state, {
			showSearch: action.state !== undefined ? action.state : !state.showSearch,
		});
	case 'TOGGLE_JUMP':
		return Object.assign({}, state, {
			showJump: action.state !== undefined ? action.state : !state.showJump,
		});
	case 'SET_MAINRIGHT_TAB':
		return Object.assign({}, state, {
			mainRightTab: action.id === state.mainRightTab ? '' : action.id,
		});
	case 'YOUTUBE_SEARCH_SUCCESS':
		return Object.assign({}, state, {
			mainRightTab: 'search',
		});
	case 'QUEUE_MEDIA':
		return Object.assign({}, state, {
			mainRightTab: 'queue',
		});
	case 'SHOW_CHAT':
		return Object.assign({}, state, {
			showChat: true,
			mainRightTab: 'chat',
		});
	case 'SHOW_SETTINGS':
		return Object.assign({}, state, {
			showSettings: true,
			mainRightTab: 'settings',
		});
	case 'TOGGLE_IMPORT':
		return Object.assign({}, state, {
			showImport: action.state !== undefined ? action.state : !state.showImport,
		});
	case 'TOGGLE_EXPORT':
		return Object.assign({}, state, {
			showExport: action.state !== undefined ? action.state : !state.showExport,
		});
	case 'TOGGLE_PLAYLISTS':
		return Object.assign({}, state, {
			showPlayLists: action.state !== undefined ? action.state : !state.showPlayLists,
		});
	default:
		return state;
	}
};

export default website;
