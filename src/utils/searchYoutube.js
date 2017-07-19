import { ajax } from './ajax';

export const isYouTubeVideoRegEx = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?/;

function getYtContentDetailURL(YOUTUBE_API_KEY, ids, withSnippet) {
	return `https://www.googleapis.com/youtube/v3/videos?part=contentDetails${withSnippet ? ',snippet' : ''}&id=${ids}&key=${YOUTUBE_API_KEY}`;
}

export function searchYoutube(YOUTUBE_API_KEY, query, callback) {
	if (isYouTubeVideoRegEx.test(query)) {
		ajax(getYtContentDetailURL(YOUTUBE_API_KEY, isYouTubeVideoRegEx.exec(query)[1], true), data => {
			callback(data.items);
		});
	} else {
		const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${query}&key=${YOUTUBE_API_KEY}`;
		ajax(url, searchData => {
			ajax(
				getYtContentDetailURL(
					YOUTUBE_API_KEY,
					searchData.items.map(item => item.id.videoId).join(','),
					true
				),
				data => {
					callback(searchData.items.map((item, idx) => Object.assign({}, item, data.items[idx])));
				}
			);
		});
	}
}
