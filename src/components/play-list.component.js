import Vue from 'vue/dist/vue';
import Sortable from 'sortablejs';
import store from '../store';
import Actions from '../actions';
import './play-list.component.sass';
import importPlaylist from '../utils/importPlaylist';
import { debounce } from '../utils/debounce';
import isElementInViewport from '../utils/isElementInViewport';

Vue.component('play-list', {
	data() {
		const mediaPlayer = store.getState().mediaPlayer;
		return {
			mediaPlayer,
			currentSong: mediaPlayer.mediaId,
			website: store.getState().website,
			store,
			Actions,
			tabs: ['queue', 'search', 'info', 'about'],
			importURLinput: false,
			jumpCursor: '',
		};
	},
	created() {
		document.addEventListener('keydown', (event) => {
			if (event.target.tagName.toLowerCase() !== 'input' && event.key === 'j') {
				this.toggleJump(true);
				setTimeout(() => {document.querySelector('.play-list-footer__search-input').value = '';}, 100);
			} else if (event.key === 'Escape') {
				if (this.website.showImport) this.toggleImport(false);
				if (this.website.showJump) this.clear()
			}
			if(this.website.showJump) {
				if(this.jumpCursor && event.key === 'q') {
					store.dispatch(Actions.queueMedia(this.jumpCursor));
				} else if(event.key === 'ArrowDown') {
					event.preventDefault();
					if (!this.jumpCursor) this.jumpCursor = this.filteredPlaylist[0];
					else this.jumpCursor = this.filteredPlaylist[this.filteredPlaylist.indexOf(this.jumpCursor) + 1];
				} else if(event.key === 'ArrowUp') {
					event.preventDefault();
					if (!this.jumpCursor) this.jumpCursor = this.filteredPlaylist[this.filteredPlaylist.length - 1];
					else this.jumpCursor = this.filteredPlaylist[this.filteredPlaylist.indexOf(this.jumpCursor) - 1];
				}
				if (event.key === 'Enter' && this.jumpCursor) {
					store.dispatch(Actions.play(this.jumpCursor));
				}
			}
		}, false);

		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
			this.website = store.getState().website;
			if (!this.website.showJump && this.jumpCursor) this.jumpCursor = '';
			if (this.currentSong !== this.mediaPlayer.mediaId) {
				Vue.nextTick(() => {
					const el = document.querySelector('.play-list li.active');
					if (!isElementInViewport(el)) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
				});
				this.currentSong = this.mediaPlayer.mediaId;
			}
		});
	},
	mounted() {
		const mediaListEl = document.querySelector('.play-list .media-list');
		Sortable.create(mediaListEl, {
			animation: 250,
			scrollSpeed: 20,
			handle: '.media-list__thumbnail',
			// Element dragging ended
			onUpdate: () => {
				store.dispatch(Actions.movePlayListMedia(
					Array.from(mediaListEl.childNodes).map(el => el.dataset.id)
				));
			},
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		exportPlayList() {
			// api_option=paste&api_paste_private=0&api_paste_code=llkjsdfljsdf
			// https://developer.github.com/v3/gists/#create-a-gist
			// curl -X POST \--data-binary '{"files": {"file1.txt": {"content": "Hello, SO"}}}' \https://api.github.com/gists
			const playList = this.mediaPlayer.currentPlayList ? this.mediaPlayer.tags[this.mediaPlayer.currentPlayList] : this.mediaPlayer.playList;
			const entities = {};
			playList.forEach(key => {
				entities[key] = this.mediaPlayer.entities[key];
			});
			const data = {
				AudiusDump: true,
				playList: this.filteredPlaylist,
				entities,
			};
			const element = document.createElement('a');
			const output = `window.getAudiusPlaylist = function(){ return ${JSON.stringify(data)}; }`;
			element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(output)}`);
			element.setAttribute('download', 'audius.data.json');
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		},
		importPlayList(event) {
			const files = event.target.files || event.dataTransfer.files;
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = (event2) => {
					importPlaylist(event2.target.result);
					store.dispatch(Actions.toggleImport(false));
				};
				reader.readAsText(file);
			});
		},
		searchJump: debounce((event) => {
			store.dispatch(Actions.filterPlayList(event.target.value));
		}, 500),
		clear(close) {
			if (!this.mediaPlayer.filterQuery) this.toggleJump(false);
			clearTimeout(this.blurTimer);
			event.stopPropagation();
			document.querySelector('.play-list-footer__search-input').value = '';
			document.querySelector('.play-list-footer__search-input').focus();
			store.dispatch(Actions.filterPlayList(''));
			if(close === true) store.dispatch(Actions.toggleJump(false));
		},
		delayBlur() {
			if (!this.mediaPlayer.filterQuery) {
				this.blurTimer = setTimeout(() => {
					store.dispatch(Actions.toggleJump(false));
				}, 800);
			}
		},
		stopPropagation() {
			if (this.website.showJump) event.stopPropagation();
		},
		toggleJump(state) {
			store.dispatch(Actions.toggleJump(state));
			Vue.nextTick(() => {
				document.querySelector('.play-list-footer__search-input').focus();
			});
		},
		toggleImport(state) {
			store.dispatch(Actions.toggleImport(state));
		},
		showImportURL() {
			this.importURLinput = true;
			Vue.nextTick(() => {
				document.querySelector('.play-list__import-url-input').focus();
			});
		},
		importURL() {
			const el = document.querySelector('.play-list__import-url-input');
			store.dispatch(Actions.importURL(el.value));
			el.value = '';
		},
		addMusic() {
			store.dispatch(Actions.importURL('http://audius.rockdapus.org/audius-starter.playlist'));
		},
		toggleEditPlayList() {
			store.dispatch(Actions.toggleEditPlayList(undefined, false));
		},
	},
	computed: {
		filteredPlaylist() {
			const playList = this.mediaPlayer.currentPlayList && !this.mediaPlayer.editPlayList ? this.mediaPlayer.tags[this.mediaPlayer.currentPlayList] : this.mediaPlayer.playList;
			if (!this.mediaPlayer.filterQuery) return playList.filter(id => this.mediaPlayer.entities[id]);
			return playList.filter(id =>
				this.mediaPlayer
					.entities[id]
					.title
					.toLowerCase()
					.indexOf(this.mediaPlayer.filterQuery) !== -1
				);
		},
	},
	template: `
<div class="play-list">
	<div class="play-list__body">
		<h2 v-if="!website.showImport && !mediaPlayer.currentPlayList && !filteredPlaylist.length">
			The playlist is empty <br>
			┐(・。・┐) ♪ <br>
			<br>
			<span v-on:click="store.dispatch(Actions.toggleSearch())">
				<span class="wmp-icon-search" title="[f] Search on YouTube"></span> Search
			</span>
				and add some songs.
			<button
				class="play-list__btn-add-music button btn--blue"
				v-on:click="addMusic">add music</button>
		</h2>
		<h2 v-if="!website.showImport && mediaPlayer.currentPlayList && !filteredPlaylist.length">
			(⊃｡•́‿•̀｡)⊃ <br>
			<br>
			<span v-on:click="store.dispatch(Actions.toggleSearch())">
				<span class="wmp-icon-search" title="[f] Search on YouTube"></span> Search
			</span>
				and add some songs.
		</h2>

		<div class="paly-list__import" v-show="mediaPlayer.editPlayList" >
			<div class="paly-list__import-header">
				<div> Edit playlist: {{mediaPlayer.currentPlayList}} </div>
				<span
					class="wmp-icon-close"
					title="[Esc] Close"
					v-on:click="toggleEditPlayList(false)"></span>
				<div class="paly-list__edit-description">Click below to add songs to the playlist.</div>
			</div>
		</div>

		<div class="paly-list__import" v-show="website.showImport" >
			<div class="paly-list__import-header">
				<div> Import playlist </div>
				<span
					class="wmp-icon-close"
					title="[Esc] Close"
					v-on:click="toggleImport(false)"></span>
			</div>
			<input type="file" id="import-playlist" v-on:change="importPlayList" title="Import playlist from file">
			<label for="import-playlist" class="button btn--blue">from file</label>
			<button
				class="button btn--blue"
				v-show="!importURLinput"
				v-on:click="showImportURL">from URL</button>
			<div class="paly-list__import-url" v-show="importURLinput">
				<input
					class="play-list__import-url-input"
					type="text"
					placeholder="http://pasetbin.com/x23kc">
				<button class="button btn--blue" v-on:click="importURL">load</button>
			</div>
		</div>

		<div
			class="play-list__jump-header"
			v-show="website.showJump">
			<div> Jump to file </div>
			<span
				class="wmp-icon-close"
				title="[Esc] Close"
				v-on:click="clear(true)"></span>
		</div>

		<!-- play list here -->
		<ul
			class="media-list"
			v-bind:class="{ 'media-list--editing': mediaPlayer.editPlayList }"
			v-show="!website.showImport">
			<video-item
				v-for="id in filteredPlaylist"
				:video="mediaPlayer.entities[id]"
				:isEditPlayList="mediaPlayer.editPlayList"
				:isPlayList="mediaPlayer.currentPlayList"
				:isInPlayList="mediaPlayer.editPlayList && mediaPlayer.tags[mediaPlayer.currentPlayList].includes(id)"
				:isSelected="jumpCursor === id"
				:isPlaying="mediaPlayer.isPlaying && mediaPlayer.entities[id] && (mediaPlayer.mediaId == mediaPlayer.entities[id].id)"></video-item>
		</ul>
		<!-- ends here -->

	</div>
	<div class="play-list-footer">
		<ul v-show="!website.showJump">
			<li class="play-list-footer--info">
				{{filteredPlaylist.length}} Songs
			</li>
			<li
				v-bind:class="{ active: website.showImport }"
				v-on:click="toggleImport()">
				Import
			</li>
			<li v-on:click="exportPlayList" title="Export playlist to file">Export</li>
		</ul>

		<div
			class="play-list-footer__search"
			v-bind:class="{ active: website.showJump }"
			v-on:click="toggleJump()">
			<span class="wmp-icon-search" title="[j] Jump to file"></span>
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
