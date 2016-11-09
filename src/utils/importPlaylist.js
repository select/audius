import store from '../store';
import Actions from '../actions';
import * as db from './indexDB';
import { s2time } from './timeConverter';
import { videoBaseObject } from '../reducers/video';


export default function importPlaylist(dataString) {
	let dataJSON;

	try {
		dataJSON = JSON.parse(dataString);
	} catch (err) {
		store.dispatch(Actions.error(err));
		return;
	}

	if (dataJSON.AudiusDump) {
		store.dispatch(Actions.importPlayList(dataJSON));
		Object.keys(dataJSON.entities).forEach((key) => {
			db.setMediaEntity(dataJSON.entities[key]);
		});
	} else if (dataJSON.StreamusDump) {
		const entities = {};
		Object.keys(dataJSON.items).forEach((key) => {
			const itemData = dataJSON.items[key].song;
			entities[itemData.id] = Object.assign({}, videoBaseObject, {
				id: itemData.id,
				title: itemData.title,
				duration: s2time(itemData.duration),
			});
		});
		const playList = dataJSON.playlist.map(key => dataJSON.items[`StreamItems-${key}`].song.id);
		store.dispatch(Actions.importPlayList({
			playList,
			entities,
		}));
		Object.keys(entities).forEach((key) => {
			db.setMediaEntity(entities[key]);
		});
	} else {
		store.dispatch(Actions.error('Can not import, this is an unknown format'));
	}
	store.dispatch(Actions.dedupePlayList());
}
