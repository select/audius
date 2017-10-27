<script>
import Vue from 'vue';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import { store } from '../vuex/store';

import ProgressBar from './progress-bar.vue';
import { isElementInViewport, debounce } from '../utils';

export default {
	components: {
		ProgressBar,
	},
	created() {
		this.subscriptions = [
			this.$store.watch(state => state.website.showSearch, () => {
				if (this.website.showSearch) {
					Vue.nextTick(() => {
						document.querySelector('.au-header__search-input').focus();
					});
				}
			}),
		];
	},
	beforeDestroy() {
		this.subscriptions.forEach((unsubscribe) => { unsubscribe(); });
	},
	methods: {
		...mapMutations([
			'toggleSearch',
			'toggleLeftMenu',
			'setShowSettings',
			'previousVideo',
			'toggleShuffle',
			'toggleMute',
			'toggleRepeat',
			'playPause',
			'setShowMediaEdit',
		]),
		...mapActions([
			'nextVideo',
			'toggleFullscreen',
		]),
		searchInput: debounce(function(event) { store.dispatch('search', event.target.value); }, 500),
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
				this.$store.commit('toggleSearch', false);
				document.querySelector('.au-header__search-input').blur();
			}, 800);
		},
		scrollToCurrentSong() {
			const el = document.querySelector(`[data-id="${this.currentMedia.id}"]`);
			if (el) {
				if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
				el.classList.add('au--highlight');
				setTimeout(() => { el.classList.remove('au--highlight'); }, 1000);
			}
		},
	},
	computed: {
		...mapGetters([
			'currentTimeObj',
			'filteredPlayListLength',
			'sessionHistoryHasPrev',
		]),
		...mapState([
			'currentMedia',
			'website',
			'isPlaying',
			'shuffle',
			'mute',
			'repeat1',
			'repeatAll',
		]),
	},
};
</script>

<template lang="html">
	<header>
		<div class="au-header__search">
			<div>
				<img class="au-header__logo" src="img/audius.logo.white.svg" alt="Audius - ♫♪.ılılıll|̲̅̅●̲̅̅|̲̅̅=̲̅̅|̲̅̅●̲̅̅|llılılı.♫♪
 -">
				<i href="#audius-changelog"><i id="version">2.0.12</i></i>
			</div>
			<div class="au-header__search-controls">
				<div
					class="au-header__search-input-group"
					@click="toggleSearch()"
					v-bind:class="{ active: website.showSearch }">
					<span class="wmp-icon-search" title="[f] Search YouTube or URL"></span>
					<input
						type="text"
						class="au-header__search-input"
						aria-label="Search media"
						placeholder="Search"
						@click="stopPropagation"
						@input="searchInput"
						@keyup.esc="clear"
						@blur="delayBlur">
					<span class="wmp-icon-close" v-show="website.showSearch" @click="clear"></span>
				</div>
				<span
					class="wmp-icon-queue_music"
					title="Toggle playlist / matrix / web"
					@click="toggleLeftMenu()"></span>
				<span
					class="wmp-icon-more_vert"
					title="Settings"
					@click="setShowSettings"></span>
			</div>
		</div>
		<div class="au-header__control-bar">
			<div class="au-header__current-song">
				<div @click="scrollToCurrentSong" v-if="currentMedia.id">
					<div class="au-header__current-song-name">{{currentMedia.title}}</div>
					<div class="au-header__current-song-time" v-if="currentMedia.duration">
						<span v-if="currentTimeObj.h">{{currentTimeObj.h}}:</span>{{currentTimeObj.m}}:{{currentTimeObj.s}}
						/
						<span v-if="currentMedia.duration.h">{{currentMedia.duration.h}}:</span>{{currentMedia.duration.m}}:{{currentMedia.duration.s}}
					</div>
				</div>
				<span
					class="wmp-icon-share"
					v-if="currentMedia.id"
					title="Share"
					@click="setShowMediaEdit(currentMedia.id)"></span>
			</div>
			<div class="au-header__controls" :disabled="!filteredPlayListLength ">
				<span
					class="wmp-icon-previous"
					@click="previousVideo"
					title="Previous song"
					:disabled="!sessionHistoryHasPrev"></span>
				<div class="au-header__play-pause" @click="playPause">
					<span class="wmp-icon-pause" v-if="isPlaying" title="[c] Pause"></span>
					<span class="wmp-icon-play" v-else  title="[c] Play"></span>
				</div>
				<span class="wmp-icon-next" @click="nextVideo"  title="[b] Next song"></span>
				<div class="spacer"></div>
				<div class="au-header__controls-small">
					<span
						class="au-header__shuffle wmp-icon-shuffle"
						@click="toggleShuffle"
						v-bind:class="{ active: shuffle }"
						title="[s] Shuffle"></span>
					<div
						@click="toggleRepeat"
						class="au-header__repeat">
						<span
							v-if="repeat1"
							class="wmp-icon-repeat_one active"
							title="Repeat this song"></span>
						<span
							v-if="repeatAll"
							class="wmp-icon-repeat active"
							title="Repeat all songs in playlist"></span>
						<span
							v-if="!(repeat1 || repeatAll)"
							class="wmp-icon-repeat"
							title="Repeat"></span>
					</div>
					<div class="au-header__mute"
						title="Mute"
						v-bind:disabled="currentMedia.type == 'audio'"
						@click="toggleMute">
						<span class="wmp-icon-volume_up" v-if="!mute"></span>
						<span class="wmp-icon-volume_off" v-else></span>
					</div>
					<div>
						<span
							class="wmp-icon-fullscreen"
							@click="toggleFullscreen()"
							title="Fullscreen"></span>
					</div>
				</div>
			</div>
		</div>
		<progress-bar></progress-bar>
	</header>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

