<script>
/* global YT */
import { mapState, mapMutations } from 'vuex';
import { injectScript } from '../utils';


export default {
	data() {
		return {
			player: undefined,
			timeInterval: undefined,
			duration: 0,
			skipToTimeLocal: 0,
		};
	},
	created() {
		this.subscriptions = [
			this.$store.watch(state => state.mediaId,() => {
				// if video changed, set new video in player
				if (this.mediaId && this.player.getVideoData() && (this.player.getVideoData().video_id !== this.mediaId)) {
					this.duration = this.player.getDuration();
					this.player.loadVideoById({
						videoId: this.mediaId,
						suggestedQuality: 'large',
					});
				}
			}),

			this.$store.watch(state => state.mute,() => {
				// if mute changed
				if (this.player && this.player.isMuted && (this.player.isMuted() !== this.mute)) {
					if (this.mute) this.player.mute();
					else this.player.unMute();
				}
			}),

			this.$store.watch(state => state.skipToTime,() => {
				// if skip to time changed
				if (this.skipToTimeLocal !== this.skipToTime) {
					this.skipToTimeLocal = this.skipToTime;
					this.player.seekTo(this.skipToTime, true);
				}
			}),

			this.$store.watch(state => state.isPlaying,() => {
				// if isPlaying changed start stop video
				if (this.isPlaying) {
					if (this.player.getPlayerState() !== 1) this.player.playVideo();
				} else if (this.player && this.player.getPlayerState && ![0, 2].includes(this.player.getPlayerState())) {
					this.player.pauseVideo();
				}
			})
		]
	},
	beforeDestroy() {
		this.subscriptions.forEach((unsubscribe) => { unsubscribe(); });
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
	computed: mapState(['mediaId', 'mute', 'skipToTime', 'isPlaying']),
	methods: {
		...mapMutations(['play','pause', 'setCurrentTime', 'nextVideo', 'videoError']),
		onPlayerError(event) {
			this.videoError(event.data);
		},
		onPlayerStateChange() {
			const playerState = this.player.getPlayerState();
			if (playerState === 2) {
				clearInterval(this.timeInterval);
				this.timeInterval = undefined;
				if (this.isPlaying) this.pause();
			} else if (playerState === 1) {
				if (!this.timeInterval) {
					this.timeInterval = setInterval(() => {
						this.setCurrentTime(this.player.getCurrentTime());
					}, 1000);
				}
				if (!this.isPlaying) this.play();
			} else if (playerState === 0) {
				this.nextVideo();
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
