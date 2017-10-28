/* eslint-disable no-multiple-empty-lines */

import Vue from 'vue';
import Vuex from 'vuex';

import { indexDB } from '../utils';
import { getters, actions, mutations, presistMutation, state as initialState } from './audius';

Vue.use(Vuex);

export const store = new Vuex.Store({
	actions: Object.assign(actions, {
		initModule({ dispatch, commit, state }, name) {
			if (name in state.loadedModules) return;
			console.log('registerModule', name);
			if (name === 'matrix') {
				import(/* webpackChunkName: "vuex/matrix" */ './matrix').then(module => {
					store.registerModule(name, module);
					commit('setLoadedModules', name);
					dispatch('initMatrix');
				});
			} else if (name === 'webScraper') {
				import(/* webpackChunkName: "vuex/webScraper" */ './webScraper').then(module => {
					store.registerModule(name, module);
					commit('setLoadedModules', name);
				});
			}
		},
	}),
	mutations,
	state: initialState,
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
