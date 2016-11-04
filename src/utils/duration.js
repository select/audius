/**
 * ##zeroPad
 * Zero pad a number and return the zero padded string.
 * @param {Integer} num number that should be padded
 * @param {Integer} size number of digits
 * @return {String}
 */
var zeroPad = function (num, size) {
  'use strict';
  var s = '000000000' + num;
  return s.substr(s.length - size);
};

if (process && process.env.APP_ENV === 'browser') {
  module.exports = zeroPad;
} else {
  // ... we are not usig webpack
  window.zeroPad = zeroPad;
}

export default function duration(durationString) {
	const durationMatch = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
	return {
		h: parseInt(durationMatch[1], 10) || 0,
		m: parseInt(durationMatch[2], 10) || 0,
		s: zeroPad(parseInt(durationMatch[3], 10) || 0, 2),
	};
}
