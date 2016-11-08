export const toggleSearch = (state) => ({
	type: 'TOGGLE_SEARCH',
	state,
});

export const setMainRightTab = (id = 'about') => ({
	type: 'SET_MAINRIGHT_TAB',
	id,
});
