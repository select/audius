<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';

import MatrixCreateRoom from './matrix-create-room.vue';
import MatrixPublicRooms from './matrix-public-rooms.vue';
import MatrixConsentModal from './matrix-consent.vue';
import MatrixLogin from './matrix-login.vue';
import { mapModuleState } from '../utils';

export default {
	components: {
		draggable,
		MatrixCreateRoom,
		MatrixPublicRooms,
		MatrixConsentModal,
		MatrixLogin,
	},
	data() {
		return {
			showConfirmDelte: false,
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
			if (!(id in this.sources)) return 0;
			const res = this.sources[id].archive ? this.sources[id].archive.length : 0;
			return res + Object.keys(this.sources[id].playedMedia).length;
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
				this.error('not implemented');
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
				Please login or register your <b>Riot.im account</b>.<br><br>
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
					@click="selectMediaSource({ type: 'matrix', id: id })">
					<div>
						{{matrix.sources[id].name}}
					</div>
					<div class="matrix-room__tag-footer">
						<div> {{sources[id].playList.length - Object.keys(sources[id].playedMedia).length}} New </div>
						<div> {{sources[id].members ? sources[id].members.length : '?'}} Members </div>
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

		<div v-if="matrixLoggedIn && _hiddenSourcesOrdered.length">
			<div v-if="showHidden">
				<div
					@click="showHidden = false"
					class="play-list-manager__show-hidden-rooms">
					hide
				</div>
				<ul>
					<li v-for="id in _hiddenSourcesOrdered">
						<div
							class="play-list-manager__tag-body"
							@click="selectMediaSource({ type: 'matrix', id: id })">
							<div>
								{{matrix.sources[id].name}}
							</div>
							<div class="matrix-room__tag-footer">
								<div> {{sources[id].playList.length - Object.keys(sources[id].playedMedia).length}} New </div>
								<div> {{sources[id].members ? sources[id].members.length : '?'}} Members </div>
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
					</li>
				</ul>
			</div>
			<div
				@click="showHidden = true"
				class="play-list-manager__show-hidden-rooms"
				v-if="!showHidden">
				show hidden
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
.matrix-room__tag-footer
	display: flex
	div
		min-width: 4em
.play-list-manager__show-hidden-rooms
	margin-left: $grid-space
	text-transform: uppercase
	font-size: .7rem
	cursor: pointer
	text-align: center;
</style>



