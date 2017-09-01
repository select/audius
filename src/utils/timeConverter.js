/**
 * ##zeroPad
 * Zero pad a number and return the zero padded string.
 * @param {Integer} num number that should be padded
 * @param {Integer} size number of digits
 * @return {String}
 */
function zeroPad(num, size) {
	const s = `000000000${num}`;
	return s.substr(s.length - size);
}

/**
 * Convert milliseconds to hours minutes seconds and milliseconds.
 * @param  {float} sms seconds float
 * @return {Object} `{h, m, s, ms}`
 */
export function s2time(sms) {
	let h;
	let m;
	let s;
	// s = Math.floor(ms / 1000);
	s = Math.floor(sms);
	const ms = sms % 1;
	m = Math.floor(s / 60);
	s %= 60;
	h = Math.floor(m / 60);
	m %= 60;
	const d = Math.floor(h / 24);
	h %= 24;
	return { d, h, m, s: zeroPad(s, 2), ms };
}
/**
 * Convert hours, minutes, seconds to seconds.
 * @return {integer} seconds
 */
export function time2s(duration) {
	duration.s = parseInt(duration.s, 10);
	const t = Object.assign({ h: 0, m: 0, s: 0 }, duration);
	return ((((t.h * 60) + t.m) * 60) + t.s);
}


export function duration(durationString) {
	if (!durationString) return {};
	const durationMatch = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
	return {
		h: parseInt(durationMatch[1], 10) || 0,
		m: parseInt(durationMatch[2], 10) || 0,
		s: zeroPad(parseInt(durationMatch[3], 10) || 0, 2),
	};
}
