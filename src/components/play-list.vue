<script>
import Vue from 'vue';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';

import { starterPlaylist, throttle, debounce } from '../utils';
import VideoItem from './video-item.vue';

const PlayListExport = () => import(/* webpackChunkName: "components/play-list-export" */'./play-list-export.vue');
const PlayListImport = () => import(/* webpackChunkName: "components/play-list-import" */'./play-list-import.vue');

function isElementInViewport(el) {
	if (!el) return false;
	const rect = el.getBoundingClientRect();
	return (
		(rect.top + 300) >= 0 &&
		(rect.bottom - 300) <= (window.innerHeight || document.documentElement.clientHeight)
	);
}

export default {
	components: {
		draggable,
		VideoItem,
		PlayListExport,
		PlayListImport,
	},
	created() {
		this.subscriptions = [
			this.$store.watch(state => state.showJump, () => {
				if (this.showJump) {
					Vue.nextTick(() => {
						document.querySelector('.play-list-footer__search-input').focus();
					});
				}
			}),
		];
	},
	mounted() {
		this.checkElementVisible();
		const $playList = this.$refs.playlist;
		$playList.addEventListener('scroll', throttle(() => {
			this.checkElementVisible();
		}, 500));
		// only hide on debounced
		$playList.addEventListener('scroll', debounce(() => {
			this.checkElementVisible(true);
		}, 100));
		$playList.addEventListener('wheel', this.scrolled);
	},
	updated() {
		this.checkElementVisible();
	},
	// beforeDestroy() {
	// 	this.subscriptions.forEach((unsub) => { unsub(); });
	// },
	methods: {
		...mapMutations([
			'dropSearchResult',
			'toggleImport',
			'toggleExport',
			'toggleSearch',
			'importOtherPlayList',
			'filterPlayList',
			'movePlayListMedia',
			'toggleJump',
			'dropMoveItem',
			'setShowWatched',
			'setLeftMenuTab',
			'setMainLeftTab',
			'selectMediaSource',
		]),
		...mapActions(['importURL', 'matrixPaginate', 'webScraperLoadMore', 'matrixSend', 'matrixLoadMore', 'webScraperLoadMore']),
		scrolled(){
			const $playList = this.$refs.playlist;
			// Detect when scrolled to bottom.
			if ($playList.scrollTop + $playList.clientHeight >= $playList.scrollHeight) {
				if (['matrix', 'webScraper'].includes(this.currentMediaSource.type)) {
					this[`${this.currentMediaSource.type}LoadMore`](this.currentMediaSource.id);
				}
			}
		},
		checkElementVisible(hide) {
			/* eslint-disable no-param-reassign */
			if (this.$refs.playListEls) {
				this.$refs.playListEls.forEach((ve) => {
					if (hide || !ve.isVisible) ve.isVisible = isElementInViewport(ve.$el);
				});
			}
		},
		addMusic() {
			this.importURL({ url: starterPlaylist });
		},
		dropAdd(event) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			const { id, type } = this.currentMediaSource;
			if (type === 'matrix') {
				this.matrixSend({ itemId, roomId: id });
			} else {
				this.dropMoveItem({ itemId, to: id });
			}
		},
		clear(close) {
			if (!this.filterQuery) this.toggleJump(false);
			clearTimeout(this.blurTimer);
			document.querySelector('.play-list-footer__search-input').value = '';
			document.querySelector('.play-list-footer__search-input').focus();
			this.filterPlayList('');
			if (close === true) this.toggleJump(false);
		},
		delayBlur() {
			if (!this.filterQuery) {
				this.blurTimer = setTimeout(() => {
					this.toggleJump(false);
				}, 800);
			}
		},
		stopPropagation(event) {
			if (this.showJump) event.stopPropagation();
		},
		filterInput(event) {
			if (event.target.value.length > 1) {
				this.filterPlayList(event.target.value);
			} else {
				this.filterPlayList('');
			}
		},
		_hasExpiryDate(mediaId) {
			if (this.currentMediaSource.type === 'playList') return false;
			return mediaId in this.playedMedia;
		},
	},
	computed: {
		...mapGetters([
			'filteredPlayListLength',
			'filteredPlayList',
		]),
		...mapState([
			'playedMedia',
			'currentMedia',
			'showJump',
			'showImport',
			'showExport',
			'currentMediaSource',
			'entities',
			'isPlaying',
			'filterQuery',
			'tags',
			'jumpCursor',
			'showWatched',
			'paginationIndex',
			'isLoading',
		]),
		_entities: {
			get() {
				return this.filteredPlayList;
			},
			set(value) {
				const { type } = this.currentMediaSource;
				if (!this.showJump && type === 'playList') {
					this.movePlayListMedia(
						value.map(media => media.id)
					);
				}
				if (type === 'matrix') {
					const index = new Set(this.filteredPlayList.map(({ id }) => id));
					value
						.filter(({ id }) => !index.has(id))
						.forEach(media => {
							this.matrixSend({ media, roomId: this.currentMediaSource.id });
						});
				}
			},
		},
		showWelcome() {
			return !(
				this.showImport
				|| this.showExport
				|| this.showJump
				|| this.filteredPlayListLength
				|| ['matrix', 'webScraper'].includes(this.currentMediaSource.type)
			);
		},
	},
};
</script>

