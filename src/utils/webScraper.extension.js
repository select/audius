import { hashCode } from './hashCode';
import { getYouTubeInfo } from './youtube';

const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx);

export const webScraper = {
	videos: [],
	currentVideoIndex: -1,
	baseURL: 'https://api.imgur.com/3/gallery/hot/viral/',
	requestHeader: ['Authorization', 'Client-ID c35fbc04fe9ccda'],
	parserName: 'imgur API',
	parserRunning: false,

	ajax(url, requestHeader) {
		const promise = new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onload = function load() {
				if (this.status >= 200 && this.status < 300) resolve(this.responseText);
				else reject(`Request failed - ${this.status} ${this.statusText}`);
			};
			if (requestHeader) {
				xhr.setRequestHeader(...requestHeader);
			}
			xhr.onerror = event => {
				reject(`Error requesting ${url}`);
			};
			xhr.send();
		});
		return promise;
	},

	findVideos(html, youtubeApiKey) {
		const node = document.createElement('div');
		node.innerHTML = html;
		// embedded youtube videos
		const ytNodes = node.querySelectorAll('iframe[allowfullscreen], iframe.youtube-player');
		// hyperlinks to videos
		const mp4ANodes = node.querySelectorAll('a[href$=".mp4"]');
		// const mp4Nodes = node.querySelectorAll('video[src$=".mp4"]');
		//
		const mediaList = Array.from(mp4ANodes).map(_node => ({
			type: 'video',
			url: _node.href,
			id: `${hashCode(_node.href)}`,
			title: _node.innerHTML,
		}));
		node.remove();
		if (ytNodes.length) {
			const ids = Array.from(ytNodes)
				.map(_node => {
					const url = _node.src.replace(/\?.*$/, '');
					const match = /youtube\.com\/embed\/(.+)$/.exec(url);
					return match ? match[1] : null;
				})
				.filter(id => !!id);
			return getYouTubeInfo(ids, youtubeApiKey);
		}
		return mediaList;
	},
	_scanOneUrl({ url, youtubeApiKey }) {
		return this.ajax(url)
			.then(rawHTML => this.findVideos(rawHTML, youtubeApiKey))
			.then(mediaList =>
				mediaList.map(media =>
					Object.assign({}, media, {
						url: media.url ? media.url.replace(`${window.location.origin}/`, url) : undefined,
					})
				)
			);
			// .then(r => {console.log('map ', r); return r});
	},
	scanUrl({ url, youtubeApiKey }) {
		const globbingRegEx = /\[(\d+)-(\d+)\]/;
		if (!globbingRegEx.test(url)) return [this._scanOneUrl({ url, youtubeApiKey })];

		const [fullMatch, start, end] = globbingRegEx.exec(url);
		try {
			return range(parseInt(start, 10), parseInt(end, 10))
				.map(index => url.replace(fullMatch, index))
				.map(_url => this._scanOneUrl({ url: _url, youtubeApiKey }));
		} catch (error) {
			return [];
		}
	},
};

