export const toggleSearch = () => ({
	type: 'TOGGLE_SEARCH',
});

export const setMainRightTab = (id = 'about') => ({
	type: 'SET_MAINRIGHT_TAB',
	id,
});
