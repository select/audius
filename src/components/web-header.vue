<script>
import Vue from 'vue';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

import { isElementInViewport } from '../utils';

export default {
	created() {
		this.dragLimitElement = {};
		this.subscriptions = [
			this.$store.watch(state => state.website.showSearch, () => {
				if (this.website.showSearch) {
					Vue.nextTick(() => {
						document.querySelector('.au-header__search-input').focus();
					});
				}
			}),
			// if media changed, set new media in player
			this.$store.watch(state => state.currentMedia, () => {
				if (this.currentMedia.start) {
					this.limitEls.start.style.left = `${this.currentMedia.start / this.currentMedia.durationS * 100}%`;
				} else this.limitEls.start.style.left = '0%';
				if (this.currentMedia.stop) {
					this.limitEls.stop.style.right = `${100 - this.currentMedia.stop / this.currentMedia.durationS * 100}%`;
				} else this.limitEls.stop.style.right = '0%';
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
			'nextVideo',
			'toggleShuffle',
			'toggleMute',
			'playPause',
			'setStartStopMarker',
		]),
		...mapActions(['search']),
		searchInput(event) {
			if (event.key.length === 1 || event.key === 'Backspace') {
				this.search(event.target.value);
			}
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
				this.$store.commit('toggleSearch', false);
				document.querySelector('.au-header__search-input').blur();
			}, 800);
		},
		skipToTime(event) {
			if (this.currentMedia.id) {
				this.$store.commit(
					'skipToTime',
					this.currentMedia.durationS * (event.clientX / event.currentTarget.offsetWidth)
				);
			}
		},
		scrollToCurrentSong() {
			const el = document.querySelector(`[data-id="${this.currentMedia.id}"]`);
			if (el) {
				if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
				el.classList.add('au--highlight');
				setTimeout(() => { el.classList.remove('au--highlight'); }, 1000);
			}
		},
		onDragStart(event) {
			event.dataTransfer.setDragImage(this.dragImg, 0, 0);
		},
		moveLimit(event, elName) {
			let pos = Math.round(event.clientX / this.progressPos.xMax * 100);
			if (pos > 100) pos = 100;
			else if (pos < 0) pos = 0;
			if (
				(elName === 'start' && pos < this.limitPos.stop)
				|| (elName === 'stop' && this.limitPos.start < pos)
			) {
				if (elName === 'start') this.limitEls[elName].style.left = `${pos}%`;
				else this.limitEls[elName].style.right = `${100 - pos}%`;
			}
		},
		dropLimit(event, elName) {
			let pos = Math.round(event.clientX / this.progressPos.xMax * 100);
			if (
				(elName === 'start' && pos < this.limitPos.stop)
				|| (elName === 'stop' && this.limitPos.start < pos)
			) {
				if (this.currentMedia.id) {
					this.setStartStopMarker({
						type: elName,
						seconds: Math.round(this.currentMedia.durationS * (pos/100)),
					});
				}
				if (pos > 100) pos = 100;
				else if (pos < 0) pos = 0;
				this.limitPos[elName] = pos;
				if (elName === 'start') this.limitEls[elName].style.left = `${pos}%`;
				else this.limitEls[elName].style.right = `${100 - pos}%`;
			}
		},
	},
	computed: {
		...mapGetters(['currentTimeObj', 'playList', 'progressWidth', 'sessionHistoryHasPrev']),
		...mapState(['currentTime', 'currentMedia', 'website', 'isPlaying', 'shuffle', 'mute']),
	},
	mounted() {
		this.dragImg = document.createElement('img');
		this.limitEls = {
			start: document.querySelector('.au-header__progress-limit-start'),
			stop: document.querySelector('.au-header__progress-limit-stop'),
		};
		const progressEl = document.querySelector('.au-header__progress');
		const rect = progressEl.getBoundingClientRect();
		this.progressPos = {
			x: rect.left,
			xMax: rect.right,
		};
		this.limitPos = { start: 0, stop: rect.right };

		const mouseEl = document.querySelector('.au-header__progress-mouse');
		progressEl.addEventListener('mousemove', (event) => {
			mouseEl.style.left = `${event.clientX - this.progressPos.x}px`;
		}, false);
	},
};
</script>

