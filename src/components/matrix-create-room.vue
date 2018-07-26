<script>
import { mapActions, mapMutations } from 'vuex';
import { slugify } from '../utils/slugify';
import MatrixLogin from './matrix-login.vue';
import { mapModuleState } from '../utils';

export default {
	components: {
		MatrixLogin,
	},
	data() {
		return {
			roomName: '',
		};
	},
	created() {
		this.$store.watch(state => state.createMatrixRoomModal, () => {
			if (typeof this.createMatrixRoomModal === 'string') this.roomName = this.createMatrixRoomModal;
		});
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
		matrixLogin() {
			const usernameEl = this.$el.querySelector('#username');
			const passwordEl = this.$el.querySelector('#password');
			this.loginMatrixWithPassword({ username: usernameEl.value, password: passwordEl.value });
			this.$el.querySelector('#username').value = '';
			this.$el.querySelector('#password').value = '';
		},
	},
	computed: {
		...mapModuleState('matrix', ['createMatrixRoomModal', 'isGuest']),
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
			<div v-if="isGuest !== false">
				Guest users are not allowed to create rooms. <br>
				Please login or register your Riot.im account. <br><br>
				<matrix-login></matrix-login>
			</div>
			<div v-else>
				<h3>Create matrix room</h3>
				<p>
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
	</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-create
	input
		width: 100%
		margin-bottom: $grid-space
.matrix-create__group
	display: flex
	align-items: flex-end
.create-room__register
	margin-bottom: 3px;
</style>
