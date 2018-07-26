<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

import MatrixLogin from './matrix-login.vue';
import { mapModuleState } from '../utils';

export default {
	components: {
		MatrixLogin,
	},
	data() {
		return {
			showConfirmLoadBackup: false,
		};
	},
	created() {
		this.initModule('matrix');
	},
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState([
			'extensionAvilable',
		]),
		...mapModuleState('matrix', [
			'matrixLoggedIn',
			'matrix',
			'credentials',
			'isGuest',
		]),
	},
	methods: {
		...mapMutations([
			'setYoutubeApiKey',
			'matrixRemoveAccount',
			'matrixLogout',
			'loadBackup',
			'error',
		]),
		...mapActions([
			'saveBackup',
			'initModule',
		]),
		_loadBackup(event) {
			const files = event.target.files || event.dataTransfer.files;
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = (event2) => {
					try {
						this.loadBackup(JSON.parse(event2.target.result));
						this.showConfirmLoadBackup = false;
					} catch (error) {
						this.error(`Error loading backup. ${error}`);
					}
				};
				reader.readAsText(file);
			});
		},
	},
};
</script>

<template>
<div class="settings">

	<h1>Settings</h1>
	<h3>Backup</h3>
	<p>
		<button
			class="button btn--blue"
			@click="saveBackup">Save backup</button>
		<button
			class="button btn--blue-ghost"
			title="Load backup from file"
			@click="showConfirmLoadBackup = true">Load backup</button>

		<a
			class="button btn--gray-ghost"
			style="float:right"
			title="Download Audius app"
			href="audius.app.html"
			download>Audius app</a>
	</p>
	<div class="modal" v-if="showConfirmLoadBackup" @click.stop="showConfirmLoadBackup = false">
		<div class="modal__body" @click.stop>
			Loading the backup will overwirte all current data!
			<div class="modal__btn-group">
				<button class="button" @click="showConfirmLoadBackup = false">Cancel</button>
				<input
					type="file"
					id="settings-backup"
					v-on:change="_loadBackup"
					title="Load backup from file">
				<label
					for="settings-backup"
					class="button btn--blue">Load backup</label>
			</div>
		</div>
	</div>
	<h3>Extension</h3>
	<p>
		The extension is <b v-if="extensionAvilable">installed</b><span v-else><b>not installed</b>. You can install it from the <a href="https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh" target="_blank" rel="noopener">Chrome web store</a>. If you just installed it please reload this page and this message will disappear</span>.
	</p>
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
		<span class="smaller">Create your own key in the <a href="https://console.developers.google.com/" target="_blank" rel="noopener">Google Developers Console</a></span>
	</p>
	<h3>Matrix / Riot.im</h3>
	<div>
		<p v-if="matrixLoggedIn">
				You are <b>connected</b> as {{credentials.userId}}.
				<span v-if="isGuest !== false">You are a <b>guest</b> user.</span>
				<br><br>
				<button @click="matrixLogout" type="button" class="button btn--blue">Log out</button>
				<button @click="matrixRemoveAccount" type="button" class="button btn--blue">Remove Account</button>
		</p>
		<p v-else>
			You are currently <b>not connected</b> ({{credentials.userId}}).<br><br>
		</p>
		<p>
			<matrix-login></matrix-login>
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

#settings-backup
	display: none
	+ label
		display: inline-flex
		justify-content: center
		align-items: center
		cursor: pointer

</style>
