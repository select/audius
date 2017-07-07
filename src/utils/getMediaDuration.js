export function getMediaDuration(url, type) {
	return new Promise((resolve) => {
		let player;
		if (type === 'audio'){
			player = new Audio();
		} else if (type === 'video') {
			player = document.createElement(type);
			player.hidden = true;
			document.body.appendChild(player);
		}
		player.addEventListener(
			'loadeddata',
			() => {
				resolve(Math.round(player.duration));
				if (player.parentNode) player.parentNode.removeChild(player);
			},
			true
		);
		if (type === 'video') {
			setTimeout(() => {
				if (player.parentNode) player.parentNode.removeChild(player);
			}, 700);
		}
		player.src = url;
	});
}
