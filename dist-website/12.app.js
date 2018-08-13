(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{147:function(e,t,r){"use strict";r.r(t);var i=r(457),a=r(226);for(var o in a)"default"!==o&&function(e){r.d(t,e,function(){return a[e]})}(o);r(334);var n=r(0),s=Object(n.a)(a.default,i.a,i.b,!1,null,null,null);t.default=s.exports},226:function(e,t,r){"use strict";r.r(t);var i=r(227),a=r.n(i);for(var o in i)"default"!==o&&function(e){r.d(t,e,function(){return i[e]})}(o);t.default=a.a},227:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e},a=r(1);t.default={name:"about-player",methods:i({},(0,a.mapMutations)(["setShowSettings","toggleLeftMenu","setLeftMenuTab","toggleSearch"])),computed:i({},(0,a.mapState)(["isMobile"]))}},228:function(e,t,r){},334:function(e,t,r){"use strict";var i=r(228);r.n(i).a},457:function(e,t,r){"use strict";var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"wmp-about"},[r("h2",{attrs:{id:"audius-changelog"}},[e._v("Changelog")]),e._v(" "),r("p",[r("b",[e._v("2.0.12")]),r("br"),e._v(" "),e._m(0),e._v(" "),r("b",[e._v("2.0.11")]),r("br"),e._v(" "),r("ul",[r("li",[r("a",{on:{click:e.setShowSettings}},[e._v("Backup and recover")]),e._v(" your Audius data.")]),e._v(" "),r("li",[e._v(" Added media sharing UI.")]),e._v(" "),e._m(1),e._v(" "),r("li",[e._v(" Show matrix login for rooms that don't allow guests.")])]),e._v(" "),r("b",[e._v("2.0.10")]),r("br"),e._v(" "),e._m(2),e._v(" "),r("b",[e._v("2.0.9")]),r("br"),e._v(" "),e._m(3),e._v(" "),r("b",[e._v("2.0.8")]),r("br"),e._v(" "),e._m(4),e._v(" "),r("b",[e._v("2.0.7")]),r("br"),e._v(" "),e._m(5),e._v(" "),r("b",[e._v("2.0.6")]),r("br"),e._v(" "),e._m(6),e._v(" "),r("b",[e._v("2.0.5")]),r("br"),e._v(" "),e._m(7),e._v(" "),r("b",[e._v("2.0.4")]),r("br"),e._v(" "),e._m(8),e._v(" "),r("b",[e._v("2.0.3")]),r("br"),e._v(" "),e._m(9),e._v(" "),r("b",[e._v("2.0.2")]),r("br"),e._v(" "),e._m(10),e._v(" "),r("b",[e._v("2.0.1")]),r("br"),e._v(" "),e._m(11)])])},a=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Singe HTML file "),r("a",{attrs:{href:"audius.app.html",download:""}},[e._v("Audius app")]),e._v(".")]),e._v(" "),r("li",[e._v(" Modularization into main app, matrix, and webscraper to optimize loading speed.")]),e._v(" "),r("li",[e._v(" Bootsplash, offline app and other "),r("a",{attrs:{href:"https://developers.google.com/web/progressive-web-apps/"}},[e._v("PWA")]),e._v(" things.")]),e._v(" "),r("li",[e._v(" Fix share component so it always finds a media object.")]),e._v(" "),r("li",[e._v(" Hide Matrix rooms.")]),e._v(" "),r("li",[e._v(" Show Matrix consent link, now required to use Matrix.")]),e._v(" "),r("li",[e._v(" Better registration flow for Matrix.")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[this._v(" Improved Audius logo. Thanks "),t("a",{attrs:{href:"http://buryat.me",target:"_blank",rel:"noopener"}},[t("i",[this._v("Buryat")])]),this._v(".")])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Add full screen mode for continous full screen playback. Add controls for prev, next, timeline.")]),e._v(" "),r("li",[e._v(" Custom channel scripts, executed in secure sandbox in extension.")]),e._v(" "),r("li",[e._v(" Change user interface to less technical language. Thanks "),r("i",[e._v("Caspar")]),e._v(".")]),e._v(" "),r("li",[e._v(" Improve matrix room creation and settings: guest access, history readability. Only full members can create rooms.")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Improved mobile UI.")]),e._v(" "),r("li",[e._v(" Improved search media link detection.")]),e._v(" "),r("li",[e._v(" Don't open queue on add just indicate new media added. Thanks "),r("i",[e._v("lazz")]),e._v(".")]),e._v(" "),r("li",[e._v(" Show error when extension is needed.")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Import "),r("a",{attrs:{href:"https://github.com/LNFWebsite/Streamly",target:"_blank",rel:"noopener"}},[e._v("Streamly")]),e._v(" playlist.")]),e._v(" "),r("li",[e._v(" Discover public Matrix rooms.")]),e._v(" "),r("li",[e._v(" Create Matrix rooms.")]),e._v(" "),r("li",[e._v(" Allow admins to remove messages from rooms.")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Vimeo video player integrated.")]),e._v(" "),r("li",[e._v(" Better support for YouTube playlists: import from search results.")]),e._v(" "),r("li",[e._v(" Resize left menu, video player, and playlist with drag.")]),e._v(" "),r("li",[e._v(" Show confirm remove popups.")]),e._v(" "),r("li",[e._v(" More error checks and error messages.")]),e._v(" "),r("li",[e._v(" Replace gitter support chat with links to "),r("a",{attrs:{href:"#community"}},[e._v("Audius matrix room")]),e._v(".")]),e._v(" "),r("li",[e._v(" Fixed queue sorting.")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[r("a",{attrs:{href:"#extension"}},[e._v("Extension")]),e._v(" for searching external websites for content.")]),e._v(" "),r("li",[e._v(" Share playlists, matrix rooms, and web channels with one click links.")]),e._v(" "),r("li",[e._v(" Add your own web channels with URL patterns (needs extension).")]),e._v(" "),r("li",[e._v(" Matrix pagination working. ")]),e._v(" "),r("li",[e._v(" Share media in "),r("a",{attrs:{href:"#matrix"}},[e._v("matrix room")]),e._v(" with drag and drop.")]),e._v(" "),r("li",[e._v(" Import YouTube playlists (import FROM WEB / Search) max 50 songs currently.")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("ul",[t("li",[this._v(" Bug fix release: YouTube skip, YouTube URLs in search, mobile version, d&d search results, history for all played items.")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Drag and drop to copy songs between playlists and queue.")]),e._v(" "),r("li",[e._v(" Sort queue with drag and drop.")]),e._v(" "),r("li",[e._v(" Added repeat for one song, all songs (only if shuffle is not active).")]),e._v(" "),r("li",[e._v(" Added support for web scraper TV stations (Imgur for now, more planned).")]),e._v(" "),r("li",[e._v(" Basic support for mobile screens (next release will add full mobile support).")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Improved header timeline design.")]),e._v(" "),r("li",[e._v(" Improved sharing playlist with direct import URLs.")]),e._v(" "),r("li",[e._v(" Added support for web video .mp4 .webm .ogg URLs.")]),e._v(" "),r("li",[e._v(" Added draggable start stop limits for media (hover over timeline).")]),e._v(" "),r("li",[e._v(" Added support for album tracks.")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Drag and drop search results into the current playlist.")]),e._v(" "),r("li",[e._v(" Support for .mp3 .oga .wav URLs (paste into search box).")]),e._v(" "),r("li",[e._v(" Experimental support for "),r("a",{attrs:{href:"https://matrix.org/",target:"_blank",rel:"noopener"}},[e._v("Matrix.org")]),e._v(" radio stations.")]),e._v(" "),r("li",[e._v(" Store and list the 5 last web exports.")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v(" Replaced Redux with Vuex. ")]),e._v(" "),r("li",[e._v(" Fixed playlist sorting. ")]),e._v(" "),r("li",[e._v(" Fixed Firefox layout problems. ")]),e._v(" "),r("li",[e._v(" Fixed, shuffle does not play same songs again. ")]),e._v(" "),r("li",[e._v(" New (import)/export using "),r("a",{attrs:{href:"http://myjson.com/",target:"_blank",rel:"noopener"}},[e._v("myjson.com")]),e._v(". ")])])}];r.d(t,"a",function(){return i}),r.d(t,"b",function(){return a})}}]);