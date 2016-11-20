import Vue from 'vue/dist/vue';

import '../components/web-app.component';
import '../components/web-header.component';
import '../components/main-right.component';
import '../components/about-player.component';
import '../components/search-results.component';
import '../components/youtube-player.component';
import '../components/play-list.component';
import '../components/video-item.component';
import '../components/queue.component';
import '../components/play-list-manager.component';

import '../utils/indexDB';
import '../utils/websiteMessageManager';

import './app.sass';

document.addEventListener('DOMContentLoaded', () => {
	new Vue({
		el: '#app',
	});
});

