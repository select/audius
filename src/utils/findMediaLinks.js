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

/**
 * findMediaLinksText
 * @param {String} text Text to parse
 * @param {Set} indexKnown index of known ids
 * @return {Promise} Promise that returns [{mediaObject}]
 */
export function findMediaText(
	text,
	youtubeApiKey,
	{ indexKnown = new Set(), extendPlayLists = false }
) {
	const promises = [];
	let isPlayList = false;
	// Find YouTube links in text message.
	const ytIds = findYouTubeIdsText(text)
		.filter(id => id && !indexKnown.has(id)) // filter empty & known
		.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates
	if (ytIds.length) {
		// Get info for all new unknown ids.
		promises.push(getYouTubeInfo({ ids: ytIds, youtubeApiKey }));
	}

	if (extendPlayLists && youTubePlaylistRexEx.test(text)) {
		isPlayList = true;
		promises.push(getPlayList(youtubeApiKey, text));
	}

	// Find Vimeo links in text message.
	const viIds = findVimeoIdsText(text)
		.filter(id => id && !indexKnown.has(id)) // filter empty & known
		.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates
	if (viIds.length) {
		promises.push(getVimeoInfo(viIds));
	}

	// Find audio files
	const audioUrls = (text.match(audioRegEx) || [])
		.filter(url => !indexKnown.has(hashCode(url))) // filter known
		.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates
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

	const videoUrls = (text.match(videoRegEx) || [])
		.filter(url => !indexKnown.has(hashCode(url))) // filter known
		.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates
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
		mediaList: res.reduce((acc, item) => [...acc, ...item], []),
	}));
}
