import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import isElementInViewport from '../utils/isElementInViewport';

Vue.component('search-results', {
	data() {
		return {
			youtube: store.getState().youtube,
			mediaPlayer: store.getState().mediaPlayer,
			website: store.getState().website,
			store,
			Actions,
			jumpCursor: {},
		};
	},
	created() {
		document.addEventListener('keydown', (event) => {
			if (this.website.mainRightTab === 'search') {
				if (this.jumpCursor.id && event.key === 'Enter') {
					store.dispatch(Actions.play(this.jumpCursor.id, this.jumpCursor));
				} else if (this.jumpCursor.id && event.ctrlKey && event.key === ' ') {
					this.addToPlaylist(this.jumpCursor);
				} else if (event.key === 'ArrowDown') {
					event.preventDefault();
					if (!this.jumpCursor) this.jumpCursor = this.youtube.results[0];
					else if (this.youtube.results.indexOf(this.jumpCursor) >= this.youtube.results.length - 1) this.jumpCursor = this.youtube.results[0];
					else this.jumpCursor = this.youtube.results[this.youtube.results.indexOf(this.jumpCursor) + 1];
				} else if (event.key === 'ArrowUp') {
					event.preventDefault();
					if (!this.jumpCursor) this.jumpCursor = this.youtube.results[this.youtube.results.length - 1];
					else if (this.youtube.results.indexOf(this.jumpCursor) <= 0) this.jumpCursor = this.youtube.results[this.youtube.results.length - 1];
					else this.jumpCursor = this.youtube.results[this.youtube.results.indexOf(this.jumpCursor) - 1];
				}
				Vue.nextTick(() => {
					const el = document.querySelector(`[data-id=${this.jumpCursor.id}]`);
					if (el && !isElementInViewport(el)) {
						el.scrollIntoView({ block: 'start', behavior: 'smooth' });
					}
				});
			}
		}, false);
		this.unsubscribe = store.subscribe(() => {
			this.youtube = store.getState().youtube;
			this.mediaPlayer = store.getState().mediaPlayer;
			this.website = store.getState().website;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		play(video) {
			store.dispatch(Actions.play(video.id, video));
		},
		pause() {
			store.dispatch(Actions.pause());
		},
		addToPlaylist(video) {
			store.dispatch(Actions.addSearchResult(video));
			Vue.nextTick(() => {
				const el = document.querySelector(`[data-id=${video.id}]`);
				if (el) {
					if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
					el.classList.add('au--highlight');
					setTimeout(() => { el.classList.remove('au--highlight'); }, 1000);
				}
			});
		},
		isPlaying(video) {
			return this.mediaPlayer.mediaId === video.id;
		},
	},
	template: `
<ul class="media-list">
	<li
		v-for="video in youtube.results"
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
