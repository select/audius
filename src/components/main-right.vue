<script >
import { mapMutations, mapState } from 'vuex';
import AboutPlayer from './about-player.vue';
import SearchResults from './search-results.vue';
import Queue from './queue.vue';
import Settings from './settings.vue';
import YoutubePlayer from './youtube-player.vue';
import WebMediaPlayer from './web-media-player.vue';

export default {
	name: 'main-right',
	components: {
		AboutPlayer,
		SearchResults,
		Queue,
		YoutubePlayer,
		WebMediaPlayer,
		Settings,
	},
	computed: mapState(['website', 'mainRightTab', 'search', 'showSettings', 'currentMedia']),
	methods: mapMutations(['setMainRightTab']),
};
</script>

<template>
<div class="main-right">
	<ul class="main-right__tabs">
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
			v-if="showSettings"
			v-on:click="setMainRightTab('settings')"
			v-bind:class="{ active: mainRightTab == 'settings' }">Settings</li>
	</ul>
	<div class="main-right__content" v-show="mainRightTab">
		<about-player v-show="mainRightTab == 'about'"></about-player>
		<search-results v-show="mainRightTab == 'search'"></search-results>
		<queue v-show="mainRightTab == 'queue'"></queue>
		<div class="audius-chat" v-show="mainRightTab == 'chat'"> </div>
		<settings v-show="mainRightTab == 'settings'"></settings>
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
		<div class="main-right__yt-player" v-bind:class="{'main-right--hide-yt-player': currentMedia.type !== 'youtube'}">
			<youtube-player></youtube-player>
		</div>
		<web-media-player v-show="currentMedia.type !== 'youtube'"></web-media-player>
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
ul.main-right__tabs
	padding: 0
	margin: 0
	list-style: none
	display: flex
	width: 100%
	min-height: $touch-size-small
	li
		flex: 1
		display: flex
		justify-content: center
		align-items: center
		background: $color-catskillwhite
		color: $color-aluminium-dark
		cursor: pointer
		text-transform: uppercase
		white-space: nowrap
		font-size: 0.7em
		transition: all $transition-time
		&.active,
		&:hover
			background: $color-aluminium
			color: $color-white

.main-right__content
	flex: 2
	overflow-y: auto

.main-right__player
	flex: 1
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
