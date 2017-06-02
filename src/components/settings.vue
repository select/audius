<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	computed: mapGetters(['youtubeApiKeyUI']),
	methods: mapMutations(['setYoutubeApiKey']),
};
</script>

<template>
<div class="settings">
	<h1>Settings</h1>
	<p>
		YouTube API key
		<input type="text" placeholder="39 digit API key" v-bind:value="youtubeApiKeyUI" @input="setYoutubeApiKey($event.target.value)">
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
