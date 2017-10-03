<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { s2time } from '../utils';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

export default {
	data() {
		return {
			player: null,
			_mediaUrl: '',
			timeInterval: undefined,
			skipToTimeLocal: 0,
			audioPlayer: new Audio(),
			videoPlayer: undefined,
		};
	},
	mounted() {
		this.videoPlayer = document.querySelector('.video-player');
		this.videoPlayer.onended = () => {
			clearInterval(this.timeInterval);
			this.nextVideo();
		};
	},
	created() {
		this.failCount = 0;
		this.audioPlayer.onended = () => {
			clearInterval(this.timeInterval);
			this.nextVideo();
		};
		this.subscriptions = [
			// if media changed, set new media in player
			this.$store.watch(state => state.currentMedia, () => {
				if (this.currentMedia.type === 'audio') {
					this.player = this.audioPlayer;
					this.videoPlayer.pause();
				} else if (this.currentMedia.type === 'video') {
					this.player = this.videoPlayer;
					this.audioPlayer.pause();
				} else {
					clearInterval(this.timeInterval);
					this.audioPlayer.pause();
					this.videoPlayer.pause();
					this._mediaUrl = null;
				}
				if (['audio', 'video'].includes(this.currentMedia.type) && (this.currentMedia.url !== this._mediaUrl)) {
					this.player.src = this.currentMedia.url;
					if (this.currentMedia.start) this.player.currentTime = this.currentMedia.start;
					this._play(this.player);
					this._startInterval();
					this._mediaUrl = this.currentMedia.url;
				}
			}),

			this.$store.watch(state => state.isPlaying, () => {
				// if isPlaying changed start stop video
				if (this.currentMedia.type === 'audio' && this.isPlaying) {
					this._play(this.audioPlayer);
					this._startInterval();
				} else if (this.currentMedia.type === 'video' && this.isPlaying) {
					this._play(this.videoPlayer);
					this._startInterval();
				} else {
					clearInterval(this.timeInterval);
					this.videoPlayer.pause();
					this.audioPlayer.pause();
				}
			}),

			this.$store.watch(state => state.skipToTime, () => {
				// if skip to time changed
				if (this.player && this.skipToTimeLocal !== this.skipToTime) {
					this.skipToTimeLocal = this.skipToTime;
					this.player.currentTime = this.skipToTime;
				}
			}),

		];
	},
	beforeDestroy() {
		this.subscriptions.forEach((unsubscribe) => { unsubscribe(); });
	},
	computed: mapState(['currentMedia', 'mute', 'skipToTime', 'isPlaying']),
	methods: {
		...mapMutations(['play', 'pause', 'setCurrentTime', 'videoError', 'error', 'updateCurrentMedia']),
		...mapActions(['nextVideo']),
		_startInterval() {
			clearInterval(this.timeInterval);
			this.timeInterval = setInterval(() => {
				if (
					this.currentMedia.stop
					&& this.player.currentTime >= this.currentMedia.stop
				) {
					this.nextVideo();
				}

				this.setCurrentTime(this.player.currentTime);
			}, 1000);
		},
		_play(player) {
			const playPromise = player.play();
			if (playPromise !== undefined) {
				playPromise.then(() => {
					this.failCount = 0;
					if (!this.currentMedia.durationS) {
						const durationS = Math.round(player.duration);
						this.updateCurrentMedia({
							duration: s2time(durationS),
							durationS,
						});
					}
				}).catch((error) => {
					this.videoError(error.message);
					this.error(`The video could not be played: ${error.message}`);
					if (this.failCount >= 3) {
						this.error('More than 3 failed playback attempts. Stopping playback.');
						this.pause();
					} else {
						this.failCount++;
					}
				});
			}
		},
	},
};
// https://github.com/kim-company/videojs-chromecast
// to add a chromcast button to videos
</script>

<template>
	<video class="video-player" src="">
		Sorry, your browser doesn't support embedded videos.
	</video>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.video-player
	position: absolute
	top: 0
	width: 100%
	height: 100%
	display: flex
	align-items: center
	background: $color-black

</style>
