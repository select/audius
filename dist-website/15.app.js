(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{150:function(e,t,r){"use strict";r.r(t);var a=r(472),i=r(235);for(var n in i)"default"!==n&&function(e){r.d(t,e,function(){return i[e]})}(n);r(340);var o=r(0),u=Object(o.a)(i.default,a.a,a.b,!1,null,null,null);t.default=u.exports},235:function(e,t,r){"use strict";r.r(t);var a=r(236),i=r.n(a);for(var n in a)"default"!==n&&function(e){r.d(t,e,function(){return a[e]})}(n);t.default=i.a},236:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},i=r(1),n=r(2);t.default={data:function(){return{player:void 0,timeInterval:void 0,duration:0,skipToTimeLocal:0}},created:function(){var e=this;this.lastTrackId=null,this.subscriptions=[this.$store.watch(function(e){return e.currentMedia},function(){if("youtube"===e.currentMedia.type)try{var t=n.isYouTubeVideoRegEx.exec(e.player.getVideoUrl()),r=t?t[1]:void 0,a=e.currentMedia.youtubeId||e.currentMedia.id;r!==a?(e.duration=e.player.getDuration(),e.player.loadVideoById({videoId:a,suggestedQuality:"large"}),e.currentMedia.start&&e.player.seekTo(e.currentMedia.start,!0),e.lastTrackId=e.currentMedia.trackId):e.currentMedia.trackId!==e.lastTrackId&&(e.player.seekTo(e.currentMedia.start,!0),e.lastTrackId=e.currentMedia.trackId),e.player.playVideo()}catch(t){e.error("YouTub player had an error. "+t)}else e.player&&e.player.pauseVideo()}),this.$store.watch(function(e){return e.mute},function(){e.player&&e.player.isMuted&&e.player.isMuted()!==e.mute&&(e.mute?e.player.mute():e.player.unMute())}),this.$store.watch(function(e){return e.skipToTime},function(){"youtube"===e.currentMedia.type&&e.skipToTimeLocal!==e.skipToTime&&(e.skipToTimeLocal=e.skipToTime,e.player.seekTo(e.skipToTime,!0))}),this.$store.watch(function(e){return e.isPlaying},function(){var t=e.currentMedia.youtubeId||e.currentMedia.id;if("youtube"===e.currentMedia.type&&e.isPlaying&&t)try{1!==e.player.getPlayerState()&&e.player.playVideo()}catch(t){e.error("YouTub player was not ready, try again.")}else e.player&&e.player.getPlayerState&&![0,2].includes(e.player.getPlayerState())&&e.player.pauseVideo()})]},beforeDestroy:function(){this.subscriptions.forEach(function(e){e()})},mounted:function(){var e=this,t=["Es22YN2stg8","strzXKsfRMs","KwoVARYA8jw","nzwrwfNHn5A"];window.onYouTubeIframeAPIReady=function(){e.player=new YT.Player("youtube-iframe",{height:"100%",width:"100%",videoId:e.currentMedia.youtubeId||e.currentMedia.id||t[Math.floor(Math.random()*t.length)],events:{onReady:e.onPlayerReady,onStateChange:e.onPlayerStateChange,onError:e.onPlayerError}})},(0,n.injectScript)("https://www.youtube.com/iframe_api").catch(function(t){e.error(t)})},computed:(0,i.mapState)(["currentMedia","mute","skipToTime","isPlaying"]),methods:a({},(0,i.mapMutations)(["play","pause","setCurrentTime","videoError","error"]),(0,i.mapActions)(["nextVideo"]),{onPlayerError:function(e){this.videoError(e.data),this.error("YouTube could not play the video. Error Code "+e.data)},onPlayerReady:function(e){this.player.playVideo()},onPlayerStateChange:function(){var e=this,t=this.player.getPlayerState();2===t?(this.clearInterval(),this.timeInterval=void 0,this.isPlaying&&"youtube"===this.currentMedia.type&&this.pause()):1===t?(this.clearInterval(),this.timeInterval=setInterval(function(){e.currentMedia.stop&&e.player.getCurrentTime()>=e.currentMedia.stop&&e.nextVideo(),e.setCurrentTime(e.player.getCurrentTime())},1e3),this.isPlaying||this.play()):0===t&&(this.clearInterval(),this.nextVideo())},clearInterval:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){clearInterval(this.timeInterval),this.timeInterval=null})})}},237:function(e,t,r){},340:function(e,t,r){"use strict";var a=r(237);r.n(a).a},472:function(e,t,r){"use strict";var a=function(){var e=this.$createElement;this._self._c;return this._m(0)},i=[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"youtube-player"},[t("div",{attrs:{id:"youtube-iframe"}})])}];r.d(t,"a",function(){return a}),r.d(t,"b",function(){return i})}}]);