/* eslint-disable no-param-reassign */
/**
 * ##getParameterByName
 * https://stackoverflow.com/a/901144
 *
 * @param {string} name name of the parameter
 * @param {string} url the URL to be parsed
 * @return {string} value of the parameter
 */
export function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	const results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// query string: ?foo=lorem&bar=&baz
// var foo = getParameterByName('foo'); // "lorem"

export function cleanWindowLocation() {
	const url = window.location.href;
	if (url.includes('?')) history.replaceState({}, 'Audius', url.split('?')[0]);
}
