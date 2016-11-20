import Vue from 'vue/dist/vue.js';
import store from '../store';
import Actions from '../actions';
import './web-app.component.sass';

Vue.component('web-app', {
	data() {
		return {
			website: store.getState().website,
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			console.log('change')
			this.website = store.getState().website;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	template: `
<div class="web-app">
	<web-header></web-header>
	<main class="box">
		<play-list-manager></play-list-manager>
		<play-list></play-list>
		<main-right></main-right>
	</main>
</div>
	`,
});
