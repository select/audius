import { store } from '../vuex/store';

document.addEventListener('keydown', (event) => {
	if (event.target.tagName.toLowerCase() !== 'input' && event.key === 'j') {
		this.toggleJump(true);
		setTimeout(() => { document.querySelector('.play-list-footer__search-input').value = ''; }, 100);
	} else if (event.key === 'Escape') {
		if (this.website.showImport) this.toggleImport(false);
		if (this.website.showExport) this.toggleExport(false);
		if (this.website.showJump) this.clear();
	}
	if (this.website.showJump) {
		if (this.jumpCursor && event.key === 'q') {
			store.commit('queueMedia', this.jumpCursor);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!this.jumpCursor) this.jumpCursor = this.filteredPlayList[0];
			else this.jumpCursor = this.filteredPlayList[this.filteredPlayList.indexOf(this.jumpCursor) + 1];
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!this.jumpCursor) this.jumpCursor = this.filteredPlayList[this.filteredPlayList.length - 1];
			else this.jumpCursor = this.filteredPlayList[this.filteredPlayList.indexOf(this.jumpCursor) - 1];
		}
		if (event.key === 'Enter' && this.jumpCursor) {
			store.commit('play', this.jumpCursor);
		}
	}

	if (this.website.mainRightTab === 'search') {
		if (this.jumpCursor.id && event.key === 'Enter') {
			store.dispatch(Actions.play(this.jumpCursor.id, this.jumpCursor));
		} else if (this.jumpCursor.id && event.ctrlKey && event.key === ' ') {
			this.addToPlaylist(this.jumpCursor);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!this.jumpCursor) this.jumpCursor = this.youtube.results[0];
			else if (this.youtube.results.indexOf(this.jumpCursor) >= this.youtube.results.length - 1) this.jumpCursor = this.youtube.results[0];
			else this.jumpCursor = this.youtube.results[this.youtube.results.indexOf(this.jumpCursor) + 1];
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!this.jumpCursor) this.jumpCursor = this.youtube.results[this.youtube.results.length - 1];
			else if (this.youtube.results.indexOf(this.jumpCursor) <= 0) this.jumpCursor = this.youtube.results[this.youtube.results.length - 1];
			else this.jumpCursor = this.youtube.results[this.youtube.results.indexOf(this.jumpCursor) - 1];
		}
		Vue.nextTick(() => {
			const el = document.querySelector(`[data-id="${this.jumpCursor.id}"]`);
			if (el && !isElementInViewport(el)) {
				el.scrollIntoView({ block: 'start', behavior: 'smooth' });
			}
		});
	}

}, false);


