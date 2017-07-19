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
		...mapState(['exportURLs']),
		...mapGetters(['currentName', 'currentExportData']),
	},
	methods: {
		...mapActions(['exportToURL']),
		exportPlayListFile() {
			debugger;
			const data = this.currentExportData();
			const element = document.createElement('a');
			element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`);
			element.setAttribute(
				'download',
				this.currentName ? `${this.currentName}.audius-playlist` : 'default.audius-playlist'
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
			if (!name) tmpEl.innerHTML = url;
			else tmpEl.innerHTML = `${window.location.href}?import=${url}&title=${name}`;
			document.body.appendChild(tmpEl);

			const range = document.createRange();
			range.selectNode(tmpEl);
			window.getSelection().addRange(range);

			try {
				document.execCommand('copy');
				if (!name) this.copyURLActive = url;
				else this.copyActive = url;
				setTimeout(() => {
					if (!name) this.copyURLActive = null;
					else this.copyActive = null;
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
		<div
			class="play-list__export-list-wrapper"
			v-if="exportURLs.length">
			<p class="smaller">
				Click and paste to share your playlist.
			</p>
			<p>
				<ul class="play-list__exports">
					<li
						v-for="item in exportURLs">
						<div
							class="play-list__full"
							v-bind:class="{ active: copyActive == item.url }"
							@click="copyToClip(item.url, item.name)"
							title="Share with Audius">
							<div>
								<div class="play-list__date">
									{{item.name}} - {{niceDate(item.date)}}
								</div>
								<b>{{item.url}}</b>
							</div>
						</div>
						<div
							@click="copyToClip(item.url, null)"
							v-bind:class="{ active: copyURLActive == item.url }"
							title="Copy data URL">
							<span class="wmp-icon-copy"></span>
						</div>
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
.play-list__full
	flex: 1
	align-items: flex-start
	overflow: hidden
.play-list__date
	white-space: nowrap
</style>
