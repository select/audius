import './utils/redux-devtools-extension' // chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js
import { createStore } from 'redux';
import reducers from './reducers';

let store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;

