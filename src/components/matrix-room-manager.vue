<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';

import MatrixCreateRoom from './matrix-create-room.vue';
import MatrixPublicRooms from './matrix-public-rooms.vue';
import MatrixConsentModal from './matrix-consent.vue';
import MatrixRoomTag from './matrix-room-tag.vue';
import MatrixLogin from './matrix-login.vue';
import { mapModuleState } from '../utils';

export default {
	components: {
		draggable,
		MatrixCreateRoom,
		MatrixPublicRooms,
		MatrixConsentModal,
		MatrixLogin,
		MatrixRoomTag,
	},
	data() {
		return {
			showHidden: false,
		};
	},
	created() {
		this.initModule('matrix');
		setTimeout(() => {
			this.$forceUpdate();
		}, 1000);
	},
	methods: {
		...mapMutations([
			'selectMediaSource',
			'toggleMatrixRoomModal',
			'toggleMatrixRoomDirectory',
			'toggleMatrixLoginModal',
			'setMatrixRoomTag',
			'moveMatrixSourcesOrdered',
			'error',
		]),
		...mapActions(['joinMatrixRoom', 'initModule']),
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
	},
	computed: {
		...mapState([
			'loadedModules',
			'currentMediaSource',
			'matrix',
		]),
		...mapModuleState('matrix', [
			'sources',
			'sourcesOrdered',
			'matrixLoggedIn',
			'showMatrixLoginModal',
		]),
		_hiddenSourcesOrdered: {
			get() {
				return this.sourcesOrdered.filter(id => this.sources[id].hidden);
			},
			set(value) {
				this.error('not implemented');
			},
		},

		_sourcesOrdered: {
			get() {
				return this.sourcesOrdered.filter(id => !this.sources[id].hidden);
			},
			set(value) {
				this.moveMatrixSourcesOrdered([...value, ...this._hiddenSourcesOrdered]);
			},
		},
	},
};
</script>

<template>
<div class="matrix-room play-list-manager__wrapper">
	<div v-if="loadedModules.matrix">
		<div v-if="!matrixLoggedIn" class="matrix-room__logging-in">
			&nbsp; … connecting to Matrix.org
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
		<matrix-consent-modal></matrix-consent-modal>

		<div class="modal" v-if="showMatrixLoginModal" @click="toggleMatrixLoginModal()">
			<div class="modal__body" @click.stop>
				Guest users are not allowed to join this room. <br>
				Please login or register your <b>Matrix / Riot.im account</b>.<br><br>
				<matrix-login></matrix-login>
			</div>
		</div>

		<draggable
			v-if="matrixLoggedIn"
			class="matrix-room__tags"
			v-model="_sourcesOrdered"
			element="ul"
			:options="{
				animation: 150,
				scrollSpeed: 20,
				handle: '.play-list-manager__drag-handle',
			}">
			<matrix-room-tag
				v-for="(id, index) in _sourcesOrdered"
				v-bind:class="{ active: currentMediaSource.id == id }"
				:key="index"
				:id="id"
				:room="sources[id]">
			</matrix-room-tag>

		</draggable>

		<div v-if="matrixLoggedIn && _hiddenSourcesOrdered.length">
			<div
				v-if="!showHidden"
				@click="showHidden = true"
				class="play-list-manager__show-hidden-rooms">
				show hidden
			</div>
			<div v-if="showHidden">
				<div
					@click="showHidden = false"
					class="play-list-manager__show-hidden-rooms">
					hide
				</div>
				<ul>
					<matrix-room-tag
						v-for="(id, index) in _hiddenSourcesOrdered"
						:key="index"
						:id="id"
						:room="sources[id]">
					</matrix-room-tag>
				</ul>
			</div>
		</div>

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

	</div>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-room__menu
	display: none

.matrix-room
	color: $color-white
	.modal__body
		color: $color-palesky

.matrix-room__room-join-create,
.matrix-room__room-list
	position: relative

.matrix-room__room-join-create:before,
.matrix-room__room-list:before
	position: absolute
	transform: rotate(-53.4deg)
	transform-origin: 5.8rem 3.5rem
	color: $color-athensgrey
	font-size: 0.8rem
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

.play-list-manager__show-hidden-rooms
	margin-left: $grid-space
	text-transform: uppercase
	font-size: .7rem
	cursor: pointer
	text-align: center;
</style>



