import Vue from 'vue/dist/vue';

import './app.sass';

import '../components/web-header.component';
import '../components/main-right.component';
import '../components/about-player.component';
import '../components/search-results.component';
import '../components/youtube-player.component';
import '../components/play-list.component';
import '../components/video-item.component';

Vue.config.devtools = true;

document.addEventListener('DOMContentLoaded', () => {
	new Vue({
		el: '#app',
	});
});
