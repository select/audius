import * as youtube from './youtube';
import * as mediaPlayer from './mediaPlayer';
import * as website from './website';

const actions = Object.assign({}, youtube, mediaPlayer, website);

export default actions;
