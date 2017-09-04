<script>
import Vue from 'vue';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';

import { starterPlaylist, debounce } from '../utils';
import VideoItem from './video-item.vue';
import PlayListExport from './play-list-export.vue';
import PlayListImport from './play-list-import.vue';

function isElementInViewport(el) {
	if (!el) return false;
	const rect = el.getBoundingClientRect();
	return (
		(rect.top + 300) >= 0 &&
		(rect.bottom - 300) <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */
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
		this.$el.querySelector('.play-list__body').addEventListener('scroll', debounce(() => {
			this.checkElementVisible();
		}, 200));
	},
	updated() {
		this.checkElementVisible();
	},
	beforeDestroy() {
		this.subscriptions.forEach((unsub) => { unsub(); });
	},
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
		]),
		...mapActions(['importURL', 'matrixPaginate', 'runWebScraper', 'matrixSend']),
		checkElementVisible() {
			/* eslint-disable no-param-reassign */
			this.$refs.playListEls.forEach((ve) => {
				if (!ve.isVisible) ve.isVisible = isElementInViewport(ve.$el);
			});
		},
		addMusic() {
			this.importURL({ url: starterPlaylist });
		},
		dropAdd(event) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			if (this.currentMatrixRoom) {
				this.matrixSend({ itemId, roomId: this.currentMatrixRoom });
			} else {
				this.dropMoveItem({ itemId, to: this.currentPlayList });
			}
		},
		clear(close) {
			if (!this.filterQuery) this.toggleJump(false);
			clearTimeout(this.blurTimer);
			event.stopPropagation();
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
		stopPropagation() {
			if (this.showJump) event.stopPropagation();
		},
		filterInput(event) {
			if (event.target.value.length > 1) {
				this.filterPlayList(event.target.value);
			} else {
				this.filterPlayList('');
			}
		},
		_expiryDate(id) {
			if (this.currentWebScraper) {
				return this.webScrapers[this.currentWebScraper].playedMedia[id];
			}
			if (this.currentMatrixRoom) {
				return this.matrixRooms[this.currentMatrixRoom].playedMedia[id];
			}
			return null;
		},
	},
	computed: {
		...mapGetters([
			'filteredPlayListLength',
			'filteredPlayList',
			'tagNames',
		]),
		...mapState([
			'currentMedia',
			'showJump',
			'showImport',
			'showExport',
			'currentPlayList',
			'entities',
			'isPlaying',
			'filterQuery',
			'tags',
			'jumpCursor',
			'leftMenuTab',
			'currentMatrixRoom',
			'currentWebScraper',
			'webScrapers',
			'webScrapersIndex',
			'matrixRooms',
			'showWatched',
		]),
		_entities: {
			get() {
				return this.filteredPlayList;
			},
			set(value) {
				if (!this.showJump) {
					this.movePlayListMedia(
						value.map(media => media.id)
					);
				}
			},
		},
		showWelcome() {
			return !(this.showImport || this.showExport || this.showJump || this.filteredPlayListLength);
		},
		currentSourceId() {
			const names = ['currentPlayList', 'currentMatrixRoom', 'currentWebScraper'];
			return this[names.find(n => !!this[n])];
		},
	},
};
</script>

