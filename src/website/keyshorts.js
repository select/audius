import { store } from '../vuex/store';

const state = store.state;

document.addEventListener('keydown', (event) => {
	if (event.target.tagName.toLowerCase() !== 'input') {
		if (event.key === 'c' && !event.ctrlKey) {
			store.commit('playPause');
		} else if (event.key === 'b') {
			store.dispatch('nextVideo');
		} else if (event.key === 's') {
			store.commit('toggleShuffle');
		} else if (event.key === 'm') {
			store.commit('toggleMute');
		} else if (event.key === 'f' && !event.ctrlKey) {
			setTimeout(() => { store.commit('toggleSearch', true); }, 50);
		} else if (event.key === 'j' && !event.ctrlKey) {
			setTimeout(() => { store.commit('toggleJump', true); }, 50);
		}
	}

	if (event.key === 'Escape') {
		if (state.fullscreen) store.commit('toggleFullscreen', false);
		if (state.showImport) store.commit('toggleImport', false);
		if (state.showExport) store.commit('toggleExport', false);
		if (state.showJump) {
			document.querySelector('.play-list-footer__search input').value = '';
			store.commit('toggleJump', false);
			store.commit('filterPlayList', '');
		}
	}

	if (state.showJump) {
		if (state.jumpCursor && event.key === 'q') {
			store.commit('queueMedia', state.jumpCursor);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!state.jumpCursor) state.jumpCursor = this.filteredPlayList[0];
			else state.jumpCursor = this.filteredPlayList[this.filteredPlayList.indexOf(state.jumpCursor) + 1];
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!state.jumpCursor) state.jumpCursor = this.filteredPlayList[this.filteredPlayList.length - 1];
			else state.jumpCursor = this.filteredPlayList[this.filteredPlayList.indexOf(state.jumpCursor) - 1];
		}
		if (event.key === 'Enter' && state.jumpCursor) {
			store.commit('play', state.jumpCursor);
		}
	}

	if (state.mainRightTab === 'search') {
		const yt = state.youtube;
		if (state.jumpCursor.id && event.key === 'Enter') {
			store.commit('play', state.jumpCursor.id, state.jumpCursor);
		} else if (state.jumpCursor.id && event.ctrlKey && event.key === ' ') {
			this.addToPlaylist(state.jumpCursor);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!state.jumpCursor) state.jumpCursor = state.youtube.results[0];
			else if (yt.results.indexOf(state.jumpCursor) >= yt.results.length - 1) state.jumpCursor = yt.results[0];
			else state.jumpCursor = yt.results[yt.results.indexOf(state.jumpCursor) + 1];
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!state.jumpCursor) state.jumpCursor = yt.results[yt.results.length - 1];
			else if (yt.results.indexOf(state.jumpCursor) <= 0) state.jumpCursor = yt.results[yt.results.length - 1];
			else state.jumpCursor = yt.results[yt.results.indexOf(state.jumpCursor) - 1];
		}
	}
}, false);
