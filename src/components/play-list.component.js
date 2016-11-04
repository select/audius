import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import './play-list.component.sass';

Vue.component('play-list', {
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
			store,
			Actions,
			tabs: ['queue', 'search', 'info', 'about'],
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
	},
	template: `
<div class="play-list">
	<h2 v-if="!mediaPlayer.playList.length"> The playlist is empty <br> ... add some music <br>┐(・。・┐) ♪ </h2>
	<ul class="media-list">
		<video-item v-for="id in mediaPlayer.playList" :video="mediaPlayer.entities[id]"></video-item>
	</ul>
</div>`,
});
