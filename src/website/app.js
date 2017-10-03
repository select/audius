/* eslint no-new: "off" */
import Vue from 'vue';

import WebApp from '../components/web-app.vue';

import { indexDB, cleanWindowLocation, getParameterByName } from '../utils';
// import '../utils/websiteMessageManager';
import { store } from '../vuex/store';
// import { migrate } from '../utils/indexDB.migrate';
import './keyshorts';

function isMobile() {
	const w = window;
	const d = document;
	const e = d.documentElement;
	const g = d.getElementsByTagName('body')[0];
	const x = w.innerWidth || e.clientWidth || g.clientWidth;
	const y = w.innerHeight || e.clientHeight || g.clientHeight;
	return x < y * 0.75;
}

const startConditions = { started: false };
function start(options) {
	Object.assign(startConditions, options);
	if (
		((startConditions.recoverdState && startConditions.contentLoaded) || startConditions.timeout) &&
		!startConditions.started
	) {
		startConditions.started = true;
		new Vue({
			el: '#app',
			render: h => h(WebApp),
			store,
		});
	}
}

indexDB
	.init()
	.then(() => indexDB.recoverState())
	.then(state => {
		store.commit('recoverState', state);
		// migrate();

		store.commit('setIsMobile', isMobile());
		[('resize', 'orientationchange')].forEach(eventName => {
			window.addEventListener(
				eventName,
				() => {
					store.commit('setIsMobile', isMobile());
				},
				true
			);
		});

		window.addEventListener(
			'audius',
			event => {
				if (event.detail && event.detail.vuex) {
					store[event.detail.vuex](event.detail.type, event.detail.data);
				}
			},
			false
		);

		const url = getParameterByName('import');
		if (url) {
			store.commit('setPendingImportURL', {
				url,
				name: getParameterByName('title'),
				type: getParameterByName('type'),
			});
		}
		cleanWindowLocation();

		start({ recoverdState: true });
	})
	.catch(error => {
		store.commit('error', { error, sticky: true });
	});

document.addEventListener('DOMContentLoaded', () => {
	start({ contentLoaded: true });
});

setTimeout(() => {
	start({ timeout: true });
}, 2000);

// if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
// 	navigator.serviceWorker
// 		.register('./service-worker.js')
// 		.then(function() {
// 			console.log('Service Worker Registered');
// 		});
// }
