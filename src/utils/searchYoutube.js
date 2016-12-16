import Actions from '../actions';
import store from '../store';
import ajax from './ajax';

const isYouTubeVideoRegEx = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?/;

function getYtContentDetailURL(ids, YOUTUBE_API_KEY, withSnippet) {
	return `https://www.googleapis.com/youtube/v3/videos?part=contentDetails${withSnippet ? ',snippet' : ''}&id=${ids}&key=${YOUTUBE_API_KEY}`;
}

export default function (query) {
	const YOUTUBE_API_KEY = store.getState().mediaPlayer.youtubeApiKey;
	if (!query || (store.getState().youtube.query === query)) return;

	if (isYouTubeVideoRegEx.test(query)) {
		ajax(getYtContentDetailURL(isYouTubeVideoRegEx.exec(query)[1], YOUTUBE_API_KEY, true), (data) => {
			store.dispatch(Actions.searchYoutubeSuccess(data.items));
		});
	} else {
		store.dispatch(Actions.searchYoutube(query));
		// &videoCategoryId=10 // for music only
		const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${query}&key=${YOUTUBE_API_KEY}`;

		ajax(url, (searchData) => {
			ajax(
				getYtContentDetailURL(searchData.items.map(item => item.id.videoId).join(','), YOUTUBE_API_KEY),
				(data) => {
					store.dispatch(
						Actions.searchYoutubeSuccess(
							searchData.items.map((item, idx) => Object.assign({}, item, data.items[idx]))
						)
					);
				}
			);
		});
	}
}

