<script>
import { mapMutations, mapState } from 'vuex';

const AboutPlayerMore = () => import(/* webpackChunkName: "components/about-player-more" */'./about-player-more.vue');


export default {
	components: {
		AboutPlayerMore,
	},
	data() {
		return { showMore: false };
	},
	methods: {
		...mapMutations(['setShowSettings', 'toggleLeftMenu', 'setLeftMenuTab', 'toggleSearch']),
	},
	computed: {
		...mapState(['isMobile']),
	},
};
</script>

<template>
	<div class="wmp-about">
	<h2 v-if="!isMobile">Keyboard shortcuts</h2>
	<p>
		<dl v-if="!isMobile">
			<dt>c</dt>
			<dd>Play / pause</dd>
			<dt>b</dt>
			<dd>Next song</dd>
			<dt>s</dt>
			<dd>Shuffle on / off</dd>
			<dt>m</dt>
			<dd>Mute / unmute</dd>
			<dt>j</dt>
			<dd>Jump to song</dd>
			<dt>f</dt>
			<dd>Find song on YouTube</dd>
		</dl>
	</p>
	<h2 id="community">Community</h2>
	<p>
		If you have questions or feedback, join the chat on matrix (#audius:matrix.org) or create an issue on github.<br>
		<div class="about-player__community-btns">
			<a
				class="button btn--blue gitter-chat"
				href="https://riot.im/app/#/room/#audius:matrix.org"
				target="_blank" rel="noopener">Join chat</a>
			<a class="button btn--blue" href="https://github.com/select/audius/issues" target="_blank" rel="noopener">Create issue</a>
		</div>
	</p>
	<h2>Run your own Audius</h2>
	<p>
		Easy as - Download the <a href="audius.app.html" download>audius app</a>, upload it to <b>your server</b>. Done!
	<p>
	<p>
		If you run Audius as file (<pre style="display: inline">file://</pre> URL) all information are <b>lost</b> when you restart.
	</p>
	<h2 id="matrix">Join a Matrix room and share</h2>
	<p>
		<a href="https://matrix.org/" target="_blank" rel="noopener">Matrix</a> is a chat network that allows you to share songs with Audius.
	</p>
	<div class="about-player__community-btns">
		<button class="button btn--blue" @click="setLeftMenuTab('radio')">Join a room</button>
	</div>
	<p>
		You can drag and drop songs on the room names in the matrix tab or add search results!
		<b>Create your own rooms</b> and share them with your friends.
		Already have an account from <a href="https://riot.im/app/" target="_blank" rel="noopener">Riot</a> or <a href="https://matrix.org/docs/projects/try-matrix-now.html#clients" target="_blank" rel="noopener">another client</a>? Login with your username in the Audius <a @click="setShowSettings">settings</a>.
	</p>
	<h2 id="extension">Web channels</h2>
	<p>
		Channels can search through any website. To do this they need <a href="https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh" target="_blank" rel="noopener">the Audius extension</a>. Once installed you can also search through websites by pasting a URL in the <a @click="toggleSearch()">search field</a>.

	</p>
	<div class="button-group">
		<button class="button btn--blue" @click="showMore = true" v-if="!showMore">show more</button>
	</div>
	<about-player-more v-if="showMore"></about-player-more>
</div>

</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.wmp-about
	padding: $grid-space
	[class^="wmp-icon-"]
		height: .5rem
		width: 1.5rem
	a
		cursor: pointer
		text-decoration: underline
	ul
		padding: 0
		list-style: none
		li
			margin-bottom: $grid-space
	ol
		margin: 0
		padding: 1em
		li
			margin-bottom: $grid-space
	dl
		dt
			float: left
			width: 4em
			font-weight: bold
			padding-left: $grid-space
			&:nth-child(4n+1)
				background: $color-catskillwhite
		dd
			margin-left: 0
			&:nth-child(4n+2)
				background: $color-catskillwhite
		dt,
		dd
			height: $touch-size-small
			display: flex
			align-items: center
	pre
		font-size: .7rem
		white-space: inherit
		overflow: auto
.wmp-about__web-channels.wmp-about__web-channels
	dt
		width: 8em
	dd:last-child
		margin-top: $grid-space
		height: auto
		display: block
.about-player__community-btns
	display: flex
	justify-content: center
	align-items: center
	> *
		margin-right: $grid-space

</style>


