import Actions from '../actions';
import store from '../store';
import ajax from './ajax';

const YOUTUBE_API_KEY = store.getState().config.youtubeApiKey;

export default function(query) {
	if (store.getState().youtube.query === query) return;
	store.dispatch(Actions.searchYoutube({ query }));
	const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=20&q=${query}&key=${YOUTUBE_API_KEY}`;

	ajax(url, searchData => {
		const ids = searchData.items.map(item => item.id.videoId)
		const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`;
		ajax(url, data => {
			for (var i = 0; i < searchData.items.length; i++) {
				searchData.items[i].contentDetails = data.items[i].contentDetails
			}
			store.dispatch(Actions.searchYoutubeSuccess(searchData.items));
		});
	});
}
// https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=metallica&key=AIzaSyCHVgsa5owudn4G79IX9pcRcrVNOmgKHuM
// https://www.googleapis.com/youtube/v3/videoCategories?part==snippet&key=AIzaSyCHVgsa5owudn4G79IX9pcRcrVNOmgKHuM
