<script>
import { mapMutations, mapState } from 'vuex';
import draggable from 'vuedraggable';

import VideoItem from './video-item.vue';

export default {
	components: {
		VideoItem,
		draggable,
	},
	computed: {
		...mapState(['queue']),
		_queue: {
			get() {
				return this.queue;
			},
			set(value) {
				this.moveQueue(value.filter(id => !!id));
			},
		},
	},
	methods: {
		...mapMutations(['dropMoveItemQueue', 'moveQueue']),
	},
};
</script>

<template>
<div class="queue">
	<draggable
		v-if="!_queue.length"
		class="media-list"
		element="ul"
		v-model="_queue"
		:options="{
			animation: 150,
			scrollSpeed: 20,
			handle: '.media-list__thumbnail',
			sort: false,
			group: {
				name: 'lists',
				pull: 'clone',
				revertClone: true,
			}
		}">
		<li class="queue__hint">
			... queue with <span class="wmp-icon-queue2"></span> or drag and drop
		</li>
	</draggable>
	<draggable
		class="media-list"
		element="ul"
		v-model="_queue"
		:options="{
			animation: 150,
			scrollSpeed: 20,
			handle: '.media-list__thumbnail',
			sort: true,
			group: {
				name: 'lists',
				pull: 'clone',
				revertClone: true,
			}
		}">
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
