# Audius

Audius is the ultimate streaming music player.

- Create playlist, no login required, stored in the indexDB in your browser.
- Share your playlists as hyperlinks, files and in Matrix rooms.
- Queue songs, play history.
- Organize playlists with drag and drop.
- Supports: YouTube/Vimeo/.mp3/.oga/.wav/.mp4/.webm/.ogg URLs.
- Runs "offline" - a pure HTML5 app that can run without a server.
- Plays Imgur "Most Viral" as video stream.
- Create your own web channels with the build in web scraper.
- Set start end times of media items (e.g. to cut of trailing silence)
- Split YouTube full albums into seperate songs.
- Connect to the Matrix network and create rooms to share and discover music with your friends.

<img src="https://audius.rockdapus.org/img/audius.screenshot.1280x800.png" />

## Community

If you have questions or feedback, join the chat on matrix or create an issue on github.

- [Join the chat](https://riot.im/app/#/room/#audius:matrix.org)
- [Create an issue](https://github.com/select/audius/issues)

## Extension

The [audius extension](https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh) helps to search  external webpages.
	
## Share your Music with Matrix
[Matrix](https://matrix.org/) is a chat network that Audius uses to share songs.

Join a room and drag and drop to add new music.

 - [Random](https://audius.rockdapus.org/?import=!zKinTrtpQEyHfnIbnI:matrix.org&type=room&title=Random)
 - [Rock](https://audius.rockdapus.org/?import=!VTIhlnDdHsxZFZQNFh:matrix.org&type=room&title=Rock)
 - [Electronic](https://audius.rockdapus.org/?import=!sgKmJzakMmEdSCgKCE:matrix.org&type=room&title=Electronic)

Create your own rooms with Audius and share it with your friends.


## Change log

**2.0.10**
* …

**2.0.9**
* Improved mobile UI.
* Improved search media link detection.
* Don't open queue on add just indicate new media added. Thanks *lazz*.
* Show error when extension is needed.

**2.0.8**
* Import [Streamly](https://github.com/LNFWebsite/Streamly) playlist.
* Discover public Matrix rooms.
* Create Matrix rooms.
* Allow Admins to remove messages from rooms.

**2.0.7**
* Vimeo video player integrated.
* Better support for YouTube playlists: import from search results.
* Resize left menu, video player with drag.
* Show confirm remove popups.
* More error checks and error messages.
* Replace gitter support chat with links to Audius matrix room.
* Fixed queue sorting.

**2.0.6**
* Extension for searching external websites for content.
* Share playlists, matrix rooms, web channels with one click link.
* Add your own web channels with URL patterns (needs extension).
* Matrix chat pagination working.
* Share media in matrix room with drag and drop.

**2.0.5**
*   Bug fix release: YouTube skip, YouTube URLs in search, mobile version, d&d search results, history for all played items.

**2.0.4**
*   Drag and drop to copy songs between playlists and queue.
*   Sort queue with drag and drop.
*   Added repeat for one song, all songs (only if shuffle is not active).
*   Added support for web scraper TV stations (Imgur for now, more planned).
*   Basic support for mobile screens (next release will add full mobile support).

**2.0.3**

*   Improved header timeline design.
*   Added support for web video .mp4 .webm .ogg URLs.
*   Added draggable start stop limits for media (hover over timeline).

**2.0.2**

*   Drag and drop search results into the current playlist.
*   Support for .mp3 .oga .wav URLs (paste into search box).
*   Experimental support for [Matrix.org](https://matrix.org/) radio stations.
*   Store and list the 5 last web exports.

**2.0.1**

*   Replaced Redux with Vuex.
*   Fixed playlist sorting.
*   Fixed Firefox layout problems.
*   Fixed, shuffle does not play same songs again.
*   New (import)/export using [myjson.com](http://myjson.com/).

## Install Audius as app

**Chrome desktop:**

1.  At the top right, click _More_.
2.  Click _More Tools_.
3.  Add the app:
		Windows users: Click _Add to taskbar_.
		Linux users: Click _Add to desktop_.
		Chromebook users: Click _Add to shelf_.

**Chrome android:**
Tap the menu button and tap _Add to homescreen_. The app is not yet optimized for mobile phones, it might work on tablets.

**Local HTML5:**
Since this player is a pure HTML5 app without server side code you can simply download the HTML and JS code and run it from a local file. You can also download the latest version from the [source code](#source-code) repository at github.

Why use the web version then?

1.  A click on "reload page" will pull the latests updates.
2.  I recognized that using this app from a local file blocks a lot of videos on YouTube (e.g. all Vevo videos) :(
3.  IndexDB, the browser database, does not work with file:// URLs, therefore Audius can not store your playlists etc. permanently.


## Development

Get the code and install all dependencies.
```
git clone git@github.com:select/audius.git
cd audius
npm install
```

Run the dev server (with hot module replacement).
```
npm start
```
Open http://localhost:8080/ to test.


Build a debug version that includes source maps and the full vue runtime.
```
npm run build
```
The build is located in `/dist-website`, open `index.html` to test.

Build a production version with with minimal runtime and without source maps
```
npm run build:prod:app
```
The build is also located in `/dist-website`, open `index.html` to test.

The chrome extension can be build with
```
npm run build:extension
```

### Media meta data object `MediaMetaData` 

This is the internal media data JSON fromat of Audius.
```
{
	id: 'ozD4h9HCHOY', // universal unique id
	title: 'Human readable title',
	duration: { h: 0, m: 58, s: '51' },
	durationS: 3531, // duration in seconds
	type: 'youtube', // available types: 'audio', 'video', 'vimeo'
	href: 'https://example.com/items/funny-video', // link to external page; not required for youtube
	thumbUrl: 'https://example.com/img/funny-video_100x75.jpg', // not req for yt
	start: 0, // optional time in s
	stop: 379, // optional time in s
	youtubeId: 'ozD4h9HCHOY', // youtube only
	vimeoId: '36579366', // vimeo only
	tracks: [ // optional
		{ // this is a full item with 
			trackId: 1,
			
			title: 'Kanan neni - Rokia Traoré - Wanita',
			duration: { d: 0, h: 0, m: 6, s: '19', ms: 0 },
			durationS: 379,
			id: 'ozD4h9HCHOY',
			type: 'youtube',
			start: 0,
			fullTitle: '1. Kanan neni : 00:00\r',
			durationAlbum: 3531,
			isTrack: true,
			youtubeId: 'ozD4h9HCHOY',
			stop: 379,
		},
	],
},
```

### Web scaper plugin

A web scraper plugin is an object that implements
- `getUrl()` returns `['ajaxJSON', String]`
- `parse(data)` returns `[MediaMetaData]`

The functions are evaled and executed in a sandbox in the Audius extension. 

Example plugin
```
({
	getUrl() {
		return [
			'ajaxJSON', // the only option so far
			!this.lastIndex ? this.baseURL : `https://example.com/api/?viral=${this.lastKey}`,
		];
	},
	parse(data) {
		this.lastIndex = data.items[data.items.length - 1].id;
		return data.items
			.map(item => ({
				id: `pr0gramm-${item.id}`,
				// … complete the media data format described above here
			}));
	},
	baseURL: 'https://example.com/api/?viral=1',
	lastIndex: '',
})

```

## Legality, security, saftey, and privacy

*   **Legality** This app sould be completely legal since it embedds videos from legal streaming providers (currently only YouTube). I do not provide any links to streams (except for the initial playlist containing only legal links from my friends)
*   **Security** This app is open source so you can make sure that there is no malicious code included. In addition to that there is no advertisement (... yet :-O) that could spread malicious code. But to be clear streams and streaming APIs are provided by external entites ... read more below about privacy.
*   **Safety** If you back up your playlist (and this app, it runs offline) to a file it will continue working even if this server goes down. Do back up your precius playlists now!
*   **Privacy** This app stores all your data in your browser (Menu > More tools > Developer tools > Application > IndexDB), nothing is saved on my server. I currently do not use any analytics tool (though it's very tempting). The streams however are provided by external entities (Google-YouTube) that will track you. As stated before I currently have no intentions of showing external advertisement. I think if Audius gets popular there are nicer ways to profit from it.

Web apps are true freedom! Support an open and liberal web without geo borders and login screens.

## System requirements

*   [Vivaldi](https://vivaldi.com/download/)
*   Chrome >= 51
*   FireFox >= 49
*   Internet Explorer & Safari ... not supported, might work though

## Source code

The source code for this project is located at [https://github.com/select/audius](https://github.com/select/audius "Source code on select@github audius").

If you like this project give it a star ★ and contribute some code!

## Migration from Streamus

On Linux use [this script](https://github.com/select/audius/blob/master/src/scripts/streamus-export.sh) I created to dump the Streamus WebSql to a JSON file. The JSON can be imported using the IMPORT button below the playlist. Use the script like this:

<pre>./streamus-export.sh ~/.config/google-chrome/Profile\ 1/Local\ Storage/chrome-extension_jbnkffmindojffecdhbbmekbmkkfpmjd_0.localstorage
</pre>

Be sure to validate the JSON output, the script is just a quick hack and you might have to tweak it.

## Motivation

You are writing another music player, seriously? That's what I thought a lot when creating this, but you know ...

The extension (inactive for now) should have been the actual player since the original idea was to create a Chrome/FireFox extension with a media player for _web.whatsapp.com_. After struggeling alot with [getting the YouTube player to run in an extension content script](https://stackoverflow.com/questions/40309872/youtube-video-in-chrome-extension-content-script) the plan completely failed when the [content security policy](https://content-security-policy.com/) did not allow the embdding of youtube videos. Even though it should be possible to overwrite the header fields for the content security policy of web.whatsapp.com I could not get it to work (it worked on every page [except web.whatsapp.com](https://stackoverflow.com/questions/40322156/chrome-extension-can-not-get-header-with-onheadersreceived)). That meant no YouTube player, no music. The only way out of this mess was to create an extension with a a content script (grabs links) that communicates with a background script (relays found links) that in turn communicates with the a main player (this web app, that plays the songs). But this also meant that I had to write an extension and a web app. Well what the heck, I was still using Streamus but over the time less and less worked so I needed a replacement anyway. I tried [tomahawk](https://www.tomahawk-player.org/) and it seemed quite promising, but I just could not get it to work with dragged in or paste in [youtube links](https://github.com/tomahawk-player/tomahawk-resolvers/issues/126). Also the search was quite slow and did not show many results. This kind of left me no other option but to write Audius.

As Audius evolved I tried out new technologies, one of them the Matrix chat network. Matrix is similar to email (multiple federated servers) and offers open and encryped real time data and chat message transfer. This was a fun opportunity to create a new medium for the music chat rooms that I am part of. Music chat rooms are the best way to break out of filter bubbles from services that use algorithms, they allow you to discover new music your friends and strangers curate for you.

Here are some alternatives to Audius that are also interesting:

*   [Streamly](https://lnfwebsite.github.io/Streamly)
*   [StreamSquid](http://streamsquid.com/)
*   [My Cloud Player](https://mycloudplayers.com)

Just look at them and appreciate the simplicity of the Audius interface ... wait what don't leave X-D

## Credits

This work is inspired by the incredible [Streamus](https://www.reddit.com/r/streamus/) app.  

Here are the tools I used to create Audius.

*   VueJs
*   <span style="text-decoration:line-through;">Redux</span> Vuex
*   Icomoon + Google material icons
*   Webpack + Plugins
*   LivingStyleGuide
*   <span style="text-decoration:line-through;">[SortableJS](https://rubaxa.github.io/Sortable/)</span> vuedraggable
*   [Myjson.com](http://myjson.com/)
*   Matrix
*   Imgur
