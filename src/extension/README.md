# Audius Extension

The Extension consists of 3 scripts:
 - Content
 - Background
 - Sandbox

```
+----------------+       +----------+       +------------+       +---------+
| Audius Website +<----->+ Content  +<----->+ Background +<----->+ Sandbox |
+----------------+       +----------+       +------+-----+       +---------+
                                                   ^
                                                   |
                                             +-----+-----+
                                             |           |
                                             v           v
                                     +-------+--+      +-+--------+
                                     | Content  |      | Content  |
                                     +----+-----+      +------+---+
                                          ^                   ^
                                          v                   v
                                   +------+--------+  +-------+-------+
                                   | Other Website |  | Other Website |
                                   +---------------+  +---------------+

```

The content script is embedded into all open tabs and detects the audius website tab to initiate communcation with it. It then relays all events from the audius website to the background. 

In addition the content script can be activated by the background to scrape an an open tab and watch for DOM changes to scrape new content.

If a user inserts a scraper script (Audis Channels of type script) the code is uploaded from the audius website through the content and background into the sandbox, where it can be executed securly. All communication with the script is done via message events.




## Content
Relays all event from Audius page to [background](#background) and vice versa,

##### Events from Audius website 
`audiusExtensionHandshake` 
If the content script is on the audius page it sets the extension flag in Audius to available.
- to audius: `{ vuex: 'commit', type: 'setExtensionAvilable', data: true }`

##### Events from Background
`startWatching`
Scrape the current content of the page and add DOM listener.
- to background: `{type: webScraperUpdateSuccess, mediaList: []}`

`stopWatching`
Stop the DOM listener.




## Background

##### Events from Audius website (via Content)
`scanOneUrl`
Fetches a website and scrapes all media (audio, video, youtube, vimeo ) on the site.
- to audius: `{...request.responseTemplate, { data }}`

`watch`
Finds all open tabs with a matching [URL match pattern](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns#Examples) and initiates the watch process in the Content.
- to content: `{type: 'startWatching', id: '…'}`
- to content: `{type: 'stopWatching'}`

`loadScript`, `getNext`
Forwards events  from Audius to the sandbox.
- to sandbox: input event

##### Events from Sandbox
`scanOneUrl`
… see above
- to audius: `{type: webScraperUpdateSuccess, mediaList: []}`

`ajaxJSON`, `ajaxRaw`
Fetch JSON data as string or object and send it back to the sandbox. On error, send error to audius website.
- to sandbox: `{...event.data.responseTemplate, { id: event.data.id, data }}`
- to audius: `{vuex: 'commit', type: 'error', data: '…'}`,



## Sandbox

loadScript
getYouTubeInfo
ajaxRaw
ajaxJSON
