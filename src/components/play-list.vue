<script>
import Vue from 'vue/dist/vue';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

import Sortable from 'sortablejs';
import { debounce, isElementInViewport } from '../utils';
import VideoItem from './video-item.vue';
import PlayListExport from './play-list-export.vue';
import PlayListImport from './play-list-import.vue';

export default {
	components: {
		VideoItem,
		PlayListExport,
		PlayListImport,
	},
	create() {
		// this.unsubscribe = store.subscribe(() => {
		// 	if (!this.showJump && this.jumpCursor) this.jumpCursor = '';
		// 	if (this.currentSong !== this.mediaId) {
		// 		Vue.nextTick(() => {
		// 			const el = document.querySelector('.play-list li.active');
		// 			if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
		// 		});
		// 		this.currentSong = this.mediaId;
		// 	}
		// });
	},
	mounted() {
		const mediaListEl = document.querySelector('.play-list .media-list');
		Sortable.create(mediaListEl, {
			animation: 250,
			scrollSpeed: 20,
			handle: '.media-list__thumbnail',
			// Element dragging ended
			onUpdate: () => {
				if (!this.showJump){
					this.movePlayListMedia(
						Array.from(mediaListEl.childNodes).map(el => el.dataset.id)
					);
				}
			},
		});
	},
	methods: {
		...mapMutations([
			'toggleImport',
			'toggleExport',
			'toggleEditPlayList',
			'toggleSearch',
			'importOtherPlayList',
			'filterPlayList',
			'movePlayListMedia'
		]),
		...mapActions(['importURL']),
		addMusic() {
			this.importURL('https://audius.rockdapus.org/audius-starter.playlist');
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
		toggleJump(state) {
			this.$store.commit('toggleJump', state);
			Vue.nextTick(() => {
				document.querySelector('.play-list-footer__search-input').focus();
			});
		},
	},
	computed: {
		...mapGetters([
			'filteredPlayList',
			'filteredPlayListLength',
			'currentEntities'
		]),
		...mapState([
			'showJump',
			'showImport',
			'showExport',
			'currentPlayList',
			'entities',
			'editPlayList',
			'isPlaying',
			'mediaId',
			'tags',
			'filterQuery',
			'tags',
			'jumpCursor',
		]),
		showWelcome() {
			return !(this.showImport || this.showExport || this.filteredPlayListLength)
		}

	},
};
</script>

<template>
<div class="play-list">
	<div class="play-list__body">
		<h2 v-if="showWelcome && !currentPlayList">
			The playlist is empty <br>
			┐(・。・┐) ♪ <br>
			<br>
			<span @click="toggleSearch()">
				<span class="wmp-icon-search" title="[f] Search on YouTube"></span> Search
			</span>
				and add some songs.
			<button
				class="play-list__btn-add-music button btn--blue"
				@click="addMusic">add music</button>
		</h2>
		<h2 v-if="showWelcome && currentPlayList">
			(⊃｡•́‿•̀｡)⊃ <br>
			<br>
			<span @click="toggleSearch()">
				<span class="wmp-icon-search" title="[f] Search on YouTube"></span> Search
			</span>
				and add some songs.
		</h2>

		<div class="paly-list__import" v-show="editPlayList" >
			<div class="paly-list__import-header">
				<div> Edit playlist: {{currentPlayList}} </div>
				<span
					class="wmp-icon-close"
					title="[Esc] Close"
					@click="toggleEditPlayList(undefined, false)"></span>
				<div class="paly-list__edit-description">Click below to add songs to the playlist.</div>
			</div>
		</div>

		<play-list-import
			:tags="Object.keys(tags)"
			v-on:toggleImport="toggleImport"
			v-on:importURL="importURL"
			v-on:importOtherPlayList="importOtherPlayList"
			v-show="showImport"></play-list-import>

		<play-list-export
			:currentPlayList="currentPlayList"
			:filteredPlayList="filteredPlayList"
			:entities="currentEntities"
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

		<!-- play list here -->
		<ul
			class="media-list"
			v-bind:class="{ 'media-list--editing': editPlayList }"
			v-show="!(showImport || showExport)">
			<video-item
				v-for="id in filteredPlayList"
				:video="entities[id]"
				:isEditPlayList="editPlayList"
				:isPlayList="currentPlayList"
				:isInPlayList="editPlayList && tags[currentPlayList].includes(id)"
				:isSelected="jumpCursor === id"
				:key="id"
				:isPlaying="isPlaying && entities[id] && (mediaId == entities[id].id)"></video-item>
		</ul>
		<!-- ends here -->

	</div>
	<div class="play-list-footer">
		<ul v-show="!showJump">
			<li class="play-list-footer--info">
				{{filteredPlayListLength}} Songs
			</li>
			<li
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
					v-on:keyup="filterPlayList($event.target.value)"
					v-on:blur="delayBlur"
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
		line-height: 2em
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
	font-size: 0.7em
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
.paly-list__import-header
	font-size: 1.5em
	span
		font-size: 0.8em
		cursor: pointer

.paly-list__import-header
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

.paly-list__edit-description
	font-size: 1rem

.paly-list__import
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
		font-size: 1em
		&::-webkit-input-placeholder
				color: $color-aluminium
		&:-moz-placeholder
			color: $color-aluminium
		&::-moz-placeholder
			color: $color-aluminium
		// +placeholder
		// 	color: $color-aluminium
	.paly-list__import-url
		display: flex
		flex-direction: column
	form span
		font-size: 0.8em

#import-playlist
	display: none
	+ label
		box-sizing: border-box
		display: flex
		justify-content: center
		align-items: center
		cursor: pointer

.media-list--editing .media-list__body
	cursor: pointer

</style>
