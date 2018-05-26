import { mapState } from 'vuex';

export function mapModuleState(namespace, attributes) {
	if (Array.isArray(attributes)) {
		return	mapState(attributes.reduce(
			(acc, n) => Object.assign(acc, { [n]: state => state[namespace][n] }),
			{}
		));
	}
	return Object.entries(attributes).reduce((acc, [alias, attribute]) => {
		acc[alias] = (state) => state[namespace][attribute];
		return acc;
	}, {});
}
