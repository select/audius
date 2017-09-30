<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import PlayList from './play-list.vue';
import WebHeader from './web-header.vue';

import YoutubePlayer from './youtube-player.vue';
import WebMediaPlayer from './web-media-player.vue';

import AboutPlayer from './about-player.vue';
import Queue from './queue.vue';

import PlayListManager from './play-list-manager.vue';

const Settings = () => import(/* webpackChunkName: "settings" */'./settings.vue');
const SearchResults = () => import(/* webpackChunkName: "search-results" */'./search-results.vue');
const MatrixRoomManager = () => import(/* webpackChunkName: "matrix-room-manager" */'./matrix-room-manager.vue');
const WebScraperManager = () => import(/* webpackChunkName: "web-scraper-manager" */'./web-scraper-manager.vue');


export default {
	components: {
		WebHeader,
		PlayList,
		YoutubePlayer,
		WebMediaPlayer,
		AboutPlayer,
		SearchResults,
		Queue,
		Settings,
		PlayListManager,
		MatrixRoomManager,
		WebScraperManager,
	},
	computed: mapState(['currentMedia', 'search', 'website', 'leftMenuTab', 'matrixEnabled', 'mainRightTab']),
	methods: {
		...mapMutations(['setMainRightTab', 'setLeftMenuTab']),
		...mapActions(['initMatrix']),
	},
};
</script>

<template>
<div class="web-app-mobile">
		<ul class="tabs">
			<li
				v-on:click="setLeftMenuTab(''); setMainRightTab('')"
				v-bind:class="{ active: !(mainRightTab || leftMenuTab) }"><span class="wmp-icon-queue_music"></span></li>
			<li
				v-on:click="setLeftMenuTab('playList');setMainRightTab('');"
				v-bind:class="{ active: leftMenuTab == 'playList' && mainRightTab != 'about' }">PlayList</li>
			<li
				v-on:click="setLeftMenuTab('radio');setMainRightTab('');"
				v-bind:class="{ active: leftMenuTab == 'radio' }">Matrix</li>
			<li
				v-on:click="setLeftMenuTab('tv');setMainRightTab('');"
				v-bind:class="{ active: leftMenuTab == 'tv' }">Web</li>
			<li
				v-on:click="setMainRightTab('queue');setLeftMenuTab('');"
				v-bind:class="{ active: mainRightTab == 'queue' }">Queue</li>
			<li
				v-if="search.results.length"
				v-on:click="setMainRightTab('search');setLeftMenuTab('');"
				v-bind:class="{ active: mainRightTab == 'search' }">Search</li>
			<li
				v-on:click="setMainRightTab('about');setLeftMenuTab('');"
				v-bind:class="{ active: mainRightTab == 'about' }">About</li>
			<li
				v-on:click="setMainRightTab('settings');setLeftMenuTab('');"
				v-bind:class="{ active: mainRightTab == 'settings' }"><span class="wmp-icon-more_vert"></span></li>
		</ul>
		<div class="web-app-mobile__playlist">
			<play-list v-show="!(mainRightTab || leftMenuTab)"></play-list>
			<about-player v-show="mainRightTab == 'about'"></about-player>
			<search-results v-if="mainRightTab == 'search'"></search-results>
			<queue v-show="mainRightTab == 'queue'"></queue>
			<div class="audius-chat" v-show="mainRightTab == 'chat'"> </div>
			<settings v-if="mainRightTab == 'settings'"></settings>
			<play-list-manager v-show="leftMenuTab == 'playList'"></play-list-manager>
			<matrix-room-manager v-if="leftMenuTab == 'radio'"></matrix-room-manager>
			<web-scraper-manager v-if="leftMenuTab == 'tv'"></web-scraper-manager>
		</div>
		<div class="web-app-mobile__players">
			<div class="web-app-mobile__yt" v-bind:class="{'web-app-mobile--hide-yt': currentMedia.type !== 'youtube'}">
				<youtube-player></youtube-player>
			</div>
			<web-media-player v-show="currentMedia.type !== 'youtube'"></web-media-player>
		</div>
		<web-header></web-header>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.web-app-mobile
	flex: 1
	display: flex
	flex-direction: column
	.tabs
		overflow-x: auto
		overflow-y: hidden
		li
			border-right: 1px solid $color-white
			flex: none
			padding: 0 $grid-space
			&:first-child
				flex: 1
			[class^="wmp-icon"]
				width: $touch-size-tiny
	.matrix-room
		color: $color-palesky
	.au-header__control-bar
		flex-direction: column
	.au-header__current-song
		font-size: 0.8em
		flex-direction: row
		max-height: 4 * $grid-space
		overflow: hidden
	.au-header__search
		height: $touch-size-small
		i
			display: none
	.au-header__controls
		height: 7 * $grid-space
	.au-header__logo
		width: 6rem
	.au-header__search-controls > span
		display: none
	.tabs
		height: $touch-size-small
	.media-list__main
		height: #{6 * $grid-space}
		overflow-y: hidden
		padding: .5em 0
	.media-list__duration
		font-size: 0.6rem
	.media-list__thumbnail
		width: 2.2em
		height: 2.2em
	.media-list__album-hint
		left: 2.8em
.web-app-mobile__players
	flex: 1
	overflow: hidden
	position: relative
	.web-app-mobile__yt
		height: 100%
		&.web-app-mobile--hide-yt
			height: 1%
.web-app-mobile__playlist
	flex: 2
	overflow: auto


</style>
