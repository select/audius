/* eslint no-new: "off" */
import Vue from 'vue';

import WebApp from '../components/web-app.vue';

import { indexDB, cleanWindowLocation, getParameterByName } from '../utils';
// import '../utils/websiteMessageManager';
import { store } from '../vuex/store';
import { migrate } from '../utils/indexDB.migrate';
import './keyshorts';


function isMobile() {
	const w = window;
	const d = document;
	const e = d.documentElement;
	const g = d.getElementsByTagName('body')[0];
	const x = w.innerWidth || e.clientWidth || g.clientWidth;
	const y = w.innerHeight || e.clientHeight || g.clientHeight;
	// console.log(x + ' × ' + y);
	return (x < (y * 0.6));
}

indexDB
	.init()
	.then(() => indexDB.recoverState())
	.then((state) => {
		store.commit('recoverState', state);
		migrate();

		window.addEventListener('resize', () => {
			store.commit('setIsMobile', isMobile());
		}, true);

		window.addEventListener('audius', (event) => {
			if (event.detail && event.detail.vuex) {
				store[event.detail.vuex](event.detail.type, event.detail.data);
			}
		}, false);

		const url = getParameterByName('import');
		if (url) {
			store.commit('setPendingImportURL', {
				url,
				name: getParameterByName('title'),
				type: getParameterByName('type'),
			});
		}
		cleanWindowLocation();

		new Vue({
			el: '#app',
			render: h => h(WebApp),
			store,
		});
	})
	.catch(error => {
		store.commit('error', { error, sticky: true });
	});


// if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
// 	navigator.serviceWorker
// 		.register('./service-worker.js')
// 		.then(function() {
// 			console.log('Service Worker Registered');
// 		});
// }

