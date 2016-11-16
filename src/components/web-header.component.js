import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import './web-header.component.sass';
import { debounce } from '../utils/debounce';
import searchYoutube from '../utils/searchYoutube';
import { s2time, time2s } from '../utils/timeConverter';

Vue.component('web-header', {
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
			website: store.getState().website,
			currentMedia: store.getState().mediaPlayer.currentMedia,
			store,
			Actions,
		};
	},
	created() {
		document.addEventListener('keydown', (event) => {
			if (event.target.tagName.toLowerCase() !== 'input') {
				if (event.key === 'c' && !event.ctrlKey) {
					this.playPauseMedia();
				} else if (event.key === 'f' && !event.ctrlKey) {
					store.dispatch(Actions.toggleSearch(true));
					setTimeout(() => { document.querySelector('.au-header__search-input').value = ''; }, 100);
				} else if (event.key === 'b') {
					store.dispatch(Actions.nextVideo());
				} else if (event.key === 's') {
					store.dispatch(Actions.toggleShuffle());
				} else if (event.key === 'm') {
					store.dispatch(Actions.toggleMute());
				}
			}
		}, false);

		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
			this.website = store.getState().website;
			if (this.website.showSearch) {
				Vue.nextTick(() => {
					document.querySelector('.au-header__search-input').focus();
				});
			}
			if (this.mediaPlayer.mediaId) {
				this.currentMedia = this.mediaPlayer.currentMedia;
				this.currentMedia.durationS = time2s(this.currentMedia.duration);
			}
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		playPauseMedia() {
			if (this.mediaPlayer.isPlaying) store.dispatch(Actions.pause());
			else if (this.mediaPlayer.playList.length) store.dispatch(Actions.play());
		},
		stopPropagation(event) {
			if (this.website.showSearch) event.stopPropagation();
		},
		clear(event) {
			clearTimeout(this.blurTimer);
			event.stopPropagation();
			document.querySelector('.au-header__search-input').value = '';
			document.querySelector('.au-header__search-input').focus();
		},
		delayBlur() {
			this.blurTimer = setTimeout(() => {
				store.dispatch(Actions.toggleSearch(false));
			}, 800);
		},
		searchYoutube: debounce((event) => {
			// store.dispatch(Actions.searchYoutube(event.target.value)); // should use this and middleware
			searchYoutube(event.target.value);
		}, 500),
		skipToTime(event) {
			if (this.currentMedia) {
				store.dispatch(
					Actions.skipToTime(
						this.currentMedia.durationS * (event.offsetX / event.currentTarget.offsetWidth)
					)
				);
			}
		},
	},
	computed: {
		currentTimeObj() {
			return s2time(this.mediaPlayer.currentTime);
		},
		progressWidth() {
			if (!this.currentMedia) return 0;
			return (this.mediaPlayer.currentTime / this.currentMedia.durationS) * 100;
		},
	},
	template: `
<header>
	<div class="au-header__search">
		<img class="au-header__logo" src="img/audius.logo.white.svg" alt="Audius - music player - logo">
		<div class="au-header__search-controls">
			<div
				class="au-header__search-input-group"
				v-on:click="store.dispatch(Actions.toggleSearch())"
				v-bind:class="{ active: website.showSearch }">
				<span class="wmp-icon-search" title="[f] Search on YouTube"></span>
				<input
					type="text"
					class="au-header__search-input"
					placeholder="Search"
					v-on:click="stopPropagation"
					v-on:keyup="searchYoutube"
					v-on:keyup.esc="clear"
					v-on:blur="delayBlur"
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
			<div class="au-header__current-song-name" v-if="currentMedia">{{currentMedia.title}}</div>
			<div class="au-header__current-song-time" v-if="currentMedia && currentMedia.duration"> {{currentTimeObj.m}}:{{currentTimeObj.s}} / {{currentMedia.duration.m}}:{{currentMedia.duration.s}} </div>
		</div>
		<div class="au-header__controls" :disabled="!mediaPlayer.playList.length">
			<span class="wmp-icon-previous" v-on:click="store.dispatch(Actions.previousVideo())" title="Previous song"></span>
			<div class="au-header__play-pause" v-on:click="playPauseMedia">
				<span class="wmp-icon-pause" v-if="mediaPlayer.isPlaying" title="[c] Pause"></span>
				<span class="wmp-icon-play" v-else  title="[c] Play"></span>
			</div>
			<span class="wmp-icon-next" v-on:click="store.dispatch(Actions.nextVideo())"  title="[b] Next song"></span>
			<div class="spacer"></div>
			<div class="au-header__controls-small">
				<span
					class="au-header__shuffle wmp-icon-shuffle"
					v-on:click="store.dispatch(Actions.toggleShuffle())"
					v-bind:class="{ active: mediaPlayer.shuffle }"
					title="[s] Shuffle"></span>
				<!-- <span
					class="au-header__repeat wmp-icon-repeat"
					v-on:click="store.dispatch(Actions.togglePlayList())"
					v-bind:class="{ active: mediaPlayer.repeatAll }"
					title="Repeat"></span> -->
			</div>
		</div>
	</div>
	<div class="au-header__progress" v-on:click="skipToTime">
		<div
			v-if="currentMedia"
			v-bind:style="{ width: progressWidth + '%' }"
			class="au-header__progress-current"></div>
	</div>
</header>
	`,
});
