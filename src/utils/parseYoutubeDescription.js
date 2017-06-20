import { time2s, duration } from './timeConverter';

const timeRegex = /((\d+):)?(\d+):(\d{1,2})/;
const trimFRegex = /^[-\W\d]*/;
const trimBRegex = /[-\W\d]*$/;

export function parseYoutubeDescription(description, durationYt) {
	const descriptionLines = description.split('\n');
	const res = descriptionLines
		.filter(line => timeRegex.test(line))
		.map(line => {
			// Get the time parts
			const [, , ht, mt, st] = timeRegex.exec(line);
			const h = ht ? parseInt(ht, 10) : 0;
			const m = parseInt(mt, 10);
			const s = parseInt(st, 10);
			// Clean up the title from spaces minus and time
			const title = line.replace(trimFRegex, '').replace(trimBRegex, '');
			return {
				start: (h * 3600) + (m * 60) + s,
				title,
			};
		});
	/* eslint-disable no-param-reassign */
	res.forEach((song, idx) => {
		if (idx === (res.length - 1)) song.stop = time2s(duration(durationYt));
		else song.stop = res[idx + 1].start;
	});
	return res;
}
