/* eslint-disable no-multiple-empty-lines */

import Vue from 'vue';
import Vuex from 'vuex';

import { indexDB } from '../utils';

import { youtubeApiKey } from '../utils/config';

import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';

Vue.use(Vuex);

const presistMutation = {
	addSearchResult: ['entities', 'playList', 'tags'],
	dropSearchResult: ['entities', 'playList', 'tags'],
	dropMoveItem: ['playList', 'tags', 'entities'],
	importPlayList: ['entities', 'playList', 'tags', 'tagsOrdered'],
	toggleLeftMenu: ['showLeftMenu'],
	addTags: ['tagsOrdered', 'tags'],
	selectMediaSource: ['currentPlayList'],
	renamePlayList: ['tagsOrdered', 'tags', 'currentPlayList'],
	deletePlayList: ['tagsOrdered', 'tags', 'currentPlayList'],
	toggleShuffle: ['shuffle'],
	setExportURL: ['exportURLs'],
	play: ['webScrapers', 'matrixRooms'],
	nextVideo: ['webScrapers'],
	movePlayListMedia: ['playList', 'tags', 'entities'],
	moveTagsOrdered: ['tagsOrdered'],
	migrationSuccess: ['migration'],
	removeVideo: ['playList', 'tags', 'entities'],
	setMatrixCredentials: ['matrix'],
	setPublicRooms: ['matrix'],
	setMatrixEnabled: ['matrixEnabled'],
	upgradeEntities: ['entities'],
	setStartStopMarker: ['entities'],
	updateWebScraper: ['webScrapers'],
	addUrlPattern: ['webScrapers'],
	videoError: ['entities'],
	updateCurrentMedia: ['entities'],
	addWebScraper: ['webScrapersOrdered', 'webScrapers'],
	renameWebScraper: ['webScrapersOrdered', 'webScrapers'],
	setIsMobile: ['isMobile'],
	updateMatrixRoom: ['matrixRooms'],
};

export const store = new Vuex.Store({
	actions,
	getters,
	mutations,
	state: {
		errorMessages: [],
		entities: {},
		currentMedia: {},
		currentPlayList: '',
		currentMatrixRoom: null,
		currentWebScraper: null,
		playList: [],
		tags: {},
		tagsOrdered: [],
		matrixRooms: {},
		matrixRoomsOrdered: [],
		webScrapers: { Imgur: { playList: [], playedMedia: {}, archive: [] } },
		webScrapersOrdered: ['Imgur'],
		paginationIndex: {},
		showWatched: {},
		sessionHistoryPos: -1,
		sessionHistory: [],
		queue: [],
		isPlaying: false,
		shuffle: false,
		repeat1: false,
		repeatAll: false,
		showSearch: false,
		filterQuery: '',
		currentTime: 0,
		skipToTime: 0,
		mute: false,
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
		// deprectaed try remove this
		reloadScript: {
			vimeo: 1,
			youtube: 1,
		},
	},
	plugins: [
		vstore => {
			vstore.subscribe((mutation, state) => {
				const presistStates = presistMutation[mutation.type];
				if (presistStates !== undefined) {
					presistStates.forEach(stateName => {
						indexDB.writeStore().put(state[stateName], stateName).onerror = event => {
							vstore.commit('error', `DB Error ${event.target.error.name}`);
						};
					});
				}
			});
		},
	],
});
