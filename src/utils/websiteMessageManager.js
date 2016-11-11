import store from '../store';
import Actions from '../actions';

window.addEventListener('audius', (event) => {
	console.log('message from extension: ', event.detail);
	store.dispatch(event.detail);
}, false);
