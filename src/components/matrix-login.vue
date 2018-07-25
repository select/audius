<script>
import { mapActions } from 'vuex';
import { mapModuleState } from '../utils';

export default {
	computed: {
		...mapModuleState('matrix', ['credentials', 'isGuest']),
	},
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
			<td><input class="input--border" type="text" id="username" :value="isGuest? '' : credentials.userId"></td>
		</tr>
		<tr>
			<td>Password</td>
			<td><input class="input--border" type="password" id="password"></td>
		</tr>
		<tr>
			<td></td>
			<td style="text-align: right">
				<a
					class="button btn--blue-ghost create-room__register"
					target="_blank"
					href="https://riot.im/app/#/register">Register</a>
				<button @click="matrixLogin" type="button" class="button btn--blue">Login</button>
			</td>
		</tr>
	</table>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

</style>
