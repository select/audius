<script>
import Vue from 'vue/dist/vue';

export default {
	name: 'play-list-export',
	data() {
		return {
			playlistExportString: ''
		};
	},
	props: [
		'pastebinApiKey',
		'currentPlayList',
		'filteredPlayList',
		'entities',
	],
	created() {
		this.playlistExportString = this.getPlaylistExportString();
	},
	methods: {
		getPlaylistExportString() {
			const data = {
				AudiusDump: true,
				playList: this.filteredPlayList,
				entities: this.entities,
			};
			return `window.getAudiusPlaylist = function(){ return ${JSON.stringify(data)}; }`;
		},
		exportPlayListFile() {
			const element = document.createElement('a');
			element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.getPlaylistExportString())}`);
			element.setAttribute(
				'download',
				this.currentPlayList? `${this.currentPlayList}.audius-playlist` : 'history.audius-playlist'
			);
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		},
	}
};
</script>

<template>
	<div class="paly-list__import"  >
		<div class="paly-list__import-header">
			<div> Export playlist </div>
			<span
				class="wmp-icon-close"
				title="[Esc] Close"
				v-on:click="$emit('toggleExport', false)"></span>
		</div>
		<button
			class="button btn--blue"
			v-on:click="exportPlayListFile">to file</button>
		<form
			target="_blank"
			method="post"
			action="http://pastebin.com/api/api_post.php">

			<input type="hidden" name="api_option" value="paste">
			<input type="hidden" name="api_dev_key" v-model="pastebinApiKey">
			<input type="hidden" name="api_paste_code" v-model="playlistExportString">
			<button
				type="submit"
				class="button btn--blue">to URL</button>
			<br>
			<span><b>Copy and paste the URL</b> on the page that opens to share your playlist.</span>
		</form>
	</div>
</template>

