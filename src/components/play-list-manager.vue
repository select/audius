<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import Sortable from 'sortablejs';

export default {
	methods: {
		...mapMutations(['selectPlayList', 'deletePlayList', 'renamePlayList', 'moveTagsOrderd']),
		addTags() {
			const el = document.querySelector('.play-list-manager__input input');
			this.$store.commit('addTags', { tagName: el.value });
			el.value = '';
		},
	},
	computed: {
		...mapGetters(['playListLength', 'currentPlayList']),
		...mapState(['tags', 'tagsOrdered', 'currentPlayList']),
	},
	mounted() {
		const listEl = document.querySelector('.play-list-manager__tags');
		Sortable.create(listEl, {
			animation: 250,
			scrollSpeed: 20,
			handle: '.play-list-manager__drag-handle',
			onUpdate: () => { // Element dragging ended
				this.moveTagsOrderd(
					Array
						.from(listEl.querySelectorAll('li:not(.play-list-manager__input)'))
						.map(el => el.dataset.tag),
				);
			},
		});
	},
};
</script>

<template>
	<div class="play-list-manager__wrapper">
		<ul>
			<li
				v-bind:class="{ active: !currentPlayList }"
				@click="selectPlayList()">
				<div class="play-list-manager__drag-handle play-list-manager--default"></div>
				<div class="play-list-manager__tag-body">
					<div>Default</div>
					<div>{{playListLength}} Songs</div>
				</div>
			</li>
			<li class="spacer"></li>
		</ul>
		<ul class="play-list-manager__tags">
			<li
				v-for="tagName in tagsOrdered"
				v-bind:data-tag="tagName"
				v-bind:class="{ active: currentPlayList == tagName }"
				@click="selectPlayList(tagName)">
				<div class="play-list-manager__drag-handle"></div>
				<div class="play-list-manager__tag-body">
					<div v-show="currentPlayList != tagName">{{tagName}}</div>
					<div v-show="currentPlayList == tagName">
						<input
							class="play-list-manager__tag-name-input"
							type="text"
							v-bind:value="tagName"
							v-on:input="renamePlayList({oldName: tagName, newName: $event.target.value})"
							placeholder="... playlist name">
					</div>
					<div>{{tags[tagName].length}} Songs</div>
				</div>
				<div class="play-list-manager__menu">
					<span
						class="wmp-icon-close"
						title="Delte playlist"
						@click.stop="deletePlayList(tagName)"></span>
				</div>
			</li>
			<li class="play-list-manager__input">
				<input
					v-on:keyup.enter="addTags"
					type="text"
					placeholder="... new playlist">
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

.play-list-manager__tag-body
	flex: 1
	text-overflow: ellipsis
	white-space: nowrap
	overflow: hidden

.play-list-manager__drag-handle
	width: #{2*$grid-space}
	height: 100%
	&:not(.play-list-manager--default)
		cursor: move

.play-list-manager__menu
	display: none

.play-list-manager__tag-body
	display: flex
	flex-direction: column
	div:last-child
		font-size: 0.7em
	input
		font-size: 1em
		border: 0
		color: $color-palesky

.play-list-manager__input
	padding: 0
	background: $color-athensgrey
	input
		background: transparent
		box-sizing: border-box
		border: 0
		border-radius: $border-radius
		height: 100%
		width: 100%
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

.play-list-manager__tag-name-input
	height: $touch-size-extratiny
</style>



