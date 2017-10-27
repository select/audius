import { s2time } from './timeConverter';
import { mediaBaseObject } from '../vuex/audius/mediaBaseObject';

export const streamlyUrlRegEx = /Streamly\/#/i;

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
		} else if (streamlyUrlRegEx.test(dataString)) {
			try {
				const [, rawData] = dataString.split('#');
				const streamlyPlaylist = JSON.parse(atob(rawData));
				const playList = streamlyPlaylist
					.slice(1, streamlyPlaylist.length - 1) // The first entry is the playlist name.
					.map(([title, durationS, youtubeId]) => Object.assign({}, mediaBaseObject, {
						youtubeId,
						id: youtubeId,
						type: 'youtube',
						title: decodeURIComponent(title),
						duration: s2time(durationS),
						durationS,
					}));
				resolve({
					playList: playList.map(({ id }) => id),
					entities: playList.reduce((acc, item) => Object.assign(acc, { [item.id]: item }), {}),
				});
				return;
			} catch (e) {
				reject(e);
			}
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
				entities[itemData.id] = Object.assign({}, mediaBaseObject, {
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
