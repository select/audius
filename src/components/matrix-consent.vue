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
		...mapMutations(['toggleMatrixConsentModal']),
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
			<p v-html="matrixConsentMessage"></p>
		</div>
	</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-consent p
	overflow: hidden
	text-overflow: ellipsis

</style>
