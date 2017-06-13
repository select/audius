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
			this.loginMatrixWithPassword(usernameEl.value, passwordEl.value);
			document.querySelector('#username').value = '';
			document.querySelector('#password').value = '';
		},
	},
};
</script>

<template>
<div class="settings">
	<h1>Settings</h1>
	<p>
		YouTube API key
		<input type="text" placeholder="39 digit API key" v-bind:value="youtubeApiKeyUI" @input="setYoutubeApiKey($event.target.value)">
	</p>
	<h3>Matrix.org account</h3>
	<div class="settings__buttons" @click="setMatrixEnabled">
			<div v-if="matrixEnabled" class="button">disable Matrix radio</div>
			<div v-else class="button btn--blue">enable Matrix radio</div>
	</div>
	<div v-if="matrixEnabled">
		<p v-if="matrixLoggedIn">
				You are <b>connected</b> as {{matrix.credentials.userId}}. <br>
				<button @click="matrixLogout" type="button" class="button btn--blue">Log out</button>
				<button @click="matrixRemoveAccount" type="button" class="button btn--blue">Remove Account</button>
		</p>
		<p v-else>
			You are currently <b>not connected</b>.
		</p>
		<p>
			<table>
				<tr>
					<td>Username</td>
					<td><input type="text" id="username"></td>
				</tr>
				<tr>
					<td>Password</td>
					<td><input type="password" id="password"></td>
				</tr>
				<tr>
					<td></td>
					<td style="text-align: right">
						<button @click="matrixLogin" type="button" class="button btn--blue">Login</button>
					</td>
				</tr>
			</table>
		</p>
	</div>


</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.settings
	h1
		text-align: center
	h3
		padding-left: $grid-space
	p, .settings__buttons
		padding: $grid-space

.settings__buttons
	.button
		white-space: nowrap
		display: inline-flex
		align-items: center
		justify-content: center
</style>
