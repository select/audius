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
			showInvited: true,
			showHiddenPeople: false,
			showInvitedPeople: true,
			fold: {
				Rooms: true,
				People: true,
			},
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
		_sources() {
			return this.sourcesOrdered.reduce((acc, id) => {
				const room = this.sources[id];
				if (!room.roomId) console.log('aaaa ', room.name)
				acc[room.type][room.membership === 'invite' ? 'invited' : room.hidden ? 'hidden' : 'visible'].push(id);
				return acc;
			},
			{
				room: { hidden: [], visible: [], invited: [] },
				directMessage: { hidden: [], visible: [], invited: [] },
			});
		},
		directMessagesOrdered: {
			get() {
				return this._sources.directMessage.visible;
			},
			set(value) {
				this.moveMatrixSourcesOrdered([
					...this._sources.room.visible,
					...this._sources.room.hidden,
					...this._sources.room.invited,
					...value,
					...this._sources.directMessage.hidden,
					...this._sources.directMessage.invited,
				]);
			},
		},
		roomsOrdered: {
			get() {
				return this._sources.room.visible;
			},
			set(value) {
				this.moveMatrixSourcesOrdered([
					...value,
					...this._sources.room.hidden,
					...this._sources.room.invited,
					...this._sources.directMessage.visible,
					...this._sources.directMessage.hidden,
					...this._sources.directMessage.invited,
				]);
			},
		},
	},
};
</script>

<template>
<div class="matrix-room play-list-manager__wrapper">
	<div v-if="!(loadedModules.matrix  && matrixLoggedIn)" class="matrix-room__logging-in">
		&nbsp; … connecting to Matrix.org
	</div>
	<div v-if="loadedModules.matrix && matrixLoggedIn">
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

		<h2 id="lm-rooms" title="fold" @click="fold['Rooms'] = !fold['Rooms']">Rooms</h2>
		<div v-show="fold['Rooms']">
			<!-- Invited Room -->
			<div
				v-show="_sources.room.invited.length">
				<div
					class="play-list-manager__show-hidden-rooms"
					@click="showInvited = !showInvited">you are invited ({{_sources.room.invited.length}})</div>
				<div v-show="showInvited">
					<ul>
						<matrix-room-tag
							v-for="(id, index) in _sources.room.invited"
							:key="index"
							:id="id"
							:room="sources[id]">
						</matrix-room-tag>
					</ul>
					<div class="spacer"></div>
				</div>
			</div>
			<!-- Rooms -->
			<draggable
				v-if="roomsOrdered"
				class="matrix-room__tags"
				v-model="roomsOrdered"
				element="ul"
				:options="{
					animation: 150,
					scrollSpeed: 20,
					handle: '.play-list-manager__drag-handle',
				}">
				<matrix-room-tag
					v-for="(id, index) in roomsOrdered"
					v-bind:class="{ active: currentMediaSource.id == id }"
					:key="index"
					:id="id"
					:room="sources[id]">
				</matrix-room-tag>

			</draggable>
			<!-- Hidden room -->
			<div v-if="_sources.room.hidden.length">
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
							v-for="(id, index) in _sources.room.hidden"
							v-bind:class="{ active: currentMediaSource.id == id }"
							:key="index"
							:id="id"
							:room="sources[id]">
						</matrix-room-tag>
					</ul>
				</div>
			</div>

			<!-- Create room / join room -->
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
			<div class="spacer"></div>
		</div>

		<h2 id="lm-rooms" title="fold" @click="fold['People'] = !fold['People']">People</h2>
		<div v-show="fold['People']">
			<!-- Invited People -->
			<div
				class="play-list-manager__show-hidden-rooms"
				v-show="_sources.directMessage.invited.length"
				@click="showInvitedPeople = !showInvitedPeople">you are invited ({{_sources.directMessage.invited.length}})</div>
			<div v-show="showInvitedPeople && _sources.directMessage.invited.length">
				<ul>
					<matrix-room-tag
						v-for="(id, index) in _sources.directMessage.invited"
						:key="index"
						:id="id"
						:room="sources[id]">
					</matrix-room-tag>
				</ul>
				<div class="spacer"></div>
			</div>
			<!-- People with active chat -->
			<draggable
				v-if="directMessagesOrdered"
				class="matrix-room__tags"
				v-model="directMessagesOrdered"
				element="ul"
				:options="{
					animation: 150,
					scrollSpeed: 20,
					handle: '.play-list-manager__drag-handle',
				}">
				<matrix-room-tag
					v-for="(id, index) in directMessagesOrdered"
					v-bind:class="{ active: currentMediaSource.id == id }"
					:key="index"
					:id="id"
					:room="sources[id]">
				</matrix-room-tag>
			</draggable>
			<!-- Hidden People -->
			<div v-if="matrixLoggedIn && _sources.directMessage.hidden.length">
				<div
					v-if="!showHiddenPeople"
					@click="showHiddenPeople = true"
					class="play-list-manager__show-hidden-rooms">
					show hidden
				</div>
				<div v-if="showHiddenPeople">
					<div
						@click="showHiddenPeople = false"
						class="play-list-manager__show-hidden-rooms">
						hide
					</div>
					<ul>
						<matrix-room-tag
							v-for="(id, index) in _sources.directMessage.hidden"
							:key="index"
							:id="id"
							:room="sources[id]">
						</matrix-room-tag>
					</ul>
				</div>

			</div>
		</div>
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


.matrix-room__logging-in
	width: 100%
	padding: 0 $grid-space
	text-align: center
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



