import { createStore, applyMiddleware, compose } from 'redux';
import { messageRelayMiddleware } from './utils/messageRelayMiddleware';
import { dbMiddleware, upgradePlayListMiddleware } from './utils/dbMiddleware';
import { importURLMiddleware } from './utils/importURLMiddleware';
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
	const middleware = [dbMiddleware, importURLMiddleware, upgradePlayListMiddleware];
	if (process && (process.env.NODE_ENV === 'production')) {
		store = createStore(reducers, applyMiddleware(...middleware));
	} else {
		const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
		store = createStore(reducers, composeEnhancers( applyMiddleware(...middleware) ));
	}
}
export default store;
