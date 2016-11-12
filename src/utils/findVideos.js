import store from '../store';
import Actions from '../actions';
import ajax from './ajax';

const YOUTUBE_API_KEY = store.getState().config.youtubeApiKey;

const youtubeRegEx = /(youtube.com)|(youtu.be)/;
const youtubeExtract1 = /youtu.be\/([\w-]+)/;
const youtubeExtract2 = /youtube.com\/watch\?v=([\w-]+)/;



export default function findVideos() {
	const youtubeUrls = Array
		.from(document.querySelectorAll('a'))
		.map(el => el.href.match(youtubeRegEx) ? el.href : null)
		.filter(link => link);
	console.log('youtubeUrls 1', youtubeUrls.length)

	Array.from(document.querySelectorAll('iframe')).forEach(iframe => {
		console.log('searching iframe')
		const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
		youtubeUrls.concat(
			Array
				.from(innerDoc.querySelectorAll('a'))
				.map(el => el.href.match(youtubeRegEx) ? el.href : null)
				.filter(link => link)
		);
		console.log('youtubeUrls 2', youtubeUrls.length)
	});

	// too many ids! must split up

	let ids = [
		...youtubeUrls
			.map((link) => {
				const match = link.match(youtubeExtract1);
				return match ? match[1] : undefined;
			}),
		...youtubeUrls
			.map((link) => {
				const match = link.match(youtubeExtract2);
				return match ? match[1] : undefined;
			}),
	];
	const entities = store.getState().mediaPlayer.entities;
	ids = ids
		.filter(id => id) // filter empty
		.filter((item, pos, self) => self.indexOf(item) === pos) // filter dublicates
		.filter(id => !entities[id]); // filter one already in store
	const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`;
	ajax(url, (data) => { store.dispatch(Actions.extensionAddVideos(data.items)); });
}
