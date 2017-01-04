/* eslint no-new: "off" */
import Vue from 'vue/dist/vue';

import WebApp from '../components/web-app.vue';

import '../utils/indexDB';
import '../utils/websiteMessageManager';

import './app.sass';

document.addEventListener('DOMContentLoaded', () => {
	new Vue({
		el: '#app',
		components: { WebApp },
	});
});

// if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
// 	navigator.serviceWorker
// 		.register('./service-worker.js')
// 		.then(function() {
// 			console.log('Service Worker Registered');
// 		});
// }

