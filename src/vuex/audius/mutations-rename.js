/* eslint-disable no-param-reassign */
export function rename(state, type, newName, oldName) {
	if (state[type].sources[newName]) return;
	const itemsObject = Object.assign({}, state[type].sources);
	itemsObject[newName] = itemsObject[oldName];
	const itemsOrdered = [...state[type].sourcesOrdered];
	itemsOrdered[itemsOrdered.indexOf(oldName)] = newName;
	delete itemsObject[oldName];
	state[type].sources = itemsObject;
	state[type].sourcesOrdered = itemsOrdered;
	state.currentMediaSource.id = newName;
}
