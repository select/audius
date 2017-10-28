<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
	components: {
		draggable,
	},
	props: {
		id: String,
	},
	data() {
		return {
			showConfirmDelte: false,
		};
	},
	methods: {
		...mapMutations(['selectMediaSource', 'deletePlayList', 'renamePlayList', 'dropMoveItem']),
		dropAdd(event) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			this.dropMoveItem({ itemId, from: this.currentMediaSource, to: { type: 'playList', id: this.id } });
		},
	},
	computed: {
		...mapGetters(['playListLength']),
		...mapState(['sources', 'sourcesOrdered', 'currentMediaSource']),
	},
};
</script>

<template>
	<li
		v-bind:data-tag="id"
		v-bind:class="{ active: currentMediaSource.id == id }"
		@click="selectMediaSource({type: 'playList', id })">
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
				<div v-show="currentMediaSource.id != id">{{id}}</div>
				<div v-show="currentMediaSource.id == id">
					<input
						class="play-list-manager__tag-name-input"
						type="text"
						:value="id"
						@input="renamePlayList({oldName: id, newName: $event.target.value})"
						placeholder="... playlist name">
				</div>
				<div>{{sources[id].length}} Songs</div>
			</div>
		</draggable>
		<div class="play-list-manager__menu">
			<span
				class="wmp-icon-close"
				title="Delte playlist"
				@click.stop="showConfirmDelte = id"></span>
		</div>
		<div class="modal" v-if="showConfirmDelte" @click.stop="showConfirmDelte = false">
			<div class="modal__body" @click.stop>
				Are you sure you want to remove this playlist?
				<div class="modal__btn-group">
					<button class="button" @click="showConfirmDelte = false">Cancel</button>
					<button class="button btn btn--blue" @click.stop="deletePlayList(id);showConfirmDelte = false;">Remove</button>
				</div>
			</div>
		</div>
	</li>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

</style>



