<script>
import { mapActions, mapMutations } from 'vuex';
import { mapModuleState } from '../utils';

export default {
	methods: {
		...mapActions(['updatePublicRooms', 'joinMatrixRoom']),
		...mapMutations(['toggleMatrixRoomDirectory']),
		close() {
			this.toggleMatrixRoomDirectory(false);
		},
	},
	computed: {
		...mapModuleState('matrix', ['showMatrixRoomDirectory', 'publicRooms']),
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
					class="about-player__community-btns">
					<div class="button btn--blue" @click="joinMatrixRoom({ id: '!zKinTrtpQEyHfnIbnI:matrix.org', name: 'Random' })">Random</div>
<!-- http://localhost:8080/?import=!wkEBtQpMVXqZktQwjF:matrix.org&type=room&title=Docu%20%2F%20Tech%20%2F%20Science%20%5BAudius%5D
http://localhost:8080/?import=!sgKmJzakMmEdSCgKCE:matrix.org&type=room&title=Electronic%20%5BAudius%5D
http://localhost:8080/?import=!vginOAdNcoiesrilGC:matrix.org&type=room&title=Music%20Links
http://localhost:8080/?import=!aSJNcnulrVagkddEtD:matrix.org&type=room&title=Chillout%20%5BAudius%5D
http://localhost:8080/?import=!uFhErnfpYhhlauJsNK:matrix.org&type=room&title=Music%20Discovery -->

					<div class="button btn--blue" @click="joinMatrixRoom({ id: '!VTIhlnDdHsxZFZQNFh:matrix.org', name: 'Rock' })">Rock</div>
					<div class="button btn--blue" @click="joinMatrixRoom({ id: '!sgKmJzakMmEdSCgKCE:matrix.org', name: 'Electronic' })">Electronic</div>
				</div>
				<div v-if="!(publicRooms && publicRooms.length)">
					<br>
					… press below to update rooms, it might take a while.
				</div>
				<div class="matrix-public-rooms__buttons">
					<a
						class="button btn--blue"
						v-for="room in publicRooms"
						v-bind:title="'['+room.numberOfMembers+' Members] '+room.topic"
						@click="joinMatrixRoom({ id: room.id, name: room.name })">
						{{room.name}}
					</a>
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
