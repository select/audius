import Vue from 'vue/dist/vue';
import store from '../store';
import './queue.component.sass';

Vue.component('queue', {
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
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
	template: `
<div class="queue">
	<p v-if="!mediaPlayer.queue.length">
		... queue with <span class="wmp-icon-queue2"></span>
	</p>
	<ul class="media-list">
		<video-item
			v-for="(id, index) in mediaPlayer.queue"
			:isQueue="true"
			:queueIndex="index"
			:video="mediaPlayer.entities[id]"></video-item>
	</ul>
</div>`,
});
