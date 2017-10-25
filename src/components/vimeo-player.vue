<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { injectScript } from '../utils';

export default {
	created() {
		this.subscriptions = [
			this.$store.watch(state => state.currentMedia, () => {
				// if video changed, set new video in player
				if (this.currentMedia.type === 'vimeo') {
					this.player
						.loadVideo(this.currentMedia.id)
						.then(() => {
							if (this.currentMedia.start) this.player.setCurrentTime(this.currentMedia.start);
							this.player.play();
						}).catch(error => {
							this.error(`Could not load vimeo video: ${error}`);
						});
				} else if (this.player) {
					this.player.pause();
					// Unload video to stop buffering.
					this.player.unload().then();
				}
			}),

			// this.$store.watch(state => state.mute, () => {
			// 	// if mute changed
			// 	if (this.player && this.player.isMuted && (this.player.isMuted() !== this.mute)) {
			// 		if (this.mute) this.player.mute();
			// 		else this.player.unMute();
			// 	}
			// }),

			this.$store.watch(state => state.skipToTime, () => {
				// if skip to time changed
				if (this.currentMedia.type === 'vimeo') {
					this.player.setCurrentTime(this.skipToTime);
				}
			}),

			this.$store.watch(state => state.isPlaying, () => {
				// if isPlaying changed start stop video
				if (this.currentMedia.type === 'vimeo' && this.isPlaying) {
					this.player.play();
				} else {
					this.player.pause();
				}
			}),
		];
	},
	beforeDestroy() {
		this.subscriptions.forEach((unsubscribe) => { unsubscribe(); });
	},
	mounted() {
		this.initPlayer();
	},
	computed: mapState(['currentMedia', 'mute', 'skipToTime', 'isPlaying']),
	methods: {
		...mapMutations(['play', 'pause', 'setCurrentTime', 'videoError', 'error']),
		...mapActions(['nextVideo']),
		clearInterval() {
			clearInterval(this.timeInterval);
			this.timeInterval = null;
		},
		initPlayer() {
			if (!this.player) {
				injectScript('https://player.vimeo.com/api/player.js').then(() => {
					this.player = new window.Vimeo.Player(document.querySelector('.vimeo-player'));
					this.player.on('play', () => {
						this.timeInterval = setInterval(() => {
							this.player.getCurrentTime().then(s => { this.setCurrentTime(s); });
						}, 1000);
					});
					this.player.on('pause', () => { this.clearInterval(); });
					this.player.on('ended', () => {
						this.clearInterval();
						this.nextVideo();
					});
				}).catch((error) => {
					this.error(error)
				});
			}
		},
	},
};
</script>

<template>
	<div class="youtube-player">
		<iframe
			class="vimeo-player"
			title="Vimeo player"
			src="https://player.vimeo.com/video/76979871"
			width="100%"
			height="100%"
			frameborder="0"
			webkitallowfullscreen
			mozallowfullscreen
			allowfullscreen>
		</iframe>

	</div>
</template>
