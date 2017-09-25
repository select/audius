<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

export default {
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['matrixLoggedIn', 'matrix', 'matrixEnabled', 'reloadScript']),
	},
	methods: {
		...mapMutations(['setYoutubeApiKey', 'matrixRemoveAccount', 'matrixLogout', 'setMatrixEnabled', 'setReloadScript']),
		...mapActions(['loginMatrixWithPassword']),
		matrixLogin() {
			const usernameEl = document.querySelector('#username');
			const passwordEl = document.querySelector('#password');
			this.loginMatrixWithPassword({ username: usernameEl.value, password: passwordEl.value });
			document.querySelector('#username').value = '';
			document.querySelector('#password').value = '';
		},
	},
};
</script>

<template>
<div class="settings">

	<h1>Settings</h1>
	<h3>YouTube</h3>
	<p>
		YouTube API key
		<input
			type="text"
			class="input--border"
			placeholder="… 39 digit API key"
			:value="youtubeApiKeyUI"
			@input="setYoutubeApiKey($event.target.value)">
		<br>
		<span class="smaller">Create your own key in the <a href="https://console.developers.google.com/" target="_blank">Google Developers Console</a></span>
	</p>
	<!-- <h3>Scripts</h3>
	<div class="settings__btn-group">
		<button
			v-for="script in (Object.entries(reloadScript))"
			@click="setReloadScript(script[0])"
			class="button btn--blue">
			{{script[0]}} {{script[1]}}
		</button>
	</div>
	<p class="smaller">
		Press to reload player
	</p> -->
	<h3>Matrix</h3>
	<div class="settings__buttons" @click="setMatrixEnabled">
			<div v-if="matrixEnabled" class="button">disable Matrix</div>
			<div v-else class="button btn--blue">enable Matrix</div>
	</div>
	<div v-if="matrixEnabled">
		<p v-if="matrixLoggedIn">
				You are <b>connected</b> as {{matrix.credentials.userId}}. <br><br>
				<button @click="matrixLogout" type="button" class="button btn--blue">Log out</button>
				<button @click="matrixRemoveAccount" type="button" class="button btn--blue">Remove Account</button>
		</p>
		<p v-else>
			You are currently <b>not connected</b>.<br><br>
		</p>
		<p>
			<table>
				<tr>
					<td>Username</td>
					<td><input class="input--border" type="text" id="username"></td>
				</tr>
				<tr>
					<td>Password</td>
					<td><input class="input--border" type="password" id="password"></td>
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
.settings__btn-group
	display: flex
	justify-content: center
	align-items: center
	> *
		margin-right: $grid-space

</style>
