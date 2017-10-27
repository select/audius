<script>
import { mapState } from 'vuex';

export default {
	mounted() {
		/* eslint no-param-reassign: 'off' */
		this.knownIdxs = [];
		this.hideMessages();
		this.subscriptions = [
			this.$store.watch(state => state.errorMessages, () => {
				this.hideMessages();
			}),
		];
	},
	methods: {
		hideMessages() {
			(function hideEl(el, errors, kidx) {
				if (!errors.length) return;
				setTimeout(() => {
					errors.forEach(error => {
						el.querySelector(`[data-id="${error.id}"]`).hidden = true;
					});
					kidx.push(...errors.map(({ id }) => id));
				}, errors[0].timeout || 5000);
			})(
				this.$el,
				this.errorMessages.filter(
					error => !this.knownIdxs.includes(error.id) && !error.sticky
				),
				this.knownIdxs
			);
		},
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
			v-for="message in errorMessages"
			v-bind:data-id="message.id"
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
	z-index: 15
	> div
		margin-bottom: $grid-space
.messages__message
	font-size: .8em
	border-radius: $border-radius
	background: $color-monza
	color: $color-white
	padding: #{2 * $grid-space}
</style>