<template>
<div class="play-list">
	<div class="play-list__body">
		<h2 v-if="currentWebScraper && !_entities.length ">
			There are currently no results from this channel, press below to load more.
		</h2>
		<draggable
			element="h2"
			v-show="showWelcome && leftMenuTab == 'playList'"
			@add="dropAdd"
			:options="{ sort: false, group: { name: 'lists' } }">
			The playlist is empty <br>
			(⊃｡•́‿•̀｡)⊃ <br>
			<br>
			<span @click="toggleSearch()">
				<span class="wmp-icon-search" title="[f] Search on YouTube"></span> Search
			</span>
				and add some songs. Or click
				<button
					class="play-list__btn-add-music button btn--blue"
					@click="addMusic">add music</button>
		</draggable>

		<play-list-import
			:tags="tagNames"
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
				v-if="(currentWebScraper || currentMatrixRoom) && !showWatched[currentSourceId]"
				@click="setShowWatched({ id: currentSourceId, toggleState: true })"
				class="play-list__load-more"> show watched items </div>
			<div
				v-if="(currentWebScraper || currentMatrixRoom) && showWatched[currentSourceId]"
				@click="setShowWatched({ id: currentSourceId, toggleState: false })"
				class="play-list__load-more"> hide watched items </div>
			<draggable
				class="media-list"
				element="ul"
				v-model="_entities"
				@add="dropAdd"
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
					:isPlayList="!!currentPlayList"
					:isSelected="jumpCursor === media.id"
					:expiryDate="_expiryDate(media.id)"
					:isWebScraper="!!(currentWebScraper || currentMatrixRoom)"
					:isPlaying="isPlaying && (currentMedia.id == media.id)"></video-item>
			</draggable>
			<div
				v-show="!(showImport || showExport || (leftMenuTab == 'radio' && !currentMatrixRoom))"
				v-if="currentWebScraper"
				@click="runWebScraper(currentWebScraper)"
				class="play-list__load-more"> … load more (Page {{webScrapersIndex[currentWebScraper] || 0}}) </div>
			<div
				v-if="leftMenuTab == 'radio' && !(showImport || showExport)"
				@click="matrixPaginate"
				class="play-list__load-more"> … load more </div>
		</div>

	</div>
	<div class="play-list-footer">
		<ul v-show="!showJump">
			<li class="play-list-footer--info">
				{{filteredPlayListLength}} Songs
			</li>
			<li
				v-if="currentPlayList !== null"
				v-bind:class="{ active: showImport }"
				@click="toggleImport()">
				Import
			</li>
			<li
				v-bind:class="{ active: showExport }"
				@click="toggleExport()"
				title="Export playlist">Export</li>
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

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.play-list
	display: flex
	flex-direction: column
	height: 100%
	h2
		font-weight: 100
		width: 100%
		text-align: center
		line-height: 2rem
		[class^='wmp-icon']
			height: #{3 * $grid-space}
			&:before
				font-size: 1em
		span
			cursor: pointer

	.button.play-list__btn-add-music
		margin-top: #{6 * $grid-space}
		padding: 0 #{5 * $grid-space}
		height: $touch-size-large


.play-list__body
	flex: 1
	overflow-y: auto
	overflow-x: hidden
.play-list-footer
	background: $color-catskillwhite
	color: $color-aluminium-dark
	display: flex
	font-size: 0.7rem
	overflow: hidden
	ul
		flex: 1
		padding: 0
		margin: 0
		list-style: none
		display: flex
		width: 100%
		height: $touch-size-small
		li
			flex: 1
			display: flex
			justify-content: center
			align-items: center
			white-space: nowrap
			transition: all $transition-time
			&:not(.play-list-footer--info)
				cursor: pointer
				text-transform: uppercase
			&.active,
			&:hover:not(.play-list-footer--info)
				background: $color-aluminium
				color: $color-white
.play-list-footer__search
	max-width: $touch-size-medium
	height: $touch-size-small
	cursor: pointer
	display: flex
	align-items: center
	&:hover:not(.active)
		background: $color-aluminium
		color: $color-white
	&.active
		max-width: 100%
		width: 100%
		span,
		input
			background: $color-white
			border: none
			border-top: 1px solid $color-aluminium
			height: $touch-size-small
			box-sizing: border-box
	span
		height: $touch-size-small
		width: $touch-size-medium
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
		font-size: 0.8em
		cursor: pointer

.play-list__import-header
	position: relative
	width: 100%
	text-align: center
	margin-bottom: $grid-space
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
	justify-content: center
	align-items: center
	.button,
	input,
	select,
	form
		width: 14rem
		margin-bottom: #{2 * $grid-space}
	input
		height: $touch-size-small
		box-sizing: border-box
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
	form span
		font-size: 0.8rem

#import-playlist
	display: none
	+ label
		box-sizing: border-box
		display: flex
		justify-content: center
		align-items: center
		cursor: pointer

.play-list__load-more
	padding-left: $touch-size-medium
	height: $touch-size-medium
	display: flex
	align-items: center
	color: $color-aluminium
	cursor: pointer
	&:hover
		background: $color-catskillwhite

</style>
