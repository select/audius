import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import './main-right.component.sass';

Vue.component('main-right', {
	data() {
		return {
			mediaPlayer: store.getState().mediaPlayer,
			website: store.getState().website,
			store,
			Actions,
			tabs: ['queue', 'search', 'info', 'about'],
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
			this.website = store.getState().website;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
	},
	template: `
<div class="main-right">
	<ul class="main-right__tabs">
		<li
			v-for="tab in tabs"
			v-on:click="store.dispatch(Actions.setMainRightTab(tab))"
			v-bind:class="{ active: website.mainRightTab == tab }">{{tab}}</li>
	</ul>
	<div class="main-right__content">
		<about-player v-if="website.mainRightTab == 'about'"></about-player>
		<search-results v-if="website.mainRightTab == 'search'"></search-results>
	</div>
	<div class="main-right__player">
		<youtube-player></youtube-player>
	</div>
</div>`,
});
