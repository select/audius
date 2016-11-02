import Vue from 'vue/dist/vue.js'
import './app.sass';
import '../components/web-header.component';
// import '../components/video-item.component';
// import '../components/youtube-player.component';

Vue.config.devtools = true

document.addEventListener('DOMContentLoaded', () => {
	var app = new Vue({
		el: '#app',
	});
});
