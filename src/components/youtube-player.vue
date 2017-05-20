<script>
/* global YT */
import { injectScript } from '../utils';


export default {
	name: 'youtube-player',
	data() {
		return {
			player: undefined,
			timeInterval: undefined,
			duration: 0,
			skipToTime: 0,
		};
	},
	created() {
		// this.unsubscribe = store.subscribe(() => {
		// 	const mediaPlayer = store.getState().mediaPlayer;
		// 	if (mediaPlayer.mediaId && this.player.getVideoData() && (this.player.getVideoData().video_id !== mediaPlayer.mediaId)) {
		// 		this.duration = this.player.getDuration();
		// 		this.player.loadVideoById({
		// 			videoId: mediaPlayer.mediaId,
		// 			suggestedQuality: 'large',
		// 		});
		// 	}
		// 	if (this.player && this.player.isMuted && (this.player.isMuted() !== mediaPlayer.mute)) {
		// 		if (mediaPlayer.mute) this.player.mute();
		// 		else this.player.unMute();
		// 	}
		// 	if (this.skipToTime !== mediaPlayer.skipToTime) { // bad hack, this sould be some middleware doing it better
		// 		this.skipToTime = mediaPlayer.skipToTime;
		// 		this.player.seekTo(mediaPlayer.skipToTime, true);
		// 	}
		// 	if (mediaPlayer.isPlaying) {
		// 		if (this.player.getPlayerState() !== 1) this.player.playVideo();
		// 	} else if (this.player && this.player.getPlayerState && ![0, 2].includes(this.player.getPlayerState())) {
		// 		this.player.pauseVideo();
		// 	}
		// });
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	mounted() {
		const initialVideos = ['Es22YN2stg8', 'strzXKsfRMs', 'qMvLkpQcCKQ', 'KwoVARYA8jw', 'nzwrwfNHn5A'];
		window.onYouTubeIframeAPIReady = () => {
			this.player = new YT.Player('youtube-iframe', {
				height: '100%',
				width: '100%',
				videoId: initialVideos[Math.floor(Math.random() * initialVideos.length)],
				events: {
					onStateChange: this.onPlayerStateChange,
					onError: this.onPlayerError,
				},
			});
		};
		injectScript('https://www.youtube.com/iframe_api');
	},
	methods: {
		onPlayerError(event) {
			const mediaPlayer = store.getState().mediaPlayer;
			const video = mediaPlayer.entities[mediaPlayer.mediaId];
			store.dispatch(Actions.videoError(video, event.data));
		},
		onPlayerStateChange() {
			const playerState = this.player.getPlayerState();
			const isPlaying = store.getState().mediaPlayer.isPlaying;
			if (playerState === 2) {
				clearInterval(this.timeInterval);
				this.timeInterval = undefined;
				if (isPlaying) store.dispatch(Actions.pause());
			} else if (playerState === 1) {
				if (!this.timeInterval) {
					this.timeInterval = setInterval(() => {
						store.dispatch(Actions.setCurrentTime(this.player.getCurrentTime()));
					}, 1000);
				}
				if (!isPlaying) store.dispatch(Actions.play());
			} else if (playerState === 0) {
				store.dispatch(Actions.nextVideo());
			}
		},
	},
};
</script>

<template>
	<div class="youtube-player">
		<div id="youtube-iframe"></div>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.youtube-player
	width: 100%
	height: 100%
	overflow: hidden
	background: $color-aluminium-dark

</style>
