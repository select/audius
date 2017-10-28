<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import { getMediaEntity } from '../vuex/audius/getCurrentPlayList';
import { debounce, getMediaLink, youtubeLink } from '../utils';

export default {
	data() {
		return {
			copyActive: false,
			currentMediaSource: 'tags',
		};
	},
	computed: {
		...mapState([
			'showMediaEdit',
			'entities',
			'sourcesOrdered',
			'sources',
			'playList',
			'currentMediaSource',
		]),
		...mapState({
			webScrapers: state => state.webScraper.sources,
			webScrapersOrdered: state => state.webScraper.sourcesOrdered,
			matrixRooms: state => state.matrix.sources,
			matrixRoomsOrdered: state => state.matrix.sourcesOrdered,
			matrixLoggedIn: state => state.matrix.matrixLoggedIn,
		}),
		media() {
			if (!this.showMediaEdit) return {};
			return getMediaEntity(this.$store.state, this.showMediaEdit);
		},
		removeFrom() {
			const data = {
				tags: this.sourcesOrdered
					.filter(sourceId => this.sources[sourceId].includes(this.media.id)),
				matrixRooms: this.matrixRoomsOrdered
					.filter(sourceId => this.matrixRooms[sourceId].playList.some(
						({ id }) => id === this.media.id)
					),
				webScrapers: this.webScrapersOrdered
					.filter(sourceId => this.webScrapers[sourceId].playList.some(
						({ id }) => id === this.media.id)
					),
			};
			if (this.playList.includes(this.media.id)) data.tags.unshift('Default');
			return data;
		},
		addTo() {
			const { removeFrom } = this;
			const data = {
				tags: this.sourcesOrdered.filter(
					sourceId => !removeFrom.tags.includes(sourceId)
				),
				matrixRooms: this.matrixRoomsOrdered
					.filter(sourceId => !this.matrixRooms[sourceId].playList.some(
						({ id }) => id === this.media.id)
					),
			};
			if (!data.tags.includes('Default')) data.tags.unshift('Default');
			return data;
		},
		sourceLink() {
			if (this.media.type === 'youtube') return this.youtubeLink();
			else if (this.media.href) return this.media.href;
			return '';
		},
		sourceApiNames() {
			return [
				{ api: 'tags', label: 'playlist' },
				{ api: 'matrixRooms', label: 'room' },
				{ api: 'webScrapers', label: 'channel' },
			];
		},
		backgroundImage() {
			if ((this.media.type === 'youtube') && !this.media.hasError) {
				return `url(https://i.ytimg.com/vi/${this.media.youtubeId || this.media.id}/default.jpg)`;
			} else if (this.media.thumbUrl) {
				return `url(${this.media.thumbUrl})`;
			}
			return '';
		},
	},
	methods: {
		...mapActions([
			'matrixSend',
			'matrixRedact',
		]),
		...mapMutations([
			'updateMedia',
			'addSearchResult',
			'removeMedia',
			'play',
			'queue',
		]),
		_setName: debounce(function debouncedSetName(name) {
			this.patchMedia({ name });
		}, 1000),
		id2name(id) {
			return this.matrixRooms[id].name;
		},
		addMediaTo(sourceName, sourceId) {
			if (sourceName === 'matrixRooms') {
				this.matrixSend({ media: this.media, roomId: sourceId });
			} else if (sourceName === 'tags') {
				this.addSearchResult({
					media: this.media,
					tagName: sourceId === 'Default' ? '' : sourceId,
				});
			}
		},
		removeMediaFrom(sourceName, sourceId) {
			if (sourceName === 'matrixRooms') {
				this.matrixRedact(this.media);
			} else if (sourceName === 'tags') {
				this.removeMedia({
					mediaIds: [this.media.id],
					tagName: sourceId === 'Default' ? '' : sourceId,
				});
			}
		},
		youtubeLink() {
			if (!this.media) return '';
			return youtubeLink(this.media);
		},
		copyToClip() {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div');
			tmpEl.innerHTML = getMediaLink(this.media);
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
	},
};
</script>

<template>
<div
	v-if="showMediaEdit"
	class="settings media-edit">
	<div class="media-edit__header">
		<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: backgroundImage }"></div>
		<input
			@input="_setMediaTitle(currentMediaSource.id, $event.target.value)"
			type="text"
			class="media-edit__name"
			placeholder="… title"
			:value="media.title">
	</div>
	<div class="media-edit__body">
		<div class="button-group media-edit__link-buttons">
			<button
				class="button"
				@click="play({ media })"
				title="Play">
				<span class="wmp-icon-play"></span>
			</button>
			<button
				class="button"
				@click="queue(media)"
				v-bind:class="{ active: copyActive }"
				title="Add to queue">
				<span class="wmp-icon-queue2 icon--small"></span>
			</button>
			<button
				class="button"
				@click="copyToClip"
				v-bind:class="{ active: copyActive }"
				title="Copy name and URL">
				<span
					class="copy wmp-icon-copy icon--small"
					v-bind:class="{ active: copyActive }"
					></span>
			</button>
			<a
				title="Visit media source"
				class="button"
				target="_blank"
				:href="sourceLink">
				<span
					:class="{
						'wmp-icon-link': ['video', 'audio'].includes(media.type),
						'wmp-icon-youtube icon--small': media.type === 'youtube',
						'wmp-icon-vimeo  icon--small': media.type === 'vimeo',
					}"></span>
			</a>
		</div>
		<div class="spacer"></div>
		<div class="spacer"></div>
		<div class="button-group">
			<button
				v-for="src in sourceApiNames"
				class="button btn--blue-ghost"
				:class="{'btn--blue': currentMediaSource == src.api}"
				@click="currentMediaSource = src.api">{{src.label}}</button>
		</div>
		<div
			v-for="src in sourceApiNames"
			v-if="currentMediaSource == src.api">
			<ul>
				<li
					v-for="id in removeFrom[src.api]"
					@click="removeMediaFrom(src.api, id)"
					:title="src.api === 'tags' ? 'Remove from '+src.label : ''"
					class="active">
					<div> {{src.api === 'matrixRooms' ? id2name(id) : id}} </div>
					<span v-if="src.api === 'tags'" class="wmp-icon-close"></span>
				</li>
			</ul>
			<ul if="src.api in addTo">
				<li
					v-for="id in addTo[src.api]"
					@click="addMediaTo(src.api, id)"
					:title="'Add to '+src.label">
					<div> {{src.api === 'matrixRooms' ? id2name(id) : id}} </div>
					<span class="wmp-icon-add"></span>
				</li>
			</ul>
		</div>
		<p v-if="currentMediaSource=='webScrapers' && !removeFrom.webScrapers.length">
			… nothing found
		</p>
		<p v-if="currentMediaSource=='matrixRooms' && !matrixLoggedIn">
			… matrix not connected
		</p>
		<!-- <div class="box-1-1 media-edit__limits">
			<div>
				<label>Start</label>
				<div><input class="input--border" type="number" :value="media.start">s</div>
			</div>
			<div>
				<label>Stop</label>
				<div><input class="input--border" type="number" placeholder="">s</div>
			</div>
		</div> -->
		<!-- <div class="row media-edit__links">
			<div>
				<th>Thumbnail</th>
				<td>
					<input
						type="text"
						:value="media.thumbUrl"
						placeholder="… https://example.com/img/video.png">
				</td>
				<td></td>
			</div>
			<tr>
				<th>Source</th>
				<td>
					<input
					type="text"
					:value="media.href"
					placeholder="… https://example.com/video-item">
				</td>
				<td></td>
			</tr>
		</div> -->
		<!-- <div class="row">
			<label>Track parser</label><br>
			<textarea class="input--border" cols="30" rows="4" placeholder="… insert text with tracks"></textarea>
			<button class="button btn--blue">Parse</button>
		</div> -->
		<div class="spacer"></div>
	</div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'
