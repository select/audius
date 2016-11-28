import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import { debounce } from '../utils/debounce';
import './play-list-manager.component.sass';

Vue.component('play-list-manager', {
	data() {
		return {
			state: store.getState(),
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.state = store.getState();
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		addTags() {
			const el = document.querySelector('.play-list-manager__input input');
			store.dispatch(Actions.addTags(el.value));
			el.value = '';
		},
		selectPlayList(name) {
			store.dispatch(Actions.selectPlayList(name));
		},
		deletePlayList(name, event) {
			event.stopPropagation();
			store.dispatch(Actions.deletePlayList(name));
		},
		togglePlayLists() {
			store.dispatch(Actions.togglePlayLists());
		},
		toggleEditPlayList(name, event) {
			event.stopPropagation();
			store.dispatch(Actions.toggleEditPlayList(name, true));
		},
		renamePlayList: debounce((oldName, event) => {
			store.dispatch(Actions.renamePlayList(oldName, event.target.value));
		}, 500),
	},
	computed: {
		tags() {
			return Object.keys(this.state.mediaPlayer.tags).map(key => ({ name: key, playList: this.state.mediaPlayer.tags[key] }));
		},
	},
	template: `
<div
	class="play-list-manager"
	v-bind:class="{ active: state.website.showPlayLists }">
	<div class="nav-handle" title="Playlists" v-on:click="togglePlayLists">
		<div class="nav-handle__tab"></div>
		<span class="wmp-icon-queue_music"></span>
	</div>
	<ul>
		<li
			v-bind:class="{ active: !state.mediaPlayer.currentPlayList }"
			v-on:click="selectPlayList()">
			<div class="play-list-manager__tag-body">
				<div>ALL</div>
				<div>{{state.mediaPlayer.playList.length}} Songs</div>
			</div>
		</li>
		<li class="spacer"></li>
		<li
			v-for="tag in tags"
			v-bind:class="{ active: state.mediaPlayer.currentPlayList == tag.name }"
			v-on:click="selectPlayList(tag.name)">
			<div class="play-list-manager__tag-body">
				<div v-show="state.mediaPlayer.currentPlayList != tag.name">{{tag.name}}</div>
				<div v-show="state.mediaPlayer.currentPlayList == tag.name">
					<input
						class="play-list-manager__tag-name-input"
						type="text"
						v-bind:value="tag.name"
						v-on:keyup="renamePlayList(tag.name, $event)"
						placeholder="... playlist name">
				</div>
				<div>{{tag.playList.length}} Songs</div>
			</div>
			<div class="play-list-manager__menu">
				<span
					class="wmp-icon-close"
					title="Delte playlist"
					v-on:click="deletePlayList(tag.name, $event)"></span>
			</div>
		</li>
		<li class="play-list-manager__input">
			<input
				v-on:keyup.enter="addTags"
				type="text"
				placeholder="... new playlist">
			<span class="wmp-icon-add" v-on:click="addTags"></span>
		</li>
	</ul>
</div>`,
});
