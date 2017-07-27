<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

export default {
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['matrixLoggedIn', 'matrix', 'matrixEnabled']),
	},
	methods: {
		...mapMutations(['setYoutubeApiKey', 'matrixRemoveAccount', 'matrixLogout', 'setMatrixEnabled']),
		...mapActions(['loginMatrixWithPassword']),
		matrixLogin() {
			const usernameEl = document.querySelector('#username');
			const passwordEl = document.querySelector('#password');
			this.loginMatrixWithPassword({ username: usernameEl.value, password: passwordEl.value });
			document.querySelector('#username').value = '';
			document.querySelector('#password').value = '';
		},
		addUrlPattern() {
			// this.$el.querySelector('.ws-settings__input').value;
		},
	},
};
</script>

<template>
<div class="settings ws-settings">
	<p>
		<input type="text" placeholder="... name">
	</p>
	<p>
		URLS
		<ul>
			<li>
				http blaa
			</li>
			<li>
				<input class="ws-settings__input" type="text" placeholder="http://www.example.com/page/[1-100]">
				<span class="wmp-icon-add" @click="addUrlPattern"></span>
			</li>
		</ul>
	</p>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.web-scraper-settings
	input
		background: transparent
		border: 0
		padding: 0
	ul
		padding: 0
		li
			display: flex
			align-items: center
			height: $touch-size-medium
			justify-content: space-between
			padding: 0 $grid-space
		li:nth-child(even)
			background: $color-catskillwhite
		li:hover
			background: $color-athensgrey
</style>
