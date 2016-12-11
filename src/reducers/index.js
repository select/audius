import { combineReducers } from 'redux';
import mediaPlayer from './mediaPlayer';
import youtube from './youtube';
import website from './website';
import extension from './extension';

export default combineReducers({
	mediaPlayer,
	youtube,
	website,
	extension,
});

