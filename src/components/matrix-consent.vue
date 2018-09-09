<script>
import { mapMutations } from 'vuex';
import { mapModuleState } from '../utils';

export default {
	data() {
		return {
			roomName: '',
		};
	},
	methods: {
		...mapMutations(['toggleMatrixConsentModal', 'toggleMatrixRoomDirectory']),
		close() {
			this.toggleMatrixConsentModal(false);
		},
	},
	computed: {
		...mapModuleState('matrix', ['showMatrixConsentModal', 'matrixConsentMessage']),
	},
};
</script>

<template>
	<div
		v-if="showMatrixConsentModal"
		@click="close"
		class="modal matrix-consent">
		<div class="modal__body" @click.stop>
			<h1>Matrix.org Terms &amp; Conditions</h1>
			<p v-html="matrixConsentMessage"></p>
			<p>After agreeing come back here and <a @click="toggleMatrixConsentModal(false);toggleMatrixRoomDirectory()">join a room</a>.</p>
		</div>
	</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-consent
	p
		text-overflow: ellipsis
		overflow: hidden
	a
		text-decoration: underline
		cursor: pointer

</style>
