import Vue from 'vue/dist/vue.js';
import store from '../store';
import Actions from '../actions';
import './web-app.component.sass';

Vue.component('web-app', {
	template: `
<div class="web-app">
	<web-header></web-header>
	<main class="box-1-1">
		<play-list></play-list>
		<main-right></main-right>
	</main>
</div>
	`,
});
