<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import Sortable from 'sortablejs';

export default {
	props: [
		'tagName',
	],
	methods: {
		...mapMutations(['selectPlayList', 'deletePlayList', 'renamePlayList', 'dropMoveItem']),
	},
	computed: {
		...mapGetters(['playListLength', 'currentPlayList']),
		...mapState(['tags', 'tagsOrdered', 'currentPlayList']),
	},
	mounted() {
		Sortable.create(this.$el.querySelector('.play-list-manager__tag-body'), {
			group: 'lists',
			put: ['playList', 'searchResults'],
			animation: 250,
			sort: false,
			onAdd: (event) => { // Element is dropped into the list from another lists
				const itemEl = event.item; // dragged HTMLElement
				const itemId = itemEl.dataset.id;
				this.dropMoveItem({ itemId, from: this.currentPlayList, to: this.tagName });
				itemEl.parentNode.removeChild(itemEl);
			},
		});
	},
};
</script>

<template>
	<li
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
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.play-list-manager__drag-handle
	width: #{2*$grid-space}
	height: 100%
	&:not(.play-list-manager--default)
		cursor: move

.play-list-manager__menu
	display: none

.play-list-manager__tag-body
	flex: 1
	text-overflow: ellipsis
	white-space: nowrap
	overflow: hidden
	display: flex
	flex-direction: column
	div:last-child
		font-size: 0.7em
	input
		font-size: 1em
		border: 0
		color: $color-palesky
		padding: 0

.play-list-manager__tag-name-input
	height: $touch-size-extratiny
</style>



