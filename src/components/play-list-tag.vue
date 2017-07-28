<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
	components: {
		draggable,
	},
	props: [
		'index',
	],
	methods: {
		...mapMutations(['selectMediaSource', 'deletePlayList', 'renamePlayList', 'dropMoveItem']),
		dropAdd(event) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			this.dropMoveItem({ itemId, from: this.currentPlayList, to: this.tagName });
		},
	},
	computed: {
		...mapGetters(['playListLength', 'currentPlayList']),
		...mapState(['tags', 'tagsOrdered', 'currentPlayList']),
		tagName() {
			return this.tagsOrdered[this.index];
		},
	},
};
</script>

<template>
	<li
		v-bind:data-tag="tagName"
		v-bind:class="{ active: currentPlayList == tagName }"
		@click="selectMediaSource({type: 'playList', id: tagName})">
		<div class="play-list-manager__drag-handle"></div>
		<draggable
			class="play-list-manager__tag-drop-zone"
			@add="dropAdd"
			:options="{ sort: false, group: { name: 'lists' } }">
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
		</draggable>
		<div class="play-list-manager__menu">
			<span
				class="wmp-icon-close"
				title="Delte playlist"
				@click.stop="deletePlayList(tagName)"></span>
		</div>
	</li>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

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

.play-list-manager__tag-body
	flex: 1
	display: flex
	flex-direction: column
	overflow: hidden
	div
		overflow: hidden
		text-overflow: ellipsis
		white-space: nowrap
		&:last-child
			font-size: 0.7em
	input
		font-size: 1em
		border: 0
		color: $color-palesky
		padding: 0

.play-list-manager__tag-name-input
	height: $touch-size-extratiny
</style>



