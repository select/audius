import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import * as db from '../utils/indexDB';


Vue.component('video-item', {
	props: ['video'],
	methods: {
		play() { store.dispatch(Actions.playVideo(this.video.id)); },
		pause() { store.dispatch(Actions.pause()); },
		menu(){ store.dispatch(Actions.menuVideo(this.video.id)); },
		remove() {
			store.dispatch(Actions.removeVideo(this.video.id));
			db.set(this.video);
		},
		copyToClip() {
			console.log('copy to clipe')
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div')
			tmpEl.innerHTML = `${this.video.title} https://youtu.be/${this.video.id}`;
			document.body.appendChild(tmpEl);

	    let range = document.createRange();
	    range.selectNode(tmpEl);
	    window.getSelection().addRange(range);

	    // let classes = event.target.getAttribute('class');
	    // event.target.setAttribute('class', classes + ' donger--active');
	    // setTimeout(() => {
	    //   event.target.setAttribute('class', classes);
	    // }, 800)
	    try {
	      const successful = document.execCommand('copy');
	    } catch (err) {
	      console.log('execCommand Error', err);
	    }
	    window.getSelection().removeAllRanges();
	    tmpEl.parentNode.removeChild(tmpEl);
	  },
	},
	template: `
	<li v-bind:class="{ active: video.isPlaying }">
		<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: 'url(' + video.thumbnail + ')' }"></div>
		<div class="media-list__body">
			<div class="media-list__name">{{video.title}}</div>
			<div class="media-list__duration" v-if="video.duration">{{video.duration.m}}:{{video.duration.s}}</div>
		</div>
		<div class="media-list__controls">
			<span class="wmp-icon-pause" v-if="video.isPlaying" v-on:click="pause"></span>
			<span class="wmp-icon-play" v-else v-on:click="play"></span>
			<span class="wmp-icon-queue2 icon--small"></span>
			<span class="wmp-icon-copy icon--small" v-on:click="copyToClip"></span>
			<a v-bind:href="'https://youtu.be/'+video.id" title="watch on YouTube" target="_blank">
				<span class="wmp-icon-youtube icon--small"></span>
			</a>
			<span class="wmp-icon-close" v-on:click="remove"></span>
		</div>
	</li>
	`,
});
