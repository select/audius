<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';

import CreateRoomModal from './create-room-modal.vue';

export default {
	components: {
		draggable,
		CreateRoomModal,
	},
	data() {
		return {
			showConfirmDelte: false,
		};
	},
	methods: {
		...mapMutations(['selectMediaSource', 'movematrixRoomsOrdered', 'setShowMediumSettings', 'toggleMatrixRoomModal']),
		...mapActions(['joinMatrixRoom', 'leaveMatrixRoom', 'matrixSend']),
		addMatrixRoom() {
			const el = document.querySelector('.matrix-room input');
			if (!el.value) this.toggleMatrixRoomModal();
			else this.joinMatrixRoom({ id: el.value });
			el.value = '';
		},
		dropAdd(event, roomId) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			this.matrixSend({ roomId, itemId });
		},
		numWatched(id) {
			if (!(id in this.matrixRooms)) return 0;
			const res = this.matrixRooms[id].archive ? this.matrixRooms[id].archive.length : 0;
			return res + Object.keys(this.matrixRooms[id].playedMedia).length;
		},
	},
	computed: {
		...mapState(['matrixRooms', 'currentMatrixRoom', 'matrixRoomsOrdered', 'matrixRooms', 'matrixLoggedIn']),
		_matrixRoomsOrdered: {
			get() {
				return this.matrixRoomsOrdered;
			},
			set(value) {
				this.moveRoomsOrdered(value);
			},
		},
	},
};
</script>

<template>
<div class="matrix-room play-list-manager__wrapper">
	<create-room-modal></create-room-modal>
	<draggable
		class="matrix-room__tags"
		v-model="_matrixRoomsOrdered"
		element="ul"
		:options="{
			animation: 150,
			scrollSpeed: 20,
			handle: '.play-list-manager__drag-handle',
		}">
		<draggable
			v-for="id in _matrixRoomsOrdered"
			:key="id"
			class="play-list-manager__tag-drop-zone"
			element="li"
			@add="dropAdd($event, id)"
			:options="{
				sort: false,
				handle: '.no-handle',
				group: { name: 'lists' }
			}"
			v-bind:class="{ active: currentMatrixRoom == id }">
			<div class="play-list-manager__drag-handle"></div>
			<div
				class="play-list-manager__tag-body"
				@click="selectMediaSource({ type: 'radio', id: id })">
				<div>
					{{matrixRooms[id].name}}
				</div>
				<div>{{matrixRooms[id].playList.length - Object.keys(matrixRooms[id].playedMedia).length}} New {{numWatched(id)}} Watched </div>
			</div>
			<div class="play-list-manager__menu">
				<span
					class="wmp-icon-mode_edit"
					title="Edit room"
					@click.stop="setShowMediumSettings({ medium: 'matrix', id })"></span>
				<span
					class="wmp-icon-close"
					title="Leave room"
					@click="showConfirmDelte = id"></span>
			</div>
		</draggable>
	</draggable>

	<ul class="matrix-room__tags">
		<li
			class="play-list-manager__input"
			v-if="matrixLoggedIn">
			<input
				v-on:keyup.enter="addMatrixRoom"
				type="text"
				placeholder="… room id or click">
			<span
				class="wmp-icon-add"
				title="Create / Join room"
				@click="addMatrixRoom"></span>
		</li>
		<li v-if="!matrixLoggedIn">
			&nbsp; … connecting to matrix
		</li>
	</ul>
	<div class="modal" v-if="showConfirmDelte" @click="showConfirmDelte = false">
		<div class="modal__body" @click.stop>
			Are you sure you want to leave the room?
			<div class="modal__btn-group">
				<button class="button" @click="showConfirmDelte = false">Cancel</button>
				<button class="button btn btn--blue" @click.stop="leaveMatrixRoom(showConfirmDelte);showConfirmDelte = false;">Leave</button>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.matrix-room__tag-body
	flex: 1
	text-overflow: ellipsis
	white-space: nowrap
	overflow: hidden

.matrix-room__menu
	display: none

</style>


