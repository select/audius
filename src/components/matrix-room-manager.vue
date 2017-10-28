<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';

import MatrixCreateRoom from './matrix-create-room.vue';
import MatrixPublicRooms from './matrix-public-rooms.vue';
import MatrixLogin from './matrix-login.vue';


export default {
	components: {
		draggable,
		MatrixCreateRoom,
		MatrixPublicRooms,
		MatrixLogin,
	},
	data() {
		return {
			showConfirmDelte: false,
		};
	},
	created() {
		if (this.matrixEnabled) {
			this.initModule('matrix');
		}
	},
	methods: {
		...mapMutations([
			'setMatrixEnabled',
			'selectMediaSource',
			'setShowMediumSettings',
			'toggleMatrixRoomModal',
			'toggleMatrixRoomDirectory',
			'toggleMatrixLoginModal',
			'setMatrixRoomTag',
			'error',
		]),
		...mapActions(['joinMatrixRoom', 'leaveMatrixRoom', 'matrixSend', 'initModule']),
		addMatrixRoom() {
			const el = document.querySelector('.matrix-room input');
			const roomIdRegEx = /#[\w-]+:[\w-]+\.\w{2,}/;
			if (!roomIdRegEx.test(el.value)) {
				this.toggleMatrixRoomModal(el.value || true);
				// this.error('Please enter a room id.');
			} else {
				this.joinMatrixRoom({ id: el.value });
			}
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
		...mapState([
			'matrixEnabled',
			'loadedModules',
			'currentMediaSource',
		]),
		...mapState([
			'sources',
			'sourcesOrdered',
			'matrixLoggedIn',
			'showMatrixLoginModal',
		].reduce(
			(acc, n) => Object.assign(acc, { [n]: state => state.matrix[n] }),
			{}
		)),
		_sourcesOrdered: {
			get() {
				return this.sourcesOrdered;
			},
			set(value) {
				this.error('not implemented');
			},
		},
	},
};
</script>

<template>
<div class="matrix-room play-list-manager__wrapper">
	<div v-if="!matrixEnabled" class="play-list-manager__enable-matrix">
		<a href="https://matrix.org/" target="_blank" rel="noopener">Matrix</a> is a chat network that allows you to share music and videos with your friends. Press the button to create a guest user and join Matrix.
		<br>
		<br>
		<button
			class="button btn--blue"
			@click="setMatrixEnabled();initModule('matrix');"
			type="button">Join Matrix</button>
	</div>
	matrixEnabled: {{matrixEnabled}} loadedModules.matrix: {{loadedModules.matrix}}
	<div v-if="matrixEnabled && loadedModules.matrix">
		matrixLoggedIn: {{matrixLoggedIn}}
		<div v-if="matrixEnabled && !matrixLoggedIn" class="matrix-room__logging-in">
			&nbsp; … connecting to Matrix
		</div>
		<div
			class="play-list-manager__room-suggestions"
			v-if="matrixLoggedIn && !sourcesOrdered.length">
			You did not join any rooms yet!
			<br>
			<br>
			<button class="button btn--blue" @click="toggleMatrixRoomDirectory()">
				<span class="wmp-icon-format_list_bulleted"></span>
				rooms
			</button>
			<br>
			<br>
			Open the room list
			or
			create your own room.
		</div>
		<matrix-create-room></matrix-create-room>
		<matrix-public-rooms></matrix-public-rooms>

		<div class="modal" v-if="showMatrixLoginModal" @click="toggleMatrixLoginModal()">
			<div class="modal__body" @click.stop>
				You are a guest user. Guest users are not allowed to join this room. Create a full accound with
				<a
				href="https://riot.im/app/#/room/#audius:matrix.org"
				target="_blank" rel="noopener">Riot</a>
				or <a href="https://matrix.org/docs/projects/try-matrix-now.html#clients" target="_blank" rel="noopener">another client</a> and login below.
				<matrix-login></matrix-login>
			</div>
		</div>

		<draggable
			class="matrix-room__tags"
			v-model="_sourcesOrdered"
			element="ul"
			:options="{
				animation: 150,
				scrollSpeed: 20,
				handle: '.play-list-manager__drag-handle',
			}">
			<draggable
				v-for="id in _sourcesOrdered"
				:key="id"
				class="play-list-manager__tag-drop-zone"
				element="li"
				@add="dropAdd($event, id)"
				:options="{
					sort: false,
					handle: '.no-handle',
					group: { name: 'lists' }
				}"
				v-bind:class="{ active: currentMediaSource.id == id }">
				<div class="play-list-manager__drag-handle"></div>
				<div
					class="play-list-manager__tag-body"
					@click="selectMediaSource({ type: 'webScraper', id: id })">
					<div>
						{{matrixRooms[id].name}}
					</div>
					<div>
						{{matrixRooms[id].playList.length - Object.keys(matrixRooms[id].playedMedia).length}} New
						{{numWatched(id)}} Watched
					</div>
				</div>
				<div class="play-list-manager__menu">
					<span
						class="wmp-icon-mode_edit"
						title="Edit room"
						@click.stop="setShowMediumSettings({ medium: 'matrix', id })"></span>
					<span
						class="wmp-icon-close"
						title="Leave room"
						@click.stop="showConfirmDelte = id"></span>
				</div>
			</draggable>
		</draggable>

		<ul class="matrix-room__tags">
			<li
				class="play-list-manager__input"
				v-if="matrixLoggedIn">
				<div class="play-list-manager__tag-body">
					<input
						v-on:keyup.enter="addMatrixRoom"
						type="text"
						placeholder="… room id or name">
				</div>
				<div class="matrix-room__room-join-create">
					<span
						class="wmp-icon-add"
						title="Create / join room"
						@click="addMatrixRoom"></span>
				</div>
				<div class="matrix-room__room-list">
					<span
						class="wmp-icon-format_list_bulleted"
						title="Room List"
						@click="toggleMatrixRoomDirectory()"></span>
				</div>
			</li>
		</ul>
		<div class="modal" v-if="showConfirmDelte" @click="showConfirmDelte = false">
			<div class="modal__body" @click.stop>
				Are you sure you want to leave the room?
				<div class="modal__btn-group">
					<button class="button" @click="showConfirmDelte = false">Cancel</button>
					<button class="button btn--blue" @click.stop="leaveMatrixRoom(showConfirmDelte);showConfirmDelte = false;">Leave</button>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.matrix-room__menu
	display: none

.matrix-room
	color: $color-white
	.modal__body
		color: $color-palesky

.matrix-room__room-join-create:before,
.matrix-room__room-list:before
	position: absolute
	transform: rotate(-53.4deg)
	transform-origin: 5.8rem 3.5rem
	font-size: 0.8rem
	color: $color-athensgrey
	pointer-events: none
.matrix-room__room-list:before
	content: 'ROOMS'
.matrix-room__room-join-create:before
	content: 'CREATE'


.matrix-room__logging-in,
.play-list-manager__enable-matrix
	width: 100%
	text-align: center
	padding: 0 $grid-space
	margin-top: $touch-size-medium
.play-list-manager__room-suggestions
	margin: $grid-space
	text-align: center
	span
		text-decoration: underline
		cursor: pointer
	> button.button
		padding: 0 #{2 * $grid-space}
		display: inline-flex
		align-items: center
		> span
			margin-right: #{2 * $grid-space}

</style>



