/* eslint-disable no-param-reassign */
export function rename(state, type, newName, oldName) {
	if (state[type][newName]) return;
	const itemsObject = Object.assign({}, state[type]);
	itemsObject[newName] = itemsObject[oldName];
	const itemsOrdered = [...state[`${type}Ordered`]];
	itemsOrdered[itemsOrdered.indexOf(oldName)] = newName;
	delete itemsObject[oldName];
	state[type] = itemsObject;
	state[`${type}Ordered`] = itemsOrdered;
	state[type.includes('web') ? 'currentWebScraper' : 'currentPlayList'] = newName;
}
