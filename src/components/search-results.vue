<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import draggable from 'vuedraggable';
import VideoItem from './video-item.vue';
import { isElementInViewport } from '../utils';


export default {
	components: {
		VideoItem,
		draggable,
	},
	computed: mapState(['search', 'currentMedia', 'isPlaying']),
	methods: {
		addToPlaylist(id) {
			Vue.nextTick(() => {
				const els = document.querySelectorAll(`[data-id="${id}"]`);
				if (els.length) {
					Array.from(els).forEach(el => {
						if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
						el.classList.add('au--highlight');
						setTimeout(() => { el.classList.remove('au--highlight'); }, 1000);
					});
				}
			});
		},
	},
};
</script>

<template>
<draggable
	class="media-list search-results"
	v-model="search.results"
	element="ul"
	:options="{
		sort: false,
		handle: '.media-list__thumbnail',
		group: {
			name: 'lists',
			pull: 'clone',
			revertClone: true,
		}
	}">
	<video-item
		v-for="media in search.results"
		v-on:addToPlaylist="addToPlaylist"
		:isSearchResult="true"
		:isPlaying="currentMedia.id == media.id && isPlaying"
		:key="media.id+media.trackId"
		:video="media"></video-item>
</draggable>
</template>
