<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
import { slugify } from '../utils/slugify';

export default {
	data() {
		return {
			roomName: '',
		};
	},
	methods: {
		...mapActions(['createMatrixRoom']),
		...mapMutations(['toggleMatrixRoomModal']),
		close() {
			this.toggleMatrixRoomModal(false);
		},
		_createMatrixRoom() {
			const visibility = this.$el.querySelector('#hidden-room-m').checked ? 'privat' : 'public';
			this.createMatrixRoom({
				room_alias_name: this.slugName,
				visibility,
				name: `${this.roomName} [Audius]`,
				topic: `Join this room at https://audius.rockdapus.org?import=#${this.slugName}:matrix.org&type=room&title=${encodeURIComponent(this.roomName)}`,
			});
		},
	},
	computed: {
		...mapState(['createMatrixRoomModal']),
		...mapGetters(['tagNames']),
		slugName() {
			if (this.roomName.length < 5) return '…';
			const slug = slugify(this.roomName)
				.slice(0, 20)
				.replace(/-$/, '');
			return `${slug}-audius`;
		},
	},
};
</script>

<template>
	<div
		v-if="createMatrixRoomModal"
		@click="close"
		class="modal matrix-create">
		<div class="modal__body" @click.stop>
			<p>
				<h3>Create matrix room</h3>
				<div>
					<input
						type="text"
						class="input--border"
						v-model="roomName"
						placeholder="Room name">
				</div>
				<div class="spacer"></div>
				#{{slugName}}:matrix.org
			</p>
			<p>
				<div>
					<input type="checkbox" id="hidden-room-m"><label for="hidden-room-m"></label>
					Hidden
					<span class="smaller">Not publicly listed</span>
				</div>
			</p>
			<div class="modal__btn-group">
				<button class="button" @click="close">Cancel</button>
				<button
					class="button btn--blue"
					v-bind:disabled="roomName.length < 5"
					v-bind:title="roomName.length < 5 ? 'The room name must be at least 5 characters long' : ''"
					@click="_createMatrixRoom">create</button>
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
</style>
