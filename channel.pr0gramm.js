({
	baseURL: 'https://pr0gramm.com/api/items/get?flags=1&promoted=1',
	lastKey: '',
	getUrl() {
		return [
			'ajaxJSON',
			!this.lastKey ? this.baseURL : `https://pr0gramm.com/api/items/get?older=${this.lastKey}&flags=1&promoted=1`,
		];
	},
	parse(data) {
		this.lastKey = data.items[data.items.length - 1].promoted; // !this.lastKey ? data.items[data.items.length - 1].promoted : data.cache.replace('stream:top:1:o', '');
		return data.items
			.filter(item  => /\.mp4$/.test(item.image))
			.map(item => ({
				id: `pr0gramm-${item.id}`,
				title: `${item.id} by ${item.user}`,
				type: 'video',
				thumbUrl: `https://thumb.pr0gramm.com/${item.image.slice(0, item.image.length - 4)}.jpg`,
				href: `https://pr0gramm.com/top/${item.id}`,
				url: `https://vid.pr0gramm.com/${item.image}`,
			}));
	},
})
