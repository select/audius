import Vue from 'vue/dist/vue.js'
import './app.sass';

const appEl = document.createElement('div');
appEl.id = 'whatsapp-web-media-player';
appEl.innerHTML = require('./index.html');
const bodyEl = document.querySelector('body');
bodyEl.insertBefore(appEl, bodyEl.firstChild);

Vue.config.devtools = true
import './wmp-app.component';
import './video-item.component';
import './youtube-player.component';

var app = new Vue({
	el: '#wmpApp',
});






