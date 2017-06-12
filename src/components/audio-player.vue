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
		};
	},
	created() {
		this.player = new Audio();

		this.player.onended = () => {
			this._stopInterval();
			this.nextVideo();
		};

		this.subscriptions = [
			// if media changed, set new media in player
			this.$store.watch(state => state.currentMedia, () => {
				if (this.currentMedia.type === 'audio' && (this.currentMedia.url !== this._mediaUrl)) {
					this.player.src = this.currentMedia.url;
					this.player.play();
					this._startInterval();
					this._mediaUrl = this.currentMedia.url;
				}
				if (this.currentMedia.type !== 'audio') {
					clearInterval(this.timeInterval);
					this.player.pause();
					this._mediaUrl = null;
				}
			}),

			this.$store.watch(state => state.isPlaying, () => {
				// if isPlaying changed start stop video
				if (this.currentMedia.type === 'audio' && this.isPlaying) {
					this.player.play();
					this._startInterval();
				} else {
					clearInterval(this.timeInterval);
					this.player.pause();
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
				console.log('tiememe ',this.timeInterval);
				this.setCurrentTime(this.player.currentTime, 'audio');
			}, 1000);
		},
	},
};
</script>

<template>
	<div>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

/* .youtube-player
	width: 100%
	height: 100%
	overflow: hidden
	background: $color-aluminium-dark */

</style>
