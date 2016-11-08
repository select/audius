import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import * as db from '../utils/indexDB';
import './play-list.component.sass';

function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

Vue.component('play-list', {
	data() {
		const mediaPlayer = store.getState().mediaPlayer;
		return {
			mediaPlayer: mediaPlayer,
			currentSong: mediaPlayer.youtubeId,
			store,
			Actions,
			tabs: ['queue', 'search', 'info', 'about'],
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
			if (this.currentSong !== this.mediaPlayer.youtubeId) {
				Vue.nextTick(() => {
					const el = document.querySelector(".play-list li.active")
					if(!isElementInViewport(el)) el.scrollIntoView({block: "start", behavior: "smooth"});
				});
				this.currentSong = this.mediaPlayer.youtubeId;
			}
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
		<video-item
			v-for="id in mediaPlayer.playList"
			:video="mediaPlayer.entities[id]"
			:isPlaying="mediaPlayer.isPlaying && mediaPlayer.entities[id] && (mediaPlayer.youtubeId == mediaPlayer.entities[id].id)"></video-item>
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
