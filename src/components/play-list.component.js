import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import * as db from '../utils/indexDB';
import './play-list.component.sass';
import importPlaylist from '../utils/importPlaylist';

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
			website: store.getState().website,
			store,
			Actions,
			tabs: ['queue', 'search', 'info', 'about'],
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
			this.website = store.getState().website;
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
				AudiusDump: true,
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
					importPlaylist(event.target.result);
				};
				reader.readAsText(file)
			});
		},
		searchJump() {
			console.log('searchJump');
		},
		clear() {
			clearTimeout(this.blurTimer);
			event.stopPropagation();
			document.querySelector('.play-list-footer__search-input').value = '';
			document.querySelector('.play-list-footer__search-input').focus();
		},
		delayBlur() {
			this.blurTimer = setTimeout(()=> {
				store.dispatch(Actions.toggleJump(false))
			}, 800)
		},
		stopPropagation() {
			if (this.website.showJump) event.stopPropagation();
		},
		toggleJump() {
			store.dispatch(Actions.toggleJump());
			Vue.nextTick(() => {
				document.querySelector('.play-list-footer__search-input').focus()
			});
		}
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
		<ul v-show="!website.showJump">
			<li class="play-list-footer--info">
				{{mediaPlayer.playList.length}} Songs
			</li>
			<li>
				<input type="file" id="import-playlist" v-on:change="importPlayList" title="Import playlist from file">
				<label for="import-playlist">Import </label>
			</li>
			<li v-on:click="exportPlayList" title="Export playlist to file">Export</li>
		</ul>

		<div
			class="play-list-footer__search"
			v-bind:class="{ active: website.showJump }"
			v-on:click="toggleJump">
			<span class="wmp-icon-search" title="[J] Jump to file"></span>
			<input
					type="text"
					class="play-list-footer__search-input"
					placeholder="Jump to"
					v-on:click="stopPropagation"
					v-on:keyup="searchJump"
					v-on:blur="delayBlur"
					v-show="website.showJump"
					debounce="500">
			<span
				class="wmp-icon-close"
				v-show="website.showJump"
				v-on:click="clear"></span>
		</div>
	</div>
</div>`,
});
