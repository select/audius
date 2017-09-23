export function youtubeLink(media) {
	let link = `https://youtu.be/${media.id}`;
	if (media.start || media.stop) link += '?';
	if (media.start) link += `start=${media.start}`;
	if (media.stop) {
		if (media.start) link += '&';
		link += `end=${media.stop}`;
	}
	return link;
}

export function getMediaLink(media) {
	if (media.type === 'youtube') {
		return `${media.title} ${youtubeLink(media)}`;
	}
	return `${media.title} ${media.href}`;
}

