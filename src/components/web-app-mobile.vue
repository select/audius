<script>
import { mapState, mapMutations } from 'vuex';

import PlayList from './play-list.vue';
import WebHeader from './web-header.vue';

import MediaPlayer from './media-player.vue';

import AboutPlayer from './about-player.vue';

import PlayListManager from './play-list-manager.vue';

const Settings = () => import(/* webpackChunkName: "components/settings" */'./settings.vue');
const SearchResults = () => import(/* webpackChunkName: "components/search-results" */'./search-results.vue');
const MatrixRoomManager = () => import(/* webpackChunkName: "components/matrix-room-manager" */'./matrix-room-manager.vue');
const WebScraperManager = () => import(/* webpackChunkName: "components/web-scraper-manager" */'./web-scraper-manager.vue');
const Queue = () => import(/* webpackChunkName: "components/queue" */'./queue.vue');


export default {
	components: {
		WebHeader,
		PlayList,
		MediaPlayer,
		AboutPlayer,
		SearchResults,
		Queue,
		Settings,
		PlayListManager,
		MatrixRoomManager,
		WebScraperManager,
	},
	data() {
		return { queueActive: false };
	},
	created() {
		this.$store.watch(state => state.queueClickCount, () => {
			this.queueActive = true;
			setTimeout(() => {
				this.queueActive = false;
			}, 800);
		});
	},
	computed: mapState([
		'currentMedia',
		'search',
		'website',
		'leftMenuTab',
		'matrixEnabled',
		'mainRightTab',
		'queue',
	]),
	methods: {
		...mapMutations(['setMainRightTab', 'setLeftMenuTab']),
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
				v-on:click="setLeftMenuTab('matrix');setMainRightTab('');"
				v-bind:class="{ active: leftMenuTab == 'matrix' }">Rooms</li>
			<li
				v-on:click="setLeftMenuTab('webScraper');setMainRightTab('');"
				v-bind:class="{ active: leftMenuTab == 'webScraper' }">Channels</li>
			<li
				@click="setMainRightTab('queue')"
				v-bind:class="{ active: mainRightTab == 'queue' || queueActive }">
				Queue <span v-if="queue.length">({{queue.length}})</span>
			</li>
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
			<queue v-if="mainRightTab == 'queue'"></queue>
			<div class="audius-chat" v-show="mainRightTab == 'chat'"> </div>
			<settings v-if="mainRightTab == 'settings'"></settings>
			<play-list-manager v-show="leftMenuTab == 'playList'"></play-list-manager>
			<matrix-room-manager v-if="leftMenuTab == 'radio'"></matrix-room-manager>
			<web-scraper-manager v-if="leftMenuTab == 'tv'"></web-scraper-manager>
		</div>
		<media-player></media-player>
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
