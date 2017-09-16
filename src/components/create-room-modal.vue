<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';

export default {
	data() {
		return {
			importName: '',
			overwriteChannel: false,
		};
	},
	mounted() {
		this.importName = this.pendingImportURL ? this.pendingImportURL.name : '';
	},
	methods: {
		...mapActions(['createMatrixRoom']),
		...mapMutations(['toggleMatrixRoomModal']),
		close() {
			this.toggleMatrixRoomModal(false);
		},

	},
	computed: {
		...mapState(['createMatrixRoomModal']),
		...mapGetters(['tagNames']),
	},
};
</script>

<template>
	<div
		v-if="createMatrixRoomModal"
		@click="close"
		class="modal">
		<div class="modal__body" @click.stop>
			<p>
				<h3>Create matrix room</h3>
				<div>
					<input type="text" placeholder="Room name">
				</div>
				<div class="spacer"></div>
			</p>
			<p>
				<div>
					<input type="checkbox" id="private-room"><label for="private-room"></label>
					Hidden
					<span class="smaller">Not publicly listed</span>
				</div>
				<div>
					<input type="checkbox" id="private-room"><label for="private-room"></label>
					Private
					<span class="smaller">New users need to be approved</span>
				</div>
				<div>
					<input type="checkbox" id="can-post"><label for="can-post"></label>
					Restrict posting
					<span class="smaller">Only Jacks and higher are allowed to post</span>
				</div>
			</p>
			<p>
				<button
					class="button btn--blue"
					@click="createMatrixRoom">create</button>
			</p>
		</div>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

// .import-modal__row
// 	display: flex
// 	flex-direction: row
// 	align-items: center
// 	> *:not(:last-child)
// 		margin-right: $grid-space
// .import-modal__last
// 	text-align: right
</style>