header
	width: 100%
	position: relative
.au-header__logo
	width: #{20*$grid-space}
.au-header__search
	padding-left: #{2*$grid-space}
	color: $color-white
	height: $touch-size-medium
	background: $color-pictonblue
	display: flex
	justify-content: space-between
	align-items: center
	h1
		font-weight: 100
		padding-left: #{2*$grid-space}
	a,a:visited
		display: inline-block
		text-decoration: none
		color: $color-white
		cursor: help

.au-header__control-bar
	display: flex
	justify-content: space-between
	padding: 0 #{2*$grid-space}
.au-header__current-song
	display: flex
	justify-content: center
	cursor: pointer
	flex-direction: row
	align-items: center
	> div
		flex-direction: column
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
			&::-webkit-input-placeholder
				color: $color-pictonblue
			&:-moz-placeholder
				color: $color-pictonblue
			&::-moz-placeholder
				color: $color-pictonblue
			// +placeholder
			// 	color: $color-pictonblue
	input
		color: $color-pictonblue
		background: transparent
		font-size: 1em
		width: 8em
		&::-webkit-input-placeholder
			color: $color-white
		&:-moz-placeholder
			color: $color-white
		&::-moz-placeholder
			color: $color-white
		// +placeholder
		// 	color: $color-white

.au-header__controls
	height: 9 * $grid-space
	display: flex
	justify-content: flex-end
	align-items: center
	&[disabled]
		span
			color: $color-athensgrey
			pointer-events: none
	span
		cursor: pointer
		&[disabled]
			color: $color-athensgrey
			pointer-events: none

	.spacer
		width: #{2*$grid-space}
	.au-header__play-pause
		height: $touch-size-medium
		span:before
			font-size: 2.5em

	.au-header__mute[disabled]
		color: $color-athensgrey
		pointer-events: none
	.au-header__controls-small
		display: flex
		align-items: center
		div
			height: $touch-size-medium
		span:before
			font-size: 1.5em

.au-header__shuffle,
.au-header__repeat
	color: $color-athensgrey
	&.active,
	.active
		color: $color-black
</style>
