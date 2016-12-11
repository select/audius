<script>
import store from '../store';
import VideoItem from './video-item.vue';

export default {
	name: 'queue',
	components: {
		VideoItem,
	},
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
};
</script>

<template>
<div class="queue">
	<p v-if="!mediaPlayer.queue.length">
		... queue with <span class="wmp-icon-queue2"></span>
	</p>
	<ul class="media-list">
		<video-item
			v-for="(id, index) in mediaPlayer.queue"
			:isQueue="true"
			:queueIndex="index"
			:video="mediaPlayer.entities[id]"></video-item>
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
