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
		...mapState(['exportURLs', 'currentWebScraper', 'webScrapers', 'currentMatrixRoom', 'matrixRooms']),
		...mapGetters(['currentName', 'currentExportData', 'exportTypeName']),
	},
	methods: {
		...mapActions(['exportToURL']),
		exportFile() {
			const data = this.currentExportData;
			const element = document.createElement('a');
			element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`);
			element.setAttribute(
				'download',
				this.currentWebScraper ? `${this.currentWebScraper}.audius-channel` : this.currentName ? `${this.currentName}.audius-playlist` : 'default.audius-playlist'
			);
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		},
		niceDate(date) {
			if (!date) return date;
			const dateObject = new Date(date);
			const minutes = dateObject.getMinutes() < 10 ? `0${dateObject.getMinutes()}` : dateObject.getMinutes();
			return `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()} ${dateObject.getHours()}:${minutes}`;
		},
		copyToClip(type, url, name) {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div');
			if (type === 'room') tmpEl.innerHTML = `${window.location.href}?import=${this.currentMatrixRoom}&type=${this.exportTypeName}&title=${encodeURIComponent(this.matrixRooms[this.currentMatrixRoom].name)}`;
			else if (['channel', 'playList', undefined].includes(type)) tmpEl.innerHTML = `${window.location.href}?import=${url}&type=${type}&title=${encodeURIComponent(name)}`;
			else if (type === 'url') tmpEl.innerHTML = url;
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
			} catch (err) {
				console.warn('execCommand Error', err);
			}
			window.getSelection().removeAllRanges();
			tmpEl.parentNode.removeChild(tmpEl);
		},
	},
};
</script>

<template>
	<div class="play-list__import"  >
		<div class="play-list__import-header">
			<div> Export {{exportTypeName}} </div>
			<span
				class="wmp-icon-close"
				title="[Esc] Close"
				v-on:click="$emit('toggleExport', false)"></span>
		</div>
		<div v-if="currentMatrixRoom" class="play-list__export-room">
			<button
				class="button btn--blue play-list__export-copy-room"
				v-bind:class="{ active: copyURLActive }"
				@click="copyToClip('room')">
					copy
				</button>
				<br>
				Click and paste to share this room.
		</div>
		<div v-else>
			<button
				class="button btn--blue"
				v-on:click="exportFile">to file</button>
			<button
				class="button btn--blue"
				v-on:click="exportToURL">to Web</button>
			<div
				class="play-list__export-list-wrapper"
				v-if="exportURLs.length">
				<p class="smaller">
					Click and paste to share your {{exportTypeName}}.
				</p>
				<p>
					<ul class="play-list__exports">
						<li
							v-for="item in exportURLs">
							<div
								class="play-list__full"
								v-bind:class="{ active: copyActive == item.url }"
								@click="copyToClip(item.type, item.url, item.name)"
								title="Share with Audius">
								<div>
									<div class="play-list__date">
										{{item.name}} {{item.type && !item.type.includes('play') ? `(${item.type})` : ''}} -  {{niceDate(item.date)}}
									</div>
									<b>{{item.url}}</b>
								</div>
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
		.wmp-icon-copy
			color: $color-aluminium
.play-list__export-copy-room.active
	background: $color-larioja
	border-color: $color-larioja
.play-list__export-room
	padding-top: #{2 * $grid-space}
	text-align: center
.play-list__full
	flex: 1
	align-items: flex-start
	overflow: hidden
.play-list__date
	white-space: nowrap
</style>
