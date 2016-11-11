import * as youtube from './youtube';
import * as mediaPlayer from './mediaPlayer';
import * as website from './website';
import * as extension from './extension';

const actions = Object.assign({}, youtube, mediaPlayer, website, extension);

export default actions;
