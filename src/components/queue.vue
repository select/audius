<script>
import { mapState } from 'vuex';

import store from '../store';
import VideoItem from './video-item.vue';

export default {
	components: {
		VideoItem,
	},
	computed: mapState(['queue', 'entities']),
};
</script>

<template>
<div class="queue">
	<p v-if="!queue.length">
		... queue with <span class="wmp-icon-queue2"></span>
	</p>
	<ul class="media-list">
		<video-item
			v-for="(id, index) in queue"
			:isQueue="true"
			:queueIndex="index"
			:key="id"
			:video="entities[id]"></video-item>
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
