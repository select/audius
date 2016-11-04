import { createStore } from 'redux';
import './utils/redux-devtools-extension'; // chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js
import reducers from './reducers';

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
// let store = createStore(reducers);
export default store;
