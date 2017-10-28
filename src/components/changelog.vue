<script>
import { mapMutations, mapState } from 'vuex';

export default {
	name: 'about-player',
	methods: {
		...mapMutations(['setShowSettings', 'toggleLeftMenu', 'setLeftMenuTab', 'toggleSearch']),
	},
	computed: {
		...mapState(['isMobile']),
	},
};
</script>

<template>
	<h2 id="audius-changelog">Change log</h2>
	<p>
		<b>2.0.12</b><br>
		<ul>
			<li> Singe HTML file <a href="audius.app.html" download>audius app</a>.</li>
		</ul>
		<b>2.0.11</b><br>
		<ul>
			<li> <a @click="setShowSettings">Backup and recover</a> your Audius data.</li>
			<li> Added media sharing UI.</li>
			<li> Improved Audius logo. Thanks <a href="http://buryat.me" target="_blank" rel="noopener"><i>Buryat</i></a>.</li>
			<li> Show matrix login for rooms that don't allow guests.</li>
		</ul>
		<b>2.0.10</b><br>
		<ul>
			<li> Add full screen mode for continous full screen playback. Add controls for prev, next, timeline.</li>
			<li> Custom channel scripts, executed in secure sandbox in extension.</li>
			<li> Change user interface to less technical language. Thanks <i>Caspar</i>.</li>
			<li> Improve matrix room creation and settings: guest access, history readability. Only full members can create rooms.</li>
		</ul>
		<b>2.0.9</b><br>
		<ul>
			<li> Improved mobile UI.</li>
			<li> Improved search media link detection.</li>
			<li> Don't open queue on add just indicate new media added. Thanks <i>lazz</i>.</li>
			<li> Show error when extension is needed.</li>
		</ul>
		<b>2.0.8</b><br>
		<ul>
			<li> Import <a href="https://github.com/LNFWebsite/Streamly" target="_blank" rel="noopener">Streamly</a> playlist.</li>
			<li> Discover public Matrix rooms.</li>
			<li> Create Matrix rooms.</li>
			<li> Allow admins to remove messages from rooms.</li>
		</ul>
		<b>2.0.7</b><br>
		<ul>
			<li> Vimeo video player integrated.</li>
			<li> Better support for YouTube playlists: import from search results.</li>
			<li> Resize left menu, video player, and playlist with drag.</li>
			<li> Show confirm remove popups.</li>
			<li> More error checks and error messages.</li>
			<li> Replace gitter support chat with links to <a href="#community">Audius matrix room</a>.</li>
			<li> Fixed queue sorting.</li>
		</ul>
		<b>2.0.6</b><br>
		<ul>
			<li> <a href="#extension">Extension</a> for searching external websites for content.</li>
			<li> Share playlists, matrix rooms, and web channels with one click links.</li>
			<li> Add your own web channels with URL patterns (needs extension).</li>
			<li> Matrix pagination working. </li>
			<li> Share media in <a href="#matrix">matrix room</a> with drag and drop.</li>
			<li> Import YouTube playlists (import FROM WEB / Search) max 50 songs currently.</li>
		</ul>
		<b>2.0.5</b><br>
		<ul>
			<li> Bug fix release: YouTube skip, YouTube URLs in search, mobile version, d&d search results, history for all played items.</li>
		</ul>
		<b>2.0.4</b><br>
		<ul>
			<li> Drag and drop to copy songs between playlists and queue.</li>
			<li> Sort queue with drag and drop.</li>
			<li> Added repeat for one song, all songs (only if shuffle is not active).</li>
			<li> Added support for web scraper TV stations (Imgur for now, more planned).</li>
			<li> Basic support for mobile screens (next release will add full mobile support).</li>
		</ul>
		<b>2.0.3</b><br>
		<ul>
			<li> Improved header timeline design.</li>
			<li> Improved sharing playlist with direct import URLs.</li>
			<li> Added support for web video .mp4 .webm .ogg URLs.</li>
			<li> Added draggable start stop limits for media (hover over timeline).</li>
			<li> Added support for album tracks.</li>
		</ul>
		<b>2.0.2</b><br>
		<ul>
			<li> Drag and drop search results into the current playlist.</li>
			<li> Support for .mp3 .oga .wav URLs (paste into search box).</li>
			<li> Experimental support for <a href="https://matrix.org/" target="_blank" rel="noopener">Matrix.org</a> radio stations.</li>
			<li> Store and list the 5 last web exports.</li>
		</ul>
		<b>2.0.1</b><br>
		<ul>
			<li> Replaced Redux with Vuex. </li>
			<li> Fixed playlist sorting. </li>
			<li> Fixed Firefox layout problems. </li>
			<li> Fixed, shuffle does not play same songs again. </li>
			<li> New (import)/export using <a href="http://myjson.com/" target="_blank" rel="noopener">myjson.com</a>. </li>
		</ul>
	</p>

</div>

</template>

<style lang="sass?indentedSyntax">


</style>


