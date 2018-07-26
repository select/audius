<script>
import { mapActions, mapMutations } from 'vuex';
import { mapModuleState } from '../utils';

const roomsList = [
	{ id: '!vginOAdNcoiesrilGC:matrix.org', name: 'Music Links' },
	{ id: '!zKinTrtpQEyHfnIbnI:matrix.org', name: 'Random' },
	{ id: '!doxyJrwhqLPtPKawfE:matrix.org', name: '😁😄😅😆😆 wtf' },
	{ id: '!sgKmJzakMmEdSCgKCE:matrix.org', name: 'Electronic' },
	{ id: '!VTIhlnDdHsxZFZQNFh:matrix.org', name: 'Rock' },
	{ id: '!aSJNcnulrVagkddEtD:matrix.org', name: 'Chillout ' },
	{ id: '!wkEBtQpMVXqZktQwjF:matrix.org', name: 'Docu / Tech / Science [Audius]' },
	// { id: '!uFhErnfpYhhlauJsNK:matrix.org', name: 'Music Discovery' },
];

export default {
	methods: {
		...mapActions(['updatePublicRooms', 'joinMatrixRoom']),
		...mapMutations(['toggleMatrixRoomDirectory']),
		close() {
			this.toggleMatrixRoomDirectory(false);
		},
	},
	computed: {
		...mapModuleState('matrix', ['sources', 'showMatrixRoomDirectory', 'publicRooms']),
		filteredRoomList() {
			return roomsList.filter(({ id }) => !(id in this.sources));
		},
		filteredPublicRooms() {
			return this.publicRooms.filter(({ id }) => !(id in this.sources));
		},
	},
};
</script>

<template>
	<div v-if="showMatrixRoomDirectory">
		<div
			@click="close"
			class="modal matrix-public-rooms">
			<div class="modal__body" @click.stop>
				<h3>Public rooms</h3>
				<div
					v-if="!(publicRooms && publicRooms.length)"
					class="about-player__community-btns matrix-public-rooms__buttons">

					<div
						v-for="room in filteredRoomList"
						class="button btn--blue"
						@click="joinMatrixRoom({ id: room.id, name: room.name })">
						{{room.name}}
					</div>
				</div>
				<div v-if="!(publicRooms && publicRooms.length)">
					<br>
					… press below to update rooms, it might take a while.
				</div>
				<div class="matrix-public-rooms__buttons">
					<a
						class="button btn--blue"
						v-for="room in filteredPublicRooms"
						v-bind:title="'['+room.numberOfMembers+' Members] '+room.topic"
						@click="joinMatrixRoom({ id: room.id, name: room.name })">
						{{room.name}}
					</a>
					<span v-if="publicRooms && publicRooms.length && !filteredPublicRooms.length">… you joined all available rooms</span>
				</div>
				<div class="modal__btn-group">
					<button class="button" @click="close">Cancel</button>
					<button class="button btn--blue-ghost" @click="updatePublicRooms">update room list</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.matrix-create
	input
		width: 100%
		margin-bottom: $grid-space
.matrix-public-rooms__buttons
	display: flex
	flex-wrap: wrap
	>*
		margin: 0 $grid-space $grid-space 0
</style>
