<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import Sortable from 'sortablejs';
import VideoItem from './video-item.vue';
import { isElementInViewport } from '../utils';


export default {
	components: {
		VideoItem,
	},
	computed: mapState(['search', 'currentMedia', 'isPlaying']),
	mounted() {
		const mediaListEl = document.querySelector('.search-results');
		Sortable.create(mediaListEl, {
			name: 'searchResults',
			handle: '.media-list__thumbnail',
			group: 'lists',
			pull: 'clone',
			revertClone: true,
			sort: false,
		});
	},
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
<ul class="media-list search-results">
	<video-item
		v-for="media in search.results"
		:isSearchResult="true"
		:isPlaying="currentMedia.id == media.id && isPlaying"
		:key="media.id+media.trackId"
		v-on:addToPlaylist="addToPlaylist"
		:video="media"></video-item>
</ul>
</template>
