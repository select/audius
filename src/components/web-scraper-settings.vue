<script>
import draggable from 'vuedraggable';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import { mapModuleState } from '../utils';

export default {
	components: {
		draggable,
	},
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['currentMediaSource', 'extensionAvilable']),
		...mapModuleState('webScraper', ['sources', 'forward']),
		...mapState({
			matrixSources: state => state.matrix.sources,
			matrixSourcesOrdered: state => state.matrix.sourcesOrdered,
		}),
		settings() {
			const { id, type } = this.currentMediaSource;
			if (type !== 'webScraper') return {};
			return this.sources[id].settings || {};
		},
		_forwards() {
			return this.forward[this.currentMediaSource.id] || [];
		},
		_forwardSources() {
			const forward = this.forward[this.currentMediaSource.id] || [];
			const forwardIndex = new Set(forward.map(({ id }) => id));
			return this.matrixSourcesOrdered.filter(id => !forwardIndex.has(id))
		},
		_urls: {
			get() {
				return this.settings.urls || [];
			},
			set(value) {
				this.updateWebScraper({
					id: this.currentMediaSource.id,
					values: {
						settings: {
							...this.settings,
							urls: value,
						},
					},
				});
			},
		},
	},
	methods: {
		...mapMutations(['updateWebScraper', 'addUrlPattern', 'editWebScraperForward']),
		...mapActions(['renameWebScraper']),
		updateSettings(values) {
			this.updateWebScraper({
				id: this.currentMediaSource.id,
				values: {
					settings: {
						...this.settings,
						...values,
					},
				},
			});
		},
		_editWatchPage() {
			const $el = this.$refs.watchInput;
			// const url = new URL($el.value);
			// console.log("url.hostname", url.hostname);
			this.updateWebScraper({
				id: this.currentMediaSource.id,
				values: {
					settings: {
						...this.settings,
						watchUrl: $el.value,
					},
				},
			});
			$el.value = '';
		},
		_addUrlPattern() {
			const $el = this.$refs.urlInput;
			this.addUrlPattern({
				id: this.currentMediaSource.id,
				urlPattern: $el.value,
			});
			$el.value = '';
		},
		removeUrl(deltetUrl) {
			this.updateSettings({ urls: this._urls.filter(({ url }) => url !== deltetUrl) });
		},
		addForward() {
			const roomId = this.$refs.forward.value;
			const forward = this.forward[this.currentMediaSource.id] || [];
			this.editWebScraperForward({
				id: this.currentMediaSource.id,
				forward: [...forward, { type: 'matrix', id: roomId }],
			});
		},
		removeForward(roomId) {
			const forward = this.forward[this.currentMediaSource.id] || [];
			this.editWebScraperForward({
				id: this.currentMediaSource.id,
				forward: forward.filter(({ id }) => id !== roomId),
			});
		},
	},
};
</script>

<template>
<div class="settings ws-settings">
	<p v-if="!extensionAvilable" class="smaller">
		Please install the <a href="https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh" target="_blank">Audius extension</a> for this feature.
	</p>
	<input
		@input="renameWebScraper({oldName: currentMediaSource.id, newName: $event.target.value})"
		class="ws-settings__name"
		type="text"
		placeholder="... name"
		:value="this.currentMediaSource.id">
	<div class="button-group">
		<button
			:class="{ 'btn--tab-active': settings.type == 'urls' }"
			class="button btn--tab"
			@click="updateSettings({ type: 'urls' })">URL patterns</button>
		<button
			:class="{ 'btn--tab-active': settings.type == 'script' }"
			class="button btn--tab"
			@click="updateSettings({ type: 'script' })">Script</button>
		<button
			:class="{ 'btn--tab-active': settings.type == 'watch' }"
			class="button btn--tab"
			@click="updateSettings({ type: 'watch' })">Watch</button>
	</div>
	<div
		class="ws-settings__script"
		v-if="settings.type == 'script'">
		<textarea
			class="input--border"
			rows="10"
			:value="settings.script"
			@input.stop="updateSettings({ script: $event.target.value })"></textarea>
		<div class="smaller">The code is executed in a <a href="https://developer.chrome.com/extensions/sandboxingEval">secure sandbox</a> in the extension.</div>
	</div>
	<div
		class="ws-settings__watch"
		v-if="settings.type == 'watch'">
		<div>{{settings.watchUrl}}</div>
		<div>
			<input ref="watchInput" type="text" placeholder="… http://music.slack.com/">
			<span class="wmp-icon-add" @click="_editWatchPage"></span>
		</div>
		<p class="smaller">
			Scrape media links from an open tab in your browser.
		</p>
	</div>
	<div v-if="settings.type == 'urls'">
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
				<input ref="urlInput" type="text" placeholder="… http://www.example.com/page/[1-100]">
				<span class="wmp-icon-add" @click="_addUrlPattern"></span>
			</li>
		</ul>
	</div>
	<div v-if="matrixSourcesOrdered.length">
		<h3>Forward</h3>
		<p>
			Post new items to a matrix room.
		</p>
		<div class="ws-settings__forward-list">
			<div v-for="(f,i) in _forwards" :key="i">
				<div>{{matrixSources[f.id].name}}</div>
				<span class="wmp-icon-close" @click="removeForward(f.id)"></span>
			</div>
		</div>
		<div class="ws-settings__new-forward">
			<select ref="forward">
				<option v-for="roomId in _forwardSources" :value="roomId">{{matrixSources[roomId].name}}</option>
			</select>
			<span class="wmp-icon-add" @click="addForward"></span>
		</div>
	</div>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.ws-settings
	width: 100%
	padding: $grid-space 0
	overflow: hidden
	[class^='wmp-icon']
		cursor: pointer
	input
		flex: 1
		background: transparent
		&::-webkit-input-placeholder
			color: $color-aluminium
		&:-moz-placeholder
			color: $color-aluminium
		&::-moz-placeholder
			color: $color-aluminium
	.ws-settings__name
		width: 100%
		height: $touch-size-huge
		padding: 0 $grid-space
		font-size: 1.5rem
	p,
	h3
		padding: 0 $grid-space
.ws-settings__watch
	padding: #{2 * $grid-space} $grid-space
	> div
		display: flex
		align-items: center
		height: $touch-size-medium
		&:hover
			background: $color-catskillwhite

.ws-settings__script
	padding: #{2 * $grid-space} $grid-space
	textarea
		width: 100%
.ws-settings__new-forward
	display: flex
	flex-direction: row
	align-items: center
	padding: $grid-space
.ws-settings__forward-list
	> div
		display: flex
		flex-direction: row
		align-items: center
		justify-content: space-between
		height: $touch-size-medium
		padding: $grid-space
		[class^='wmp-icon']
			display: none
		&:hover
			background-color: $color-catskillwhite
			[class^='wmp-icon']
				display: block


</style>
