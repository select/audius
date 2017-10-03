<script >
import { mapMutations, mapActions, mapState } from 'vuex';
import YoutubePlayer from './youtube-player.vue';
import VimeoPlayer from './vimeo-player.vue';
import WebMediaPlayer from './web-media-player.vue';
import { debounce } from '../utils';


export default {
	name: 'main-right',
	components: {
		YoutubePlayer,
		VimeoPlayer,
		WebMediaPlayer,
	},
	computed: mapState([
		'currentMedia',
		'currentWebScraper',
		'currentMatrixRoom',
		'fullscreen',
	]),
	data() {
		return { showControls: false };
	},
	mounted() {
		this.$el.addEventListener('mousemove', () => {
			this.showControls = true;
		});
		this.$el.addEventListener('mousemove', debounce(() => {
			this.showControls = false;
		}, 2000));
	},
	methods: {
		...mapMutations([
			'previousVideo',
		]),
		...mapActions([
			'toggleFullscreen',
			'nextVideo',
		]),
	},
};
</script>

<template>
	<div
		class="media-player"
		v-bind:class="{
			fullscreen
		}">
		<div :class="{'media-player--hide': !showControls}">
			<div class="media-player__prev" @click="previousVideo">‹</div>
			<div class="media-player__next" @click="nextVideo">›</div>
		</div>
		<img
			class="media-player__logo"
			v-if="fullscreen"
			@click="toggleFullscreen()"
			src="img/audius.logo.white.svg" alt="Audius - music player - logo">
		<span
			:class="{
				'wmp-icon-fullscreen': !fullscreen,
				'wmp-icon-fullscreen_exit': fullscreen,
				'media-player--hide': !showControls,
			}"
			@click="toggleFullscreen()"
			title="Fullscreen"></span>
		<div :class="{'media-player--hide': !showControls}" class="media-player__header">{{currentMedia.title}}</div>
		<div
			class="media-player__yt-player"
			v-bind:class="{'media-player--hide-yt-player': currentMedia.type !== 'youtube'}">
			<youtube-player></youtube-player>
		</div>
		<div
			class="media-player__yt-player"
			v-bind:class="{'media-player--hide-yt-player': currentMedia.type !== 'vimeo'}">
			<vimeo-player></vimeo-player>
		</div>
		<web-media-player v-show="!['youtube', 'vimeo'].includes(currentMedia.type)"></web-media-player>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.media-player
	height: 33%
	overflow: hidden
	border-top: 1px solid $color-aluminium
	position: relative
	background: $color-catskillwhite
	&.fullscreen
		position: fixed
		top: 0
		left: 0
		width: 100%
		height: 100%!important
		z-index: 1
	[class^="wmp-icon-fullscreen"]
		position: absolute
		bottom: 0
		right: 0
		color: $color-white
		z-index: 12
		cursor: pointer
		transition: all $transition-time
		opacity: 1
.media-player--hide.media-player--hide
	opacity: 0
.media-player__logo
	position: absolute
	top: #{5 * $grid-space}
	right: #{2 * $grid-space}
	cursor: pointer
	height: 1.1rem
	z-index: 13
.media-player__header
	position: absolute
	width: 80%
	left: 10%
	padding-top: #{2 * $grid-space}
	text-align: center
	// background: $color-overlay
	// box-shadow: inset 0px 0px 40px 40px #DBA632;
	color: $color-white
	opacity: 1
	z-index: 12
.media-player__yt-player
	height: 100%
	&.media-player--hide-yt-player
		height: 1%
span.media-player__full-btn
	position: absolute
	top: 0
	right: 0
	cursor: pointer
	color: $color-white
	z-index: 13
.media-player__prev,
.media-player__next
	transition: all $transition-time
	opacity: 1
	position: absolute
	z-index: 12
	height: 80%
	top: 10%
	width: 2*$touch-size-medium
	display: flex
	justify-content: center
	align-items: center
	font-size: 3rem
	color: $color-catskillwhite
	cursor: pointer
.media-player__next
	right: 0
</style>