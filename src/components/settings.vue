<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['matrixLoggedIn', 'matrix']),
	},
	methods: {
		...mapMutations(['setYoutubeApiKey', 'loginMatrixWithPassword', 'matrixRemoveAccount', 'matrixLogout']),
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
	<p v-if="matrixLoggedIn">
			Your are <b>connected</b> as {{matrix.credentials.userId}}. <br>
			<button @click="matrixLogout" type="button" class="button btn--blue">Log out</button>
			<button @click="matrixRemoveAccount" type="button" class="button btn--blue">Remove Account</button>
	</p>
	<p v-else>
		Your are currently <b>not connected</b>.
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
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.settings
	h1
		text-align: center
	h3
		padding-left: $grid-space
	p
		padding: $grid-space
</style>
