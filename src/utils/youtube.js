import { ajaxJSON } from './ajax';
import { time2s, s2time, duration } from './timeConverter';
import { mediaBaseObject } from '../vuex/audius/mediaBaseObject';

export const isYouTubeVideoRegEx = /.*youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?/;
export const youTubePlaylistRexEx = /.*youtu(?:be\.com\/|\.be\/).*list=([\w\-_]*)/;

const youtubeExtract1g = /youtu.be\/([\w-]+)/g;
const youtubeExtract2g = /youtube.com\/watch\?v=([\w-]+)/g;

const timeRegex = /((\d+):)?(\d+):(\d{1,2})/;
const trimFRegex = /^[-\W\d]*/;
const trimBRegex = /[-\W\d]*$/;

/* eslint-disable no-param-reassign */
export function parseYoutubeDescription(v) {
	const snippet = v.snippet || {};
	const description = snippet.description || '';
	const durationYt = v.contentDetails ? v.contentDetails.duration : undefined;
	const { id } = v;

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
			const title = `${line.replace(trimFRegex, '').replace(trimBRegex, '')} - ${snippet.title}`;
			return Object.assign({}, mediaBaseObject, {
				id: `${id}-track${idx + 1}`,
				start: h * 3600 + m * 60 + s,
				title,
				fullTitle: line,
				durationAlbum: time2s(duration(durationYt)),
				type: 'youtube',
				isTrack: true,
				trackId: idx + 1,
				youtubeId: id,
			});
		})
		.map((song, idx, thisArray) => {
			// Add end times of each song from start of song after and end time of the media
			if (idx === thisArray.length - 1) song.stop = time2s(duration(durationYt));
			else song.stop = thisArray[idx + 1].start;
			return song;
		})
		.map(song => {
			// Calculate duration of each song.
			song.durationS = song.stop - song.start;
			song.duration = s2time(song.durationS);
			return song;
		});
}

function normalizeYouTubeData(videoData) {
	const snippet = videoData.snippet || {};
	const tracks = parseYoutubeDescription(videoData);
	const durationYt = videoData.contentDetails ? videoData.contentDetails.duration : undefined;
	return Object.assign({}, mediaBaseObject, {
		title: snippet.title,
		duration: duration(durationYt),
		durationS: time2s(duration(durationYt)),
		id: videoData.id,
		youtubeId: videoData.id,
		type: 'youtube',
		tracks: tracks.length ? tracks : undefined,
	});
}

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
	return `https://www.googleapis.com/youtube/v3/videos?part=contentDetails${withSnippet
		? ',snippet'
		: ''}&id=${ids}&key=${YOUTUBE_API_KEY}`;
}

export function getPlayList(YOUTUBE_API_KEY, playListUrl) {
	const playListId = youTubePlaylistRexEx.exec(playListUrl)[1];
	const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&type=video&maxResults=50&playlistId=${playListId}&key=${YOUTUBE_API_KEY}`;
	let searchData;
	return ajaxJSON(url)
		.then(sd => {
			searchData = sd;
			return ajaxJSON(
				getYtContentDetailURL(
					YOUTUBE_API_KEY,
					searchData.items.map(item => item.contentDetails.videoId).join(','),
					true
				)
			);
		})
		.then(data =>
			searchData.items.map((item, idx) =>
				normalizeYouTubeData(Object.assign({}, item, data.items[idx]))
			)
		);
}

export function searchYoutube(YOUTUBE_API_KEY, query) {
	if (isYouTubeVideoRegEx.test(query)) {
		return ajaxJSON(
			getYtContentDetailURL(YOUTUBE_API_KEY, isYouTubeVideoRegEx.exec(query)[1], true)
		).then(data => data.items.map(v => normalizeYouTubeData(v)));
	}
	const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${query}&key=${YOUTUBE_API_KEY}`;
	let searchData;
	return ajaxJSON(url)
		.then(sd => {
			searchData = sd;
			return ajaxJSON(
				getYtContentDetailURL(
					YOUTUBE_API_KEY,
					searchData.items.map(item => item.id.videoId).join(','),
					true
				)
			);
		})
		.then(data =>
			searchData.items.map((item, idx) =>
				normalizeYouTubeData(Object.assign({}, item, data.items[idx]))
			)
		);
}

export function getYouTubeInfo({ ids, youtubeApiKey }) {
	const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${ids.join(
		','
	)}&key=${youtubeApiKey}`;
	return ajaxJSON(url).then(data => data.items.map(v => normalizeYouTubeData(v)));
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
