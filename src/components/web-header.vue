<script>
import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import { debounce } from '../utils/debounce';
import searchYoutubeUtil from '../utils/searchYoutube';
import { s2time, time2s } from '../utils/timeConverter';
import isElementInViewport from '../utils/isElementInViewport';

export default {
	name: 'web-header',
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
				document.querySelector('.au-header__search-input').blur();
			}, 800);
		},
		searchYoutube: debounce((event) => {
			searchYoutubeUtil(event.target.value);
		}, 300),
		skipToTime(event) {
			if (this.currentMedia) {
				store.dispatch(
					Actions.skipToTime(
						this.currentMedia.durationS * (event.offsetX / event.currentTarget.offsetWidth)
					)
				);
			}
		},
		scrollToCurrentSong() {
			const el = document.querySelector(`[data-id="${this.currentMedia.id}"]`);
			if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
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
		playList() {
			if (this.mediaPlayer.currentPlayList) return this.mediaPlayer.tags[this.mediaPlayer.currentPlayList];
			return this.mediaPlayer.playList;
		},
	},
};
</script>

<template lang="html">
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
						v-on:blur="delayBlur">
					<span class="wmp-icon-close" v-show="website.showSearch" v-on:click="clear"></span>
				</div>
				<span
					class="wmp-icon-queue_music"
					title="Toggle playlists"
					v-on:click="store.dispatch(Actions.togglePlayLists())"></span>
				<span
					class="wmp-icon-more_vert"
					title="Show settings"
					v-on:click="store.dispatch(Actions.showSettings())"></span>
			</div>
		</div>
		<div class="au-header__control-bar">
			<div
				class="au-header__current-song"
				v-on:click="scrollToCurrentSong">
				<div class="au-header__current-song-name" v-if="currentMedia">{{currentMedia.title}}</div>
				<div class="au-header__current-song-time" v-if="currentMedia && currentMedia.duration">
					{{currentTimeObj.m}}:{{currentTimeObj.s}} / {{currentMedia.duration.m}}:{{currentMedia.duration.s}}
				</div>
			</div>
			<div class="au-header__controls" :disabled="!playList.length">
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
					<div v-on:click="store.dispatch(Actions.toggleMute())">
						<span class="wmp-icon-volume_up" v-if="!mediaPlayer.mute"></span>
						<span class="wmp-icon-volume_off" v-else></span>
					</div>
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
</template>



<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

header
	width: 100%
.au-header__logo
	width: #{20*$grid-space}
	margin-left: #{2*$grid-space}
.au-header__search
	color: $color-white
	height: $touch-size-medium
	background: $color-pictonblue
	display: flex
	justify-content: space-between
	align-items: center
	h1
		font-weight: 100
		padding-left: #{2*$grid-space}
.au-header__control-bar
	display: flex
	justify-content: space-between
	padding: 0 #{2*$grid-space}
.au-header__current-song
	display: flex
	flex-direction: column
	justify-content: center
	cursor: pointer
	.au-header__current-song-name
		font-size: 1.1em
		// font-weight: bold
	.au-header__current-song-time
		color: $color-aluminium-dark
.au-header__search-controls
	display: flex
	align-items: center
	[class^='wmp-icon-']
		cursor: pointer
.au-header__search-input-group
	height: $touch-size-small
	display: flex
	align-items: center
	transition: all $transition-time
	border-radius: $border-radius
	background: rgba(255, 255, 255, 0.3)
	margin-right: $grid-space
	&.active
		background: $color-white
		color: $color-pictonblue
		// width: inherit
		input
			width: 18em
			+placeholder
				color: $color-pictonblue
	input
		color: $color-pictonblue
		background: transparent
		font-size: 1em
		border: 0
		width: 8em
		+placeholder
			color: $color-white

.au-header__controls
	height: $touch-size-large
	display: flex
	justify-content: flex-end
	align-items: center
	&[disabled]
		span
			color: $color-athensgrey
			pointer-events: none
	span
		cursor: pointer
	.spacer
		width: #{2*$grid-space}
	.au-header__play-pause
		height: $touch-size-medium
		span:before
			font-size: 2.5em
	.au-header__controls-small
		display: flex
		align-items: center
		div
			height: $touch-size-medium
		span:before
			font-size: 1.5em
.au-header__progress
	width: 100%
	height: 4px
	background: $color-aluminium
	transition: all $transition-time
	cursor: pointer
	&:hover
		.au-header__progress-current
			&:after
				content: ''
				width: 10px
				height: 10px
				border-radius: 50%
				position: absolute
				top: -3px
				right: -3px
				background: $color-pictonblue

	.au-header__progress-current
		position: relative
		background: $color-pictonblue
		height: 100%

.au-header__shuffle,
.au-header__repeat
	color: $color-athensgrey
	&.active
		color: $color-pictonblue
</style>
