<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import { getMediaLink, youtubeLink } from '../utils';

export default {
	name: 'video-item',
	props: {
		video: { type: Object, required: true },
		isPlaying: Boolean,
		isQueue: Boolean,
		queueIndex: Number,
		isPlayList: Boolean,
		isSearchResult: Boolean,
		expiryDate: Date,
		isWebScraper: Boolean,
	},
	computed: {
		...mapState([
			'isMobile',
			'currentMediaSource',
		]),
		...mapState({
			matrixRooms: state => state.matrix.matrixRooms,
		}),
	},
	data() {
		return {
			copyActive: false,
			showSongs: false,
			isVisible: false,
			showConfirmDelte: false,
			selected: false,
		};
	},
	methods: {
		...mapMutations(['pause',
			'play',
			'queue',
			'error',
			'queueRemoveIndex',
			'removeMedia',
			'queuePlayIndex',
			'setShowMediaEdit',
			'addSearchResult',
		]),
		...mapActions(['matrixSend', 'matrixRedact']),
		setShowConfirmDelte() {
			if (this.isQueue) {
				this.queueRemoveIndex(this.queueIndex);
			} else {
				this.showConfirmDelte = true;
			}
		},
		_play() {
			if (this.isQueue) this.queuePlayIndex(this.queueIndex);
			else this.play({ media: this.video });
		},
		remove() {
			const { id, type } = this.currentMediaSource;
			if (type === 'matrix') {
				this.matrixRedact(this.video);
			} else if (type === 'playList') {
				this.removeMedia({ mediaIds: [this.video.id], tagName: id });
			} else {
				this.error('No suitable media source selected.');
			}
		},
		addToPlaylist() {
			const { id, type } = this.currentMediaSource;
			if (type === 'matrix') {
				this.matrixSend({ media: this.video, roomId: id });
			} else if (type === 'playList') {
				this.addSearchResult({ media: this.video, tagName: id });
			} else {
				this.error('No suitable media source selected.');
			}
		},
		youtubeLink() {
			return youtubeLink(this.video);
		},
		copyToClip() {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div');
			tmpEl.innerHTML = getMediaLink(this.video);
			document.body.appendChild(tmpEl);

			const range = document.createRange();
			range.selectNode(tmpEl);
			window.getSelection().addRange(range);

			try {
				document.execCommand('copy');
				this.copyActive = true;
				setTimeout(() => {
					this.copyActive = false;
					this.selected = false;
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
			selected: selected,
			error: video.hasError,
			old: !!expiryDate,
			mobile: isMobile,
			}"
		v-bind:title="expiryDate ? '🕑 hide in < 5min' : ''"
		v-on:dblclick="_play"
		v-bind:data-id="video.id">
		<div v-if="isVisible || !isPlayList || video.tracks">
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

					<span
						class="wmp-icon-pause"
						v-if="isPlaying"
						@click="pause();selected = false"
						title="Pause"></span>
					<span
						class="wmp-icon-play"
						v-else
						@click="_play();selected = false"
						title="Play"></span>

					<span
						v-if="video.tracks && !isQueue"
						@click="showSongs = !showSongs;selected = false"
						v-bind:class="{ active: showSongs }"
						title="Toggle album tracks"
						class="wmp-icon-album media-list__show-tracks"></span>

					<span
						class="wmp-icon-queue2 icon--small"
						@click="queue(video);selected = false"
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

					<span
						class="wmp-icon-share"
						title="Share"
						@click="setShowMediaEdit(video.id);selected = false"></span>
					<span
						class="wmp-icon-close"
						v-if="isPlayList || isQueue || (currentMediaSource.type === 'matrix' && matrixRooms[currentMediaSource.id].isAdmin)"
						@click="setShowConfirmDelte();selected = false"
						title="Remove"></span>

					<span
						v-if="isSearchResult"
						class="wmp-icon-add"
						@click="addToPlaylist(video);selected = false"
						title="Add to playlist"></span>

				</div>
				<div v-if="isMobile">
					<span
						class="wmp-icon-more_vert"
						@click="selected = !selected"></span>
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
			<div class="modal" v-if="showConfirmDelte" @click="showConfirmDelte = false">
				<div class="modal__body" @click.stop>
					Are you sure you want to remove this song?
					<div class="modal__btn-group">
						<button class="button" @click="showConfirmDelte = false">Cancel</button>
						<button class="button btn btn--blue" @click.stop="remove();showConfirmDelte = false;">Remove</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="media-list__main">
			<div class="media-list__thumbnail"></div>
				<div
					class="media-list__body">
					<div class="media-list__name">…</div>
					<div class="media-list__duration">
						0:00
					</div>
				</div>
		</div>
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
