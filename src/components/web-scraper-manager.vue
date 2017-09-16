<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
	methods: {
		...mapMutations(['selectMediaSource', 'setShowMediumSettings', 'addWebScraper', 'deleteWebScraper']),
		...mapActions(['initWebScraper']),
		_addWebScraper() {
			const el = document.querySelector('.ws-manager__input input');
			this.addWebScraper(el.value);
			el.value = '';
		},
		numWatched(id) {
			if (!(id in this.webScrapers)) return 0;
			const res = this.webScrapers[id].archive ? this.webScrapers[id].archive.length : 0;
			return res + Object.keys(this.webScrapers[id].playedMedia).length;
		},
	},
	computed: {
		...mapState(['webScrapersOrdered', 'webScrapers', 'currentWebScraper']),
	},
};
</script>

<template>
	<div class="play-list-manager__wrapper">
		<ul class="play-list-manager__tags">
			<li
				v-for="id in webScrapersOrdered"
				@click="initWebScraper(id);selectMediaSource({type: 'tv', id: id})"
				v-bind:class="{ active: currentWebScraper === id }">
				<div class="play-list-manager__drag-handle"></div>
				<div class="play-list-manager__tag-body">
					<div> {{id}} </div>
					<div v-if="webScrapers[id] && webScrapers[id].playList">{{webScrapers[id].playList.length - Object.keys(webScrapers[id].playedMedia).length}} New {{numWatched(id)}} Watched </div>
				</div>
				<div
					v-if="webScrapers[id] && webScrapers[id].settings"
					class="play-list-manager__menu">
					<span
						class="wmp-icon-mode_edit"
						title="Edit channel"
						@click.stop="setShowMediumSettings({ medium: 'tv', id })"></span>
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
				<span
					class="wmp-icon-add"
					title="Create channel"
					@click="_addWebScraper"></span>
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



