<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
	methods: {
		...mapMutations(['moveTagsOrderd', 'dropMoveItem', 'selectMediaSource']),
		addTags() {
			const el = document.querySelector('.play-list-manager__input input');
			this.$store.commit('addTags', { tag: el.value });
			el.value = '';
		},
	},
	computed: {
		...mapState(['webScrapersOrderd', 'currentWebScraper']),
	},
};
</script>

<template>
	<div class="play-list-manager__wrapper">
		<ul class="play-list-manager__tags">
			<li
				v-for="id in webScrapersOrderd"
				@click="selectMediaSource({type: 'tv', id: id})"
				v-bind:class="{ active: currentWebScraper }">
				<div class="play-list-manager__drag-handle"></div>
				<div class="play-list-manager__tag-body">
					{{id}}
				</div>
			</li>

			<!-- <li class="play-list-manager__input">
				<div class="play-list-manager__drag-handle"></div>
				<div class="play-list-manager__tag-body">
					Create TV station
				</div>
				<span class="wmp-icon-add" @click="addTags"></span>
			</li> -->
		</ul>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'


</style>



