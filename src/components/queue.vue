<script>
import draggable from 'vuedraggable';
import VideoItem from './video-item.vue';

export default {
	components: {
		VideoItem,
		draggable,
	},
	computed: {
		_queue: {
			get() {
				return this.$store.state.queue;
			},
			set(value) {
				this.$store.commit('moveQueue', value);
			},
		},
	},
};
</script>

<template>
<div class="queue">
	<draggable
		class="media-list"
		element="ul"
		v-model="_queue"
		:options="{
			animation: 150,
			scrollSpeed: 20,
			handle: '.media-list__thumbnail',
			group: {
				name: 'lists',
				pull: 'clone',
				revertClone: true,
			}
		}">
		<li v-if="!_queue.length" class="queue__hint">
			... queue with <span class="wmp-icon-queue2"></span> or drag and drop
		</li>
		<video-item
			v-for="(media, index) in _queue"
			:isQueue="true"
			:queueIndex="index"
			:key="index"
			:video="media"></video-item>
	</draggable>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.queue
	display: flex
	flex-direction: column
	height: 100%
	overflow: hidden
	.media-list
		flex: 1
		width: 100%
.queue__hint
	width: 100%
	text-align: center
	display: flex
	justify-content: center
	align-items: center
	span
		font-size: .7em
</style>
