<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { mapModuleState } from '../utils';

export default {
	data() {
		return {
			showConfirmDelte: false,
		};
	},
	created() {
		this.initModule('webScraper');
	},
	methods: {
		...mapMutations(['selectMediaSource', 'setShowMediumSettings', 'addWebScraper', 'deleteWebScraper']),
		...mapActions(['initModule', 'initWebScraper']),
		_addWebScraper() {
			const el = document.querySelector('.ws-manager__input input');
			this.addWebScraper(el.value);
			el.value = '';
		},
	},
	computed: {
		...mapState([
			'loadedModules',
			'currentMediaSource',
			'playedMedia',
		]),
		...mapModuleState('webScraper', [
			'sourcesOrdered',
			'sources',
		]),
	},
};
</script>

<template>
	<div class="play-list-manager__wrapper" v-if="loadedModules.webScraper">
		<ul class="play-list-manager__tags">
			<li
				v-for="id in sourcesOrdered"
				@click="initWebScraper(id);selectMediaSource({type: 'webScraper', id: id})"
				v-bind:class="{ active: currentMediaSource.id === id }">
				<div class="play-list-manager__drag-handle"></div>
				<div class="play-list-manager__tag-body">
					<div> {{id}} </div>
					<div v-if="sources[id] && sources[id].playList">{{sources[id].playList.filter(({id}) => !(id in playedMedia)).length }} New</div>
				</div>
				<div
					v-if="sources[id] && sources[id].settings"
					class="play-list-manager__menu">
					<span
						class="wmp-icon-mode_edit"
						title="Edit channel"
						@click.stop="setShowMediumSettings({ medium: 'webScraper', id })"></span>
					<span
						class="wmp-icon-close"
						title="Delte channel"
						@click.stop="showConfirmDelte = id"></span>
				</div>
			</li>
			<li class="play-list-manager__input ws-manager__input">
				<div class="play-list-manager__tag-body">
					<input
						v-on:keyup.enter="_addWebScraper"
						type="text"
						placeholder="... new channel">
				</div>
				<div class="play-list-manager__create">
					<span
						class="wmp-icon-add"
						title="Create channel"
						@click.stop="_addWebScraper"></span>
				</div>
			</li>
		</ul>
		<div class="modal" v-if="showConfirmDelte" @click.stop="showConfirmDelte = false">
			<div class="modal__body" @click.stop>
				Are you sure you want to delete this channel?
				<div class="modal__btn-group">
					<button class="button" @click="showConfirmDelte = false">Cancel</button>
					<button class="button btn btn--blue" @click.stop="deleteWebScraper(showConfirmDelte);showConfirmDelte = false;">Remove</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.play-list-manager__menu
	.wmp-icon-mode_edit
		font-size: .9rem;

</style>