<template>
<div class="play-list">
	<div class="play-list__body" ref="playlist">
		<draggable
			element="div"
			class="play-list__greeting"
			v-show="showWelcome"
			@add="dropAdd"
			:options="{ sort: false, handle: '.no-handle', group: { name: 'lists' } }">
			<div>
				Your playlist is empty
			</div>
			<div>
				Find music and videos you love <br>
				<button
					class="button btn--blue"
					@click="toggleSearch()">
					Search
				</button>
			</div>
			<div>
				Join a room and share your discoveries <br>
				<button
					@click="setLeftMenuTab('matrix')"
					class="button btn--blue">join room</button>
			</div>
			<div>
				Watch funny videos from Imgur <br>
				<button
					@click="selectMediaSource({type: 'webScraper', id: 'Imgur'});setLeftMenuTab('webScraper')"
					class="button btn--blue">watch imgur</button>
			</div>
			<div>
				Add some songs to your playlist <br>
				<button
					class="button btn--blue"
					@click="addMusic">add music</button>
			</div>
		</draggable>

		<play-list-import
			v-on:toggleImport="toggleImport"
			v-on:importOtherPlayList="importOtherPlayList"
			v-show="showImport"></play-list-import>

		<play-list-export
			v-on:toggleExport="toggleExport()"
			v-if="showExport"></play-list-export>

		<div
			class="play-list__jump-header"
			v-show="showJump">
			<div> Jump to file </div>
			<span
				class="wmp-icon-close"
				title="[Esc] Close"
				@click="clear(true)"></span>
		</div>

		<div
			v-show="!(showImport || showExport)"
			>
			<div
				v-if="['matrix', 'webScraper'].includes(currentMediaSource.type) && !showWatched[currentMediaSource.id]"
				@click="setShowWatched({ id: currentMediaSource.id, toggleState: true })"
				class="play-list__load-more"> show watched items </div>
			<div
				v-if="['matrix', 'webScraper'].includes(currentMediaSource.type) && showWatched[currentMediaSource.id]"
				@click="setShowWatched({ id: currentMediaSource.id, toggleState: false })"
				class="play-list__load-more"> hide watched items </div>
			<draggable
				class="media-list"
				element="ul"
				v-model="_entities"
				:options="{
					animation: 150,
					scrollSpeed: 20,
					handle: '.media-list__thumbnail',
					group: {
						name: 'lists',
						pull: 'clone',
						revertClone: true,
					}
				}">
				<video-item
					v-for="(media, index) in _entities"
					ref="playListEls"
					:key="index"
					:video="media"
					:isPlayList="currentMediaSource.type === 'playList'"
					:isSelected="jumpCursor === media.id"
					:hasExpiryDate="_hasExpiryDate(media.id)"
					:isWebScraper="currentMediaSource.type == 'webScraper'"
					:isPlaying="isPlaying && (currentMedia.id == media.id)"></video-item>
			</draggable>

			<div
				class="play-list__greeting"
				v-if="currentMediaSource.type === 'matrix' && !_entities.length ">
				Nothing found. Click load more or add from search or playlists.
			</div>
			<div
				class="play-list__greeting"
				v-if="currentMediaSource.type == 'webScraper' && !_entities.length ">
				Nothing found. Click below to load more.
			</div>

			<div
				v-if="currentMediaSource.type == 'webScraper'"
				@click="webScraperLoadMore(currentMediaSource.id)"
				class="play-list__load-more">
				… load more (Page {{paginationIndex[currentMediaSource.id] || 0}})
				<div class="loader" v-show="isLoading[currentMediaSource.id]"></div>
			</div>
			<div
				v-if="currentMediaSource.type == 'matrix'"
				@click="matrixLoadMore(currentMediaSource.id)"
				class="play-list__load-more">
				… load more (Page {{paginationIndex[currentMediaSource.id] || 0}})
				<div class="loader" v-show="isLoading[currentMediaSource.id]"></div>
			</div>
		</div>

	</div>
	<div class="play-list-footer">
		<ul v-show="!showJump">
			<li
				class="play-list-footer--info"
				@click="toggleImport(false); toggleExport(false)">
				{{filteredPlayListLength}} Songs
			</li>
			<li
				v-if="this.currentMediaSource.type === 'matrix'">
				<span
					@click="setMainLeftTab('matrix')"
					class="wmp-icon-chat play-list__chat"></span>
			</li>
			<li
				v-if="currentMediaSource.type === 'playList'"
				v-bind:class="{ active: showImport }"
				@click="toggleImport()">
				<span class="wmp-icon-add"></span> Add
			</li>
			<li
				v-bind:class="{ active: showExport }"
				@click="toggleExport()"
				title="Share and save">
				<span class="wmp-icon-share"></span>
				Share
			</li>
		</ul>

		<div
			class="play-list-footer__search"
			v-bind:class="{ active: showJump }"
			@click="toggleJump()">
			<span class="wmp-icon-search" title="[j] Jump to file"></span>
			<input
					type="text"
					class="play-list-footer__search-input"
					placeholder="Jump to"
					@click="stopPropagation"
					@input="filterInput"
					@blur="delayBlur"
					v-show="showJump">
			<span
				class="wmp-icon-close"
				v-show="showJump"
				@click="clear"></span>
		</div>
	</div>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.play-list
	display: flex
	position: relative
	flex-direction: column
	height: 100%
