import { ajax } from './ajax';
import { s2time } from './timeConverter';

// https://stackoverflow.com/a/13286930/1436151
export const isVimeoVideoRegEx = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;

export function getVimeoInfo(id) {
	return ajax(`//vimeo.com/api/v2/video/${id}.json`).then(info => ([{
		title: info[0].title,
		duration: s2time(info[0].duration),
		durationS: info[0].duration,
		id,
		vimeoId: id,
		type: 'vimeo',
		href: info[0].url,
		thumbUrl: info[0].thumbnail_small,
	}]));
}

export function searchVimeo(query) {
	const id = isVimeoVideoRegEx.exec(query)[3];
	return getVimeoInfo(id);
}

