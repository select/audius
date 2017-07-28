<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
	methods: {
		...mapMutations(['selectMediaSource', 'openWebScraperSettings', 'addWebScraper', 'deleteWebScraper']),
		...mapActions(['initWebScraper']),
		_addWebScraper() {
			const el = document.querySelector('.ws-manager__input input');
			this.addWebScraper(el.value);
			el.value = '';
		},

	},
	computed: {
		...mapState(['webScrapersOrderd', 'webScrapers', 'currentWebScraper']),
	},
};
</script>

<template>
	<div class="play-list-manager__wrapper">
		<ul class="play-list-manager__tags">
			<li
				v-for="id in webScrapersOrderd"
				@click="initWebScraper(id);selectMediaSource({type: 'tv', id: id})"
				v-bind:class="{ active: currentWebScraper === id }">
				<div class="play-list-manager__drag-handle"></div>
				<div class="play-list-manager__tag-body">
					{{id}}
				</div>
				<div
					v-if="webScrapers[id] && webScrapers[id].settings"
					class="play-list-manager__menu">
					<span
						class="wmp-icon-mode_edit"
						title="TV Settings"
						@click.stop="openWebScraperSettings(id)"></span>
					<span
						class="wmp-icon-close"
						title="Delte channel"
						@click.stop="deleteWebScraper(id)"></span>
				</div>
			</li>
			<li class="play-list-manager__input ws-manager__input">
				<input
					v-on:keyup.enter="_addWebScraper"
					type="text"
					placeholder="... new channel">
				<span class="wmp-icon-add" @click="_addWebScraper"></span>
			</li>
		</ul>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.play-list-manager__menu .wmp-icon-mode_edit
	font-size: .9rem;

</style>



