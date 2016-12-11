export const initDbSuccess = db => ({
	type: 'DB_INIT_SUCCESS',
	db,
});
export const videoError = (video, message) => ({
	type: 'VIDEO_ERROR',
	video,
	message,
});

export const error = message => ({
	type: 'ERROR',
	message,
});
export const setDbSuccess = data => ({
	type: 'DB_SET_SUCCESS',
	data,
});
export const getDbSuccess = data => ({
	type: 'DB_GET_SUCCESS',
	data,

});
export const getAllDbSuccess = entities => ({
	type: 'DB_GETALL_SUCCESS',
	entities,
});

export const getDbPlayListSuccess = playList => ({
	type: 'DB_GET_PLAYLIST_SUCCESS',
	playList,
});

export const setCurrentTime = time => ({
	type: 'SET_CURRENT_TIME',
	time,
});

export const skipToTime = s => ({
	type: 'SKIP_TO_TIME',
	s,
});

export const addVideos = (videos = []) => ({
	type: 'ADD_VIDEOS',
	videos,
});

export const importPlayList = data => ({
	type: 'IMPORT_PLAYLIST',
	data,
});

export const importURL = url => ({
	type: 'IMPORT_URL',
	url,
});

export const importOtherPlayList = playListName => ({
	type: 'IMPORT_OTHER_PLAYLIST',
	playListName,
	persistState: ['playList', 'tags'],
});

export const upgradePlayList = () => ({
	type: 'UPGRADE_PLAYLIST',
});

export const removeVideo = video => ({
	type: 'REMOVE_VIDEO',
	video,
	persistState: ['playList', 'tags'],
});

export const addSearchResult = (video = {}) => ({
	type: 'ADD_SEARCH_RESULT',
	video,
	persistState: ['playList', 'tags'],
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
	persistState: 'shuffle',
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

export const queueMedia = id => ({
	type: 'QUEUE_MEDIA',
	id,
});

export const queuePlayIndex = idx => ({
	type: 'QUEUE_PLAY_INDEX',
	idx,
});

export const queueRemoveIndex = idx => ({
	type: 'QUEUE_REMOVE_INDEX',
	idx,
});

export const filterPlayList = query => ({
	type: 'FILTER_PLAYLIST',
	query,
});

export const movePlayListMedia = playList => ({
	type: 'MOVE_PLAYLIST_MEDIA',
	playList,
	persistState: ['playList', 'tags'],
});

export const selectPlayList = playListName => ({
	type: 'SELECT_PLAYLIST',
	playListName,
	persistState: 'currentPlayList',
});

export const deletePlayList = playListName => ({
	type: 'DELETE_PALYLIST',
	playListName,
	persistState: 'tags',
});

export const toggleEditPlayList = (playListName, state) => ({
	type: 'TOGGLE_EDIT_PALYLIST',
	state,
	playListName,
	persistState: 'currentPlayList',
});

export const renamePlayList = (oldName, newName) => ({
	type: 'RENAME_PLAYLIST',
	oldName,
	newName,
	persistState: 'tags',
});

export const addTags = (tag, mediaIds) => ({
	type: 'ADD_TAGS',
	tag,
	mediaIds,
	persistState: 'tags',
});

export const removeTags = (tag, mediaIds) => ({
	type: 'REMOVE_TAGS',
	tag,
	mediaIds,
	persistState: 'tags',
});


export const recoverState = state => ({
	type: 'RECOVER_STATE',
	state,
});

export const setYoutubeApiKey = youtubeApiKey => ({
	type: 'SET_YOUTUBE_API_KEY',
	youtubeApiKey,
	persistState: 'youtubeApiKey',
})
