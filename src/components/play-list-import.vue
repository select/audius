<script>
import Vue from 'vue/dist/vue';
import importPlaylist from '../utils/importPlaylist';

export default {
	name: 'play-list-import',
	data() {
		return {
			importURLinput: false,
			showImportOtherPlaylist: false,
		};
	},
	props: [
		'tags',
	],
	methods: {
		importPlayList(event) {
			const files = event.target.files || event.dataTransfer.files;
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = (event2) => {
					importPlaylist(event2.target.result);
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
		importURL() {
			const el = document.querySelector('.play-list__import-url-input');
			this.$emit('importURL', el.value);
			el.value = '';
			this.$emit('toggleImport', false);
		},
		importOtherPlayList() {
			const el = document.querySelector('.paly-list__other-playlist-input');
			this.$emit('importOtherPlayList', el.value);
			el.value = '';
			this.$emit('toggleImport', false);
		},
	},
};
</script>

<template>
	<div class="paly-list__import" >
		<div class="paly-list__import-header">
			<div> Import playlist </div>
			<span
				class="wmp-icon-close"
				title="[Esc] Close"
				v-on:click="$emit('toggleImport', false)"></span>
		</div>
		<input type="file" id="import-playlist" v-on:change="importPlayList" title="Import playlist from file">
		<label for="import-playlist" class="button btn--blue">from file</label>
		<button
			class="button btn--blue"
			v-show="!importURLinput"
			v-on:click="showImportURL">from URL</button>
		<div class="paly-list__import-url" v-show="importURLinput">
			<input
				class="play-list__import-url-input"
				type="text"
				placeholder="http://pasetbin.com/x23kc">
			<button class="button btn--blue" v-on:click="importURL">load</button>
		</div>
		<button
			class="button btn--blue"
			v-if="!showImportOtherPlaylist"
			v-on:click="showImportOtherPlaylist = true">other playlist</button>
		<div v-if="showImportOtherPlaylist">
			<select class="paly-list__other-playlist-input">
				<option v-for="playListName in tags">{{playListName}}</option>
			</select>
			<button class="button btn--blue" v-on:click="importOtherPlayList">load</button>
		</div>
	</div>
</template>
