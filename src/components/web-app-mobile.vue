<script>
import { mapState } from 'vuex';
import PlayList from './play-list.vue';
import YoutubePlayer from './youtube-player.vue';
import WebMediaPlayer from './web-media-player.vue';
import WebHeader from './web-header.vue';

export default {
	components: {
		WebHeader,
		PlayList,
		YoutubePlayer,
		WebMediaPlayer,
	},
	computed: mapState(['currentMedia']),
};
</script>

<template>
<div class="web-app-mobile">

		<div class="web-app-mobile__playlist">
			<play-list></play-list>
		</div>
		<div class="web-app-mobile__players">
			<div class="web-app-mobile__yt" v-bind:class="{'web-app-mobile--hide-yt': currentMedia.type !== 'youtube'}">
				<youtube-player></youtube-player>
			</div>
			<web-media-player v-show="currentMedia.type !== 'youtube'"></web-media-player>
		</div>
		<web-header></web-header>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.web-app-mobile
	flex: 1
	display: flex
	flex-direction: column
.web-app-mobile__players
	flex: 1
	overflow: hidden
	.web-app-mobile__yt
		height: 100%
		&.web-app-mobile--hide-yt
			height: 1%
.web-app-mobile__playlist
	flex: 2
	overflow: auto
</style>
