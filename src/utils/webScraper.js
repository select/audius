import { hashCode } from './hashCode';
import { ajaxJSON, ajaxRaw } from './ajax';

const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx);
const globbingRegEx = /\[(\d+)-(\d+)\]/;

export const webScraper = {
	baseURL: 'https://api.imgur.com/3/gallery/hot/viral/',
	requestHeader: ['Authorization', 'Client-ID c35fbc04fe9ccda'],
	ajaxJSON,
	ajaxRaw,
	getImgurMedia(currentPageIndex) {
		return ajaxRaw(
			`${this.baseURL}${currentPageIndex}.json`,
			this.requestHeader
		).then(res => JSON.parse(res).data
			.filter(item => item.mp4)
			.map(item => ({
				id: `${hashCode(item.mp4)}`,
				href: item.link,
				url: item.mp4,
				type: 'video',
				title: item.title,
				thumbUrl: `//i.imgur.com/${item.id}s.jpg`,
			}))
		);
	},

	patternToUrls(url) {
		if (!globbingRegEx.test(url)) return [url];
		const [fullMatch, start, end] = globbingRegEx.exec(url);
		return range(parseInt(start, 10), parseInt(end, 10)).map(index =>
			url.replace(fullMatch, index)
		);
	},
};

