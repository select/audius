<script>
import { mapState } from 'vuex';
import VideoItem from './video-item.vue';

export default {
	components: {
		VideoItem,
	},
	computed: mapState(['queue']),
};
</script>

<template>
<div class="queue">
	<p v-if="!queue.length">
		... queue with <span class="wmp-icon-queue2"></span>
	</p>
	<ul class="media-list">
		<video-item
			v-for="(media, index) in queue"
			:isQueue="true"
			:queueIndex="index"
			:key="media.id+media.trackId"
			:video="media"></video-item>
	</ul>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.queue
	p
		width: 100%
		text-align: center
		display: flex
		justify-content: center
		align-items: center
		span
			font-size: .7em
</style>
