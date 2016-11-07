import { createStore } from 'redux';
import reducers from './reducers';

let store;
if (process && process.env.APP_ENV === 'production') {
	store = createStore(reducers);
} else {
	store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}
export default store;
