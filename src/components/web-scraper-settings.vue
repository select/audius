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
				// this.moveTagsOrdered(value);
			},
		},
	},
	methods: {
		...mapMutations(['updateWebScraper', 'addUrlPattern', 'renameWebScraper']),
		_addUrlPattern() {
			const el = this.$el.querySelector('.ws-settings__input');
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
	<p>
		<input
			@input="renameWebScraper({oldName: currentWebScraper, newName: $event.target.value})"
			class="ws-settings__name"
			type="text"
			placeholder="... name"
			v-bind:value="this.currentWebScraper">
	</p>
	<p>
		URLS
		<draggable
			v-model="_urls"
			element="ul"
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
				<div class="ws-settings__url-menu">
					<span
						title="Delte URL"
						@click="removeUrl(url.url)"
						class="wmp-icon-close"></span>
				</div>
			</li>
		</draggable>
		<ul>
			<li>
				<input class="ws-settings__input" type="text" placeholder="http://www.example.com/page/[1-100]">
				<span class="wmp-icon-add" @click="_addUrlPattern"></span>
			</li>
		</ul>
	</p>
	<p>
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
	input
		background: transparent
		border: 0
		padding: 0
		flex: 1
		&::-webkit-input-placeholder
			color: $color-aluminium
		&:-moz-placeholder
			color: $color-aluminium
		&::-moz-placeholder
			color: $color-aluminium
	ul
		padding: 0
		li
			display: flex
			align-items: center
			height: $touch-size-medium
			justify-content: space-between
			padding: 0 $grid-space
			&:hover .ws-settings__url-menu
				display: block
			>div:first-child
				flex: 1
				word-break: break-all
		li:nth-child(even)
			background: $color-catskillwhite
		li:hover
			background: $color-athensgrey
.ws-settings__url-menu
	display: none
	cursor: pointer
.ws-settings__name
	font-size: 1.5rem
	height: $touch-size-huge
</style>
