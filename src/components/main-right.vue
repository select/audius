<script>
import store from '../store';
import Actions from '../actions';
import AboutPlayer from './about-player.vue';
import SearchResults from './search-results.vue';
import Queue from './queue.vue';
import YoutubePlayer from './youtube-player.vue';

export default {
	name: 'main-right',
	components: {
		AboutPlayer,
		SearchResults,
		Queue,
		YoutubePlayer,
	},
	data() {
		return {
			state: store.getState(),
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.state = store.getState();
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
};
</script>

<template>
<div class="main-right">
	<ul class="main-right__tabs">
		<li
			v-on:click="store.dispatch(Actions.setMainRightTab('queue'))"
			v-bind:class="{ active: state.website.mainRightTab == 'queue' }">Queue</li>
		<li
			v-if="state.youtube.results.length"
			v-on:click="store.dispatch(Actions.setMainRightTab('search'))"
			v-bind:class="{ active: state.website.mainRightTab == 'search' }">Search</li>
		<li
			v-on:click="store.dispatch(Actions.setMainRightTab('about'))"
			v-bind:class="{ active: state.website.mainRightTab == 'about' }">About</li>
		<li
			v-if="state.website.showChat"
			v-on:click="store.dispatch(Actions.setMainRightTab('chat'))"
			v-bind:class="{ active: state.website.mainRightTab == 'chat' }">Chat</li>
	</ul>
	<div class="main-right__content" v-show="state.website.mainRightTab">
		<about-player v-show="state.website.mainRightTab == 'about'"></about-player>
		<search-results v-show="state.website.mainRightTab == 'search'"></search-results>
		<queue v-show="state.website.mainRightTab == 'queue'"></queue>
		<div class="audius-chat" v-show="state.website.mainRightTab == 'chat'">
		</div>
	</div>
	<div
		class="main-right__player"
		v-bind:class="{ full: !state.website.mainRightTab }">
		<span
			v-on:click="store.dispatch(Actions.setMainRightTab(''))"
			v-if="state.website.mainRightTab"
			class="main-right__player-full-btn wmp-icon-unfold_more"></span>
		<youtube-player></youtube-player>
	</div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.main-right
	display: flex
	flex-direction: column
	height: 100%
ul.main-right__tabs
	padding: 0
	margin: 0
	list-style: none
	display: flex
	width: 100%
	height: $touch-size-small
	li
		flex: 1
		display: flex
		justify-content: center
		align-items: center
		background: $color-catskillwhite
		color: $color-aluminium-dark
		cursor: pointer
		text-transform: uppercase
		white-space: nowrap
		font-size: 0.7em
		transition: all $transition-time
		&.active,
		&:hover
			background: $color-aluminium
			color: $color-white

.main-right__content
	flex: 2
	overflow-y: auto

.main-right__player
	flex: 1
	border-top: 1px solid $color-aluminium
	position: relative
	background: $color-catskillwhite
	&.full
		height: 100%
span.main-right__player-full-btn
	position: absolute
	top: 0
	right: 0
	cursor: pointer
	color: $color-white
.audius-chat
	position: relative
	height: 100%
	overflow: hidden
	iframe
		width: 100%
		height: 100%

</style>
