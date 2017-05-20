<script>
import store from '../store';
import Actions from '../actions';
import {youtubeApiKey, pastebinApiKey} from '../utils/config';

console.log('pastebin: ', pastebinApiKey);

const scrollbarCss = `
::-webkit-scrollbar
	width: 5px
	&:hover
		width: 10px

::-webkit-scrollbar-track
  background: $color-catskillwhite

::-webkit-scrollbar-thumb
  background: $color-aluminium-dark`;

export default {
	name: 'settings',
	data() {
		return {
			youtubeApiKey: '',
			pastebinApiKey: '',
			mediaPlayer: store.getState().mediaPlayer,
		};
	},
	// created() {
	// 	this.unsubscribe = store.subscribe(() => {
	// 		this.mediaPlayer = store.getState().mediaPlayer;
	// 		if (this.mediaPlayer.youtubeApiKey !== youtubeApiKey) this.youtubeApiKey = this.mediaPlayer.youtubeApiKey;
	// 		if (this.mediaPlayer.pastebinApiKey !== pastebinApiKey) this.pastebinApiKey = this.mediaPlayer.pastebinApiKey;
	// 	});
	// },
	// beforeDestroy() {
	// 	this.unsubscribe();
	// },
	watch: {
		youtubeApiKey: function(val, oldVal) {
			this.$store.commit('setYoutubeApiKey', val);
		},
		pastebinApiKey: function(val, oldVal) {
			this.$store('setPastebinApiKey',  val);
		},
	},
};
</script>

<template>
<div class="settings">
	<h1>Settings</h1>
	<p>
		YouTube API key <input type="text" placeholder="39 digit API key" v-model="youtubeApiKey">
	</p>
	<p>
		Pastebin API key <input type="text" placeholder="32 digit API key" v-model="pastebinApiKey">
	</p>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.settings
	h1
		text-align: center
	p
		padding: $grid-space
</style>