<template lang="html">
	<header>
		<div class="au-header__search">
			<div>
				<img class="au-header__logo" src="img/audius.logo.white.svg" alt="Audius - music player - logo">
				<i>2.0.3</i>
			</div>
			<div class="au-header__search-controls">
				<div
					class="au-header__search-input-group"
					@click="toggleSearch()"
					v-bind:class="{ active: website.showSearch }">
					<span class="wmp-icon-search" title="[f] Search on YouTube"></span>
					<input
						type="text"
						class="au-header__search-input"
						placeholder="Search"
						@click="stopPropagation"
						v-on:keyup="searchInput"
						v-on:keyup.esc="clear"
						v-on:blur="delayBlur">
					<span class="wmp-icon-close" v-show="website.showSearch" @click="clear"></span>
				</div>
				<span
					class="wmp-icon-queue_music"
					title="Toggle playlists"
					@click="toggleLeftMenu"></span>
				<span
					class="wmp-icon-more_vert"
					title="Show settings"
					@click="setShowSettings"></span>
			</div>
		</div>
		<div class="au-header__control-bar">
			<div
				class="au-header__current-song"
				@click="scrollToCurrentSong">
				<div class="au-header__current-song-name" v-if="currentMedia">{{currentMedia.title}}</div>
				<div class="au-header__current-song-time" v-if="currentMedia && currentMedia.duration">
					<span v-if="currentTimeObj.h">{{currentTimeObj.h}}:</span>{{currentTimeObj.m}}:{{currentTimeObj.s}}
					/
					<span v-if="currentMedia.duration.h">{{currentMedia.duration.h}}:</span>{{currentMedia.duration.m}}:{{currentMedia.duration.s}}
				</div>
			</div>
			<div class="au-header__controls" :disabled="!playList.length ">
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
					<div class="au-header__mute"
						v-bind:disabled="currentMedia.type == 'audio'"
						@click="toggleMute">
						<span class="wmp-icon-volume_up" v-if="!mute"></span>
						<span class="wmp-icon-volume_off" v-else></span>
					</div>
					<!-- <span
						class="au-header__repeat wmp-icon-repeat"
						@click="store.dispatch(Actions.togglePlayList())"
						v-bind:class="{ active: mediaPlayer.repeatAll }"
						title="Repeat"></span> -->
				</div>
			</div>
		</div>
		<div class="au-header__progress" @click="skipToTime">

			<div class="au-header__progress-inner">
				<div
					v-if="currentMedia.id"
					v-bind:style="{ width: progressWidth + '%' }"
					class="au-header__progress-current"></div>
			</div>
			<div class="au-header__progress-mouse"></div>
			<div
				draggable="true"
				title="drag start limit"
				v-on:dragstart="onDragStart"
				v-on:drag="moveLimit($event, 'start')"
				v-on:dragend="dropLimit($event, 'start')"
				class="au-header__progress-limit-start"></div>
			<div
				draggable="true"
				title="drag stop limit"
				v-on:dragstart="onDragStart"
				v-on:drag="moveLimit($event, 'stop')"
				v-on:dragend="dropLimit($event, 'stop')"
				class="au-header__progress-limit-stop"></div>
		</div>
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
		border: 0
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
.au-header__progress
	position: absolute
	z-index: 1
	bottom: 0
	width: 100%
	height: 2*$grid-space
	transition: all $transition-time
	cursor: pointer
	background: transparent
	display: flex
	&:hover
		.au-header__progress-mouse,
		.au-header__progress-limit-stop,
		.au-header__progress-limit-start
			display: block
		.au-header__progress-current
			&:after
				content: ''
				width: #{2 * $grid-space}
				height: #{2 * $grid-space}
				border-radius: 50%
				position: absolute
				bottom: -$grid-space*0.7
				right: -3px
				background: $color-pictonblue
.au-header__progress-inner
	position: absolute
	bottom: 0
	width: 100%
	height: $grid-space/2
	background: $color-aluminium

.au-header__progress-current
	position: relative
	background: $color-pictonblue
	height: 100%
	height: $grid-space/2


.au-header__progress-mouse
	display: none
	width: $grid-space
	height: $grid-space
	background: $color-clementine
	position: absolute
	bottom: -$grid-space*0.2
	border-radius: 50%

.au-header__progress-limit-stop,
.au-header__progress-limit-start
	display: none
	position: absolute
	bottom: 0
	width: 3*$grid-space
	height: 3*$grid-space
	border: 2px solid $color-aluminium-dark
	border-top-color: transparent
	cursor: ew-resize
	&:hover

		border-color: $color-clementine
		border-top-color: transparent

.au-header__progress-limit-start.au-header__progress-limit-start
	left: 0
	border-right-color: transparent

.au-header__progress-limit-stop.au-header__progress-limit-stop
	right: 0
	border-left-color: transparent

.au-header__shuffle,
.au-header__repeat
	color: $color-athensgrey
	&.active
		color: $color-pictonblue
</style>
