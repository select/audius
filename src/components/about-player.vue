<script>
import Vue from 'vue';
import { mapMutations } from 'vuex';
import { injectScript } from '../utils';

export default {
	name: 'about-player',
	methods: {
		...mapMutations(['showChat', 'setShowSettings', 'toggleLeftMenu']),
		openGitter() {
			if (!this.gitter) {
				this.showChat();
				Vue.nextTick(() => {
					// config
					((window.gitter = {}).chat = {}).options = {
						room: 'audius-player/Lobby',
						activationElement: '.gitter-chat',
						targetElement: '.audius-chat',
						preload: true,
					};
					// load script
					injectScript('https://sidecar.gitter.im/dist/sidecar.v1.js');
				});
			}
		},
	},
};
</script>

<template>
	<div class="wmp-about">
	<h2>Keyboard shortcuts</h2>
	<p>
		<dl>
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
	<!-- <p>
		When search is active.
		<dl>
			<dt>up / down</dt>
			<dd>Select song</dd>
			<dt>Ctrl + space</dt>
			<dd>Add song to playlist</dd>
			<dt>enter</dt>
			<dd>Play selected song</dd>
		</dl>
	</p> -->
	<!-- <p>
		When jump to file is active.
		<dl>
			<dt>up / down</dt>
			<dd>Select song</dd>
			<dt>enter</dt>
			<dd>Play selected song</dd>
			<dt>q</dt>
			<dd>Queue selected song</dd>
		</dl>
	</p> -->
	<h2 id="matrix">Share your music with Matrix</h2>
	<p>
		<a href="https://matrix.org/" target="_blank">Matrix</a> is a chat network that allows you to share songs with Audius.
	</p>
	<p>
		<b>Join a room</b> and drag and drop to add new music.
	</p>
	<div class="about-player__community-btns">
		<a class="button btn--blue" href="?import=!zKinTrtpQEyHfnIbnI:matrix.org&type=room&title=Random">Random</a>
		<a class="button btn--blue" href="?import=!VTIhlnDdHsxZFZQNFh:matrix.org&type=room&title=Rock">Rock</a>
		<a class="button btn--blue" href="?import=!sgKmJzakMmEdSCgKCE:matrix.org&type=room&title=Electronic">Electronic</a>
	</div>

	<p class="smaller">
		… more rooms are coming soon. You can drop songs on the room name in the <a @click="toggleLeftMenu(true)">matrix tab <span class="wmp-icon-queue_music"title="Toggle playlists"></span></a>!
	</p>
	<p>
		<b>Create your own rooms</b> and share them with your friends.
		<!-- Get a user name to create private channels. -->
	</p>
	<div class="about-player__community-btns">
		<a class="button btn--gray-ghost" href="https://riot.im/app/" target="_blank">Use Riot</a>
	</div>
	<p>
		… or <a href="https://matrix.org/docs/projects/try-matrix-now.html#clients" target="_blank">any other client</a> to create a room. For a public room set the access rights and history to <i>Anyone</i>. Private rooms are easier to manage with a username. Create a proper user with e.g. Riot and login with your username in the <a @click="setShowSettings">settings</a>.
	</p>
	<h2 id="extension">Extension and web channels</h2>
	<p>
		<a href="https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh" target="_blank">Install the audius extension</a> to search  external webpages. It's also required when you create or import <a @click="toggleLeftMenu(true)">web channels <span class="wmp-icon-queue_music"title="Toggle playlists"></span></a>. Web channels are still in development, currently they allow you to search on your favorite website for sounds and videos.
	</p>

	<h2>Community</h2>
	<p>
		If you have questions or feedback, join the chat on gitter or create an issue on github.<br>
		<div class="about-player__community-btns">
			<button
				class="button btn--blue gitter-chat"
				v-on:click="openGitter">Join chat</button>
			<a class="button btn--blue" href="https://github.com/select/audius/issues" target="_blank">Create issue</a>
		</div>
	</p>
	<p class="smaller">
		* You must allow 3rd party cookies for the chat to work (if you have not idea what that means it will work for you) or chat in a new window.
	</p>
	<!-- <h2>Extension</h2>
	<p class="about-player__community-btns">
		<a class="button btn--blue" href="https://chrome.google.com/webstore/detail/audius/ekpajajepcojhnjmlibfbjmdjcafajoh" target="_blank">Audius Extension</a>
	</p>
	<p>
		The Audius extension allows you to collect and play music from any website.
		It will automatically collect all links for you so you can add them to your playlist.
		The songs will be played on this site (<a href="#motivation">background here</a>).
	</p>
	<p>
		If you like to get fresh music that you like create a "Music" chat group on WhatsApp or Slack with your friends and use the extension!
	</p>
	<p>
		The extension is mostly working but not quite ready for prime time. Don't give up and report a bug.
	</p> -->
	<h2>Change log</h2>
	<p>
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
			<li> Experimental support for <a target="_blank" href="https://matrix.org/">Matrix.org</a> radio stations.</li>
			<li> Store and list the 5 last web exports.</li>
		</ul>
		<b>2.0.1</b><br>
		<ul>
			<li> Replaced Redux with Vuex. </li>
			<li> Fixed playlist sorting. </li>
			<li> Fixed Firefox layout problems. </li>
			<li> Fixed, shuffle does not play same songs again. </li>
			<li> New (import)/export using <a target="_blank" href="http://myjson.com/">myjson.com</a>. </li>
		</ul>
	</p>
	<h2>Install Audius as app</h2>
	<p>
		<b>Chrome desktop:</b>
		<ol>
			<li> At the top right, click <i>More</i> (Icon <span class="wmp-icon-more_vert" style="font-size: .7em; display: inline-block; height: 1em; width: 1.3em"></span>). </li>
			<li> Click <i>More Tools</i>. </li>
			<li> Add the app:<br>
			Windows users: Click <i>Add to taskbar</i>.<br>
			Linux users: Click <i>Add to desktop</i>.<br>
			Chromebook users: Click <i>Add to shelf</i>. </li>
		</ol>
		<b>Chrome android:</b><br>
		Tap the menu button and tap <i>Add to homescreen</i>. The app is not yet optimized for mobile phones, it might work on tablets.
	</p>
	<p>
		<b>Local HTML5:</b><br>
		Since this player is a pure HTML5 app without server side code you can simply download the HTML and JS code and run it from a local file.
		 You can also download the latest version from the <a href="#source-code">source code</a> repository at github. <br>
	</p>
	<p>
		Why use the web version then?
		<ol>
			<li>
				A click on "reload page" will pull the latests updates.
			</li>
			<li>
				I recognized that using this app from a local file blocks a lot of videos on YouTube (e.g. all Vevo videos) :(
			</li>
		</ol>
	</p>
	<h2>Legality, security, saftey, and privacy</h2>
	<p>
	<ul>
		<li><b>Legality</b> This app sould be completely legal since it streams audio and videos from other providers.
			I do not provide any links to streams (except for the initial playlist containing only legal links from my friends). Please mind what you are sharing.</li>
		<li><b>Security</b> This app is open source so you can make sure that there is no malicious code included.
			In addition to that there is no advertisement that could spread malicious code.
			But to be clear streams and streaming APIs are provided by external entites ... read more below about privacy.</li>
		<li><b>Safety</b> If you back up your playlist (and this app, it runs offline) to a file it will continue working even if this server goes down. Do back up your precius playlists now!</li>
		<li><b>Privacy</b> This app stores all your data in your browser (Menu > More tools > Developer tools > Application > IndexDB), nothing is saved on my server.
			I currently do not use any analytics tool (though it's very tempting).
			The streams however are provided by external entities (Google-YouTube) that will track you.
			As stated before I currently have no intentions of showing external advertisement.
			I think if Audius gets popular there are nicer ways to profit from it.</li>
	</ul>
	</p>
	<p>
		Web apps are true freedom! Support an open and liberal web without geo borders and login screens.
	</p>
	<h2>System requirements</h2>
	<p>
		<ul>
			<li> <a href="https://vivaldi.com/download/" target="_blank">Vivaldi</a> </li>
			<li> Chrome >= 51 </li>
			<li> FireFox >= 49 </li>
			<li> Internet Explorer & Safari ... not supported, might work though </li>
		</ul>
	</p>
	<h2 id="source-code">Source code</h2>
	<p>
		The source code for this project is located at <a href="https://github.com/select/audius" title="Source code on select@github audius" target="_blank">https://github.com/select/audius</a>.
	</p>
	<p>
		If you like this project give it a star ★ and contribute some code!
	</p>
	<h2>Migration from Streamus</h2>
	<p>
		On Linux use <a href="https://github.com/select/audius/blob/master/src/scripts/streamus-export.sh" target="_blank">this script</a> I created to dump the Streamus WebSql to a JSON file.
		The JSON can be imported using the IMPORT button below the playlist. Use the script like this:
		<pre>./streamus-export.sh ~/.config/google-chrome/Profile\ 1/Local\ Storage/chrome-extension_jbnkffmindojffecdhbbmekbmkkfpmjd_0.localstorage
		</pre>
		Be sure to validate the JSON output, the script is just a quick hack and you might have to tweak it.
	</p>
	<!-- <h2>Other Projects</h2>
	Here are some other fun projects I created this year.
	<p>
		<ul>
			<li><a href="https://github.com/select/boomnext/" target="_blank">Boom, next video!</a></li>
			<li><a href="http://emoji-text.com/" target="_blank">ッ Emoji-text</a></li>
			<li><a href="https://www.fantasyplanet.de/" target="_blank">FantasyPlanet</a></li>
			<li>...</li>
		</ul>
	</p> -->
	<h2 id="motivation">Motivation</h2>
	<p>
		The extension (currently revived) should have been the actual player since the original idea was to create a Chrome/FireFox extension with a media player for <i>web.whatsapp.com</i>. After struggeling alot with <a href="https://stackoverflow.com/questions/40309872/youtube-video-in-chrome-extension-content-script" target="_blank">getting the YouTube player to run in an extension content script</a> the plan completely failed when the <a href="https://content-security-policy.com/" target="_blank">content security policy</a> did not allow the embdding of youtube videos. Even though it should be possible to overwrite the header fields for the content security policy of web.whatsapp.com I could not get it to work (it worked on every page <a href="https://stackoverflow.com/questions/40322156/chrome-extension-can-not-get-header-with-onheadersreceived" target="_blank">except web.whatsapp.com</a>). That meant no YouTube player, no music. The only way out of this mess was to create an extension with a content script (grabs links from the current page) that communicates with a background script (relays found links) that in turn communicates with the a main player (this web app, that plays the songs). But this also meant that I had to write an extension and a web app. Well what the heck, I was still using the Streamus player (a Chrome extension that was killed by google) but over the time less and less worked so I needed a replacement anyway. I tried <a href="https://www.tomahawk-player.org/" target="_blank">tomahawk</a> and it seemed quite promising, but I just could not get it to work with dragged in or paste in <a href="https://github.com/tomahawk-player/tomahawk-resolvers/issues/126">youtube links</a>. Also the search was quite slow and did not show many results. This kind of left me no other option but to write Audius.
	</p>
	<p>
		In the summer before I started with Audius, I created a Chrome app (oh stupid me, 2 weeks before Google announced the death of Chrome apps I release the first version) for watching funny videos from popular sites like Imgur and 9gag. <a href="https://github.com/select/boomnext/" target="_blank">Boom, next video!</a> was the result of an idea that I played around with for a long time but never fully realized. Then some day the awesome <a href="https://twitter.com/5by">5by</a> app was created, which had everything I really wanted: a continous stream of fresh and fun content with no user interaction necessary, just like TV, start it and turn off your brain. But 5by did not survive long and I forgot about it, until last summer when I recreated it. It was fun, it was absolutely addictive. But then Google killed Chrome apps and since I used core components from <i>Boom, next</i> already in Audius I started to integrate some more features.
	</p>
	<p>
		As Audius evolved I tried out new technologies, one of them the Matrix chat network. Matrix is similar to email (multiple federated servers) and offers open and encryped real time file, data and chat message transfer. This was a fun opportunity to create a new medium for the music chat rooms that I am part of. Music chat rooms are the best way to break out of filter bubbles from services that use algorithms, they allow you to discover new music your friends and strangers curate for you.
	</p>
	<p>
		Here are some alternatives to Audius that are also interesting:
		<ul>
			<li><a href="http://streamsquid.com/" target="_blank">StreamSquid</a></li>
			<li><a href="https://mycloudplayers.com" target="_blank">My Cloud Player</a></li>
		</ul>
		Just look at them and appreciate the simplicity of the Audius interface ... wait what don't leave X-D
	</p>
	<h2>Credits</h2>
	<p>
		This work is inspired by the incredible <a href="https://www.reddit.com/r/streamus/" target="_blank">Streamus</a> app.<br>
	</p>
	<p>
		Here are the tools I used to create Audius.
		<ul>
			<li>VueJs</li>
			<li><span style="text-decoration:line-through;">Redux</span> Vuex</li>
			<li>Icomoon</li>
			<li>Google material icons</li>
			<li>Webpack + Plugins</li>
			<li>LivingStyleGuide</li>
			<li><a href="https://rubaxa.github.io/Sortable/">SortableJS</a>; vuedraggable</li>
			<li><a target="_blank" href="http://myjson.com/">Myjson.com</a></li>
		</ul>
	</p>
	<h2>Impressum</h2>
	<p>Brauch ich nicht weil: keine kommerziellen Inhalte, keine regelmässigen Inhalte. Hier machst du den Inhalt!</p>
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
.about-player__community-btns
	display: flex
	justify-content: center
	align-items: center
	> *
		margin-right: $grid-space

</style>


