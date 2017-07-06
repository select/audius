<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import draggable from 'vuedraggable';
import PlayListTag from './play-list-tag.vue';

export default {
	components: {
		PlayListTag,
		draggable,
	},
	methods: {
		...mapMutations(['moveTagsOrderd', 'dropMoveItem', 'selectMediaSource']),
		addTags() {
			const el = document.querySelector('.play-list-manager__input input');
			this.$store.commit('addTags', { tag: el.value });
			el.value = '';
		},
		dropAdd(event) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			this.dropMoveItem({ itemId, from: this.currentPlayList, to: '' });
		},
	},
	computed: {
		...mapGetters(['playListLength']),
		...mapState(['tags', 'tagsOrdered', 'currentPlayList']),
		_tagsOrdered: {
			get() {
				return this.tagsOrdered;
			},
			set(value) {
				this.moveTagsOrderd(value);
			},
		},
	},
};
</script>

<template>
	<div class="play-list-manager__wrapper">
		<ul>
			<li
				v-bind:class="{ active: currentPlayList !== null && !currentPlayList }"
				class="play-list-manager__default-playlist"
				@click="selectMediaSource({type: 'playList', id: ''})">
				<div class="play-list-manager__drag-handle play-list-manager--default"></div>
				<draggable
					class="play-list-manager__tag-drop-zone"
					@add="dropAdd"
					:options="{
						sort: false,
						group: {
							name: 'lists',
						}
					}">
					<div class="play-list-manager__tag-body">
						<div>Default</div>
						<div>{{playListLength}} Songs</div>
					</div>
				</draggable>
			</li>
			<li class="spacer"></li>
		</ul>


		<draggable
			class="play-list-manager__tags"
			v-model="_tagsOrdered"
			element="ul"
			:options="{
				animation: 150,
				scrollSpeed: 20,
				handle: '.play-list-manager__drag-handle',
			}">
			<play-list-tag
				v-for="(tagName, index) in tagsOrdered"
				:key="index"
				v-bind:index="index"></play-list-tag>
		</draggable>
		<ul class="play-list-manager__tags">
			<li class="play-list-manager__input">
				<div class="play-list-manager__tag-body">
					<input
						v-on:keyup.enter="addTags"
						type="text"
						placeholder="... new playlist">
				</div>
				<span class="wmp-icon-add" @click="addTags"></span>
			</li>
		</ul>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.play-list-manager__wrapper
	flex: 1
	overflow-y: auto
	&::-webkit-scrollbar-thumb
	  background: $color-athensgrey
	&::-webkit-scrollbar-track
		background: $color-aluminium-dark
	ul
		padding: 0
		list-style: none
		margin: 0
		li
			display: flex
			height: $touch-size-medium
			margin: $grid-space
			border-radius: $border-radius
			align-items: center
			// border: 1px solid $color-mineshaft
			background: $color-athensgrey
			color: $color-palesky
			cursor: pointer
			// font-weight: bold
			&.active
				font-weight: bold
				background: $color-white
				.play-list-manager__drag-handle
					border-left: 1vw solid $color-pictonblue

			// &.active,
			&:hover:not(.spacer)
				border-color: $color-pictonblue
				color: $color-pictonblue
				background: $color-white
				.play-list-manager__menu
					display: block
				input
					color: $color-pictonblue

		.spacer
			background: transparent
			height: $grid-space


.play-list-manager__drag-handle
	width: #{2*$grid-space}
	height: 100%
	&:not(.play-list-manager--default)
		cursor: move

.play-list-manager__menu
	display: none

.play-list-manager__input
	padding: 0
	background: $color-athensgrey
	input
		background: transparent
		box-sizing: border-box
		border: 0
		border-radius: $border-radius
		height: 100%
		padding-left: #{2*$grid-space}
		font-size: 1em
		&::-webkit-input-placeholder
			color: $color-palesky
		&:-moz-placeholder
			color: $color-palesky
		&::-moz-placeholder
			color: $color-palesky
		// +placeholder
		// 	color: $color-palesky
</style>



