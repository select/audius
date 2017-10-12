<script >
import { mapMutations, mapState } from 'vuex';
import AboutPlayer from './about-player.vue';
import Queue from './queue.vue';
import MediaPlayer from './media-player.vue';

const Settings = () => import(/* webpackChunkName: "settings" */'./settings.vue');
const SearchResults = () => import(/* webpackChunkName: "search-results" */'./search-results.vue');
const WebScraperSettings = () => import(/* webpackChunkName: "web-scraper-settings" */'./web-scraper-settings.vue');
const MatrixRoomSettings = () => import(/* webpackChunkName: "matrix-room-settings" */'./matrix-settings.vue');
const MediaEdit = () => import(/* webpackChunkName: "media-edit" */'./media-edit.vue');

function disableSelect(event) {
	event.preventDefault();
}

export default {
	name: 'main-right',
	components: {
		AboutPlayer,
		SearchResults,
		Queue,
		Settings,
		MediaPlayer,
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
		'queue',
	]),
	data() {
		return { queueActive: false };
	},
	mounted() {
		this.$store.watch(state => state.queueClickCount, () => {
			this.queueActive = true;
			setTimeout(() => {
				this.queueActive = false;
			}, 800);
		});
		document.addEventListener('mouseup', () => {
			this.resize = false;
			this.resizeWidth = false;
			window.removeEventListener('selectstart', disableSelect);
		});
		const br = this.$el.getBoundingClientRect();
		document.addEventListener('mousemove', (event) => {
			if (this.resize) {
				const pos = 100 - Math.round(((event.clientY - br.top) / br.height) * 100);
				if (pos > 10) this.$el.querySelector('.media-player').style.height = `${pos}%`;
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
			window.addEventListener('selectstart', disableSelect);
		},
		resizeWidthStart() {
			this.resizeWidth = true;
			window.addEventListener('selectstart', disableSelect);
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
			v-bind:class="{ active: mainRightTab == 'queue' || queueActive }">
			Queue&nbsp;<span v-if="queue.length">({{queue.length}})</span>
		</li>
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
	<media-player></media-player>
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
