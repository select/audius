export const initDbSuccess = (db) => ({
	type: 'DB_INIT_SUCCESS',
	db,
});
export const error = (message) => ({
	type: 'DB_ERROR',
	message,
});
export const setDbSuccess = (data) => ({
	type: 'DB_SET_SUCCESS',
	data,
});
export const getDbSuccess = (data) => ({
	type: 'DB_GET_SUCCESS',
	data,

});
export const getAllDbSuccess = (entities) => ({
	type: 'DB_GETALL_SUCCESS',
	entities,
});

export const getDbPlayListSuccess = (playList) => ({
	type: 'DB_GET_PLAYLIST_SUCCESS',
	playList,
});

export const addVideos = (videos = []) => ({
	type: 'ADD_VIDEOS',
	videos,
});

export const importPlayList = (data) => ({
	type: 'IMPORT_PLAYLIST',
	data,
});

export const removeVideo = (id) => ({
	type: 'REMOVE_VIDEO',
	id,
});

export const addSearchResult = (video = {}) => ({
	type: 'ADD_SEARCH_RESULT',
	video,
});

export const menuVideo = id => ({
	type: 'MENU_VIDEO',
	id,
});

export const playVideo = id => ({
	type: 'PLAY_VIDEO',
	id,
});

export const play = () => ({
	type: 'PLAY',
});

export const pause = () => ({
	type: 'PAUSE',
});

export const nextVideo = () => ({
	type: 'NEXT_VIDEO',
});

export const previousVideo = () => ({
	type: 'PREV_VIDEO',
});

export const togglePlayList = () => ({
	type: 'TOGGLE_PLAYLIST',
});

export const toggleShuffle = () => ({
	type: 'TOGGLE_SHUFFLE',
});

export const toggleRepeat = () => ({
	type: 'TOGGLE_REPEAT',
});

export const changeVolume = volume => ({
	type: 'CHANGE_VOLUME',
	volume,
});

export const mute = () => ({
	type: 'MUTE',
});
