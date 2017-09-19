<script>
import draggable from 'vuedraggable';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
	components: {
		draggable,
	},
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['webScrapers', 'currentWebScraper']),
		_urls: {
			get() {
				if (!(this.currentWebScraper && this.webScrapers[this.currentWebScraper].settings)) return [];
				return this.webScrapers[this.currentWebScraper].settings.urls || [];
			},
			set(value) {
				this.updateWebScraper({
					id: this.currentWebScraper,
					values: {
						settings: {
							...this.webScrapers[this.currentWebScraper].settings,
							urls: value,
						},
					},
				});
			},
		},
	},
	methods: {
		...mapMutations(['updateWebScraper', 'addUrlPattern', 'renameWebScraper']),
		_addUrlPattern() {
			const el = this.$el.querySelector('.ws-settings .input-list__input');
			this.addUrlPattern({
				id: this.currentWebScraper,
				urlPattern: el.value,
			});
			el.value = '';
		},
		removeUrl(deltetUrl) {
			this.updateWebScraper({
				id: this.currentWebScraper,
				values: {
					settings: {
						...this.webScrapers[this.currentWebScraper].settings,
						urls: this._urls.filter(({ url }) => url !== deltetUrl),
					},
				},
			});
		},
	},
};
</script>

<template>
<div class="settings ws-settings">
	<input
		@input="renameWebScraper({oldName: currentWebScraper, newName: $event.target.value})"
		class="ws-settings__name"
		type="text"
		placeholder="... name"
		v-bind:value="this.currentWebScraper">
	<h3>URLS</h3>
	<draggable
		v-model="_urls"
		element="ul"
		class="input-list"
		:options="{
			animation: 150,
			scrollSpeed: 20,
		}">
		<li v-for="url in _urls">
			<div>
				{{url.url}}
			</div>
			<div>
				({{url.numPages}} Page{{url.numPages > 1 ? 's' : ''}})
			</div>
			<div class="input-list__menu">
				<span
					title="Delte URL"
					@click="removeUrl(url.url)"
					class="wmp-icon-close"></span>
			</div>
		</li>
	</draggable>
	<ul class="input-list">
		<li>
			<input class="input-list__input" type="text" placeholder="… http://www.example.com/page/[1-100]">
			<span class="wmp-icon-add" @click="_addUrlPattern"></span>
		</li>
	</ul>
	<p class="smaller">
		Please install the <a href="https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh" target="_blank">Audius extension</a> for this feature.
	</p>

</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.ws-settings
	overflow: hidden
	width: 100%
	padding: $grid-space 0
	input
		background: transparent
		flex: 1
		&::-webkit-input-placeholder
			color: $color-aluminium
		&:-moz-placeholder
			color: $color-aluminium
		&::-moz-placeholder
			color: $color-aluminium
	.ws-settings__name
		font-size: 1.5rem
		height: $touch-size-huge
		width: 100%
		padding: 0 $grid-space
	p, h3
		padding: 0 $grid-space

</style>
