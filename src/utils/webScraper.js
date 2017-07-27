import { hashCode } from './hashCode';

export const webScraper = {
	videos: [],
	currentVideoIndex: -1,
	baseURL: 'https://api.imgur.com/3/gallery/hot/viral/',
	requestHeader: ['Authorization', 'Client-ID c35fbc04fe9ccda'],
	parserName: 'imgur API',
	parserRunning: false,

	getVideosFromIndex(currentPageIndex) {
		return this.ajax(
			`${this.baseURL}${currentPageIndex}.json`,
			this.requestHeader
		).then(rawJsonIndex => {
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

	ajax(url, requestHeader) {
		const promise = new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onload = function load() {
				if (this.status >= 200 && this.status < 300) resolve(this.responseText);
				else reject(`ajax failed for ${url}, because ${this.statusText}`);
			};
			if (requestHeader) {
				xhr.setRequestHeader(...requestHeader);
			}
			xhr.onerror = event => {
				reject(`Error requesting ${this.parserName}`);
			};
			xhr.send();
		});
		return promise;
	},
};

