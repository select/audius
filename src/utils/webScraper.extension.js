import { hashCode } from './hashCode';
import { getYouTubeInfo, findYouTubeIdsText } from './youtube';
import { getVimeoInfo, findVimeoIdsText } from './vimeo';
import { webScraper as wsBase } from './webScraper';
import { audioRegEx, videoRegEx } from './findMediaLinks';

class MediaConverter {
	constructor(localUrl, remoteUrl) {
		this.localUrl = localUrl;
		this.remoteUrl = remoteUrl;
	}
	getMediaData(type, _url, _title) {
		const url = _url.replace(this.localUrl, this.remoteUrl);
		const title = _title || url.substring(url.lastIndexOf('/') + 1, url.length);
		return {
			type,
			title,
			url,
			id: `${hashCode(url)}`,
		};
	}
}

export const webScraper = Object.assign({}, wsBase, {
	getYouTubeInfo,
	findMediaHtml(html, localUrl, remoteUrl, youtubeApiKey) {
		const node = document.createElement('div');
		node.innerHTML = html;

		const mc = new MediaConverter(localUrl, remoteUrl);
		const youtubeIds = [];
		const vimeoIds = [];

		// Check all `<audiu>`, `<video>`, `<source>`, `<a>` elements for media.
		const mediaList = [
			...Array.from(
				node.querySelectorAll('[href]')
			).reduce((acc, _node) => {
				if (videoRegEx.test(_node.href)) acc.push(mc.getMediaData('video', _node.href, _node.innerHTML));
				else if (audioRegEx.test(_node.href)) acc.push(mc.getMediaData('audio', _node.href, _node.innerHTML));
				else {
					youtubeIds.push(...findYouTubeIdsText(_node.href));
					vimeoIds.push(...findVimeoIdsText(_node.href));
				}
				return acc;
			}, []),
			...Array.from(
				node.querySelectorAll('[src]')
			).reduce((acc, _node) => {
				if (videoRegEx.test(_node.src)) acc.push(mc.getMediaData('video', _node.src));
				else if (audioRegEx.test(_node.src)) acc.push(mc.getMediaData('audio', _node.src));
				else {
					youtubeIds.push(...findYouTubeIdsText(_node.src));
					vimeoIds.push(...findVimeoIdsText(_node.src));
				}
				return acc;
			}, []),
		];

		const promises = [];

		// Get all iframes with possible yt or vimeo embed.
		const iframes = node.querySelectorAll('iframe');

		// Search for embeded youtube videos.
		const ytEmbedRegEx = /youtube\.com\/(v|embed)\/([^"?]+)/;
		youtubeIds.push(...Array.from(iframes).reduce((acc, _node) => {
			const match = ytEmbedRegEx.exec(_node.src);
			if (match && !acc.some(id => id === match[2])) acc.push(match[2]);
			return acc;
		}, []));
		if (youtubeIds.length) promises.push(getYouTubeInfo({ ids: youtubeIds, youtubeApiKey }));

		// Search for emedded vimeo videos.
		const vimeoEmbedRegEx = /vimeo.com\/video\/([^"?]+)/;
		vimeoIds.push(...Array.from(iframes).reduce((acc, _node) => {
			const match = vimeoEmbedRegEx.exec(_node.src);
			if (match && !acc.some(id => id === match[1])) acc.push(match[1]);
			return acc;
		}, []));
		if (vimeoIds.length) {
			promises.push(getVimeoInfo(vimeoIds));
		}

		node.remove();

		return Promise.all(promises)
			.then(results => results.reduce((acc, res) => [...acc, ...res], []))
			.then(flatResults => [...flatResults, ...mediaList]);
	},

	scanOneUrl({ url, youtubeApiKey }) {
		// FIXME this breaks for root URLs without a trailing `/`` !!
		return this.ajaxRaw(url).then(rawHTML =>
			this.findMediaHtml(rawHTML, `${window.location.origin}/`, url.substring(0, url.lastIndexOf('/') + 1), youtubeApiKey)
		);
	},
	/**
	 * scanUrl - from a URL or URL pattern return a list of
	 * promises that each return a list of media objects that could be
	 * found at the URL or list of URLS
	 * @param {String} options.url URL or URL pattern e.g. `http://example.com/page/[1-5]`
	 * @param {String} options.youtubeApiKey key for youtube API
	 * @return {[Promise]} list of promises that each return media a object list
	 */
	scanUrl({ url, youtubeApiKey }) {
		try {
			return this.patternToUrls(url).map(_url => this.scanOneUrl({ url: _url, youtubeApiKey }));
		} catch (error) {
			return [];
		}
	},
});
