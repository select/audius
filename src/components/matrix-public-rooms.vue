<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
	methods: {
		...mapActions(['updatePublicRooms']),
		...mapMutations(['toggleMatrixRoomDirectory']),
		close() {
			this.toggleMatrixRoomDirectory(false);
		},
	},
	computed: {
		...mapState(['showMatrixRoomDirectory', 'matrix']),
	},
};
</script>

<template>
	<div
		v-if="showMatrixRoomDirectory"
		@click="close"
		class="modal matrix-public-rooms">
		<div class="modal__body" @click.stop>
			<h3>Public rooms</h3>
			<div
				v-if="!(matrix.publicRooms && matrix.publicRooms.length)"
				class="about-player__community-btns">
				<a class="button btn--blue" href="?import=!zKinTrtpQEyHfnIbnI:matrix.org&type=room&title=Random">Random</a>
				<a class="button btn--blue" href="?import=!VTIhlnDdHsxZFZQNFh:matrix.org&type=room&title=Rock">Rock</a>
				<a class="button btn--blue" href="?import=!sgKmJzakMmEdSCgKCE:matrix.org&type=room&title=Electronic">Electronic</a>
			</div>
			<div v-if="!(matrix.publicRooms && matrix.publicRooms.length)">
				<br>
				… press below to update rooms, it might take a while.
			</div>
			<div class="matrix-public-rooms__buttons">
				<a
					class="button btn--blue"
					v-for="room in matrix.publicRooms"
					v-bind:title="'['+room.numberOfMembers+' Members] '+room.topic"
					v-bind:href="'?import='+room.id+'&type=room&title='+encodeURIComponent(room.name)">
					{{room.name}}
				</a>
			</div>
			<div class="modal__btn-group">
				<button class="button" @click="close">Cancel</button>
				<button class="button btn--blue-ghost" @click="updatePublicRooms">update room list</button>
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
