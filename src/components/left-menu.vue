<script>
import { mapMutations, mapState } from 'vuex';

import PlayListManager from './play-list-manager.vue';

const MatrixRoomManager = () => import(/* webpackChunkName: "components/matrix-room-manager" */'./matrix-room-manager.vue');
const WebScraperManager = () => import(/* webpackChunkName: "components/web-scraper-manager" */'./web-scraper-manager.vue');

function disableSelect(event) {
	event.preventDefault();
}

export default {
	components: {
		PlayListManager,
		MatrixRoomManager,
		WebScraperManager,
	},
	mounted() {
		document.addEventListener('mouseup', () => {
			this.resize = false;
			window.removeEventListener('selectstart', disableSelect);
		});
		const ww = (window.innerWidth || document.documentElement.clientWidth);
		document.addEventListener('mousemove', (event) => {
			if (this.resize) {
				const pos = Math.round((event.clientX / ww) * 100);
				if (pos > 5) this.$el.style.width = `${pos}vw`;
			}
		});
	},
	methods: {
		...mapMutations(['toggleLeftMenu', 'setLeftMenuTab']),
		resizeStart(event) {
			event.preventDefault();
			this.resize = true;
			window.addEventListener('selectstart', disableSelect);
		},
	},
	computed: {
		...mapState(['showLeftMenu']),
	},
};
</script>

<template>
<div
	class="left-menu"
	v-bind:class="{ hide: !showLeftMenu }">
	<div class="nav-handle" title="Playlists" @click="toggleLeftMenu()">
		<div class="nav-handle__tab"></div>
		<span class="wmp-icon-queue_music"></span>
	</div>
	<div class="tabs">
		<a
			v-for="tabName in ['playlists', 'rooms', 'channels']"
			:href="'#lm-'+tabName"
			v-bind:class="{ active: tabName == 'playList' }">{{tabName}}</a>
	</div>
	<div class="left-menu__wrapper">
		<h2 id="lm-playlists">Playlists</h2>
		<play-list-manager></play-list-manager>
		<div class="left-menu__spacer"></div>
		<h2 id="lm-rooms">Rooms</h2>
		<matrix-room-manager></matrix-room-manager>
		<div class="left-menu__spacer"></div>
		<h2 id="lm-channels">Channels</h2>
		<web-scraper-manager></web-scraper-manager>
		<div class="left-menu__spacer"></div>
	</div>
	<div
		class="left-menu__drag-handle"
		@mousedown="resizeStart"
		></div>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'


.left-menu
	display: flex
	position: relative
	flex-direction: column
	width: 25vw
	margin-left: 0
	transition: all $transition-time
	border-right: 1px solid $color-aluminium
	background: $color-aluminium-dark
	&.hide
		width: 25vw!important
		margin-left: -24.5vw
	h2
		margin-left: $grid-space
		color: $color-palesky
		font-size: 1.1rem

.left-menu__wrapper
	height: 100%
	overflow-y: auto
	&::-webkit-scrollbar-thumb
	  background: $color-athensgrey
	&::-webkit-scrollbar-track
		background: $color-aluminium-dark

.left-menu__drag-handle
	position: absolute
	top: 0
	right: -$grid-space/4
	width: $grid-space/2
	height: 100%
	background: transparent
	cursor: ew-resize
	user-select: none

.left-menu__spacer
	height: $touch-size-medium

.nav-handle
	position: absolute
	top: calc(50% - #{$touch-size-small/2})
	right: -2em
	cursor: pointer
	z-index: 1
	&:hover
		span
			color: $color-aluminium-dark
		.nav-handle__tab
			background: $color-catskillwhite

	span
		width: $touch-size-small
		height: $touch-size-small
		color: $color-catskillwhite

.nav-handle__tab
	position: absolute
	top: 0.1em
	left: 0.2em
	width: 2.5em
	height: 2em
	transform: rotate(90deg) perspective(2em) rotateX(30deg)
	border-bottom: 0
	background: $color-aluminium-dark

.left-menu__tag-name-input
	height: $touch-size-extratiny
</style>



