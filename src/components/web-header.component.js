import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import './web-header.component.sass';
import { debounce } from '../utils/debounce';
import searchYoutube from '../utils/searchYoutube';

Vue.component('web-header', {
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
			website: store.getState().website,
			currentSong: undefined,
			// search: '',
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
			this.website = store.getState().website;
			if (this.website.showSearch) {
				Vue.nextTick(() => {
					document.querySelector('.au-header__search-input').focus();
				});
			}
			if (this.mediaPlayer.youtubeId) {
				this.currentSong = this.mediaPlayer.entities[this.mediaPlayer.youtubeId];
			} else {
				this.currentSong = undefined;
			}
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		playPauseVideos() {
			if (this.mediaPlayer.isPlaying) store.dispatch(Actions.pause());
			else if (this.mediaPlayer.playList.length) store.dispatch(Actions.play());
		},
		stopPropagation(event) {
			if (this.website.showSearch) event.stopPropagation();
		},
		clear(event) {
			event.stopPropagation();
			document.querySelector('.au-header__search-input').value = '';
		},
		searchYoutube: debounce((event) => {
			// store.dispatch(Actions.searchYoutube(event.target.value)); // should use this and middleware
			searchYoutube(event.target.value);
		}, 500),
	},
	template: `
<header>
	<div class="au-header__search">
		<img class="au-header__logo" src="./audius.logo.white.svg" alt="Audius - music player - logo">
		<div class="au-header__search-controls">
			<div
				class="au-header__search-input-group"
				v-on:click="store.dispatch(Actions.toggleSearch())"
				v-bind:class="{ active: website.showSearch }">
				<span class="wmp-icon-search"></span>
				<input
					type="text"
					class="au-header__search-input"
					placeholder="Search"
					v-on:click="stopPropagation"
					v-on:keyup="searchYoutube"
					v-on:blur="store.dispatch(Actions.toggleSearch())"
					debounce="500">
				<span class="wmp-icon-close" v-show="website.showSearch" v-on:click="clear"></span>
			</div>
			<div v-on:click="store.dispatch(Actions.toggleMute())">
				<span class="wmp-icon-volume_up" v-if="!mediaPlayer.mute"></span>
				<span class="wmp-icon-volume_off" v-else></span>
			</div>
			<!-- <span class="wmp-icon-more_vert"></span> -->
		</div>
	</div>
	<div class="au-header__control-bar">
		<div class="au-header__current-song">
			<div class="au-header__current-song-name" v-if="currentSong">{{currentSong.title}}</div>
			<div class="au-header__current-song-time" v-if="currentSong"> 3:20 / {{currentSong.duration.m}}:{{currentSong.duration.s}} </div>
		</div>
		<div class="au-header__controls" :disabled="!mediaPlayer.playList.length">
			<span class="wmp-icon-previous" v-on:click="store.dispatch(Actions.previousVideo())" title="Previous song"></span>
			<div class="au-header__play-pause" v-on:click="playPauseVideos">
				<span class="wmp-icon-pause" v-if="mediaPlayer.isPlaying" title="Pause"></span>
				<span class="wmp-icon-play" v-else  title="Play"></span>
			</div>
			<span class="wmp-icon-next" v-on:click="store.dispatch(Actions.nextVideo())"  title="Next song"></span>
			<div class="spacer"></div>
			<div class="au-header__controls-small">
				<span
					class="au-header__shuffle wmp-icon-shuffle"
					v-on:click="store.dispatch(Actions.toggleShuffle())"
					v-bind:class="{ active: mediaPlayer.shuffle }"
					title="Shuffle"></span>
				<!-- <span
					class="au-header__repeat wmp-icon-repeat"
					v-on:click="store.dispatch(Actions.togglePlayList())"
					v-bind:class="{ active: mediaPlayer.repeatAll }"
					title="Repeat"></span> -->
			</div>
		</div>
	</div>
	<div class="au-header__progress"> </div>
</header>
	`,
});
