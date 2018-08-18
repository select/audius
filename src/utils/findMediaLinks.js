import { findYouTubeIdsText, getYouTubeInfo, youTubePlaylistRexEx, getPlayList } from './youtube';
import { findVimeoIdsText, getVimeoInfo } from './vimeo';
import { s2time } from './timeConverter';
import { hashCode } from './hashCode';
import { getMediaDuration } from './getMediaDuration';
import { mediaBaseObject } from '../vuex/audius/mediaBaseObject';

export const audioRegEx = /(http|https)?:\/\/\S+\.(mp3|oga|m4a|flac|wav|aiff|aif|wma|asf)/gi;
export const videoRegEx = /(http|https)?:\/\/\S+\.(avi|mkv|mp4|webm|ogg)/gi;

function refineWebSearchResult(media) {
	const urlParts = media.url.split('/');
	const title = urlParts.length ? urlParts[urlParts.length - 1] : media.url;
	return Object.assign({}, mediaBaseObject, media, {
		title,
		duration: media.durationS ? s2time(media.durationS) : undefined,
		id: media.id || `${hashCode(media.url)}`,
	});
}

function reduceKnown(mediaIndex, mediaItems, hashId = false) {
	const seenIndex = new Set();
	return (acc, id) => {
		if (!id || seenIndex.has(id)) return acc;
		const _id = hashId ? hashCode(id) : id;
		if (_id in mediaIndex) mediaItems.push(mediaIndex[_id]);
		else acc.push(id);
		seenIndex.add(id);
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
	const promises = [];
	const mediaItems = [];
	let isPlayList = false;

	// Find YouTube links in text message.
	const ytIds = findYouTubeIdsText(text).reduce(reduceKnown(mediaIndex, mediaItems), []);
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
	const viIds = findVimeoIdsText(text).reduce(reduceKnown(mediaIndex, mediaItems), []);
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

	// Flat map the results so we get one list and not a list of lists.
	return Promise.all(promises).then(res => ({
		isPlayList,
		mediaList: res.reduce((acc, item) => [...acc, ...item], mediaItems),
	}));
}
