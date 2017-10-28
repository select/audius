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
		...mapState(['showLeftMenu', 'leftMenuTab']),
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
	<ul class="tabs">
		<li
			v-on:click="setLeftMenuTab('playList')"
			v-bind:class="{ active: leftMenuTab == 'playList' }">Playlist</li>
		<li
			v-on:click="setLeftMenuTab('matrix')"
			v-bind:class="{ active: leftMenuTab == 'matrix' }">Rooms</li>
		<li
			v-on:click="setLeftMenuTab('webScraper');"
			v-bind:class="{ active: leftMenuTab == 'webScraper' }">Channels</li>
	</ul>
	<div class="left-menu__wrapper">
		<play-list-manager v-show="leftMenuTab == 'playList'"></play-list-manager>
		<matrix-room-manager v-if="leftMenuTab == 'matrix'"></matrix-room-manager>
		<web-scraper-manager v-if="leftMenuTab == 'webScraper'"></web-scraper-manager>
	</div>
	<div
		class="left-menu__drag-handle"
		@mousedown="resizeStart"
		></div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'


.left-menu
	position: relative
	width: 25vw
	margin-left: 0
	transition: all $transition-time
	background: $color-aluminium-dark
	border-right: 1px solid $color-aluminium
	display: flex
	flex-direction: column
	&.hide
		margin-left: -24.5vw
		width: 25vw!important

.left-menu__wrapper
	height: 100%
	overflow-y: auto
	&::-webkit-scrollbar-thumb
	  background: $color-athensgrey
	&::-webkit-scrollbar-track
		background: $color-aluminium-dark

.left-menu__drag-handle
	width: $grid-space/2
	height: 100%
	position: absolute
	top: 0
	right: -$grid-space/4
	background: transparent
	cursor: ew-resize
	user-select: none


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
		color: $color-catskillwhite
		width: $touch-size-small
		height: $touch-size-small

.nav-handle__tab
	height: 2em
	width: 2.5em
	position: absolute
	top: 0.1em
	left: 0.2em
	transform: rotate(90deg) perspective(2em) rotateX(30deg)
	background: $color-aluminium-dark
	border-bottom: 0

.left-menu__tag-name-input
	height: $touch-size-extratiny
</style>



