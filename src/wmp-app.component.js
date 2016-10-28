import Vue from 'vue/dist/vue.js';
import './wmp-app.component.sass';
import store from './store';
import { findVideos } from './utils';
import * as Actions from './actions';

Vue.component('wmp-app', {
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
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
	methods: {
		findVideos,
		playPauseVideos() {
			if(this.mediaPlayer.isPlaying) store.dispatch(Actions.pause());
			else store.dispatch(Actions.play());
		},
		previousVideo() { store.dispatch(Actions.previousVideo()) },
		nextVideo() { store.dispatch(Actions.nextVideo()) },
		toggleShuffle() { store.dispatch(Actions.toggleShuffle()) }
	},
	template: `
<div>
	<div class="wamp-controls">
		<button class="wamp__scan" v-on:click="findVideos"> scan </button>
		<span class="wmp-icon-previous" v-on:click="previousVideo"></span>
		<div class="wamp-controls__play-pause" v-on:click="playPauseVideos">
			<span class="wmp-icon-pause" v-if="mediaPlayer.isPlaying"></span>
			<span class="wmp-icon-play" v-else></span>
		</div>
		<span class="wmp-icon-next" v-on:click="nextVideo"></span>
		<div class="spacer"> </div>
		<span class="shuffle wmp-icon-shuffle" v-on:click="toggleShuffle" v-bind:class="{ active: mediaPlayer.shuffle }"></span>
	</div>
	<ul class="wamp__media-list">
		<video-item v-for="id in mediaPlayer.playList" :video="mediaPlayer.entities[id]"></video-item>
	</ul>
	<webview src="youtube.html" partition="static" style="width:100px; height:100px; background-color: black; display: block;" allowtransparency></webview>
</div>
	`,
});
