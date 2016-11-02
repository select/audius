import Vue from 'vue/dist/vue.js';
import store from '../store';
import { findVideos } from '../utils';
import * as Actions from '../actions';
import './web-header.component.sass';

Vue.component('web-header', {
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
			// search: '',
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
			if(this.mediaPlayer.showSearch) Vue.nextTick(() => {
				document.querySelector('.wamp__search-input').focus();
			});
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
		stopPropagation(event) {
			if(mediaPlayer.showSearch) event.stopPropagation();
		},
	},
	template: `
<header>
	<div class="wamp__search">
		<div
			class="wamp__search-input-group"
			v-on:click="store.dispatch(Actions.toggleSearch())"
			v-bind:class="{ active: mediaPlayer.showSearch }">
			<span class="wmp-icon-search"></span>
			<input
				type="text"
				class="wamp__search-input"
				placeholder="Search"
				v-on:click="stopPropagation"
				v-model="search">
			<span class="wmp-icon-close" v-if="mediaPlayer.showSearch" :click="search = ''"></span>
		</div>
		<span class="wmp-icon-volume_up"></span>
		<span class="wmp-icon-more_vert"></span>
	</div>
	<div class="wamp__controls" :disabled="!mediaPlayer.playList.length">
		<span class="wmp-icon-previous" v-on:click="store.dispatch(Actions.previousVideo())"></span>
		<div class="wamp__play-pause" v-on:click="playPauseVideos">
			<span class="wmp-icon-pause" v-if="mediaPlayer.isPlaying"></span>
			<span class="wmp-icon-play" v-else></span>
		</div>
		<span class="wmp-icon-next" v-on:click="store.dispatch(Actions.nextVideo())"></span>
		<div class="spacer"></div>
		<div class="wamp__controls-small">
			<span class="wamp__shuffle wmp-icon-shuffle" v-on:click="store.dispatch(Actions.toggleShuffle())" v-bind:class="{ active: mediaPlayer.shuffle }"></span>
			<span class="wamp__show-play-list wmp-icon-format_list_bulleted"  v-on:click="store.dispatch(Actions.togglePlayList())" v-bind:class="{ active: mediaPlayer.showPlayList }"></span>
		</div>
	</div>
	<div class="wamp__progress"> </div>
</header>
	`,
});
