import { ajax } from './ajax';
import { time2s, s2time, duration } from './timeConverter';
import { videoBaseObject } from '../vuex/video';

export const isYouTubeVideoRegEx = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?/;

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

export function getYtContentDetailURL(YOUTUBE_API_KEY, ids, withSnippet) {
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

const timeRegex = /((\d+):)?(\d+):(\d{1,2})/;
const trimFRegex = /^[-\W\d]*/;
const trimBRegex = /[-\W\d]*$/;

/* eslint-disable no-param-reassign */
export function parseYoutubeDescription(v) {
	const description = v.snippet.description;
	const durationYt = v.contentDetails ? v.contentDetails.duration : undefined;
	const id = v.id;

	const descriptionLines = description.split('\n');
	return descriptionLines
		.filter(line => timeRegex.test(line)) // only lines with time information
		.map((line, idx) => {
			// Get the time parts
			const [, , ht, mt, st] = timeRegex.exec(line);
			const h = ht ? parseInt(ht, 10) : 0;
			const m = parseInt(mt, 10);
			const s = parseInt(st, 10);
			// Clean up the title from spaces minus and time
			const title = `${line.replace(trimFRegex, '').replace(trimBRegex, '')} - ${v.snippet.title}`;
			return Object.assign({}, videoBaseObject, {
				id,
				start: (h * 3600) + (m * 60) + s,
				title,
				fullTitle: line,
				durationAlbum: time2s(duration(durationYt)),
				type: 'youtube',
				isTrack: true,
				trackId: idx + 1,
				youtubeId: id,
			});
		}).map((song, idx, thisArray) => {
			// Add end times of each song from start of song after and end time of the media
			if (idx === (thisArray.length - 1)) song.stop = time2s(duration(durationYt));
			else song.stop = thisArray[idx + 1].start;
			return song;
		}).map(song => {
			// Calculate duration of each song.
			song.durationS = song.stop - song.start;
			song.duration = s2time(song.durationS);
			return song;
		});
}

export function getYouTubeInfo(ids, YOUTUBE_API_KEY) {
	return new Promise(resolve => {
		const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`;
		ajax(url, data => {
			resolve(data.items.map(v => {
				const tracks = parseYoutubeDescription(v);
				const durationYt = v.contentDetails ? v.contentDetails.duration : undefined;
				return Object.assign({}, videoBaseObject, {
					title: v.snippet.title,
					duration: duration(durationYt),
					durationS: time2s(duration(durationYt)),
					isPlaying: false,
					id: v.id,
					deleted: false,
					type: 'youtube',
					tracks: tracks.length ? tracks : undefined,
				});
			}));
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


