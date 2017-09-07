<script>
import { mapMutations, mapState, mapActions } from 'vuex';

import PlayListManager from './play-list-manager.vue';

const MatrixRadioManager = () => import(/* webpackChunkName: "matrix-radio-manager" */'./matrix-radio-manager.vue');
const WebScraperManager = () => import(/* webpackChunkName: "web-scraper-manager" */'./web-scraper-manager.vue');


export default {
	components: {
		PlayListManager,
		MatrixRadioManager,
		WebScraperManager,
	},
	methods: {
		...mapMutations(['toggleLeftMenu', 'setLeftMenuTab']),
		...mapActions(['initMatrix']),
		resizeWidth(event) {
			const ww = (window.innerWidth || document.documentElement.clientWidth);
			const pos = Math.round((event.clientX / ww) * 100);
			if (pos > 5) this.$el.style.width = `${pos}vw`;
		},
	},
	computed: {
		...mapState(['showLeftMenu', 'leftMenuTab', 'matrixEnabled']),
	},
};
</script>

<template>
<div
	class="left-menu"
	v-bind:class="{ active: showLeftMenu }">
	<div class="nav-handle" title="Playlists" @click="toggleLeftMenu()">
		<div class="nav-handle__tab"></div>
		<span class="wmp-icon-queue_music"></span>
	</div>
	<ul class="tabs">
		<li
			v-on:click="setLeftMenuTab('playList')"
			v-bind:class="{ active: leftMenuTab == 'playList' }">Playlist</li>
		<li
			v-if="matrixEnabled"
			v-on:click="setLeftMenuTab('radio');initMatrix()"
			v-bind:class="{ active: leftMenuTab == 'radio' }">Matrix</li>
		<li
			v-on:click="setLeftMenuTab('tv');"
			v-bind:class="{ active: leftMenuTab == 'tv' }">Web</li>
	</ul>
	<div class="left-menu__wrapper">
		<play-list-manager v-show="leftMenuTab == 'playList'"></play-list-manager>
		<matrix-radio-manager v-if="leftMenuTab == 'radio'"></matrix-radio-manager>
		<web-scraper-manager v-if="leftMenuTab == 'tv'"></web-scraper-manager>
	</div>
	<div
		class="left-menu__drag-handle"
		draggable="true"
		@drag="resizeWidth"
		></div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'


.left-menu
	position: relative
	width: 25vw
	margin-left: -24.5vw
	transition: all $transition-time
	background: $color-aluminium-dark
	border-right: 1px solid $color-aluminium
	display: flex
	flex-direction: column
	&.active
		margin-left: 0

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
	background: $color-aluminium
	border-bottom: 0
.left-menu__tag-name-input
	height: $touch-size-extratiny
</style>



