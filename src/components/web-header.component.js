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
					document.querySelector('.wamp__search-input').focus();
				});
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
			console.log('cleeeear')
			event.stopPropagation();
			document.querySelector('.wamp__search-input').value = '';
		},
		searchYoutube: debounce((event) => {
			// store.dispatch(Actions.searchYoutube(event.target.value)); // should use this and middleware
			searchYoutube(event.target.value);
		}, 800),
	},
	template: `
<header>
	<div class="wamp__search">
		<h1>Audius</h1>
		<div class="wamp__search-controls">
			<div
				class="wamp__search-input-group"
				v-on:click="store.dispatch(Actions.toggleSearch())"
				v-bind:class="{ active: website.showSearch }">
				<span class="wmp-icon-search"></span>
				<input
					type="text"
					class="wamp__search-input"
					placeholder="Search"
					v-on:click="stopPropagation"
					v-on:keyup="searchYoutube"
					v-on:blur="store.dispatch(Actions.toggleSearch())"
					debounce="500">
				<span class="wmp-icon-close" v-show="website.showSearch" v-on:click="clear"></span>
			</div>
			<span class="wmp-icon-volume_up"></span>
			<span class="wmp-icon-more_vert"></span>
		</div>
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
			<span class="wamp__show-play-list wmp-icon-repeat"  v-on:click="store.dispatch(Actions.togglePlayList())" v-bind:class="{ active: mediaPlayer.showPlayList }"></span>
		</div>
	</div>
	<div class="wamp__progress"> </div>
</header>
	`,
});
