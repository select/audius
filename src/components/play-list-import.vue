<script>
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

export default {
	data() {
		return {
			importURLinput: false,
			showImportOtherPlaylist: false,
		};
	},
	computed: mapState(['sourcesOrdered']),
	methods: {
		...mapActions(['importPlayListFromString', 'importURL']),
		importPlayListHandler(event) {
			const files = event.target.files || event.dataTransfer.files;
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = (event2) => {
					this.importPlayListFromString(event2.target.result);
					this.$emit('toggleImport', false);
				};
				reader.readAsText(file);
			});
		},
		showImportURL() {
			this.importURLinput = true;
			Vue.nextTick(() => {
				document.querySelector('.play-list__import-url-input').focus();
			});
		},
		_importURL() {
			const el = document.querySelector('.play-list__import-url-input');
			this.importURL({ url: el.value });
			el.value = '';
			this.$emit('toggleImport', false);
		},
		importOtherPlayList() {
			const el = document.querySelector('.play-list__other-playlist-input');
			this.$emit('importOtherPlayList', el.value);
			el.value = '';
			this.$emit('toggleImport', false);
		},
		exit() {
			this.importURLinput = false;
			this.$emit('toggleImport', false);
		},
	},
};
</script>

<template>
	<div class="play-list__import" >
		<div class="play-list__import-header">
			<div> Import playlist </div>
			<span
				class="wmp-icon-close"
				title="[Esc] Close"
				v-on:click="exit"></span>
		</div>
		<input
			type="file"
			id="import-playlist"
			v-on:change="importPlayListHandler"
			title="Import playlist from file">
		<label for="import-playlist" class="button btn--blue">from file</label>
		<button
			class="button btn--blue"
			v-show="!importURLinput"
			v-on:click="showImportURL">from web</button>
		<div class="play-list__import-url" v-show="importURLinput">
			<span class="smaller">Import Audius, YouTube, Streamly playlists</span>
			<input
				class="play-list__import-url-input input--border"
				type="text"
				placeholder="… https://api.myjson.com/bins/122zfl">
			<button class="button btn--blue" v-on:click="_importURL">load</button>
		</div>
		<button
			class="button btn--blue"
			v-if="!showImportOtherPlaylist"
			v-on:click="showImportOtherPlaylist = true">other playlist</button>
		<div v-if="showImportOtherPlaylist">
			<select class="play-list__other-playlist-input">
				<option value="">Default</option>
				<option v-for="playListName in sourcesOrdered">{{playListName}}</option>
			</select>
			<button class="button btn--blue" v-on:click="importOtherPlayList">load</button>
		</div>
	</div>
</template>


