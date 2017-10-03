<script>
import { mapState } from 'vuex';

export default {
	created() {
		const knownIdxs = [];
		this.subscriptions = [
			this.$store.watch(state => state.errorMessages, () => {
				(function hideEl(el, newIdxs, kidx) {
					setTimeout(() => {
						newIdxs.forEach(idx => {
							el.querySelector(`[data-id="${idx}"]`).hidden = true;
						});
						kidx.push(...newIdxs);
					}, 5000);
				})(
					this.$el,
					[...Array(this.errorMessages.length).keys()].filter(
						idx => !knownIdxs.includes(idx) && !this.errorMessages[idx].sticky
					),
					knownIdxs
				);
			}),
		];
	},
	beforeDestroy() {
		this.subscriptions.forEach((unsubscribe) => { unsubscribe(); });
	},
	computed: {
		...mapState(['errorMessages']),
	},
};
</script>

<template>
	<div class="messages">
		<div
			v-for="(message, idx) in errorMessages"
			v-bind:data-id="idx"
			class="messages__message">
			{{message.error}}
		</div>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.messages
	position: fixed
	top: $grid-space
	right: $grid-space
	z-index: 14
	> div
		margin-bottom: $grid-space
.messages__message
	font-size: .8em
	border-radius: $border-radius
	background: $color-monza
	color: $color-white
	padding: #{2 * $grid-space}
</style>
