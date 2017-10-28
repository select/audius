<script>
import { mapState } from 'vuex';
import draggable from 'vuedraggable';

import VideoItem from './video-item.vue';

export default {
	components: {
		VideoItem,
		draggable,
	},
	computed: {
		...mapState(['sessionHistory']),
	},
};
</script>

<template>
<div class="history">
	<ul v-if="!sessionHistory.length">
		<li class="queue__hint">
			... you did not play a song yet
		</li>
	</ul>
	</draggable>
	<draggable
		class="media-list"
		element="ul"
		v-model="sessionHistory"
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
			v-for="(media, index) in sessionHistory"
			:key="index"
			:video="media"></video-item>
	</draggable>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.history
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
