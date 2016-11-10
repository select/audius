import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import * as db from '../utils/indexDB';
import isElementInViewport from '../utils/isElementInViewport';

Vue.component('search-results', {
	data() {
		return {
			youtube: store.getState().youtube,
			mediaPlayer: store.getState().mediaPlayer,
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.youtube = store.getState().youtube;
			this.mediaPlayer = store.getState().mediaPlayer;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		play(video) {
			store.dispatch(Actions.playVideo(video.id));
		},
		pause() {
			store.dispatch(Actions.pause());
		},
		addToPlaylist(video) {
			store.dispatch(Actions.addSearchResult(video));
			db.setMediaEntity(video);
			Vue.nextTick(() => {
				const el = document.querySelector(`[data-id=${video.id}]`)
				if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
				el.classList.add('au--highlight');
				setTimeout(() => {el.classList.remove('au--highlight');}, 1000);
			});
		},
		isPlaying(video) {
			return this.mediaPlayer.youtubeId === video.id;
		},
	},
	template: `
<ul class="media-list">
	<li v-for="video in youtube.results" v-bind:class="{ active: isPlaying(video) }">
		<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: 'url(https://i.ytimg.com/vi/' + video.id + '/default.jpg)' }" ></div>
		<div class="media-list__body">
			<div class="media-list__name">{{video.title}}</div>
			<div class="media-list__duration" v-if="video.duration">{{video.duration.m}}:{{video.duration.s}}</div>
		</div>
		<div class="media-list__controls">
			<span class="wmp-icon-add" v-on:click="addToPlaylist(video)" title="Add to playlist"></span>
			<span class="wmp-icon-pause" v-if="isPlaying(video)" v-on:click="pause" title="Pause"></span>
			<span class="wmp-icon-play" v-else v-on:click="play(video)" title="Play"></span>
			<a v-bind:href="'https://youtu.be/'+video.id" title="watch on YouTube" target="_blank">
				<span class="wmp-icon-youtube icon--small"></span>
			</a>
		</div>
	</li>
</ul>
	`,
});
