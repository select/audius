<script>
import store from '../store';
import Actions from '../actions';
import youtubeApiKey from '../utils/youtubeApiKey';

export default {
	name: 'settings',
	data() {
		return {
			youtubeApiKey: '',
			mediaPlayer: store.getState().mediaPlayer,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.mediaPlayer = store.getState().mediaPlayer;
			if (this.mediaPlayer.youtubeApiKey !== youtubeApiKey) this.youtubeApiKey = this.mediaPlayer.youtubeApiKey;
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	watch: {
		youtubeApiKey: function(val, oldVal) {
			store.dispatch(Actions.setYoutubeApiKey(val));
		}
	},
};
</script>

<template>
<div class="settings">
	<h1>Settings</h1>
	<p>
		YouTube API key <input type="text" placeholder="39 digit API key" v-model="youtubeApiKey">
	</p>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.settings
	h1
		text-align: center
	p
		padding: $grid-space
</style>
