import Vue from 'vue/dist/vue';
import './about-player.component.sass';

Vue.component('about-player', {
	data() {
		return {
			gitter: false
		}
	},
	methods: {
		openGitter() {
			if (!this.gitter) {
				//config
				((window.gitter = {}).chat = {}).options = {
					room: 'audius-player/Lobby',
					activationElement: '.gitter-chat',
				};
				//load script
				const tag = document.createElement('script');
				tag.onload = () => {
					document.querySelector('.gitter-chat').click();
				};
				tag.src = "https://sidecar.gitter.im/dist/sidecar.v1.js";
				document.head.appendChild(tag);
				this.gitter = true;
			}
		}
	},
	template: `
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
			<dt>j</dt>
			<dd>Jump to song</dd>
			<dt>f</dt>
			<dd>Find song on YouTube</dd>
		</dl>
	</p>
	<h2>Community</h2>
	<p>
		If you have questions or feedback, join the chat on gitter or create a ticket on github.<br>
		<div class="about-player__community-btns">
			<button
				class="btn--blue"
				v-on:click="openGitter"
				v-bind:class="{ 'gitter-chat': gitter }">Join chat</button>
			<a class="button btn--blue" href="https://github.com/select/audius/issues" target="_blank">Create issue</a>
		</div>
	</p>
	<h2>Install as app</h2>
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
		Since this player is a pure HTML5 app without server side code you can simply download the HTML and JS code and run it from a local file. You can also download the latest version from the source code repository at github (see <a href="#source-code">Source code</a>). Use the web version to always get the latest updates automatically. A word of caution: I recognized that using this app from a local file block$ a lot of videos on YouTube :(
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
	<h2>Extension</h2>
	<p>... development started, but now stopped until the main app is ready.</p>
	<p>The Audius extension allows you to open a music player on any website. It will then automatically collect all linked videos and add it to a playlist similar to the one in this app. The videos will still be played in this app due to <a href="#motivation">restrictions of some websites</a>. This setup allows you to create a "Music" chat group on Whatsapp or Slack and have fresh music from your friends every day playing right where you share it. You can then continue and add this music to you regular playlist with a simple click.</p>
	<h2 id="source-code">Source code</h2>
	<p>
		The source code for this project is located at <a href="https://github.com/select/audius" title="Source code on select@github audius" target="_blank">https://github.com/select/audius</a>.
	</p>
	<p>
		If you like this project give it a star ★ and contribute some code!
	</p>
	<h2>Migration from Streamus</h2>
	<p>
		On Linux use <a href="https://github.com/select/audius/blob/master/src/scripts/streamus-export.sh" target="_blank">this script</a> I created to dump the Streamus WebSql to a JSON file. The JSON can be imported using the IMPORT button below the playlist. Use the script like this:
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
		The extension should have been the actual player since the original idea was to create a Chrome/FireFox extension with a media player for <i>web.whatsapp</i>. This however failed since the conten security policy does not allow the embdding of youtube videos and somehow it is not possible to overwrite the header fields of web.whatsapp. That meant no player, no music. The only way around this issue I could come up with is to create a background process that the extension cummunicates with and that sends messages to a main player web app. This is currently still untested but that is the plan.
	</p>
	<p>
		The
	</p>
	<h2>Credits</h2>
	<p>
		This work is inspired by the incredible <a href="https://www.reddit.com/r/streamus/" target="_blank">Streamus</a> app.<br>
		It was created with:
		<ul>
			<li>VueJs</li>
			<li>Redux</li>
			<li>Icomoon</li>
			<li>Google material icons</li>
			<li>Webpack</li>
			<li>LivingStyleGuide</li>
		</ul>
	</p>
</div>`,
});
