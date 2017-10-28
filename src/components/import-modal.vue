<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';

export default {
	data() {
		return {
			importName: '',
			overwriteChannel: false,
		};
	},
	mounted() {
		this.importName = this.pendingImportURL ? this.pendingImportURL.name : '';
		if (!this.matrixLoggedIn && this.matrixEnabled) {
			this.initModule('matrix');
		}
	},
	methods: {
		...mapActions(['importURL', 'joinMatrixRoom', 'initModule']),
		...mapMutations(['setPendingImportURL', 'setMatrixEnabled', 'error']),
		close() {
			this.setPendingImportURL(null);
		},
		addToPlayList() {
			const el = document.querySelector('.import-modal__other-playlist-input');
			const value = el.value || null;
			this.importURL({ url: this.pendingImportURL.url, name: value });
		},
		importPlayList() {
			const el = document.querySelector('.import-modal__name-input');
			this.importURL({ url: this.pendingImportURL.url, name: el.value });
		},
		setOverwrite(event) {
			this.overwriteChannel = event.target.checked;
		},
		setImportName(event) {
			this.importName = event.target.value;
		},
		importRoom() {
			this.joinMatrixRoom({ id: this.pendingImportURL.url, name: this.pendingImportURL.name });
			this.close();
		},
		importChannel() {
			this.error('Not implemented yet .·´¯`(>▂<)´¯`·.');
		},
	},
	computed: {
		...mapState([
			'pendingImportURL',
			'matrixEnabled',
			'extensionAvilable',
		]),
		...mapState([
			'matrixLoggedIn',
		].reduce(
			(acc, n) => Object.assign(acc, { [n]: state => state.matrix[n] }),
			{}
		)),
		...mapState({
			webScrapers: state => state.webScraper.sources,
		}),
		...mapGetters(['sourcesOrdered']),
	},
};
</script>

<template>
	<div
		v-if="pendingImportURL"
		@click="close"
		class="import-modal modal">
		<div class="modal__body" @click.stop>
			<div v-if="pendingImportURL.type === 'channel'">
				<p>
					<h3>Import channel</h3>
					<div class="import-modal__row">
						<input
							class="import-modal__name-input input--border"
							type="text"
							placeholder="… name"
							@input="setImportName"
							:value="importName">
						<button
							class="button btn--blue"
							v-bind:class="{disabled: ((importName in webScrapers) && !overwriteChannel)}"
							@click="importChannel">Import</button>
					</div>
					<div v-if="importName in webScrapers">
						<input type="checkbox" id="overwrite" @change="setOverwrite">
						<label for="overwrite">
							overwrite channel
						</label>
					</div>
					<p v-if="!extensionAvilable">
						Please install the <a href="https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh" target="_blank" rel="noopener">Audius extension</a> for this feature.
					</p>
				</p>
			</div>
			<div v-if="pendingImportURL.type === 'room'">
				<h3>Join room</h3>
					<p v-if="!matrixEnabled">
							<button
								@click="setMatrixEnabled"
								class="button btn--blue">
								enable Matrix
							</button>
					</p>
					<p v-if="!matrixLoggedIn && matrixEnabled">
							… connecting to Matrix. Please be patient.
					</p>
					<p>
						<div class="import-modal__row">
							<div>{{pendingImportURL.name}}</div>
							<button
								v-bind:class="{disabled: !(matrixEnabled && matrixLoggedIn)}"
								class="button btn--blue"
								@click="importRoom">Join</button>
						</div>
					</p>
			</div>
			<div v-if="pendingImportURL.type != 'channel' && pendingImportURL.type != 'room'">
				<p>
					Create new playlist
					<div class="import-modal__row">
						<input class="import-modal__name-input input--border" type="text" placeholder="… name" :value="pendingImportURL.name">
						<button class="button btn--blue" @click="importPlayList">Create</button>
					</div>
				</p>
				<p>
					Add songs to playlist
					<div class="import-modal__row">
						<select class="import-modal__other-playlist-input">
							<option value="">Default</option>
							<option v-for="playListName in sourcesOrdered">{{playListName}}</option>
						</select>
						<button class="button btn--blue" @click="addToPlayList">Add</button>
					</div>
				</p>
			</div>
			<p class="import-modal__last">
					<button class="button" @click="close">Cancel</button>
			</p>
		</div>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.import-modal__row
	display: flex
	flex-direction: row
	align-items: center
	> *:not(:last-child)
		margin-right: $grid-space
.import-modal__last
	text-align: right
</style>
