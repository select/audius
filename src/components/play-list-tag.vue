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
	data() {
		return {
			showConfirmDelte: false,
		};
	},
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
			:options="{
				sort: false,
				handle: '.no-handle',
				group: { name: 'lists' }
			}">
			<div class="play-list-manager__tag-body">
				<div v-show="currentPlayList != tagName">{{tagName}}</div>
				<div v-show="currentPlayList == tagName">
					<input
						class="play-list-manager__tag-name-input"
						type="text"
						:value="tagName"
						@input="renamePlayList({oldName: tagName, newName: $event.target.value})"
						placeholder="... playlist name">
				</div>
				<div>{{tags[tagName].length}} Songs</div>
			</div>
		</draggable>
		<div class="play-list-manager__menu">
			<span
				class="wmp-icon-close"
				title="Delte playlist"
				@click="showConfirmDelte = tagName"></span>
		</div>
		<div class="modal" v-if="showConfirmDelte" @click="showConfirmDelte = false">
			<div class="modal__body" @click.stop>
				Are you sure you want to remove this playlist?
				<div class="modal__btn-group">
					<button class="button" @click="showConfirmDelte = false">Cancel</button>
					<button class="button btn btn--blue" @click.stop="deletePlayList(tagName);showConfirmDelte = false;">Remove</button>
				</div>
			</div>
		</div>
	</li>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

</style>



