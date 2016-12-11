<script>
import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import injectScript from '../utils/injectScript';

export default {
	name: 'about-player',
	methods: {
		openGitter() {
			if (!this.gitter) {
				store.dispatch(Actions.showChat());
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
	<p>
		When search is active.
		<dl>
			<dt>up / down</dt>
			<dd>Select song</dd>
			<dt>Ctrl + space</dt>
			<dd>Add song to playlist</dd>
			<dt>enter</dt>
			<dd>Play selected song</dd>
		</dl>
	</p>
	<p>
		When jump to file is active.
		<dl>
			<dt>up / down</dt>
			<dd>Select song</dd>
			<dt>enter</dt>
			<dd>Play selected song</dd>
			<dt>q</dt>
			<dd>Queue selected song</dd>
		</dl>
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
	<p>
		* You must allow 3rd party cookies for the chat to work (default for almost everybody) or chat in a new window.
	</p>
	<h2>Extension</h2>
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
		Tap the menu button and tap <i>Add to homescreen</i>. The app is not yet optimized for mobile phones, it might work on tables.
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
		<li><b>Legality</b> This app sould be completely legal since it embedds videos from legal streaming providers (currently only YouTube).
			I do not provide any links to streams (except for the initial playlist containing only legal links from my friends)</li>
		<li><b>Security</b> This app is open source so you can make sure that there is no malicious code included.
			In addition to that there is no advertisement (... yet :-O) that could spread malicious code.
			But to be clear streams and streaming APIs are provided by external entites ... read more below about privacy.</li>
		<li><b>Safety</b> If you back up your playlist (and this app) to a file it will be save even if this server goes down. Do it now and save your precius playlist!</li>
		<li><b>Privacy</b> This app stores all your data in your browser (Menu > More tools > Developer tools > Application > IndexDB), nothing is saved on my server.
			I currently do not use any analytics tool (though it's very tempting).
			The streams however are provided by external entities (Google-YouTube) that will track you.
			As stated before I currently have no intentions of showing external advertisement.
			I think if Audius gets popular there are nicer ways to profit from it. ... how about a song of your band on the initial playlist? It's really cheap (0€) right now :P</li>
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
	<h2>Other Projects</h2>
	Here are some other fun projects I created this year.
	<p>
		<ul>
			<li><a href="https://github.com/select/boomnext/" target="_blank">Boom, next video!</a></li>
			<li><a href="http://emoji-text.com/" target="_blank">ッ Emoji-text</a></li>
			<li><a href="https://www.fantasyplanet.de/" target="_blank">FantasyPlanet</a></li>
			<li>...</li>
		</ul>
	</p>
	<h2 id="motivation">Motivation</h2>
	<p>
		You are writing another music player, seriously? That's what I thought a lot when creating this, but you know ...
	</p>
	<p>
		The extension should have been the actual player since the original idea was to create a Chrome/FireFox extension with a media player for <i>web.whatsapp.com</i>. After struggeling alot with <a href="https://stackoverflow.com/questions/40309872/youtube-video-in-chrome-extension-content-script" target="_blank">getting the YouTube player to run in an extension content script</a> the plan completely failed when the <a href="https://content-security-policy.com/" target="_blank">content security policy</a> did not allow the embdding of youtube videos. Even though it should be possible to overwrite the header fields for the content security policy of web.whatsapp.com I could not get it to work (it worked on every page <a href="https://stackoverflow.com/questions/40322156/chrome-extension-can-not-get-header-with-onheadersreceived" target="_blank">except web.whatsapp.com</a>). That meant no YouTube player, no music. The only way out of this mess was to create an extension with a a content script (grabs links) that communicates with a background script (relays found links) that in turn communicates with the a main player (this web app, that plays the songs). But this also meant that I had to write an extension and a web app. Well what the heck, I was still using Streamus but over the time less and less worked so I needed a replacement anyway. I tried <a href="https://www.tomahawk-player.org/" target="_blank">tomahawk</a> and it seemed quite promising, but I just could not get it to work with dragged in or paste in <a href="https://github.com/tomahawk-player/tomahawk-resolvers/issues/126">youtube links</a>. Also the search was quite slow and did not show many results. This kind of left me no other option but to write Audius.
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
			<li>Redux</li>
			<li>Icomoon</li>
			<li>Google material icons</li>
			<li>Webpack</li>
			<li>LivingStyleGuide</li>
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
	ul
		padding: 0
		list-style: none
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
		font-size: .7em
		white-space: inherit
		overflow: auto
.about-player__community-btns
	display: flex
	justify-content: center
	align-items: center
	button
		margin-right: $grid-space
</style>


