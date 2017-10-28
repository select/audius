<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
	data() {
		return {
			copyActive: null,
			copyURLActive: null,
		};
	},
	computed: {
		...mapState([
			'exportURLs',
			'currentMediaSource',
			'isMobile',
		]),
		...mapGetters([
			'currentName',
			'currentExportData',
			'exportTypeName',
		]),
	},
	methods: {
		...mapActions(['exportToURL', 'exportToFile', 'error']),
		exportFile() {
			const { id, type } = this.currentMediaSource;
			const fileExtensions = {
				playList: 'audius-playlist',
				webScraper: 'audius-channel',
			};
			this.exportToFile({
				data: this.currentExportData,
				fileName: `${id || 'Default'}.${fileExtensions[type]}`,
			});
		},
		niceDate(date) {
			if (!date) return date;
			const dateObject = new Date(date);
			const minutes = dateObject.getMinutes() < 10 ? `0${dateObject.getMinutes()}` : dateObject.getMinutes();
			return `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()} ${dateObject.getHours()}:${minutes}`;
		},
		getLink(type, url, name) {
			if (type === 'Imgur') return `${window.location.href}?showImgur=1`;
			else if (type === 'room') return `${window.location.href}?import=${this.currentMediaSource.id}&type=${this.exportTypeName}&title=${encodeURIComponent(this.matrixRooms[this.currentMatrixRoom.id].name)}`;
			else if (['channel', 'playList', undefined].includes(type)) return `${window.location.href}?import=${url}&type=${type}&title=${encodeURIComponent(name)}`;
			else if (type === 'url') return url;
			return '';
		},
		copyToClip(type, url, name) {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div');
			tmpEl.innerHTML = this.getLink(type, url, name);
			document.body.appendChild(tmpEl);

			const range = document.createRange();
			range.selectNode(tmpEl);
			window.getSelection().addRange(range);

			try {
				document.execCommand('copy');
				if (!name) this.copyURLActive = url || true;
				else this.copyActive = url;
				setTimeout(() => {
					this.copyURLActive = null;
					this.copyActive = null;
				}, 800);
			} catch (error) {
				this.error(`Could not copy to clipboard. ${error}`);
			}
			window.getSelection().removeAllRanges();
			tmpEl.parentNode.removeChild(tmpEl);
		},
		twitterLink(item) {
			const text = `${item.name || 'Default'} (${item.type}) ${this.getLink(item.type, item.url, item.name)}`;
			return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
		},
		whatsAppLink(item) {
			const text = `${item.name || 'Default'} (${item.type}) ${this.getLink(item.type, item.url, item.name)}`;
			return encodeURIComponent(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
		},
	},
};
</script>

<template>
	<div class="play-list__import play-list__export"  >
		<div class="play-list__import-header">
			<div> Share {{exportTypeName}} </div>
			<span
				class="wmp-icon-close"
				title="[Esc] Close"
				v-on:click="$emit('toggleExport', false)"></span>
		</div>
		<div
			v-if="currentMediaSource.type === 'webScraper' && currentMediaSource.id == 'Imgur'"
			class="play-list__export-room">
			<button
				class="button btn--blue play-list__export-copy-room"
				v-bind:class="{ active: copyURLActive }"
				@click="copyToClip('Imgur')">
					copy link
				</button>
		</div>
		<div v-if="currentMediaSource.type === 'matrix' && currentMediaSource.id" class="play-list__export-room">
			<button
				class="button btn--blue play-list__export-copy-room"
				v-bind:class="{ active: copyURLActive }"
				@click="copyToClip('room')">
					copy link
				</button>
			<a class="button btn--blue" :href="twitterLink({type: 'room', name: matrixRooms[this.currentMediaSource.id].name})" target="_blank" rel="noopener">
				<span class="wmp-icon-twitter"></span>
				<div>twitter</div>
			</a>
			<a
				class="button btn--blue"
				v-if="isMobile"
				:href="whatsAppLink({type: 'room', name: matrixRooms[this.currentMediaSource.id].name})"
				target="_blank" rel="noopener">
				<span class="wmp-icon-whatsapp"></span>
				<div>whatsapp</div>
			</a>
		</div>
		<div v-else>
			<div v-if="currentMediaSource.id != 'Imgur'" class="button-group">
				<button
					class="button btn--blue"
					v-on:click="exportToURL">create link</button>
			</div>
			<div
				class="play-list__export-list-wrapper"
				v-if="exportURLs.length">
				<p v-if="currentMediaSource.id != 'Imgur'" class="smaller">
					Click and paste to share your {{exportTypeName}}.
				</p>
				<p>
					<ul class="play-list__exports">
						<li
							v-for="item in exportURLs">
							<div
								class="play-list__full"
								v-bind:class="{ active: copyActive == item.url }"
								@click="copyToClip(item.type, item.url, item.name || 'Default')"
								title="Copy link">
								<div class="play-list__name">
									<span>
									{{item.name || 'Default'}} {{item.type && !item.type.includes('play') ? `(${item.type})` : ''}}
									</span>
									<span class="play-list__date">
										{{niceDate(item.date)}}
									</span>
								</div>
									<div class="play-list__url">{{item.url}}</div>
							</div>
							<div @click="copyToClip(item.type, item.url, item.name || 'Default')">
								<span class="wmp-icon-link"></span>
							</div>
							<div v-if="isMobile">
								<a :href="whatsAppLink(item)" target="_blank" rel="noopener">
									<span class="wmp-icon-whatsapp"></span>
								</a>
							</div>
							<div>
								<a :href="twitterLink(item)" target="_blank" rel="noopener">
									<span class="wmp-icon-twitter"></span>
								</a>
							</div>
							<div
								@click="copyToClip('url', item.url)"
								v-bind:class="{ active: copyURLActive == item.url }"
								title="Copy data URL">
								<span class="wmp-icon-copy"></span>
							</div>
						</li>
					</ul>
				</p>
			</div>
			<div class="button-group">
				<button
					class="button btn--blue"
					v-on:click="exportFile">save file</button>
			</div>
		</div>
	</div>
</template>


<style lang="sass?indentedSyntax" scoped>
@import '../sass/vars'
@import '../sass/color'

.smaller
	font-size: 0.9rem
.play-list__export-list-wrapper
	width: 100%
	overflow: hidden
.play-list__exports
	list-style: none
	padding: 0
	li
		height: $touch-size-medium
		display: flex
		flex-direction: row
		> div
			display: flex
			flex-direction: row
			cursor: pointer
			&:hover
				background: $color-catskillwhite
			&.active,
			&.active:hover
				background: $color-larioja
				color: $color-white
		[class^="wmp-icon"]
			color: $color-palesky
		.wmp-icon-copy
			font-size: .7rem
.play-list__export
	.button
		justify-content: center
	a.button
		position: relative
		justify-content: center
		align-items: center
		span
			left: $grid-space
			position: absolute
.play-list__export-copy-room.active
	background: $color-larioja
	border-color: $color-larioja
.play-list__export-room
	padding-top: #{2 * $grid-space}
.play-list__full.play-list__full
	flex: 1
	align-items: flex-start
	overflow: hidden
	flex-direction: column
	justify-content: center
	div,span
		white-space: nowrap
.play-list__name
	display: flex
	justify-content: space-between
	width: 100%
.play-list__url
	font-size: 0.7rem
	color: $color-pictonblue
.play-list__date
	font-size: .7rem
</style>
