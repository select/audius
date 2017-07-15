<script>
import { mapMutations, mapState } from 'vuex';

export default {
	name: 'video-item',
	props: {
		video: { type: Object, required: true },
		isPlaying: Boolean,
		isQueue: Boolean,
		queueIndex: Number,
		isExtension: Boolean,
		isSelected: Boolean,
		isPlayList: Boolean,
		isSearchResult: Boolean,
		expiryDate: Date,
		isWebScraper: Boolean,
	},
	computed: mapState(['isMobile']),
	data() {
		return {
			copyActive: false,
			showSongs: false,
		};
	},
	methods: {
		...mapMutations(['pause', 'queue', 'error']),
		play() {
			if (this.isQueue) this.$store.commit('queuePlayIndex', this.queueIndex);
			else this.$store.commit('play', { currentMedia: this.video });
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
			this.$emit('addToPlaylist', this.video.id);
		},
		youtubeLink() {
			let link = `https://youtu.be/${this.video.id}`;
			if (this.video.start || this.video.stop) link += '?';
			if (this.video.start) link += `start=${this.video.start}`;
			if (this.video.stop) {
				if (this.video.start) link += '&';
				link += `end=${this.video.stop}`;
			}
			return link;
		},
		copyToClip() {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div');
			if (this.video.type !== 'youtube') {
				tmpEl.innerHTML = `${this.video.title} ${this.video.url}`;
			} else {
				tmpEl.innerHTML = `${this.video.title} ${this.youtubeLink()}`;
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
				this.error(`Error copying to clipboard ${err}`);
			}
			window.getSelection().removeAllRanges();
			tmpEl.parentNode.removeChild(tmpEl);
		},
		_backgroundImage() {
			if ((this.video.type === 'youtube') && !this.video.hasError) {
				return `url(https://i.ytimg.com/vi/${this.video.youtubeId || this.video.id}/default.jpg)`;
			} else if (this.video.thumbUrl) {
				return `url(${this.video.thumbUrl})`;
			}
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
			old: !!expiryDate,
			}"
		v-bind:title="expiryDate ? '🕑 hide in < 5min' : ''"
		v-on:dblclick="play"
		v-bind:data-id="video.id">
		<div class="media-list__main">
			<span class="wmp-icon-album media-list__album-hint" v-if="video.tracks"></span>
			<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: _backgroundImage() }"></div>
			<div
				class="media-list__body">
				<div class="media-list__name">{{video.title}}</div>
				<div class="media-list__duration" v-if="video.duration">
					<span v-if="video.duration.h">{{video.duration.h}}:</span>{{video.duration.m}}:{{video.duration.s}}
				</div>
			</div>
			<div class="media-list__controls">

				<span class="wmp-icon-pause" v-if="isPlaying" @click="pause" title="Pause"></span>
				<span class="wmp-icon-play" v-else @click="play" title="Play"></span>

				<span
					v-if="video.tracks && !isQueue"
					@click="showSongs = !showSongs"
					v-bind:class="{ active: showSongs }"
					title="Toggle album tracks"
					class="wmp-icon-album media-list__show-tracks"></span>

				<span
					class="wmp-icon-queue2 icon--small"
					@click="queue(video)"
					v-if="!isQueue"
					title="Add to queue"></span>

				<span
					class="wmp-icon-search"
					v-if="video.error"
					title="Search alternative"></span>

				<span
					class="copy wmp-icon-copy icon--small"
					@click="copyToClip"
					v-bind:class="{ active: copyActive }"
					title="Copy name and URL"></span>

				<div class="media-list__more-controls" v-bind:class="{active: (isSearchResult || isWebScraper || isMobile)}">
					<span class="wmp-icon-more_vert"></span>
					<div>
						<a
							v-if="video.type === 'youtube'"
							v-bind:href="this.youtubeLink()"
							title="Watch on YouTube"
							target="_blank">
							<span class="wmp-icon-youtube icon--small"></span>
						</a>
						<a
							v-if="video.href"
							v-bind:href="video.href"
							title="Go to source"
							target="_blank">
							<span class="wmp-icon-link"></span>
						</a>
						<span
							class="wmp-icon-close"
							v-if="!(isExtension || isSearchResult || isWebScraper)"
							@click="remove"
							title="Remove"></span>
					</div>
				</div>


				<span
					v-if="isSearchResult"
					class="wmp-icon-add"
					@click="addToPlaylist(video)"
					title="Add to playlist"></span>

			</div>
		</div>
		<ul
			v-if="video.tracks && !isQueue"
			v-bind:class="{ active: showSongs }"
			class="media-list__tracks">
			<video-item
				v-for="track in video.tracks"
				:video="track"
				:isPlayList="false"
				:key="track.start"
				:isSearchResult="isSearchResult"
				:isPlaying="false"></video-item>
		</ul>
	</li>
</template>

<style lang="sass?indentedSyntax">re
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
