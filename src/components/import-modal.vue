<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';

export default {
	methods: {
		...mapActions(['importURL']),
		...mapMutations(['setPendingImportURL']),
		close() {
			this.setPendingImportURL(null);
		},
		importURLtoPlayList() {
			const el = document.querySelector('.import-modal__other-playlist-input');
			const value = el.value || null;
			this.importURL({ url: this.pendingImportURL.url, name: value });
		},
		importURLCreate() {
			const el = document.querySelector('.import-modal__name-input');
			this.importURL({ url: this.pendingImportURL.url, name: el.value });
		},
	},
	computed: {
		...mapState(['pendingImportURL']),
		...mapGetters(['tagNames']),
	},
};
</script>

<template>
	<div
		v-if="pendingImportURL"
		@click="close"
		class="import-modal modal">
		<div class="modal__body" @click.stop>
			<p>
				Create new playlist
				<div class="import-modal__row">
					<input class="import-modal__name-input" type="text" placeholder="... name" v-bind:value="pendingImportURL.name">
					<button class="button btn--blue" @click="importURLCreate">Create</button>
				</div>
			</p>
			<p>
				Add songs to playlist
				<div class="import-modal__row">
					<select class="import-modal__other-playlist-input">
						<option value="">Default</option>
						<option v-for="playListName in tagNames">{{playListName}}</option>
					</select>
					<button class="button btn--blue" @click="importURLtoPlayList">Add</button>
				</div>
			</p>
			<p class="import-modal__last">
					<button class="button " @click="close">Cancel</button>
			</p>
		</div>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.import-modal__row
	display: flex
	flex-direction: row
	align-items: center
	> *:not(:last-child)
		margin-right: $grid-space
.import-modal__last
	text-align: right
</style>
