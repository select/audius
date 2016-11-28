import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import injectScript from '../utils/injectScript';
import './about-player.component.sass';

Vue.component('about-player', {
	methods: {
		openGitter() {
			if (!this.gitter) {
				store.dispatch(Actions.showChat());
				Vue.nextTick(() => {
					// config
					((window.gitter = {}).chat = {}).options = {
						room: 'audius-player/Lobby',
						activationElement: '.gitter-chat',
						targetElement: '.audius-chat',
						preload: true,
					};
					// load script
					injectScript('https://sidecar.gitter.im/dist/sidecar.v1.js');
				});
			}
		},
	},
	template: require('./about-player.component.html'),
});
