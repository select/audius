import Vue from 'vue/dist/vue';
import './web-app.component.sass';

Vue.component('web-app', {
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
