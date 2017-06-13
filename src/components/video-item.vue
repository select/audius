<script>
import { mapMutations } from 'vuex';

export default {
	name: 'video-item',
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
			copyActive: false,
		};
	},
	methods: {
		...mapMutations(['pause', 'queue']),
		play() {
			if (this.isQueue) this.$store.commit('queuePlayIndex', this.queueIndex);
			else this.$store.commit('play', { mediaId: this.video.id });
		},
		remove() {
			if (this.isPlayList) {
				this.$store.commit('removeTags', { mediaIds: [this.video.id] });
			} else if (this.isQueue) {
				this.$store.commit('queueRemoveIndex', this.queueIndex);
			} else {
				this.$store.commit('removeVideo', this.video);
			}
		},
		addToPlaylist() {
			this.$store.commit('addSearchResult', this.video);
		},
		copyToClip() {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div');
			if (this.video.type === 'audio'){
				tmpEl.innerHTML = `${this.video.url}`;
			} else {
				tmpEl.innerHTML = `${this.video.title} https://youtu.be/${this.video.id}`;
			}
			document.body.appendChild(tmpEl);

			const range = document.createRange();
			range.selectNode(tmpEl);
			window.getSelection().addRange(range);

			try {
				document.execCommand('copy');
				this.copyActive = true;
				setTimeout(() => {
					this.copyActive = false;
				}, 800);
			} catch (err) {
				console.log('execCommand Error', err);
			}
			window.getSelection().removeAllRanges();
			tmpEl.parentNode.removeChild(tmpEl);
		},
		addTags() {
			if (this.isEditPlayList) {
				if (!this.isInPlayList) {
					this.$store.commit('addTags', { mediaIds: [this.video.id] });
				} else {
					this.$store.commit('removeTags', { mediaIds: [this.video.id] });
				}
			}
		},
		_backgroundImage() {
			if (this.video.type !== 'audio') return `url(https://i.ytimg.com/vi/${this.video.id}/default.jpg)`;
			return '';
		},
	},
};
</script>

<template>
	<li
		v-bind:class="{
			active: isPlaying,
			error: video.hasError,
			selected: isSelected,
			'in-playlist': isInPlayList,
			}"
		v-on:dblclick="play"
		v-bind:data-id="video.id">
		<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: _backgroundImage() }"></div>
		<div
			class="media-list__body"
			v-on:click="addTags">
			<div class="media-list__name">{{video.title}}</div>
			<div class="media-list__duration" v-if="video.duration">
				<span v-if="video.duration.h">{{video.duration.h}}:</span>{{video.duration.m}}:{{video.duration.s}}
			</div>
		</div>
		<div class="media-list__controls">
			<div v-if="!video.hasError">
				<span class="wmp-icon-pause" v-if="isPlaying" v-on:click="pause" title="Pause"></span>
				<span class="wmp-icon-play" v-else v-on:click="play" title="Play"></span>
				<span
					class="wmp-icon-queue2 icon--small"
					v-on:click="queue(video.id)"
					v-if="!isQueue"
					title="Add to queue"></span>
			</div>
			<span class="wmp-icon-search" v-else title="Search alternative"></span>
			<span class="copy wmp-icon-copy icon--small" v-on:click="copyToClip" v-bind:class="{ active: copyActive }" title="Copy name and URL"></span>
			<div class="media-list__more-controls">
				<span class="wmp-icon-more_vert"></span>
				<div>
					<a
						v-if="video.type !='audio'"
						v-bind:href="'https://youtu.be/'+video.id"
						title="Watch on YouTube"
						target="_blank">
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
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.copy
	transition: all $transition-time
	&.active,
	&.active:hover
		background: $color-larioja
		color: $color-white
.au--highlight
	transition: background 1000ms
	background: $color-pictonblue-dark
	color: $color-white
.in-playlist
	background: $color-athensgrey

</style>
