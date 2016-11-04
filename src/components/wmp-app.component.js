import Vue from 'vue/dist/vue.js';
import store from '../store';
import { findVideos } from '../utils';
import Actions from '../actions';
import './wmp-app.component.sass';

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
	mounted() {
		findVideos()
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		playPauseVideos() {
			if(this.mediaPlayer.isPlaying) store.dispatch(Actions.pause());
			else if (this.mediaPlayer.playList.length) store.dispatch(Actions.play());
		},
		previousVideo() { store.dispatch(Actions.previousVideo()) },
		nextVideo() { store.dispatch(Actions.nextVideo()) },
		togglePlayList() { store.dispatch(Actions.togglePlayList()) },
		toggleShuffle() { store.dispatch(Actions.toggleShuffle()) }
	},
	template: `
<div class="wamp">
	<div class="wamp__controls" :disabled="!mediaPlayer.playList.length">
		<span class="wmp-icon-previous" v-on:click="previousVideo"></span>
		<div class="wamp__play-pause" v-on:click="playPauseVideos">
			<span class="wmp-icon-pause" v-if="mediaPlayer.isPlaying"></span>
			<span class="wmp-icon-play" v-else></span>
		</div>
		<span class="wmp-icon-next" v-on:click="nextVideo"></span>
		<div class="spacer"></div>
		<span class="wamp__shuffle wmp-icon-shuffle" v-on:click="toggleShuffle" v-bind:class="{ active: mediaPlayer.shuffle }"></span>
		<div class="spacer"></div>
		<span class="wamp__show-play-list wmp-icon-format_list_bulleted"  v-on:click="togglePlayList" v-bind:class="{ active: mediaPlayer.showPlayList }"></span>
	</div>
	<div v-if="!mediaPlayer.playList.length && mediaPlayer.showPlayList">
		... playlist is empty
	</div>
	<div class="wamp__media-list-wrapper" v-if="mediaPlayer.showPlayList">
		<ul class="media-list">
			<video-item v-for="id in mediaPlayer.playList" :video="mediaPlayer.entities[id]"></video-item>
		</ul>
	</div>
	<div class="wamp__youtube-player">
		<youtube-player></youtube-player>
	</div>
</div>
	`,
});
