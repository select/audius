import jsmediatags from 'jsmediatags';

export function readId3tag(url) {
	return new Promise((resolve, reject) => {
		jsmediatags.read(url, {
			onSuccess: resolve,
			onError: reject,
		});
	});
}
