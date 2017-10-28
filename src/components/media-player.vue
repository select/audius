<script >
import { mapMutations, mapActions, mapState } from 'vuex';
import ProgressBar from './progress-bar.vue';
import { debounce } from '../utils';

const WebMediaPlayer = () => import(/* webpackChunkName: "components/web-media-player" */'./web-media-player.vue');
const YoutubePlayer = () => import(/* webpackChunkName: "components/youtube-player" */'./youtube-player.vue');
const VimeoPlayer = () => import(/* webpackChunkName: "components/vimeo-player" */'./vimeo-player.vue');

export default {
	name: 'main-right',
	components: {
		YoutubePlayer,
		VimeoPlayer,
		WebMediaPlayer,
		ProgressBar,
	},
	computed: mapState([
		'currentMedia',
		'fullscreen',
	]),
	data() {
		return {
			showYoutube: false,
			showVimeo: false,
			showControls: false,
		};
	},
	created() {
		this.unsubscribe = this.$store.watch(state => state.currentMedia, () => {
			if (this.currentMedia.type === 'youtube') this.showYoutube = true;
			if (this.currentMedia.type === 'vimeo') this.showVimeo = true;
			if (this.showYoutube && this.showVimeo) this.unsubscribe();
		});
	},
	mounted() {
		this.$el.addEventListener('mousemove', () => {
			this.showControls = true;
		});
		this.$el.addEventListener('mousemove', debounce(() => {
			this.showControls = false;
		}, 2000));
		this.$store.watch(state => state.currentMedia, () => {
			this.showControls = true;
			setTimeout(() => { this.showControls = false; }, 2000);
		});
	},
	methods: {
		...mapMutations([
			'previousVideo',
			'playPause',
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
		@click="playPause"
		v-bind:class="{
			fullscreen
		}">
		<div :class="{'media-player--hide': !showControls}">
			<div class="media-player__prev" title="Previous" @click.stop="previousVideo">
				<span class="wmp-icon-previous"></span>
			</div>
			<div class="media-player__next" title="[b] Next" @click.stop="nextVideo">
				<span class="wmp-icon-next"></span>
			</div>
		</div>
		<img
			:class="{'media-player--hide': !showControls}"
			class="media-player__logo"
			v-if="fullscreen"
			@click.stop="toggleFullscreen()"
			src="img/audius.logo.white.svg" alt="Audius - music player - logo">
		<span
			:class="{
				'wmp-icon-fullscreen': !fullscreen,
				'wmp-icon-fullscreen_exit': fullscreen,
				'media-player--hide': !showControls,
			}"
			@click.stop="toggleFullscreen()"
			title="Fullscreen"></span>
		<div
			:class="{'media-player--hide': !showControls || currentMedia.type === 'youtube'}"
			class="media-player__header">{{currentMedia.title}}</div>
		<div
			class="media-player__yt-player"
			v-bind:class="{'media-player--hide-yt-player': currentMedia.type !== 'youtube'}">
			<youtube-player v-if="showYoutube"></youtube-player>
		</div>
		<div
			class="media-player__yt-player"
			v-bind:class="{'media-player--hide-yt-player': currentMedia.type !== 'vimeo'}">
			<vimeo-player v-if="showVimeo"></vimeo-player>
		</div>
		<web-media-player v-if="['audio', 'video'].includes(currentMedia.type)"></web-media-player>
		<progress-bar></progress-bar>
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
	background: $color-black
	&.fullscreen
		position: fixed
		top: 0
		left: 0
		width: 100%
		height: 100%!important
		z-index: 1
	[class^="wmp-icon-fullscreen"]
		position: absolute
		bottom: 1.5 * $grid-space
		right: 1.5 * $grid-space
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
	height: 60%
	top: 20%
	width: 12%
	display: flex
	justify-content: center
	align-items: center
	font-size: 2rem
	color: $color-catskillwhite
	cursor: pointer
.media-player__next
	right: 0
</style>
