import { time2s, s2time, duration } from './timeConverter';
import { videoBaseObject } from '../vuex/video';

const timeRegex = /((\d+):)?(\d+):(\d{1,2})/;
const trimFRegex = /^[-\W\d]*/;
const trimBRegex = /[-\W\d]*$/;

/* eslint-disable no-param-reassign */
export function parseYoutubeDescription(v) {
	const description = v.snippet.description;
	const durationYt = v.contentDetails.duration;
	const id = v.id;

	const descriptionLines = description.split('\n');
	return descriptionLines
		.filter(line => timeRegex.test(line)) // only lines with time information
		.map((line, idx) => {
			// Get the time parts
			const [, , ht, mt, st] = timeRegex.exec(line);
			const h = ht ? parseInt(ht, 10) : 0;
			const m = parseInt(mt, 10);
			const s = parseInt(st, 10);
			// Clean up the title from spaces minus and time
			const title = `${line.replace(trimFRegex, '').replace(trimBRegex, '')} - ${v.snippet.title}`;
			return Object.assign({}, videoBaseObject, {
				id,
				start: (h * 3600) + (m * 60) + s,
				title,
				fullTitle: line,
				durationAlbum: time2s(duration(v.contentDetails.duration)),
				type: 'youtube',
				isTrack: true,
				trackId: idx + 1,
				youtubeId: id,
			});
		}).map((song, idx, thisArray) => {
			// Add end times of each song from start of song after and end time of the media
			if (idx === (thisArray.length - 1)) song.stop = time2s(duration(durationYt));
			else song.stop = thisArray[idx + 1].start;
			return song;
		}).map(song => {
			// Calculate duration of each song.
			song.durationS = song.stop - song.start;
			song.duration = s2time(song.durationS);
			return song;
		});

}
