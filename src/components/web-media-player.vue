<script>
import { mapState, mapMutations } from 'vuex';

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
					this.player.play();
					this._startInterval();
					this._mediaUrl = this.currentMedia.url;
				}
			}),

			this.$store.watch(state => state.isPlaying, () => {
				// if isPlaying changed start stop video
				if (this.currentMedia.type === 'audio' && this.isPlaying) {
					this.audioPlayer.play();
					this._startInterval();
				} else if (this.currentMedia.type === 'video' && this.isPlaying) {
					this.videoPlayer.play();
					this._startInterval();
				} else {
					clearInterval(this.timeInterval);
					this.videoPlayer.pause();
					this.audioPlayer.pause();
				}
			}),

			// this.$store.watch(state => state.mute,() => {
			// 	// if mute changeds
			// 	if (this.player && this.player.isMuted && (this.player.isMuted() !== this.mute)) {
			// 		if (this.mute) this.player.mute();
			// 		else this.player.unMute();
			// 	}
			// }),

			this.$store.watch(state => state.skipToTime, () => {
				// if skip to time changed
				if (this.skipToTimeLocal !== this.skipToTime) {
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
		...mapMutations(['play', 'pause', 'setCurrentTime', 'nextVideo', 'videoError']),
		_startInterval() {
			clearInterval(this.timeInterval);
			this.timeInterval = setInterval(() => {
				this.setCurrentTime(this.player.currentTime);
			}, 1000);
		},
	},
};
// https://github.com/kim-company/videojs-chromecast
// to add a chromcast button to videos
</script>

<template>
	<video class="video-player" src="" controls>
		Sorry, your browser doesn't support embedded videos.
	</video>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.video-player
	width: 100%
	flex: 1
	background: $color-black

</style>