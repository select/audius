import { ajaxJSON } from './ajax';
import { s2time } from './timeConverter';

// https://github.com/regexhq/vimeo-regex/blob/master/index.js
const isVimeoVideoRegEx = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/g;

export function getVimeoInfo(ids) {
	return Promise.all(ids.map(id => ajaxJSON(`https://vimeo.com/api/v2/video/${id}.json`).then(info => ({
		title: info[0].title,
		duration: s2time(info[0].duration),
		durationS: info[0].duration,
		id,
		vimeoId: id,
		type: 'vimeo',
		href: info[0].url,
		thumbUrl: info[0].thumbnail_small,
	}))));
}

export function findVimeoIdsText(text) {
	const ids = [];
	let match;
	while (match = isVimeoVideoRegEx.exec(text)) {
		ids.push(match[4]);
	}
	return ids;
}
