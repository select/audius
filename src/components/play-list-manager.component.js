import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import './play-list-manager.component.sass';

Vue.component('play-list-manager', {
	data() {
		return {
			state: store.getState(),
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.state = store.getState();
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
	},
	template: `
<div
	class="play-list-manager"
	v-bind:class="{ active: state.website.showPlayLists }">
	<div class="nav-handle" title="Playlists" v-on:click="store.dispatch(Actions.togglePlayLists())">
		<div class="nav-handle__tab"></div>
		<span class="wmp-icon-queue_music"></span>
	</div>
	<ul>
		<li class="active">All</li>
		<li class="spacer"></li>
		<li>
			<div> Rock </div>
			<div class="play-list-manager__menu">
				<span class="wmp-icon-mode_edit"></span>
				<span class="wmp-icon-close"></span>
			</div>
		</li>
		<li>
			<div> My super happy playlist </div>
			<div class="play-list-manager__menu">
				<span class="wmp-icon-mode_edit"></span>
				<span class="wmp-icon-close"></span>
			</div>
		</li>
		<li>
			<div> Electronic stuff </div>
			<div class="play-list-manager__menu">
				<span class="wmp-icon-mode_edit"></span>
				<span class="wmp-icon-close"></span>
			</div>
		</li>
		<li class="play-list-manager__input"><input type="text" placeholder="New playlist"><span class="wmp-icon-add"></span></li>
	</ul>
</div>`,
});
