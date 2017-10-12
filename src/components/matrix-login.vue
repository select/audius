<script>
import { mapActions } from 'vuex';

export default {
	methods: {
		...mapActions(['loginMatrixWithPassword']),
		matrixLogin() {
			const usernameEl = this.$el.querySelector('#username');
			const passwordEl = this.$el.querySelector('#password');
			this.loginMatrixWithPassword({ username: usernameEl.value, password: passwordEl.value });
			this.$el.querySelector('#username').value = '';
			this.$el.querySelector('#password').value = '';
		},
	},
};
</script>

<template>
	<table class="matrix-login">
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
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

</style>
