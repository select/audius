import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import './main-right.component.sass';

Vue.component('main-right', {
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
<div class="main-right">
	<ul class="main-right__tabs">
		<li
			v-on:click="store.dispatch(Actions.setMainRightTab('queue'))"
			v-bind:class="{ active: state.website.mainRightTab == 'queue' }">Queue</li>
		<li
			v-if="state.youtube.results.length"
			v-on:click="store.dispatch(Actions.setMainRightTab('search'))"
			v-bind:class="{ active: state.website.mainRightTab == 'search' }">Search</li>
		<li
			v-on:click="store.dispatch(Actions.setMainRightTab('about'))"
			v-bind:class="{ active: state.website.mainRightTab == 'about' }">About</li>
		<li
			v-if="state.website.showChat"
			v-on:click="store.dispatch(Actions.setMainRightTab('chat'))"
			v-bind:class="{ active: state.website.mainRightTab == 'chat' }">Chat</li>
	</ul>
	<div class="main-right__content" v-show="state.website.mainRightTab">
		<about-player v-show="state.website.mainRightTab == 'about'"></about-player>
		<search-results v-show="state.website.mainRightTab == 'search'"></search-results>
		<queue v-show="state.website.mainRightTab == 'queue'"></queue>
		<div class="audius-chat" v-show="state.website.mainRightTab == 'chat'">
		</div>
	</div>
	<div
		class="main-right__player"
		v-bind:class="{ full: !state.website.mainRightTab }">
		<span
			v-on:click="store.dispatch(Actions.setMainRightTab(''))"
			v-if="state.website.mainRightTab"
			class="main-right__player-full-btn wmp-icon-unfold_more"></span>
		<youtube-player></youtube-player>
	</div>
</div>`,
});
