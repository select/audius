<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';

export default {
	components: {
		draggable,
	},
	methods: {
		...mapMutations(['selectMediaSource', 'movematrixRoomsOrdered']),
		...mapActions(['joinMatrixRoom', 'leaveMatrixRoom', 'matrixSend']),
		addMatrixRoom() {
			const el = document.querySelector('.matrix-radio__input input');
			this.joinMatrixRoom({ id: el.value });
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
		...mapState(['matrixRooms', 'currentMatrixRoom', 'matrixRoomsOrdered', 'matrixRooms']),
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
<div class="matrix-radio play-list-manager__wrapper">
	<draggable
		class="matrix-radio__tags"
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
			:options="{ sort: false, group: { name: 'lists' } }"
			v-bind:class="{ active: currentMatrixRoom == id }">
			<div class="play-list-manager__drag-handle"></div>
			<div
				class="play-list-manager__tag-body"
				@click="selectMediaSource({ type: 'radio', id: id })">
				{{matrixRooms[id].name}}
				<div>{{matrixRooms[id].playList.length - Object.keys(matrixRooms[id].playedMedia).length}} New {{numWatched(id)}} Watched </div>
			</div>
			<div class="play-list-manager__menu">
				<span
					class="wmp-icon-close"
					title="Leave room"
					@click.stop="leaveMatrixRoom(id)"></span>
			</div>
		</draggable>
	</draggable>

	<ul class="matrix-radio__tags">

		<li class="play-list-manager__input matrix-radio__input">
			<input
				v-on:keyup.enter="addMatrixRoom"
				type="text"
				placeholder="... room ">
			<span
				class="wmp-icon-add"
				title="Join room"
				@click="addMatrixRoom"></span>
		</li>
	</ul>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

// .matrix-radio
// 	flex: 1
// 	overflow-y: auto
// 	&::-webkit-scrollbar-thumb
// 	  background: $color-athensgrey
// 	&::-webkit-scrollbar-track
// 		background: $color-aluminium-dark
// 	ul
// 		padding: 0
// 		list-style: none
// 		margin: 0
// 		li
// 			display: flex
// 			height: $touch-size-medium
// 			margin: $grid-space
// 			border-radius: $border-radius
// 			align-items: center
// 			background: $color-athensgrey
// 			color: $color-palesky
// 			cursor: pointer
// 			&.active
// 				font-weight: bold
// 				background: $color-white

// 			&:hover:not(.spacer)
// 				border-color: $color-pictonblue
// 				color: $color-pictonblue
// 				background: $color-white
// 				.matrix-radio__menu
// 					display: block
// 				input
// 					color: $color-pictonblue

// 		.spacer
// 			background: transparent
// 			height: $grid-space

.matrix-radio__tag-body
	flex: 1
	text-overflow: ellipsis
	white-space: nowrap
	overflow: hidden

// .matrix-radio__drag-handle
// 	width: #{2*$grid-space}
// 	height: 100%
// 	&:not(.matrix-radio--default)
// 		cursor: move

.matrix-radio__menu
	display: none

</style>



