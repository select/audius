import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import * as db from '../utils/indexDB';

Vue.component('search-results', {
	data() {
		return {
			youtube: store.getState().youtube,
			// search: '',
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.youtube = store.getState().youtube;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		play() {
			console.log('play');
		},
		pause() {
			console.log('pause');
		},
		addToPlaylist(video) {
			store.dispatch(Actions.addSearchResult(video));
			db.set(video);
		}
	},
	template: `
<ul class="media-list">
	<li v-for="video in youtube.results">
		<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: 'url(' + video.thumbnail + ')' }" ></div>
		<div class="media-list__body">
			<div class="media-list__name">{{video.title}}</div>
			<div class="media-list__duration" v-if="video.duration">{{video.duration.m}}:{{video.duration.s}}</div>
		</div>
		<div class="media-list__controls">
			<span class="wmp-icon-add" v-on:click="addToPlaylist(video)"></span>
			<span class="wmp-icon-pause" v-if="video.isPlaying" v-on:click="pause"></span>
			<span class="wmp-icon-play" v-else v-on:click="play"></span>
			<span class="wmp-icon-copy icon--small"></span>
			<a v-bind:href="'https://youtu.be/'+video.id" title="watch on YouTube" target="_blank">
				<span class="wmp-icon-youtube icon--small"></span>
			</a>
		</div>
	</li>
</ul>
	`,
});
