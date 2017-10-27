/* eslint-disable no-multiple-empty-lines */

import Vue from 'vue';
import Vuex from 'vuex';

import { indexDB } from '../utils';

import { getters, actions, mutations, presistMutation, initialState } from './audius';
import * as matrix from './matrix';
import * as webScraper from './webScraper';

Vue.use(Vuex);

export const store = new Vuex.Store({
	actions: Object.assign(actions, matrix.actions, webScraper.actions),
	mutations: Object.assign(mutations, matrix.mutations, webScraper.mutations),
	state: Object.assign(initialState, matrix.initialState, webScraper.initialState),
	getters,
	plugins: [
		vstore => {
			vstore.subscribe((mutation, state) => {
				const presistStates =
					mutation.type === 'loadBackup'
						? new Set(Object.values(presistMutation).reduce((acc, item) => [...acc, ...item], []))
						: presistMutation[mutation.type];
				if (presistStates !== undefined) {
					presistStates.forEach(stateName => {
						indexDB
							.writeStore(stateName, state[stateName])
							.then()
							.catch(error => vstore.commit('error', `IndexDB Error ${error}`));
					});
				}
			});
		},
	],
});
