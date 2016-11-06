import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import * as db from '../utils/indexDB';
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
		exportPlayList() {
			const data = {
				playList: this.mediaPlayer.playList,
				entities: this.mediaPlayer.entities,
			}
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
			element.setAttribute('download', 'audius.data.json');
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		},
		importPlayList(event) {
			const files = event.target.files || event.dataTransfer.files;
			Array.from(files).forEach(file => {
				const reader = new FileReader();
				reader.onload = (event) => {
					const dataJSON = JSON.parse(event.target.result)
					store.dispatch(Actions.importPlayList(dataJSON));
					Object.keys(dataJSON.entities).forEach(key => {
						db.setMediaEntity(dataJSON.entities[key]);
					})
				};
				reader.readAsText(file)
			});
		},
	},
	template: `
<div class="play-list">
	<h2 v-if="!mediaPlayer.playList.length">
		The playlist is empty <br> ... add some music <br>┐(・。・┐) ♪
	</h2>
	<ul class="media-list">
		<video-item v-for="id in mediaPlayer.playList" :video="mediaPlayer.entities[id]"></video-item>
	</ul>
	<div class="play-list-footer">
		<ul>
			<li class="play-list-footer--info">
				{{mediaPlayer.playList.length}} Songs
			</li>
			<li>
				<input type="file" id="import-playlist" v-on:change="importPlayList">
				<label for="import-playlist">Import </label>
			</li>
			<li v-on:click="exportPlayList">Export</li>
		</ul>
	</div>
</div>`,
});
