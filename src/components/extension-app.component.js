import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import './extension-app.component.sass';
import findVideos from '../utils/findVideos';

Vue.component('extension-app', {
	data() {
		return {
			extension: store.getState().extension,
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.extension = store.getState().extension;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		playPauseVideos() {
			if (this.extension.isPlaying) store.dispatch(Actions.pause());
			else if (this.extension.playList.length) store.dispatch(Actions.play());
		},
		previousVideo() { store.dispatch(Actions.previousVideo()); },
		nextVideo() { store.dispatch(Actions.nextVideo()); },
		togglePlayList() { store.dispatch(Actions.togglePlayList()); },
		toggleShuffle() { store.dispatch(Actions.toggleShuffle()); },
		toggleExtension() { store.dispatch(Actions.toggleExtension()); },
		searchAudiusTab() { store.dispatch(Actions.searchAudiusTab()); },
		findVideos,
	},
	template: `
<div class="audius" v-show="extension.show">
	<div
		class="audius__error"
		v-if="extension.audiusTabMissing">
		Audius app is not open! Open the <a href="https://audius.rockdapus.org/" title="Audius app" target="_blank">Audius app</a> in a tab and keep it open
		<div
			class="button"
			v-on:click="searchAudiusTab">
			Retry
		</div>
	</div>
	<div class="audius__controls" v-if="!extension.audiusTabMissing">
		<div class="audius__play-list-controls" :disabled="!extension.playList.length">
			<span class="wmp-icon-previous" v-on:click="previousVideo"></span>
			<div class="audius__play-pause" v-on:click="playPauseVideos">
				<span class="wmp-icon-pause" v-if="extension.isPlaying"></span>
				<span class="wmp-icon-play" v-else></span>
			</div>
			<span class="wmp-icon-next" v-on:click="nextVideo"></span>
		</div>
		<div class="spacer"></div>
		<span
			class="audius__shuffle wmp-icon-shuffle"
			v-on:click="toggleShuffle"
			v-bind:class="{ active: extension.shuffle }"></span>
		<div class="spacer"></div>
		<!-- <span class="wmp-icon-search" v-on:click="findVideos"></span> -->
		<span
			class="audius__show-play-list wmp-icon-format_list_bulleted"
			v-on:click="togglePlayList"
			v-bind:class="{ active: extension.showPlayList }"></span>
		<span
			class="wmp-icon-close"
			v-on:click="toggleExtension"></span>
	</div>
	<div v-if="!extension.playList.length && extension.showPlayList">
		... no YouTube videos found
	</div>
	<div class="audius__media-list-wrapper" v-if="extension.showPlayList && !extension.audiusTabMissing">
		<ul class="media-list">
			<video-item
				v-for="id in extension.playList"
				:video="extension.entities[id]"
				:isPlaying="extension.isPlaying && extension.entities[id] && (extension.mediaId == extension.entities[id].id)"
				:isExtension="true"></video-item>
		</ul>
	</div>

</div>
	`,
});
