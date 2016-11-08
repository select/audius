const initialState = {
	showSearch: false,
	mainRightTab: 'about',
};

const website = (state = initialState, action) => {
	switch (action.type) {
	case 'TOGGLE_SEARCH':
		return Object.assign({}, state, {
			showSearch: !state.showSearch,
		});
	case 'SET_MAINRIGHT_TAB':
		return Object.assign({}, state, {
			mainRightTab: action.id === state.mainRightTab? '' : action.id,
		});
	case 'YOUTUBE_SEARCH_SUCCESS':
		return Object.assign({}, state, {
			mainRightTab: 'search',
		});
	default:
		return state;
	}
};

export default website;