.play-list__greeting
	width: 100%
	margin: #{2 * $grid-space} 0 #{2 * $grid-space} 0
	font-size: 1.2rem
	line-height: 1.5rem
	text-align: center
	[class^='wmp-icon']
		height: #{3 * $grid-space}
		&:before
			font-size: 1em
	span
		cursor: pointer
	>div
		margin-top: #{3 * $grid-space}
		> button.button
			width: #{5 * $touch-size-medium}
			height: $touch-size-medium
			margin-top: #{2 * $grid-space}
			// padding: 0 #{5 * $grid-space}

.play-list__body
	flex: 1
	overflow-y: auto
	overflow-x: hidden
.play-list-footer
	display: flex
	position: relative
	background: $color-catskillwhite
	color: $color-aluminium-dark
	font-size: 0.7rem
	overflow: hidden
	ul
		display: flex
		flex: 1
		width: 100%
		height: $touch-size-small
		margin: 0
		padding: 0
		list-style: none
		li
			display: flex
			flex: 1
			align-items: center
			justify-content: center
			transition: all $transition-time
			white-space: nowrap
			&:not(.play-list-footer--info)
				text-transform: uppercase
				cursor: pointer
			&.active,
			&:hover:not(.play-list-footer--info)
				background: $color-aluminium
				color: $color-white
		[class^='wmp-icon']
			width: $touch-size-small
			height: $touch-size-tiny
.play-list-footer__search
	display: flex
	align-items: center
	max-width: $touch-size-medium
	height: $touch-size-small
	cursor: pointer
	&:hover:not(.active)
		background: $color-aluminium
		color: $color-white
	&.active
		width: 100%
		max-width: 100%
		span,
		input
			height: $touch-size-small
			border: 0
			border-top: 1px solid $color-aluminium
			background: $color-white
	span
		width: $touch-size-medium
		height: $touch-size-small
	input
		flex: 1

.play-list__jump-header
	display: flex
	align-items: center
	justify-content: space-between
	margin-left: #{ 2* $grid-space + $touch-size-medium}

.play-list__jump-header,
.play-list__import-header
	font-size: 1.5em
	span
		font-size: .8em
		cursor: pointer

.play-list__import-header
	position: relative
	width: 100%
	margin-bottom: $grid-space
	text-align: center
	> div
		height: $touch-size-medium
		line-height: $touch-size-medium
	span
		position: absolute
		top: 0
		right: 0

.play-list__import
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	padding: $grid-space
	.button,
	input,
	select,
	form
		width: 14rem
		margin-bottom: #{2 * $grid-space}
	input
		height: $touch-size-small
		&::-webkit-input-placeholder
				color: $color-aluminium
		&:-moz-placeholder
			color: $color-aluminium
		&::-moz-placeholder
			color: $color-aluminium
		// +placeholder
		// 	color: $color-aluminium
	.play-list__import-url
		display: flex
		flex-direction: column
		align-items: center
	form span
		font-size: 0.8rem

#import-playlist
	display: none
	+ label
		display: flex
		align-items: center
		justify-content: center
		cursor: pointer

.play-list__load-more
	display: flex
	align-items: center
	height: $touch-size-medium
	padding-left: $touch-size-medium
	color: $color-aluminium
	cursor: pointer
	&:hover
		background: $color-catskillwhite

// tag
.play-list-manager__tag-body
	display: flex
	flex: 1
	flex-direction: column
	overflow: hidden
	> div
		text-overflow: ellipsis
		white-space: nowrap
		overflow: hidden
		&:last-child
			font-size: 0.7em
	input
		color: $color-palesky
		font-size: 1rem

.play-list-manager__drag-handle
	min-width: #{2*$grid-space}
	height: 100%
	&:not(.play-list-manager--default)
		cursor: move

.play-list-manager__menu
	display: none

li ~ .play-list-manager__tag-body
	display: none

.play-list-manager__tag-drop-zone
	flex: 1
	overflow: hidden


.play-list-manager__tags
	.play-list-manager__tag-name-input
		height: $touch-size-extratiny

.loader
	width: #{3 * $grid-space}
	height: #{3 * $grid-space}
	border: $grid-space/2 solid $color-catskillwhite
	border-radius: 50%
	border-top-color: $color-pictonblue
	animation: spin 2s linear infinite

@keyframes spin
	0%
		transform: rotate(0deg)
	100%
		transform: rotate(360deg)
</style>
