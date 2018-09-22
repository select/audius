import { hashCode } from './hashCode';
import { findYouTubeIdsText } from './youtube';
import { findVimeoIdsText } from './vimeo';
import { webScraper as wsBase } from './webScraper';

class MediaConverter {
	constructor(localUrl, remoteUrl) {
		this.localUrl = localUrl;
		this.remoteUrl = remoteUrl;
	}

	getMediaData(type, _url, _title) {
		const url = this.localUrl ? _url.replace(this.localUrl, this.remoteUrl) : _url;
		const title = _title || url.substring(url.lastIndexOf('/') + 1, url.length);
		return {
			type,
			title,
			href: this.remoteUrl,
			url,
			id: `${hashCode(url)}`,
		};
	}
}
const audioRegEx = /(http|https)?:\/\/\S+\.(mp3|oga|m4a|flac|wav|aiff|aif|wma|asf|opus)$/gi;
const videoRegEx = /(http|https)?:\/\/\S+\.(avi|mkv|mp4|webm|ogg)$/gi;
function findMediaText(mc, text, innerHTML) {
	const res = [];
	if (videoRegEx.test(text)) res.push(mc.getMediaData('video', text, innerHTML));
	else if (audioRegEx.test(text)) res.push(mc.getMediaData('audio', text, innerHTML));
	return [
		...res,
		...findYouTubeIdsText(text).map(id => ({ type: 'youtube', id })),
		...findVimeoIdsText(text).map(id => ({ type: 'vimeo', id })),
	];
}

export const webScraper = Object.assign({}, wsBase, {
	findMediaInElement(node, localUrl, remoteUrl) {
		const mc = new MediaConverter(localUrl, remoteUrl);
		// Get all iframes with possible yt or vimeo embed.
		const iframes = node.querySelectorAll('iframe');
		const ytEmbedRegEx = /youtube\.com\/(v|embed)\/([^"?]+)/;
		const vimeoEmbedRegEx = /vimeo.com\/video\/([^"?]+)/;

		// Check all `<audiu>`, `<video>`, `<source>`, `<a>` elements for media.
		return [
			// Search for video audio in [href]
			...[...node.querySelectorAll('[href]')].reduce(
				(acc, _node) => [...acc, ...findMediaText(mc, _node.href, node.innerHTML)],
				[]
			),
			// Search for video audio in [srv]
			...[...node.querySelectorAll('[src]')].reduce(
				(acc, _node) => [...acc, ...findMediaText(mc, _node.src)],
				[]
			),
			// Search for embeded youtube videos.
			...[...iframes].reduce((acc, _node) => {
				const match = ytEmbedRegEx.exec(_node.src);
				if (match) acc.push({ type: 'youtube', id: match[2] });
				return acc;
			}, []),
			// Search for embeded vimeo videos.
			...[...iframes].reduce((acc, _node) => {
				const match = vimeoEmbedRegEx.exec(_node.src);
				if (match) acc.push({ type: 'vimeo', id: match[1] });
				return acc;
			}, []),
		];
	},
	findMediaHtml(html, localUrl, remoteUrl) {
		const node = document.createElement('div');
		node.innerHTML = html;
		const mediaList = this.findMediaInElement(node, localUrl, remoteUrl);
		node.remove();
		return mediaList;
	},

	scanOneUrl({ url }) {
		console.log('scanOneUrl url', url);
		// FIXME this breaks for root URLs without a trailing `/`` !!
		return this.ajaxRaw(url).then(rawHTML =>
			this.findMediaHtml(
				rawHTML,
				`${window.location.origin}/`,
				url.substring(0, url.lastIndexOf('/') + 1)
			)
		);
	},
	/**
	 * scanUrl - from a URL or URL pattern return a list of
	 * promises that each return a list of media objects that could be
	 * found at the URL or list of URLS
	 * @param {Mixed} options.inUrls Array of URLs or URL or URL pattern e.g. `http://example.com/page/[1-5]`
	 * @param {String} options.youtubeApiKey key for youtube API
	 * @return {[Promise]} list of promises that each return media a object list
	 */
	scanUrl({ url }) {
		console.log('scanUrl url', url);
		try {
			const urls = Array.isArray(url) ? url : this.patternToUrls(url);
			return urls.map(_url => this.scanOneUrl({ url: _url }));
		} catch (error) {
			return [];
		}
	},
});
