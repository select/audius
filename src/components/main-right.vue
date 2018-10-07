<script >
import { mapMutations, mapState } from 'vuex';
import AboutPlayer from './about-player.vue';
import MediaPlayer from './media-player.vue';

const Settings = () => import(/* webpackChunkName: "components/settings" */'./settings.vue');
const SearchResults = () => import(/* webpackChunkName: "components/search-results" */'./search-results.vue');
const WebScraperSettings = () => import(/* webpackChunkName: "components/web-scraper-settings" */'./web-scraper-settings.vue');
const MatrixRoomSettings = () => import(/* webpackChunkName: "components/matrix-room-settings" */'./matrix-room-settings.vue');
const MediaEdit = () => import(/* webpackChunkName: "components/media-edit" */'./media-edit.vue');
const Queue = () => import(/* webpackChunkName: "components/queue" */'./queue.vue');
const ChangeLog = () => import(/* webpackChunkName: "components/changelog" */'./changelog.vue');
const PlayHistory = () => import(/* webpackChunkName: "components/play-history" */'./play-history.vue');
const MatrixBroadcast = () => import(/* webpackChunkName: "components/matrix-broadcast" */'./matrix-broadcast.vue');

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
		ChangeLog,
		PlayHistory,
		MatrixBroadcast,
	},
	computed: mapState([
		'website',
		'mainRightTab',
		'search',
		'showSettings',
		'showMediumSettings',
		'currentMedia',
		'currentMediaSource',
		'showMediaEdit',
		'queue',
		'sessionHistory',
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
		this.$store.watch(state => state.mainRightTab, () => {
			const $el = this.$el.querySelector('.media-player');
			if (!this.mainRightTab) $el.style.height = '100%';
			else $el.style.height = '';
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
			v-if="sessionHistory.length"
			@click="setMainRightTab('history')"
			v-bind:class="{ active: mainRightTab == 'history' }">History</li>
		<li
			@click="setMainRightTab('about')"
			v-bind:class="{ active: mainRightTab == 'about' }">About</li>
		<li
			v-if="currentMediaSource.type === 'webScraper' && currentMediaSource.id !== 'Imgur'"
			@click="setMainRightTab('webScraperSettings')"
			v-bind:class="{ active: mainRightTab == 'webScraperSettings' }">Channel Settings</li>
		<li
			v-if="currentMediaSource.type === 'matrix'"
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
		<li
			v-if="mainRightTab == 'broadcast'"
			@click="setMainRightTab('broadcast')"
			v-bind:class="{ active: mainRightTab == 'broadcast' }">Live</li>
	</ul>
	<div class="main-right__content" v-show="mainRightTab">
		<about-player v-show="mainRightTab == 'about'"></about-player>
		<search-results v-if="mainRightTab == 'search'"></search-results>
		<queue v-else-if="mainRightTab == 'queue'"></queue>
		<media-edit v-else-if="mainRightTab == 'mediaEdit'"></media-edit>
		<web-scraper-settings v-else-if="mainRightTab == 'webScraperSettings' && currentMediaSource.type === 'webScraper' && currentMediaSource.id !== 'Imgur'"></web-scraper-settings>
		<matrix-room-settings v-else-if="mainRightTab == 'matrixRoomSettings' && currentMediaSource.type === 'matrix'"></matrix-room-settings>
		<settings v-else-if="mainRightTab == 'settings'"></settings>
		<play-history v-else-if="mainRightTab == 'history'"></play-history>
		<change-log v-else-if="mainRightTab == 'changelog'"></change-log>
		<matrix-broadcast v-else-if="mainRightTab == 'broadcast'"></matrix-broadcast>
	</div>
	<div
		class="main-right__drag-handle"
		@mousedown="resizeStart"></div>
	<media-player></media-player>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.main-right
	display: flex
	position: relative
	flex-direction: column
	width: 50%
	height: 100%
.main-right__content
	flex: 1
	overflow-y: auto

.main-right__width-handle
	position: absolute
	top: 0
	left: 0
	width: $grid-space/2
	height: 100%
	background: transparent
	cursor: ew-resize
	z-index: 8

.main-right__drag-handle
	width: 100%
	height: $grid-space/2
	background: transparent
	cursor: ns-resize
</style>
