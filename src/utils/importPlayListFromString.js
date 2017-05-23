import { s2time } from './timeConverter';
import { videoBaseObject } from '../reducers/video';

export function importPlayListFromString(dataString) {
	return new Promise((resolve, reject) => {
		let dataJSON;

		// Read string from file or URL.
		if (dataString[0] === '{') {
			try {
				dataJSON = JSON.parse(dataString);
			} catch (err) {
				reject(err);
				return;
			}
		} else if (dataString.indexOf('window.getAudiusPlaylist = function()') !== -1) {
			eval(dataString);
			dataJSON = window.getAudiusPlaylist();
		} else {
			reject('Cannot import - unknown data format');
		}
		// Parse JSON from Audius export.
		if (dataJSON.AudiusDump) {
			resolve(dataJSON);
			// Parse JSON from Streamus Export.
		} else if (dataJSON.StreamusDump) {
			const entities = {};
			Object.keys(dataJSON.items).forEach(key => {
				const itemData = dataJSON.items[key].song;
				entities[itemData.id] = Object.assign({}, videoBaseObject, {
					id: itemData.id,
					title: itemData.title,
					duration: s2time(itemData.duration),
					durationS: itemData.duration,
				});
			});
			const playList = dataJSON.playlist.map(key => dataJSON.items[`StreamItems-${key}`].song.id);
			resolve({ playList, entities });
			// Throw error when it's none of the above export formats.
		} else {
			reject('Can not import, this is an unknown format');
		}
	});
}
