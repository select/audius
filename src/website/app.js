/* eslint no-new: "off" */
import Vue from 'vue';

import WebApp from '../components/web-app.vue';

import { indexDB } from '../utils';
// import '../utils/websiteMessageManager';

import { store } from '../vuex/store';

indexDB
	.init()
	.then(() => indexDB.recoverState())
	.then((state) => {
		store.commit('recoverState', state);
	});


document.addEventListener('DOMContentLoaded', () => {
	new Vue({
		el: '#app',
		render: h => h(WebApp),
		store,
	});
});


// if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
// 	navigator.serviceWorker
// 		.register('./service-worker.js')
// 		.then(function() {
// 			console.log('Service Worker Registered');
// 		});
// }

