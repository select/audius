<script>
import { ajaxPost } from '../utils';
import { mapState, mapActions } from 'vuex';

export default {
	props: [
		'currentPlayList',
		'filteredPlayList',
		'entities',
	],
	data() {
		return {
			copyActive: null,
		};
	},
	computed: mapState(['exportURLs']),
	methods: {
		...mapActions(['exportToURL']),
		exportPlayListFile() {
			const data = {
				AudiusDump: true,
				playList: this.filteredPlayList,
				entities: this.entities,
			};
			const element = document.createElement('a');
			element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`);
			element.setAttribute(
				'download',
				this.currentPlayList ? `${this.currentPlayList}.audius-playlist` : 'default.audius-playlist'
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
		copyToClip(url, name) {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div');
			tmpEl.innerHTML = `${window.location.href}?import=${url}&title=${name}`;
			document.body.appendChild(tmpEl);

			const range = document.createRange();
			range.selectNode(tmpEl);
			window.getSelection().addRange(range);

			try {
				document.execCommand('copy');
				this.copyActive = url;
				setTimeout(() => {
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
	<div class="paly-list__import"  >
		<div class="paly-list__import-header">
			<div> Export playlist </div>
			<span
				class="wmp-icon-close"
				title="[Esc] Close"
				v-on:click="$emit('toggleExport', false)"></span>
		</div>
		<button
			class="button btn--blue"
			v-on:click="exportPlayListFile">to file</button>
		<button
			class="button btn--blue"
			v-on:click="exportToURL">to Web</button>
		<div v-if="exportURLs.length">
			<p class="smaller">
				Copy and paste the URL to share your playlist.
			</p>
			<p>
				<ul class="paly-list__exports">
					<li
						v-for="item in exportURLs"
						v-bind:class="{ active: copyActive == item.url }"
						title="Copy URL"
						@click="copyToClip(item.url, item.name)">
						<div>
							{{item.name}} - {{niceDate(item.date)}}
						</div>
						<b>{{item.url}}</b>
					</li>
				</ul>
			</p>
		</div>
	</div>
</template>


<style lang="sass?indentedSyntax" scoped>
@import '../sass/vars'
@import '../sass/color'

.smaller
	font-size: 0.9em
.paly-list__exports
	list-style: none
	padding: 0
	li
		height: $touch-size-medium
		display: flex
		flex-direction: column
		justify-content: center
		cursor: pointer
		&:hover
			background: $color-catskillwhite
		&.active,
		&.active:hover
			background: $color-larioja
			color: $color-white
</style>
