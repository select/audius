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
		...mapMutations(['moveTagsOrdered', 'dropMoveItem', 'selectMediaSource']),
		addTags() {
			const el = document.querySelector('.play-list-manager__input input');
			this.$store.commit('addTags', { tag: el.value });
			el.value = '';
		},
		dropAdd(event) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			this.dropMoveItem({
				itemId,
				from: this.currentMediaSource.id,
				to: '',
				sourceType: 'playList',
			});
		},
	},
	computed: {
		...mapGetters(['playListLength']),
		...mapState(['sourcesOrdered', 'currentMediaSource']),
		_tagsOrdered: {
			get() {
				return this.sourcesOrdered;
			},
			set(value) {
				this.moveTagsOrdered(value);
			},
		},
	},
};
</script>

<template>
	<div class="play-list-manager__wrapper">
		<ul>
			<li
				v-bind:class="{ active: currentMediaSource.id === '' }"
				class="play-list-manager__default-playlist"
				@click="selectMediaSource({type: 'playList', id: ''})">
				<div class="play-list-manager__drag-handle play-list-manager--default"></div>
				<draggable
					class="play-list-manager__tag-drop-zone"
					@add="dropAdd"
					:options="{ sort: false, group: { name: 'lists' } }">
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
				v-for="id in _tagsOrdered"
				:key="id"
				:id="id"></play-list-tag>
		</draggable>
		<ul class="play-list-manager__tags">
			<li class="play-list-manager__input">
				<div class="play-list-manager__tag-body">
					<input
						v-on:keyup.enter="addTags"
						type="text"
						aria-label="New playlist name"
						placeholder="... new playlist">
				</div>
				<div class="play-list-manager__create">
					<span class="wmp-icon-add" @click="addTags"></span>
				</div>
			</li>
		</ul>
	</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.play-list-manager__wrapper
	flex: 1
	&::-webkit-scrollbar-thumb
	  background: $color-athensgrey
	&::-webkit-scrollbar-track
		background: $color-aluminium-dark
	div
		text-overflow: ellipsis
	ul
		margin: 0
		padding: 0
		list-style: none
		li
			display: flex
			margin: $grid-space
			height: $touch-size-medium
			align-items: center
			border-radius: $border-radius
			background: $color-athensgrey
			color: $color-palesky
			cursor: pointer
			&.active
				background: $color-white
				.play-list-manager__tag-body
					font-weight: bold
				.play-list-manager__drag-handle
					border-left: 1vw solid $color-pictonblue
				input
					font-weight: bold

			&:hover:not(.spacer)
				border-color: $color-pictonblue
				background: $color-white
				.play-list-manager__tag-body,
				.play-list-manager__menu
					color: $color-pictonblue
				.play-list-manager__menu
					display: flex
				input
					color: $color-pictonblue

		.spacer
			background: transparent
			height: $grid-space


.play-list-manager__menu
	display: none

.play-list-manager__input
	span
	 color: $color-aluminium-dark
	input
		background: transparent
		border-radius: $border-radius
		height: 100%
		padding-left: #{2*$grid-space}
		font-size: 1rem
		&::-webkit-input-placeholder
			color: $color-aluminium-dark
		&:-moz-placeholder
			color: $color-aluminium-dark
		&::-moz-placeholder
			color: $color-aluminium-dark
.play-list-manager__create
	position: relative
	&:before
		position: absolute
		transform: rotate(-53.4deg)
		transform-origin: 5.8rem 3.5rem
		color: $color-athensgrey
		font-size: 0.8rem
		content: 'CREATE'
		pointer-events: none

</style>



