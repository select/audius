import { findYouTubeIdsText, getYouTubeInfo, youTubePlaylistRexEx, getPlayList } from './youtube';
import { findVimeoIdsText, getVimeoInfo } from './vimeo';
import { s2time } from './timeConverter';
import { hashCode } from './hashCode';
import { getMediaDuration } from './getMediaDuration';
import { mediaBaseObject } from '../vuex/audius/mediaBaseObject';

export const audioRegEx = /(http|https)?:\/\/\S+\.(mp3|oga|m4a|flac|wav|aiff|aif|wma|asf|opus)/gi;
export const videoRegEx = /((http|https)?:\/\/\S+\.(avi|mkv|mp4|webm|ogg))/gi;

function refineWebSearchResult(media) {
	const urlParts = media.url.split('/');
	const title = urlParts.length ? urlParts[urlParts.length - 1] : media.url;
	return Object.assign(
		{},
		mediaBaseObject,
		{
			title,
			duration: media.durationS ? s2time(media.durationS) : undefined,
			id: media.id || `${hashCode(media.url)}`,
		},
		media
	);
}
// filter duplicates,
// filter media in `mediaIndex` and add them to `mediaItems`
//
function reduceKnown(mediaIndex, mediaItems, hashId = false) {
	const seenIndex = new Set();
	return (acc, item) => {
		const baseObject = typeof id === 'object' ? item : {};
		const _id2 = typeof id === 'object' ? item.id : item;

		if (!_id2 || seenIndex.has(_id2)) return acc;
		const _id = hashId ? hashCode(_id2) : _id2;
		if (_id in mediaIndex) mediaItems.push(Object.assign({}, mediaIndex[_id], baseObject));
		else acc.push(item);
		seenIndex.add(_id2);
		return acc;
	};
}

/**
 * findMediaLinksText
 * @param {String} text Text to parse
 * @param {Set} indexKnown index of known ids
 * @return {Promise} Promise that returns [{mediaObject}]
 */
export function findMediaText(text, youtubeApiKey, mediaIndex, options) {
	const { extendPlayLists } = Object.assign({ extendPlayLists: false }, options);
	const mediaList = (options && options.mediaList) || [];
	const promises = [];
	const mediaItems = [];
	let isPlayList = false;

	// Find YouTube links in text message.
	const ytIds = [
		...findYouTubeIdsText(text).reduce(reduceKnown(mediaIndex, mediaItems), []),
		...mediaList
			.filter(({ type }) => type === 'youtube')
			.map(({ id }) => id)
			.reduce(reduceKnown(mediaIndex, mediaItems), []),
	];
	if (ytIds.length) {
		// Get info for all new unknown ids.
		promises.push(getYouTubeInfo({ ids: ytIds, youtubeApiKey }));
	}

	// If desired parse playlist link and get all playlist entries.
	if (extendPlayLists && youTubePlaylistRexEx.test(text)) {
		isPlayList = true;
		promises.push(getPlayList(youtubeApiKey, text));
	}

	// Find Vimeo links in text message.
	const viIds = [
		...findVimeoIdsText(text).reduce(reduceKnown(mediaIndex, mediaItems), []),
		...mediaList
			.filter(({ type }) => type === 'vimeo')
			.map(({ id }) => id)
			.reduce(reduceKnown(mediaIndex, mediaItems), []),
	];
	if (viIds.length) {
		promises.push(getVimeoInfo(viIds));
	}

	// Find audio files
	const audioUrls = (text.match(audioRegEx) || []).reduce(
		reduceKnown(mediaIndex, mediaItems, true),
		[]
	);
	if (audioUrls.length) {
		promises.push(
			Promise.all(
				audioUrls.map(url =>
					getMediaDuration(url, 'audio').then(durationS =>
						refineWebSearchResult({ url, href: url, durationS, type: 'audio' })
					)
				)
			)
		);
	}
	const audioItems = mediaList
		.filter(({ type }) => type === 'audio')
		.reduce(reduceKnown(mediaIndex, mediaItems), []);
	if (audioItems.length) {
		promises.push(
			Promise.all(
				audioItems.map(media =>
					getMediaDuration(media.url, 'audio').then(durationS =>
						refineWebSearchResult(
							Object.assign({ href: media.url, durationS, type: 'audio' }, media)
						)
					)
				)
			)
		);
	}

	const videoUrls = (text.match(videoRegEx) || []).reduce(
		reduceKnown(mediaIndex, mediaItems, true),
		[]
	);
	if (videoUrls.length) {
		promises.push(
			Promise.all(
				videoUrls.map(url =>
					getMediaDuration(url, 'video').then(durationS =>
						refineWebSearchResult({ url, href: url, durationS, type: 'video' })
					)
				)
			)
		);
	}
	const videoItems = mediaList
		.filter(({ type }) => type === 'video')
		.reduce(reduceKnown(mediaIndex, mediaItems), []);
	if (videoItems.length) {
		promises.push(
			Promise.all(
				videoItems.map(media =>
					getMediaDuration(media.url, 'video').then(durationS =>
						refineWebSearchResult(
							Object.assign({ href: media.url, durationS, type: 'video' }, media)
						)
					)
				)
			)
		);
	}

	// Flat map the results so we get one list and not a list of lists.
	return Promise.all(
		promises.map(p => p.catch(error => window.console.warn('findMediaLinksText', error)))
	).then(res => {
		const newMedia = res.reduce((acc, item) => [...acc, ...item], []);
		return {
			isPlayList,
			newMedia,
			mediaList: [...mediaItems, ...newMedia],
		};
	});
}
