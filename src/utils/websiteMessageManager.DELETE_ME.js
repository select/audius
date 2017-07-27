import store from '../store';

window.addEventListener('audius', (event) => {
	store.dispatch(event.detail);
}, false);