.settings.media-edit
	display: flex
	flex-direction: column
	overflow: hidden
	height: 100%
	p
		text-align: center
	ul
		padding: 0
		list-style: none
		li
			height: $touch-size-small
			display: flex
			align-items: center
			padding: $grid-space
			cursor: pointer
			&.active
				color: $color-pictonblue
			*:first-child
				flex: 1
				white-space: nowrap
				overflow: hidden
				text-overflow: ellipsis
			[class^="wmp-icon"]
				display: none
			&:hover
				*:last-child
					display: block
			&:nth-child(odd)
				background: $color-catskillwhite
			&:hover
				background: $color-athensgrey
	.row, h3, h4, .media-edit__name
		padding: 0 $grid-space
	.spacer
		height: #{2 * $grid-space}
	th, label
		text-align: left
		font-weight: normal
		color: $color-aluminium
		text-transform: uppercase
		font-size: .7rem
		padding-right: #{2 * $grid-space}

.media-edit__header
	height: $touch-size-medium
	margin: $grid-space
	display: flex
	> *
		&:first-child
			height: $touch-size-medium
			width: $touch-size-medium
	.media-edit__name
		flex: 1
		font-size: 1.2rem
		height: $touch-size-medium
		width: 100%
		margin-bottom: $grid-space
.media-edit__body
	flex: 1
	overflow-y: auto
.media-edit__link-buttons
	& > .button
		display: flex
		align-items: center
		justify-content: center
		white-space: nowrap
		margin-right: #{2 * $grid-space}
		width: $touch-size-medium
		border: 0
		color: $color-palesky
		&:hover
			color: $color-pictonblue
		span
			height: $touch-size-tiny
.copy
	transition: all $transition-time
	&.active,
	&.active:hover
		background: $color-larioja
		border-color: $color-larioja
		color: $color-white

.media-edit__limits
	width: 100%
	overflow: hidden
	padding: 0 $grid-space
	>div:first-child
			margin-right: 2 * $grid-space
	label + div
		display: flex
		align-items: center
		input
			width: 2*$touch-size-medium
			margin-right: $grid-space
</style>
