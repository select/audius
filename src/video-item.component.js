import Vue from 'vue/dist/vue.js';
import store from './store';
import * as Actions from './actions';

Vue.component('video-item', {
	props: ['video'],
	watch : {
    video : function (value) {
      console.log('video changed to '+value);
    }
  },
	methods: {
		play() {
			console.log('dd ',this.video.isPlaying);
			store.dispatch(Actions.playVideo(this.video.id))
		},
		pause() {store.dispatch(Actions.pause())},
		menu(){store.dispatch(Actions.menuVideo(this.video.id))},
	},
	template: `
	<li>
		<div class="thumbnail"  v-bind:style="{ backgroundImage: 'url(' + video.snippet.thumbnails.default.url + ')' }" ></div>
		<div class="body">
			<div class="name">{{video.snippet.title}}</div>
			<div class="duration">{{video.duration.m}}:{{video.duration.s}}</div>
		</div>
		<div class="wamp-item__controls">
			<span class="wmp-icon-pause" v-if="video.isPlaying" v-on:click="pause"></span>
			<span class="wmp-icon-play" v-else v-on:click="play"></span>
			<span class="menu wmp-icon-more_vert" v-on:click="menu"></span>
		</div>
	</li>
	`,
});
