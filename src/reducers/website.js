const initialState = {
	showSearch: false,
	showJump: false,
	mainRightTab: 'about',
	showChat: false,
};

const website = (state = initialState, action) => {
	switch (action.type) {
	case 'TOGGLE_SEARCH':
		return Object.assign({}, state, {
			showSearch: action.state !== undefined? action.state : !state.showSearch,
		});
	case 'TOGGLE_JUMP':
		return Object.assign({}, state, {
			showJump: action.state !== undefined? action.state : !state.showJump,
		});
	case 'SET_MAINRIGHT_TAB':
		return Object.assign({}, state, {
			mainRightTab: action.id === state.mainRightTab? '' : action.id,
		});
	case 'YOUTUBE_SEARCH_SUCCESS':
		return Object.assign({}, state, {
			mainRightTab: 'search',
		});
	case 'QUEUE_MEDIA':
		return Object.assign({}, state, {
			mainRightTab: 'queue',
		})
	case 'SHOW_CHAT':
		return Object.assign({}, state, {
			showChat: true,
			mainRightTab: 'chat',
		})
	default:
		return state;
	}
};

export default website;
