<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['webScrapers', 'currentWebScraper']),
		webScraperSettings() {
			return this.webScrapers[this.currentWebScraper];
		},
		urlPatterns() {
			if (!(this.currentWebScraper && this.webScrapers[this.currentWebScraper].settings)) return [];
			return this.webScrapers[this.currentWebScraper].settings.urlPatterns || [];
		},
	},
	methods: {
		...mapMutations(['updateWebScraper', 'addUrlPattern']),
		_addUrlPattern() {
			const el = this.$el.querySelector('.ws-settings__input');
			this.addUrlPattern({
				id: this.currentWebScraper,
				urlPattern: el.value,
			});
			el.value = '';
		},
	},
};
</script>

<template>
<div class="settings ws-settings">
	<p>
		<input type="text" placeholder="... name" v-bind:value="this.currentWebScraper">
	</p>
	<p>
		URLS
		<ul>
			<li v-for="pattern in urlPatterns">
				{{pattern}}
			</li>
			<li>
				<input class="ws-settings__input" type="text" placeholder="http://www.example.com/page/[1-100]">
				<span class="wmp-icon-add" @click="_addUrlPattern"></span>
			</li>
		</ul>
	</p>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.ws-settings
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
		li:nth-child(even)
			background: $color-catskillwhite
		li:hover
			background: $color-athensgrey

</style>
