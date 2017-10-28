<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
import { slugify } from '../utils/slugify';
import MatrixLogin from './matrix-login.vue';

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
		...mapState(['createMatrixRoomModal', 'matrix']),
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
			<div v-if="matrix.isGuest !== false">
				You are a guest user. Guest users are not allowed to create rooms. Create a full accound with
					<a
					href="https://riot.im/app/#/room/#audius:matrix.org"
					target="_blank" rel="noopener">Riot</a>
					or <a href="https://matrix.org/docs/projects/try-matrix-now.html#clients" target="_blank" rel="noopener">another client</a> and login below.
				<p>
					<matrix-login></matrix-login>
				</p>
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

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.matrix-create
	input
		width: 100%
		margin-bottom: $grid-space
</style>
