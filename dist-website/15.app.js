(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{126:function(t,e,o){},215:function(t,e,o){"use strict";var r=o(126);o.n(r).a},359:function(t,e,o){"use strict";o.r(e);var r=o(0);function a(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{},r=Object.keys(o);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(o).filter(function(t){return Object.getOwnPropertyDescriptor(o,t).enumerable}))),r.forEach(function(e){n(t,e,o[e])})}return t}function n(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}var i={name:"about-player",methods:a({},Object(r.d)(["setShowSettings","toggleLeftMenu","setLeftMenuTab","toggleSearch"])),computed:a({},Object(r.e)(["isMobile"]))},s=(o(215),o(2)),l=Object(s.a)(i,function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"wmp-about"},[o("p",[t._v("\n\t\tThe Imgur "),o("a",{on:{click:function(e){t.selectMediaSource({type:"webScraper",id:"Imgur"}),t.setLeftMenuTab("webScraper")}}},[t._v("web channel")]),t._v(" is a build in demo. You can create your own "),o("a",{on:{click:function(e){t.setLeftMenuTab("webScraper")}}},[t._v("channel")]),t._v(". There are two methods.\n\t")]),t._v(" "),o("p"),t._m(0),t._v(" "),o("p"),t._v(" "),o("h2",[t._v("Install Audius as app")]),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),o("h2",[t._v("Legality, security, saftey, and privacy")]),t._v(" "),t._m(3),t._v(" "),o("p",[t._v("\n\t\tWeb apps are true freedom! Support an open and liberal web without geo borders and login screens.\n\t")]),t._v(" "),o("h2",[t._v("System requirements")]),t._v(" "),t._m(4),t._v(" "),o("h2",{attrs:{id:"source-code"}},[t._v("Source code")]),t._v(" "),t._m(5),t._v(" "),o("p",[t._v("\n\t\tIf you like this project give it a star ★ on GitHub!\n\t")]),t._v(" "),o("h2",{attrs:{id:"motivation"}},[t._v("Motivation")]),t._v(" "),t._m(6),t._v(" "),t._m(7),t._v(" "),o("p",[t._v("\n\t\tAs Audius evolved I tried out new technologies, one of them the Matrix chat network. Matrix is similar to email (multiple federated servers) and offers open and encryped real time file, data and chat message transfer. This was a fun opportunity to create a new medium for the music chat rooms that I am part of. Music chat rooms are the best way to break out of filter bubbles from services that use algorithms, they allow you to discover new music your friends and strangers curate for you.\n\t")]),t._v(" "),t._m(8),t._v(" "),o("h2",[t._v("Credits")]),t._v(" "),t._m(9),t._v(" "),t._m(10)])},[function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("dl",{staticClass:"wmp-about__web-channels"},[o("dt",[t._v("URL patterns")]),t._v(" "),o("dd",[o("pre",{staticStyle:{display:"inline"}},[t._v("http://example.com/page[1-5]")])]),t._v(" "),o("dt",[t._v("Script")]),t._v(" "),o("dd",[t._v("a small JS script that is executed in a secure sanbox of the extension. "),o("a",{attrs:{href:"https://github.com/select/audius",target:"_blank",rel:"noopener"}},[t._v("API documentation")]),t._v(" is half way there.")])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("p",[o("b",[t._v("Chrome desktop:")]),t._v(" "),o("ol",[o("li",[t._v(" At the top right, click "),o("i",[t._v("More")]),t._v(" (Icon "),o("span",{staticClass:"wmp-icon-more_vert",staticStyle:{"font-size":".7em",display:"inline-block",height:"1em",width:"1.3em"}}),t._v("). ")]),t._v(" "),o("li",[t._v(" Click "),o("i",[t._v("More Tools")]),t._v(". ")]),t._v(" "),o("li",[t._v(" Add the app:"),o("br"),t._v("\n\t\t\tWindows users: Click "),o("i",[t._v("Add to taskbar")]),t._v("."),o("br"),t._v("\n\t\t\tLinux users: Click "),o("i",[t._v("Add to desktop")]),t._v("."),o("br"),t._v("\n\t\t\tChromebook users: Click "),o("i",[t._v("Add to shelf")]),t._v(". ")])]),t._v(" "),o("b",[t._v("Chrome android:")]),o("br"),t._v("\n\t\tTap the menu button and tap "),o("i",[t._v("Add to homescreen")]),t._v(". The app is not yet optimized for mobile phones, it might work on tablets.\n\t")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("\n\t\tWhy use the web version then?\n\t\t"),e("ol",[e("li",[this._v('\n\t\t\t\tA click on "reload page" will pull the latests updates.\n\t\t\t')]),this._v(" "),e("li",[this._v("\n\t\t\t\tI recognized that using this app from a local file blocks a lot of videos on YouTube (e.g. all Vevo videos) :(\n\t\t\t")]),this._v(" "),e("li",[this._v("\n\t\t\t\tIndexDB, the browser database, does not work with file:// URLs, therefore Audius can not store your playlists etc. permanently.\n\t\t\t")])])])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("p",[o("ul",[o("li",[o("b",[t._v("Legality")]),t._v(" This app sould be completely legal since it streams audio and videos from other providers.\n\t\t\tI do not provide any links to streams (except for the initial playlist containing only legal links from my friends). Please mind what you are sharing.")]),t._v(" "),o("li",[o("b",[t._v("Security")]),t._v(" This app is open source so you can make sure that there is no malicious code included.\n\t\t\tIn addition to that there is no advertisement that could spread malicious code.\n\t\t\tBut to be clear streams and streaming APIs are provided by external entites ... read more below about privacy.")]),t._v(" "),o("li",[o("b",[t._v("Safety")]),t._v(" If you back up your playlist (and this app, it runs offline) to a file it will continue working even if this server goes down. Do back up your precius playlists now!")]),t._v(" "),o("li",[o("b",[t._v("Privacy")]),t._v(" This app stores all your data in your browser (Menu > More tools > Developer tools > Application > IndexDB), nothing is saved on my server.\n\t\t\tI currently do not use any analytics tool (though it's very tempting).\n\t\t\tThe streams however are provided by external entities (Google-YouTube) that will track you.\n\t\t\tAs stated before I currently have no intentions of showing external advertisement.\n\t\t\tI think if Audius gets popular there are nicer ways to profit from it.")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("ul",[e("li",[e("a",{attrs:{href:"https://vivaldi.com/download/",target:"_blank",rel:"noopener"}},[this._v("Vivaldi")])]),this._v(" "),e("li",[this._v(" Chrome >= 51 ")]),this._v(" "),e("li",[this._v(" FireFox >= 49 ")]),this._v(" "),e("li",[this._v(" Internet Explorer & Safari ... not supported, might work though ")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("\n\t\tThe source code for this project is located at "),e("a",{attrs:{href:"https://github.com/select/audius",title:"Source code on select@github audius",target:"_blank",rel:"noopener"}},[this._v("https://github.com/select/audius")]),this._v(".\n\t")])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("p",[t._v("\n\t\tThe extension (currently revived) should have been the actual player since the original idea was to create a Chrome/FireFox extension with a media player for "),o("i",[t._v("web.whatsapp.com")]),t._v(". After struggeling alot with "),o("a",{attrs:{href:"https://stackoverflow.com/questions/40309872/youtube-video-in-chrome-extension-content-script",target:"_blank",rel:"noopener"}},[t._v("getting the YouTube player to run in an extension content script")]),t._v(" the plan completely failed when the "),o("a",{attrs:{href:"https://content-security-policy.com/",target:"_blank",rel:"noopener"}},[t._v("content security policy")]),t._v(" did not allow the embdding of youtube videos. Even though it should be possible to overwrite the header fields for the content security policy of web.whatsapp.com I could not get it to work (it worked on every page "),o("a",{attrs:{href:"https://stackoverflow.com/questions/40322156/chrome-extension-can-not-get-header-with-onheadersreceived",target:"_blank",rel:"noopener"}},[t._v("except web.whatsapp.com")]),t._v("). That meant no YouTube player, no music. The only way out of this mess was to create an extension with a content script (grabs links from the current page) that communicates with a background script (relays found links) that in turn communicates with the a main player (this web app, that plays the songs). But this also meant that I had to write an extension and a web app. Well what the heck, I was still using the Streamus player (a Chrome extension that was killed by google) but over the time less and less worked so I needed a replacement anyway. I tried "),o("a",{attrs:{href:"https://www.tomahawk-player.org/",target:"_blank",rel:"noopener"}},[t._v("tomahawk")]),t._v(" and it seemed quite promising, but I just could not get it to work with dragged in or paste in "),o("a",{attrs:{href:"https://github.com/tomahawk-player/tomahawk-resolvers/issues/126"}},[t._v("youtube links")]),t._v(". Also the search was quite slow and did not show many results. This kind of left me no other option but to write Audius.\n\t")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("\n\t\tIn the summer before I started with Audius, I created a Chrome app (oh stupid me, 2 weeks before Google announced the death of Chrome apps I release the first version) for watching funny videos from popular sites like Imgur and 9gag. "),e("a",{attrs:{href:"https://github.com/select/boomnext/",target:"_blank",rel:"noopener"}},[this._v("Boom, next video!")]),this._v(" was the result of an idea that I played around with for a long time but never fully realized. Then some day the awesome "),e("a",{attrs:{href:"https://twitter.com/5by"}},[this._v("5by")]),this._v(" app was created, which had everything I really wanted: a continous stream of fresh and fun content with no user interaction necessary, just like TV, start it and turn off your brain. But 5by did not survive long and I forgot about it, until last summer when I recreated it. It was fun, it was absolutely addictive. But then Google killed Chrome apps and since I used core components from "),e("i",[this._v("Boom, next")]),this._v(" already in Audius I started to integrate some more features.\n\t")])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("p",[t._v("\n\t\tHere are some alternatives to Audius that are also interesting:\n\t\t"),o("ul",[o("li",[o("a",{attrs:{href:"https://lnfwebsite.github.io/Streamly",target:"_blank",rel:"noopener"}},[t._v("Streamly")])]),t._v(" "),o("li",[o("a",{attrs:{href:"http://streamsquid.com/",target:"_blank",rel:"noopener"}},[t._v("StreamSquid")])]),t._v(" "),o("li",[o("a",{attrs:{href:"https://mycloudplayers.com",target:"_blank",rel:"noopener"}},[t._v("My Cloud Player")])]),t._v(" "),o("li",[o("a",{attrs:{href:"https://music.torchbrowser.com/trending"}},[t._v("Torch Music")])])]),t._v("\n\t\tJust look at them and appreciate the simplicity of the Audius interface ... wait what don't leave X-D\n\t")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("\n\t\tThis work is inspired by the incredible "),e("a",{attrs:{href:"https://www.reddit.com/r/streamus/",target:"_blank",rel:"noopener"}},[this._v("Streamus")]),this._v(" app."),e("br")])},function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("p",[t._v("\n\t\tHere are the tools I used to create Audius.\n\t\t"),o("ul",[o("li",[t._v("VueJs")]),t._v(" "),o("li",[o("span",{staticStyle:{"text-decoration":"line-through"}},[t._v("Redux")]),t._v(" Vuex")]),t._v(" "),o("li",[t._v("Icomoon + Google material icons")]),t._v(" "),o("li",[t._v("Webpack + Plugins")]),t._v(" "),o("li",[t._v("LivingStyleGuide")]),t._v(" "),o("li",[o("a",{attrs:{href:"https://rubaxa.github.io/Sortable/"}},[t._v("SortableJS")]),t._v("; vuedraggable")]),t._v(" "),o("li",[o("a",{attrs:{target:"_blank",href:"http://myjson.com/"}},[t._v("Myjson.com")])]),t._v(" "),o("li",[t._v("Matrix")]),t._v(" "),o("li",[t._v("Imgur")]),t._v(" "),o("li",[o("a",{attrs:{href:"https://github.com/developit/snarkdown"}},[t._v("Snarkdown")])])])])}],!1,null,null,null);l.options.__file="about-player-more.vue";e.default=l.exports}}]);