<script >
import { mapMutations, mapState } from 'vuex';
import { mapModuleState } from '../utils';

export default {
	components: {
	},
	computed: {
		...mapState(['currentMediaSource', 'currentMedia']),
		...mapModuleState('matrix', ['chatlog']),
		_chatlog() {
			return chatlog[this.currentMediaSource.id];
		},
	},
	// data() {
	// 	return { queueActive: false };
	// },
	methods: {
		...mapMutations(['setMainRightTab']),
	},

};
</script>

<template>
<div class="matrix-chat">
	<div
		v-for="(message, index) in _chatlog"
		:key="index">
		<video-item
			v-if="typeof message === 'object'"
			ref="playListEls"
			:video="message"
			:isPlayList="currentMediaSource.type === 'playList'"
			:isSelected="jumpCursor === media.id"
			:expiryDate="_expiryDate(media.id)"
			:isWebScraper="currentMediaSource.type == 'webScraper'"
			:isPlaying="isPlaying && (currentMedia.id == media.id)"></video-item>
		<div
			v-if="typeof message === 'string'">
			{{message}}
		</div>
	</div>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

</style>
