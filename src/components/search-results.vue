<script>
import Vue from 'vue/dist/vue';
import { mapMutations, mapState } from 'vuex';
import Sortable from 'sortablejs';
import { isElementInViewport } from '../utils';

export default {
	computed: mapState(['search', 'currentMedia', 'website', 'jumpCursor']),
	methods: {
		...mapMutations(['play', 'pause']),
		addToPlaylist(video) {
			this.$store.commit('addSearchResult', video);
			Vue.nextTick(() => {
				const el = document.querySelector(`[data-id="${video.id}"]`);
				if (el) {
					if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
					el.classList.add('au--highlight');
					setTimeout(() => { el.classList.remove('au--highlight'); }, 1000);
				}
			});
		},
		isPlaying(video) {
			return this.currentMedia.id === video.id;
		},
	},
	mounted() {
		const mediaListEl = document.querySelector('.main-right__content .media-list');
		Sortable.create(mediaListEl, {
			name: 'searchResults',
			group: 'lists',
			pull: 'clone',
			sort: false,
		});
	},
};
</script>

<template>
<ul class="media-list">
	<li
		v-for="video in search.results"
		v-bind:class="{
			active: isPlaying(video),
			selected: (jumpCursor && (jumpCursor.id === video.id)),
		}"
		v-bind:data-id="video.id">
		<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: 'url(https://i.ytimg.com/vi/' + video.id + '/default.jpg)' }" ></div>
		<div class="media-list__body">
			<div class="media-list__name">{{video.title}}</div>
			<div class="media-list__duration" v-if="video.duration">{{video.duration.m}}:{{video.duration.s}}</div>
		</div>
		<div class="media-list__controls">
			<span class="wmp-icon-add" @click="addToPlaylist(video)" title="Add to playlist"></span>
			<span class="wmp-icon-pause" v-if="isPlaying(video)" @click="pause" title="Pause"></span>
			<span class="wmp-icon-play" v-else @click="play({ currentMedia: video })" title="Play"></span>
			<a v-bind:href="'https://youtu.be/'+video.id" title="watch on YouTube" target="_blank">
				<span class="wmp-icon-youtube icon--small"></span>
			</a>
		</div>
	</li>
</ul>
</template>
