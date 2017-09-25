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
const MatrixRoomSettings = () => import(/* webpackChunkName: "matrix-room-settings" */'./matrix-settings.vue');
const MediaEdit = () => import(/* webpackChunkName: "media-edit" */'./media-edit.vue');

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
		MatrixRoomSettings,
		MediaEdit,
	},
	computed: mapState([
		'website',
		'mainRightTab',
		'search',
		'showSettings',
		'showMediumSettings',
		'currentMedia',
		'currentWebScraper',
		'currentMatrixRoom',
		'showMediaEdit',
	]),
	mounted() {
		document.addEventListener('mouseup', () => {
			this.resize = false;
			this.resizeWidth = false;
		});
		const br = this.$el.getBoundingClientRect();
		document.addEventListener('mousemove', (event) => {
			if (this.resize) {
				const pos = 100 - Math.round(((event.clientY - br.top) / br.height) * 100);
				if (pos > 10) this.$el.querySelector('.main-right__player').style.height = `${pos}%`;
			}
			if (this.resizeWidth) {
				const bb = document.querySelector('.web-app__main').getBoundingClientRect();

				const pos = 100 - Math.round(((event.clientX - bb.left) / bb.width) * 100);
				if (pos > 10) this.$el.style.width = `${pos}%`;
			}
		});
	},
	methods: {
		...mapMutations(['setMainRightTab']),
		resizeStart() {
			this.resize = true;
		},
		resizeWidthStart() {
			this.resizeWidth = true;
		},
	},
};
</script>

<template>
<div class="main-right">
	<div
		class="main-right__width-handle"
		@mousedown="resizeWidthStart"></div>
	<ul class="tabs">
		<li
			@click="setMainRightTab('queue')"
			v-bind:class="{ active: mainRightTab == 'queue' }">Queue</li>
		<li
			v-if="search.results.length"
			@click="setMainRightTab('search')"
			v-bind:class="{ active: mainRightTab == 'search' }">Search</li>
		<li
			@click="setMainRightTab('about')"
			v-bind:class="{ active: mainRightTab == 'about' }">About</li>
		<li
			v-if="showMediumSettings.tv && currentWebScraper"
			@click="setMainRightTab('webScraperSettings')"
			v-bind:class="{ active: mainRightTab == 'webScraperSettings' }">Channel Settings</li>
		<li
			v-if="showMediumSettings.matrix && currentMatrixRoom"
			@click="setMainRightTab('matrixRoomSettings')"
			v-bind:class="{ active: mainRightTab == 'matrixRoomSettings' }">Room Settings</li>
		<li
			v-if="showMediaEdit"
			@click="setMainRightTab('mediaEdit')"
			v-bind:class="{ active: mainRightTab == 'mediaEdit' }">Media Info</li>
		<li
			v-if="showSettings"
			@click="setMainRightTab('settings')"
			v-bind:class="{ active: mainRightTab == 'settings' }">Settings</li>
	</ul>
	<div class="main-right__content" v-show="mainRightTab">
		<about-player v-show="mainRightTab == 'about'"></about-player>
		<search-results v-if="mainRightTab == 'search'"></search-results>
		<queue v-show="mainRightTab == 'queue'"></queue>
		<media-edit v-if="mainRightTab == 'mediaEdit'"></media-edit>
		<web-scraper-settings v-if="mainRightTab == 'webScraperSettings' && currentWebScraper"></web-scraper-settings>
		<matrix-room-settings v-if="mainRightTab == 'matrixRoomSettings' && currentMatrixRoom"></matrix-room-settings>
		<settings v-if="mainRightTab == 'settings'"></settings>
	</div>
	<div
		class="main-right__drag-handle"
		@mousedown="resizeStart"></div>
	<div
		class="main-right__player"
		v-bind:class="{
			full: !mainRightTab,
		}">
		<span
			@click="setMainRightTab('')"
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
	width: 50%
	position: relative
.main-right__content
	flex: 1
	overflow-y: auto

.main-right__player
	height: 33%
	overflow: hidden
	border-top: 1px solid $color-aluminium
	position: relative
	background: $color-catskillwhite
	&.full
		// I use important here since the height can be set by
		// the user with drag and drop resize which sets the element
		// height inline
		height: 100%!important
		.video-player
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

.main-right__width-handle
	position: absolute
	top: 0
	left: 0
	height: 100%
	background: transparent
	width: $grid-space/2
	z-index: 8
	cursor: ew-resize

.main-right__drag-handle
	height: $grid-space/2
	width: 100%
	background: transparent
	cursor: ns-resize

</style>
