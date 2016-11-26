import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import './video-item.component.sass';

Vue.component('video-item', {
	props: [
		'video',
		'isPlaying',
		'isQueue',
		'queueIndex',
		'isExtension',
		'isSelected',
		'isPlayList',
		'isInPlayList',
		'isEditPlayList',
	],
	data() {
		return {
			copyActive: false
		}
	},
	methods: {
		play() {
			if (this.isQueue) store.dispatch(Actions.queuePlayIndex(this.queueIndex));
			else store.dispatch(Actions.play(this.video.id));
		},
		pause() { store.dispatch(Actions.pause()); },
		menu(){ store.dispatch(Actions.menuVideo(this.video.id)); },
		remove() {
			if (this.isPlayList) {
				store.dispatch(Actions.removeTags(undefined, [this.video.id]))
			} else if (this.isQueue) {
				store.dispatch(Actions.queueRemoveIndex(this.queueIndex));
			} else {
				store.dispatch(Actions.removeVideo(this.video));
			}
		},
		addToPlaylist() {
			store.dispatch(Actions.addSearchResult(this.video));
		},
		copyToClip() {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div')
			tmpEl.innerHTML = `${this.video.title} https://youtu.be/${this.video.id}`;
			document.body.appendChild(tmpEl);

			let range = document.createRange();
			range.selectNode(tmpEl);
			window.getSelection().addRange(range);

			try {
				const successful = document.execCommand('copy');
				this.copyActive = true;
				setTimeout(() => {
					this.copyActive = false;
				}, 800)
			} catch (err) {
				console.log('execCommand Error', err);
			}
			window.getSelection().removeAllRanges();
			tmpEl.parentNode.removeChild(tmpEl);
		},
		queue() {
			store.dispatch(Actions.queueMedia(this.video.id));
		},
		addTags() {
			if (this.isEditPlayList) {
				if (!this.isInPlayList) {
					store.dispatch(Actions.addTags(undefined, [this.video.id]))
				} else {
					store.dispatch(Actions.removeTags(undefined, [this.video.id]))
				}
			}
		},
	},
	template: `
	<li
		v-bind:class="{
			active: isPlaying,
			error: video.hasError,
			selected: isSelected,
			'in-playlist': isInPlayList,
			}"
		v-on:dblclick="play"
		v-bind:data-id="video.id">
		<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: 'url(https://i.ytimg.com/vi/' + video.id + '/default.jpg)' }"></div>
		<div
			class="media-list__body"
			v-on:click="addTags">
			<div class="media-list__name">{{video.title}}</div>
			<div class="media-list__duration" v-if="video.duration">{{video.duration.m}}:{{video.duration.s}}</div>
		</div>
		<div class="media-list__controls">
			<div v-if="!video.hasError">
				<span class="wmp-icon-pause" v-if="isPlaying" v-on:click="pause" title="Pause"></span>
				<span class="wmp-icon-play" v-else v-on:click="play" title="Play"></span>
				<span
					class="wmp-icon-queue2 icon--small"
					v-on:click="queue"
					v-if="!isQueue"
					title="Add to queue"></span>
			</div>
			<span class="wmp-icon-search" v-else title="Search alternative"></span>
			<span class="copy wmp-icon-copy icon--small" v-on:click="copyToClip" v-bind:class="{ active: copyActive }" title="Copy name and URL"></span>
			<div class="media-list__more-controls">
				<span class="wmp-icon-more_vert"></span>
				<div>
					<a v-bind:href="'https://youtu.be/'+video.id" title="Watch on YouTube" target="_blank">
						<span class="wmp-icon-youtube icon--small"></span>
					</a>
					<span
						class="wmp-icon-close"
						v-if="!isExtension"
						v-on:click="remove"
						title="Remove"></span>
				</div>
			</div>
			<span
				class="wmp-icon-add"
				v-if="isExtension"
				v-on:click="addToPlaylist"
				title="Add to playlist"></span>
		</div>
	</li>
	`,
});
