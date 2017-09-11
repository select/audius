<script >
import { mapMutations, mapState } from 'vuex';
import AboutPlayer from './about-player.vue';
import Queue from './queue.vue';
import YoutubePlayer from './youtube-player.vue';
import VimeoPlayer from './vimeo-player.vue';
import WebMediaPlayer from './web-media-player.vue';

const Settings = () => import(/* webpackChunkName: "settings" */'./settings.vue');
const SearchResults = () => import(/* webpackChunkName: "search-results" */'./search-results.vue');
const WebScraperSettings = () => import(/* webpackChunkName: "web-scraper-settings" */'./web-scraper-settings.vue');

export default {
	name: 'main-right',
	components: {
		AboutPlayer,
		SearchResults,
		Queue,
		Settings,
		YoutubePlayer,
		VimeoPlayer,
		WebMediaPlayer,
		WebScraperSettings,
	},
	computed: mapState([
		'website',
		'mainRightTab',
		'search',
		'showSettings',
		'showWebScraperSettings',
		'currentMedia',
		'currentWebScraper',
	]),
	methods: mapMutations(['setMainRightTab']),
};
</script>

<template>
<div class="main-right">
	<ul class="tabs">
		<li
			v-on:click="setMainRightTab('queue')"
			v-bind:class="{ active: mainRightTab == 'queue' }">Queue</li>
		<li
			v-if="search.results.length"
			v-on:click="setMainRightTab('search')"
			v-bind:class="{ active: mainRightTab == 'search' }">Search</li>
		<li
			v-on:click="setMainRightTab('about')"
			v-bind:class="{ active: mainRightTab == 'about' }">About</li>
		<li
			v-if="website.showChat"
			v-on:click="setMainRightTab('chat')"
			v-bind:class="{ active: mainRightTab == 'chat' }">Chat</li>
		<li
			v-if="showWebScraperSettings && currentWebScraper"
			v-on:click="setMainRightTab('webScraperSettings')"
			v-bind:class="{ active: mainRightTab == 'webScraperSettings' }">TV Settings</li>
		<li
			v-if="showSettings"
			v-on:click="setMainRightTab('settings')"
			v-bind:class="{ active: mainRightTab == 'settings' }">Settings</li>
	</ul>
	<div class="main-right__content" v-show="mainRightTab">
		<about-player v-show="mainRightTab == 'about'"></about-player>
		<search-results v-if="mainRightTab == 'search'"></search-results>
		<queue v-show="mainRightTab == 'queue'"></queue>
		<div class="audius-chat" v-show="mainRightTab == 'chat'"> </div>
		<web-scraper-settings v-if="mainRightTab == 'webScraperSettings'"></web-scraper-settings>
		<settings v-if="mainRightTab == 'settings'"></settings>
	</div>
	<div
		class="main-right__player"
		v-bind:class="{
			full: !mainRightTab,
		}">
		<span
			v-on:click="setMainRightTab('')"
			v-if="mainRightTab"
			class="main-right__player-full-btn wmp-icon-unfold_more"></span>
		<div
			class="main-right__yt-player"
			v-bind:class="{'main-right--hide-yt-player': currentMedia.type !== 'youtube'}">
			<youtube-player></youtube-player>
		</div>
		<div
			class="main-right__yt-player"
			v-bind:class="{'main-right--hide-yt-player': currentMedia.type !== 'vimeo'}">
			<vimeo-player></vimeo-player>
		</div>
		<web-media-player v-show="!['youtube', 'vimeo'].includes(currentMedia.type)"></web-media-player>
	</div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.main-right
	display: flex
	flex-direction: column
	height: 100%
.main-right__content
	flex: 2
	overflow-y: auto

.main-right__player
	flex: 1
	overflow: hidden
	border-top: 1px solid $color-aluminium
	position: relative
	background: $color-catskillwhite
	&.full .video-player
		height: 100%
.main-right__yt-player
	height: 100%
	&.main-right--hide-yt-player
		height: 1%
span.main-right__player-full-btn
	position: absolute
	top: 0
	right: 0
	cursor: pointer
	color: $color-white
	z-index: 1
.audius-chat
	position: relative
	height: 100%
	overflow: hidden
	iframe
		width: 100%
		height: 100%

</style>
