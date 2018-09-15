const urlRegex = /(https?:\/\/[^\s]+)/g;
export function urlify(text) {
	return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}
