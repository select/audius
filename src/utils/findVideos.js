import * as Actions from '../actions';
import store from '../store';
import ajax from './ajax';

const YOUTUBE_API_KEY = 'AIzaSyCHVgsa5owudn4G79IX9pcRcrVNOmgKHuM';

const youtubeRegEx = /(youtube.com)|(youtu.be)/;
const youtubeExtract1 = /youtu.be\/([\w-]+)/;
const youtubeExtract2 = /youtube.com\/watch\?v=([\w-]+)/;

export default function() {
	const youtubeUrls = Array
		.from(document.querySelectorAll('a'))
		.map(el => el.href.match(youtubeRegEx) ? el.href : null)
		.filter(link => link);
	let ids = [
		...youtubeUrls
			.map(link => {
				const match = link.match(youtubeExtract1);
				return match ? match[1] : undefined;
			}),
		...youtubeUrls
			.map(link => {
				const match = link.match(youtubeExtract2);
				return match ? match[1] : undefined;
			}),
	];
	ids = ids
		.filter(id => id) // filter empty
		.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates
	const url = `https://www.googleapis.com/youtube/v3/videos?&part=snippet,contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`;
	ajax(url, data => {store.dispatch(Actions.addVideos(data.items));});
}
