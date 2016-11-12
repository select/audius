import { createStore, applyMiddleware, compose } from 'redux';
import { messageRelayMiddleware } from './utils/messageRelayMiddleware';
import { dbMiddleware } from './utils/dbMiddleware';
import reducers from './reducers';


let store;
if(process && (process.env.extension === true)) {
	if (process && (process.env.NODE_ENV === 'production') || document.querySelectorAll('#audius-website').length) {
		console.log('extension store production')
		store = createStore(reducers, applyMiddleware(messageRelayMiddleware));
	} else {
		console.log('extension store dev')
		const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
		store = createStore(reducers, composeEnhancers( applyMiddleware(...[messageRelayMiddleware]) ));
	}
} else {
	console.log('website store production: ', process.env.NODE_ENV)
	if (process && (process.env.NODE_ENV === 'production')) {
		store = createStore(reducers, applyMiddleware(dbMiddleware));
	} else {
		const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
		store = createStore(reducers, composeEnhancers( applyMiddleware(...[dbMiddleware]) ));
	}
}
export default store;
