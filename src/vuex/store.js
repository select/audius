/* eslint-disable no-multiple-empty-lines */

import Vue from 'vue';
import Vuex from 'vuex';

import { indexDB } from '../utils';

import { youtubeApiKey } from '../utils/config';

import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { presistMutation } from './presistMutation';

Vue.use(Vuex);

export const store = new Vuex.Store({
	actions,
	getters,
	mutations,
	state: {
		errorMessages: [],
		entities: {},
		currentMedia: {},
		currentPlayList: '',
		currentWebScraper: null,
		playList: [],
		tags: {},
		tagsOrdered: [],
		webScrapers: { Imgur: { playList: [], playedMedia: {}, archive: [] } },
		webScrapersOrdered: ['Imgur'],
		webScrapersInitialized: {}, // e.g. `{'pr0gramm': true}`
		paginationIndex: {},
		showWatched: {},
		sessionHistoryPos: -1,
		sessionHistory: [],
		queue: [],
		queueClickCount: 0,
		isPlaying: false,
		shuffle: false,
		repeat1: false,
		repeatAll: false,
		showSearch: false,
		filterQuery: '',
		currentTime: 0,
		skipToTime: 0,
		mute: false,
		fullscreen: false,
		youtubeApiKey,
		showImport: false,
		showExport: false,
		showMediaEdit: null,
		showJump: false,
		jumpCursor: '',
		exportURLs: [],
		pendingImportURL: null,
		migration: {
			'audius_0.03': false,
			'audius_0.03.2': false,
		},
		showLeftMenu: false,
		leftMenuTab: 'playList',
		showSettings: false,
		showMediumSettings: {
			webscraper: false,
			matrix: false,
		},
		mainRightTab: 'about',
		isMobile: false,
		website: {
			showSearch: false,
			showChat: false,
		},
		search: {
			query: '',
			results: [],
		},
		// Matrix
		currentMatrixRoom: null,
		matrixRooms: {},
		matrixRoomsOrdered: [],
		createMatrixRoomModal: false,
		showMatrixRoomDirectory: false,
		matrixEnabled: false,
		matrixLoggedIn: false,
		matrix: {
			hasCredentials: false,
			credentials: {
				accessToken: '',
				userId: '',
				deviceId: '',
			},
			publicRooms: [],
		},
		extensionAvilable: false,
	},
	plugins: [
		vstore => {
			vstore.subscribe((mutation, state) => {
				const presistStates = mutation.type === 'loadBackup'
					? new Set(Object.values(presistMutation).reduce((acc, item) => [...acc, ...item], []))
					: presistMutation[mutation.type];
				if (presistStates !== undefined) {
					presistStates.forEach(stateName => {
						indexDB.writeStore(stateName, state[stateName])
							.then()
							.catch(error => vstore.commit('error', `IndexDB Error ${error}`));
					});
				}
			});
		},
	],
});
