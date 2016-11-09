import Vue from 'vue/dist/vue.js';
import store from '../store';
import Actions from '../actions';
import youtubeApi from '../utils/youtube-iframe-api';
import * as db from '../utils/indexDB';
import './youtube-player.component.sass';


Vue.component('youtube-player', {
	data() {
		return {
			player: undefined,
			timeInterval: undefined,
			duration: 0,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			const mediaPlayer = store.getState().mediaPlayer;
			if (mediaPlayer.youtubeId && (this.player.getVideoData().video_id !== mediaPlayer.youtubeId)) {
				this.duration = this.player.getDuration()
				this.player.loadVideoById({
					videoId: mediaPlayer.youtubeId,
					suggestedQuality: 'large',
				});
			}
			if (mediaPlayer.isPlaying) {
				if (this.player.getPlayerState() !== 1) this.player.playVideo();
				// if (!this.timeInterval) {
				// 	this.timeInterval = setInterval(() => {
				// 		store.dispatch(Actions.setCurrentTime(this.player.getCurrentTime()));
				// 	}, 1000);
				// }
			} else {
				clearInterval(this.timeInterval);
				if (this.player.getPlayerState) {
					if (![0, 2].includes(this.player.getPlayerState())) this.player.pauseVideo();
				}
			}

		});
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
				videoId: initialVideos[Math.floor(Math.random()*initialVideos.length)],
				events: {
					onStateChange: this.onPlayerStateChange,
					onError: this.onPlayerError,
				}
			});
		}
		youtubeApi();
	},
	methods: {
		onPlayerError(event) {
			console.log('error!')
			const youtubeId = store.getState().mediaPlayer.youtubeId;
			store.dispatch(Actions.videoError(store.getState().mediaPlayer.youtubeId, event.data));
			db.setMediaEntity(store.getState().mediaPlayer.entities[youtubeId]);
		},
		onPlayerStateChange(event) {
			const playerState = this.player.getPlayerState();
			const isPlaying = store.getState().mediaPlayer.isPlaying;
			if (playerState === 2 && isPlaying) {
				store.dispatch(Actions.pause());
			} else if (playerState === 1 && !isPlaying){
				store.dispatch(Actions.play());
			} else if (playerState === 0) {
				store.dispatch(Actions.nextVideo());
			}
		},
	},
	template: `
	<div class="youtube-player">
		<!-- <object style="width: 100px; height: 100px;" data="http://www.youtube.com/embed/GlIzuTQGgzs"></object> -->
		<div id="youtube-iframe"></div>
	</div>
	`,
});
