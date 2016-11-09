/**
 * Convert milliseconds to hours minutes seconds and milliseconds.
 * @param  {float} sms milliseconds
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
	return { d, h, m, s, ms };
}
/**
 * Convert hours, minutes, seconds to seconds.
 * @return {integer} seconds
 */
export function time2s(h, m, s) {
	return ((h * 60 + m) * 60 + s);
}
