export const initDbSuccess = (db) => ({
	type: 'DB_INIT_SUCCESS',
	db,
});
export const videoError = (video, message) => ({
	type: 'VIDEO_ERROR',
	video,
	message,
});

export const error = (message) => ({
	type: 'ERROR',
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

export const setCurrentTime = (time) => ({
	type: 'SET_CURRENT_TIME',
	time,
});

export const skipToTime = (s) => ({
	type: 'SKIP_TO_TIME',
	s,
})

export const addVideos = (videos = []) => ({
	type: 'ADD_VIDEOS',
	videos,
});

export const importPlayList = (data) => ({
	type: 'IMPORT_PLAYLIST',
	data,
});

export const importURL = (url) => ({
	type: 'IMPORT_URL',
	url,
})

export const dedupePlayList = () => ({
	type: 'DEDUPE_PLAYLIST',
})

export const removeVideo = (video) => ({
	type: 'REMOVE_VIDEO',
	video,
});

export const addSearchResult = (video = {}) => ({
	type: 'ADD_SEARCH_RESULT',
	video,
});

export const menuVideo = id => ({
	type: 'MENU_VIDEO',
	id,
});

export const play = (mediaId, currentMedia) => ({
	type: 'PLAY',
	mediaId,
	currentMedia,
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

export const toggleMute = () => ({
	type: 'TOGGLE_MUTE',
});

export const queueMedia = (id) => ({
	type: 'QUEUE_MEDIA',
	id,
});

export const queuePlayIndex = (idx) => ({
	type: 'QUEUE_PLAY_INDEX',
	idx,
});

export const queueRemoveIndex = (idx) => ({
	type: 'QUEUE_REMOVE_INDEX',
	idx,
});

export const filterPlayList = (query) => ({
	type: 'FILTER_PLAYLIST',
	query,
})

export const movePlayListMedia = (mediaId, beforeThisMediaId) => ({
	type: 'MOVE_PLAYLIST_MEDIA',
	mediaId,
	beforeThisMediaId,
})
