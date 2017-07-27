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
	removeTags: ['tags'],
	selectMediaSource: ['currentPlayList'],
	renamePlayList: ['tagsOrdered', 'tags', 'currentPlayList'],
	deletePlayList: ['tagsOrdered', 'tags', 'currentPlayList'],
	toggleShuffle: ['shuffle'],
	setExportURL: ['exportURLs'],
	play: ['webScrapers'],
	nextVideo: ['webScrapers'],
	movePlayListMedia: ['playList', 'tags', 'entities'],
	moveTagsOrderd: ['tagsOrdered'],
	migrationSuccess: ['migration'],
	removeVideo: ['playList', 'entities'],
	setMatrixCredentials: ['matrix'],
	setMatrixEnabled: ['matrixEnabled'],
	upgradeEntities: ['entities'],
	setStartStopMarker: ['entities'],
	updateWebScraper: ['webScrapers'],
	videoError: ['entities'],
	updateCurrentMedia: ['entities'],
	addWebScraper: ['webScrapersOrderd', 'webScrapers'],
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
		currentRadioStation: null,
		currentWebScraper: null,
		playList: [],
		tags: {},
		tagsOrdered: [],
		radioStations: {},
		radioStationsOrderd: [],
		webScrapers: {},
		webScrapersOrderd: ['Imgur'],
		webScrapersIndex: {},
		webScraperEmptyCount: {},
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
		showWebScraperSettings: false,
		mainRightTab: 'about',
		isMobile: false,
		website: {
			showSearch: false,
			showChat: false,
		},
		search: {
			query: '',
			isSearching: false,
			results: [],
		},
		matrixEnabled: false,
		matrixLoggedIn: false,
		matrixRooms: [],
		matrix: {
			hasCredentials: false,
			credentials: {
				accessToken: '',
				userId: '',
				deviceId: '',
			},
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
