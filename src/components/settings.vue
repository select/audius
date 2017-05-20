<script>
import { mapGetters, mapMutations } from 'vuex';

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
	computed: mapGetters(['youtubeApiKeyUI', 'pastebinApiKeyUI']),
	methods: mapMutations(['setYoutubeApiKey', 'setPastebinApiKey']),
};
</script>

<template>
<div class="settings">
	<h1>Settings</h1>
	<p>
		YouTube API key
		<input type="text" placeholder="39 digit API key" v-bind:value="youtubeApiKeyUI" @input="setYoutubeApiKey($event.target.value)">
	</p>
	<p>
		Pastebin API key
		<input type="text" placeholder="32 digit API key" v-bind:value="pastebinApiKeyUI" @input="setPastebinApiKey($event.target.value)">
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
