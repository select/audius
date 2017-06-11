import { ajax } from './ajax';


const youtubeExtract1g = /youtu.be\/([\w-]+)/g;
const youtubeExtract2g = /youtube.com\/watch\?v=([\w-]+)/g;

export function findYouTubeIdsText(text) {
	const hits = [];
	let matches;
	while ((matches = youtubeExtract1g.exec(text))) {
		hits.push(decodeURIComponent(matches[1]));
	}
	while ((matches = youtubeExtract2g.exec(text))) {
		hits.push(decodeURIComponent(matches[1]));
	}
	return hits;
}

export function getYouTubeInfo(ids, YOUTUBE_API_KEY) {
	return new Promise(resolve => {
		const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`;
		ajax(url, data => {
			resolve(data.items);
		});
	});
}

// const youtubeRegEx = /(youtube.com)|(youtu.be)/;
// const youtubeExtract1 = /youtu.be\/([\w-]+)/;
// const youtubeExtract2 = /youtube.com\/watch\?v=([\w-]+)/;

// export function findYouTubeIdsHTML() {
// 	const YOUTUBE_API_KEY = store.getState().mediaPlayer.youtubeApiKey;
// 	const youtubeUrls = Array
// 		.from(document.querySelectorAll('a'))
// 		.map(el => el.href.match(youtubeRegEx) ? el.href : null)
// 		.filter(link => link);

// 	Array.from(document.querySelectorAll('iframe')).forEach((iframe) => {
// 		const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
// 		youtubeUrls.concat(
// 			Array
// 				.from(innerDoc.querySelectorAll('a'))
// 				.map(el => el.href.match(youtubeRegEx) ? el.href : null)
// 				.filter(link => link)
// 		);
// 	});

// 	return [
// 		...youtubeUrls
// 			.map((link) => {
// 				const match = link.match(youtubeExtract1);
// 				return match ? match[1] : undefined;
// 			}),
// 		...youtubeUrls
// 			.map((link) => {
// 				const match = link.match(youtubeExtract2);
// 				return match ? match[1] : undefined;
// 			}),
// 	];
// }

