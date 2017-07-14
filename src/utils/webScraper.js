import { hashCode } from './hashCode';

export const webScraper = {
	videos: [],
	currentVideoIndex: -1,
	baseURL: 'https://api.imgur.com/3/gallery/hot/viral/',
	requestHeader: ['Authorization', 'Client-ID c35fbc04fe9ccda'],
	parserName: 'imgur API',
	parserRunning: false,

	getVideosFromIndex(currentPageIndex) {
		return this.ajax(`${this.baseURL}${currentPageIndex}.json`).then(rawJsonIndex => {
			this.parserRunning = false;
			return [
				...this.videos,
				...JSON.parse(rawJsonIndex).data.filter(item => item.mp4).map(item => ({
					id: `${hashCode(item.mp4)}`,
					href: item.link,
					url: item.mp4,
					type: 'video',
					title: item.title,
					thumbUrl: `http://i.imgur.com/${item.id}s.jpg`,
				})),
			];
		});
	},

	ajax(url) {
		const promise = new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onload = function load() {
				if (this.status >= 200 && this.status < 300) resolve(this.responseText);
				else reject(`ajax failed for ${url}, because ${this.statusText}`);
			};
			if (this.requestHeader) {
				xhr.setRequestHeader(...this.requestHeader);
			}
			xhr.onerror = event => {
				reject(`Error requesting ${this.parserName}`);
			};
			xhr.send();
		});
		return promise;
	},

	findVideos(html) {
		const node = document.createElement('div');
		node.innerHTML = html;
		const ytNodes = node.querySelectorAll('iframe[allowfullscreen], iframe.youtube-player');
		const mp4Nodes = node.querySelectorAll('a[href$=".mp4"]');
		return [
			...Array.from(ytNodes).map(_node => ({
				type: 'youtube',
				url: _node.src.replace(/\?.*$/, ''),
			})),
			...Array.from(mp4Nodes).map(_node => ({
				type: 'video',
				url: _node.href,
			})),
		];
	},

	scanUrl(url) {
		return this.ajax(url).then(rawHTML => this.findVideos(rawHTML));
	},

	getNext() {
		const promise = new Promise((resolve, reject) => {
			// only increment if we are not at the last video
			if (this.currentVideoIndex < this.videos.length) {
				this.currentVideoIndex++;
			}

			// no videos left, we must wait before we can return a new video
			if (this.currentVideoIndex >= this.videos.length - 1) {
				this.getVideosFromIndex().then(
					() => {
						resolve(this.videos[this.currentVideoIndex]);
					},
					err => {
						reject(err);
					}
				);
			} else {
				// 3 before last, request next index page to get more videos
				if (this.currentVideoIndex >= this.videos.length - 4) {
					this.getVideosFromIndex();
				}
				resolve(this.videos[this.currentVideoIndex]);
			}
		});
		return promise;
	},

	getPrev() {
		if (this.currentVideoIndex > 0) {
			this.currentVideoIndex--;
		}
		return this.videos[this.currentVideoIndex];
	},
};
