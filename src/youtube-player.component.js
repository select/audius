import Vue from 'vue/dist/vue.js';
import store from './store';
import * as Actions from './actions';

Vue.component('youtube-player', {
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
			player: undefined,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	mounted() {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		document.querySelector('body').appendChild(tag);
		window.onYouTubeIframeAPIReady = () => {
			this.player = new YT.Player('youtube-iframe', {
				height: '390',
				width: '640',
				videoId: 'M7lc1UVf-VE',
				events: {
					'onReady': this.onPlayerReady,
					// 'onStateChange': onPlayerStateChange
				}
			});
		}

		// 5. The API calls this function when the player's state changes.
		//    The function indicates that when playing a video (state=1),
		//    the player should play for six seconds and then stop.
		// var done = false;
		// function onPlayerStateChange(event) {
		// 	if (event.data == YT.PlayerState.PLAYING && !done) {
		// 		setTimeout(stopVideo, 6000);
		// 		done = true;
		// 	}
		// }
		// function stopVideo() {
		// 	player.stopVideo();
		// }
	},
	methods: {
		onPlayerReady(event) {
			console.log('player ready');
			event.target.playVideo();
		},
	},
	template: '<div id="youtube-iframe"></div>',
});
