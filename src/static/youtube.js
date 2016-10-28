class YoutubePlayer {
	constructor() {
		this.initMessageInterface();
	}

	initMessageInterface() {
		window.addEventListener('message', (event) => {
			console.log('## event recieved', event.data);
			if (!this.messageSource) {
				if (event.data.handshake) {
					console.log('## handshake complete');
					this.messageSource = event.source;
					this.messageOrigin = event.origin;
					this.message({ handshake: true });

				}
			} else {
				if (event.data.togglePlay) this.togglePlay();
				else if (event.data.play) this.play(event.data.play);
				else if (event.data.pause) this.pause();
				else if (event.data.init) this.initYoutube(event.data.init);
			}
		});
	}

	initYoutube(size) {
		if (this.isInit) return;

		this.isInit = true;

		// // 2. This code loads the IFrame Player API code asynchronously.
		const tag = document.createElement('script');

		tag.src = 'https://www.youtube.com/iframe_api';
		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		// 3. This function creates an <iframe> (and YouTube player)
		//    after the API code downloads.
		window.onYouTubeIframeAPIReady = () => {
			this.player = new YT.Player('ytplayer', {
				width: size.x,
				height: size.y,
				videoId: 'Bo-3zz4ZwMM',
				iv_load_policy: 3, // hide annotations, does not seem to work
				events: {
					onReady: () => this.onPlayerReady(),
					onStateChange: (e) => this.videoStateChanged(e.data),
					onError: (e) => this.message({ error: e.data }),
				},
			});
		};
	}
	message(data) {
		this.messageSource.postMessage(data, this.messageOrigin);
	}

	videoStateChanged(state) {
		// -1 (unstarted)
		// 0 (ended)
		// 1 (playing)
		// 2 (paused)
		// 3 (buffering)
		// 5 (video cued).
		if (state === 0) {
			this.message({ ended: true });
		}
	}

	// 4. The API will call this function when the video player is ready.
	onPlayerReady() {
		this.payerReady = true;
		if (this.playURL) this.play(this.playURL);
	}

	pause() {
		this.player.stopVideo();
	}

	play(ytObj) {
		console.log('play ', ytObj);
		if (this.onPlayerReady) {
			if (ytObj.url) this.player.cueVideoByUrl(ytObj.url, 0, 'large');
			if (ytObj.id) this.player.loadVideoById({
				videoId: ytObj.id,
				startSeconds: ytObj.startSeconds,
				endSeconds: ytObj.endSeconds,
				suggestedQuality: 'large',
			});
			this.player.playVideo();
		} else {
			this.playURL = ytUrl;
		}
	}

	togglePlay() {
		const curState = this.player.getPlayerState();
		if ([0, 2].includes(curState)) this.player.playVideo();
		else this.player.stopVideo();
	}
}

console.log('# YouTube webview');
new YoutubePlayer();


