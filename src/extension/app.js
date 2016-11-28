import Vue from 'vue/dist/vue'

import '../components/extension-app.component';
import '../components/video-item.component';
import '../components/youtube-player.component';
import '../utils/domObserver';
import '../utils/extensionMessenger';

import './app.sass';

const appEl = document.createElement('div');
appEl.id = 'audius';
appEl.innerHTML = '<extension-app></extension-app>';
const bodyEl = document.querySelector('body');
bodyEl.insertBefore(appEl, bodyEl.firstChild);

if (!document.querySelectorAll('#audius-website').length) {
	var app = new Vue({
		el: '#audius',
	});
} else {
	console.log('is Audius website!');
}
