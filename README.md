# Audius

Web app

and extension 

are in the making

<a href="https://chrome.google.com/webstore/detail/???">
<img alt="Try it now" src="https://camo.githubusercontent.com/334b4f665751356b1f4afb758f8ddde55b9c71b8/68747470733a2f2f7261772e6769746875622e636f6d2f476f6f676c654368726f6d652f6368726f6d652d6170702d73616d706c65732f6d61737465722f74727969746e6f77627574746f6e5f736d616c6c2e706e67" title="Click here to install this app from the Chrome Web Store" data-canonical-src="https://raw.github.com/GoogleChrome/chrome-app-samples/master/tryitnowbutton_small.png" style="max-width:100%;">
</a>


## Keyboard shortcuts

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

## Community

If you have questions or feedback, join the chat on gitter or [create an issue](https://github.com/select/audius/issues).

[(https://badges.gitter.im/gitterHQ/services.png)](https://gitter.im/audius-player/Lobby)


## Install as app

**Chrome desktop:**

1.  At the top right, click _More_ (Icon top right).
2.  Click _More Tools_.
3.  Add the app:
    Windows users: Click _Add to taskbar_.
    Linux users: Click _Add to desktop_.
    Chromebook users: Click _Add to shelf_.

**Chrome android:**
Tap the menu button and tap _Add to homescreen_. The app is not yet optimized for mobile phones, it might work on tables.

**Local HTML5:**
Since this player is a pure HTML5 app without server side code you can simply download the HTML and JS code and run it from a local file. You can also download the latest version from the source code repository at github (see [Source code](#source-code)). Use the web version to always get the latest updates automatically. A word of caution: I recognized that using this app from a local file block$ a lot of videos on YouTube :(

Web apps are true freedom! Support an open and liberal web without geo borders and login screens.

## System requirements

*   [Vivaldi](https://vivaldi.com/download/)
*   Chrome >= 51
*   FireFox >= 49
*   Internet Explorer & Safari ... not supported, might work though

## Extension

... development started, but now stopped until the main app is ready.

The Audius extension allows you to open a music player on any website. It will then automatically collect all linked videos and add it to a playlist similar to the one in this app. The videos will still be played in this app due to [restrictions of some websites](#motivation). This setup allows you to create a "Music" chat group on Whatsapp or Slack and have fresh music from your friends every day playing right where you share it. You can then continue and add this music to you regular playlist with a simple click.


## Migration from Streamus

On Linux use [this script](https://github.com/select/audius/blob/master/src/scripts/streamus-export.sh) I created to dump the Streamus WebSql to a JSON file. The JSON can be imported using the IMPORT button below the playlist. Use the script like this:

```
./streamus-export.sh ~/.config/google-chrome/Profile\ 1/Local\ Storage/chrome-extension_jbnkffmindojffecdhbbmekbmkkfpmjd_0.localstorage
```

Be sure to validate the JSON output, the script is just a quick hack and you might have to tweak it.

## Other Projects

Here are some other fun projects I created this year.

*   [Boom, next video!](https://github.com/select/boomnext/)
*   [ッ Emoji-text](http://emoji-text.com/)
*   [FantasyPlanet](https://www.fantasyplanet.de/)
*   ...

## Motivation

You are writing another music player, seriously? That's what I thought a lot when creating this, but you know ...

The extension should have been the actual player since the original idea was to create a Chrome/FireFox extension with a media player for _web.whatsapp_. This however failed since the conten security policy does not allow the embdding of youtube videos and somehow it is not possible to overwrite the header fields of web.whatsapp. That meant no player, no music. The only way around this issue I could come up with is to create a background process that the extension cummunicates with and that sends messages to a main player web app. This is currently still untested but that is the plan.


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Credits

This work is inspired by the incredible [Streamus](https://www.reddit.com/r/streamus/) app.
It was created with:

*   VueJs
*   Redux
*   Icomoon
*   Google material icons
*   Webpack
*   LivingStyleGuide


## History

... still working on version 0.0.1

## License

MIT
