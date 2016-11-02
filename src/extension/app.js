import Vue from 'vue/dist/vue.js'
import './app.sass';

const appEl = document.createElement('div');
appEl.id = 'whatsapp-web-media-player';
appEl.innerHTML = '<wmp-app></wmp-app>';
const bodyEl = document.querySelector('body');
bodyEl.insertBefore(appEl, bodyEl.firstChild);

Vue.config.devtools = true
import '../components/wmp-app.component';
import '../components/video-item.component';
import '../components/youtube-player.component';

var app = new Vue({
	el: '#whatsapp-web-media-player',
});

import '../utils/domObserver';
