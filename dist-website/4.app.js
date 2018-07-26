(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{142:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t(318);Object.defineProperty(r,"actions",{enumerable:!0,get:function(){return n.actions}});var s=t(319);Object.defineProperty(r,"mutations",{enumerable:!0,get:function(){return s.mutations}});var i=t(82);Object.defineProperty(r,"presistMutation",{enumerable:!0,get:function(){return i.presistMutation}});var a=t(83);Object.defineProperty(r,"state",{enumerable:!0,get:function(){return a.state}})},318:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.actions=void 0;var n=t(2);function s(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function i(e){window.dispatchEvent(new CustomEvent("audiusExtension",{detail:e}))}r.actions={renameWebScraper:function(e,r){var t=e.state,n=e.commit,s=r.oldName,i=r.newName;t.sources[i]||(n("renameWebScraper",{oldName:s,newName:i}),n("selectMediaSource",{type:"webScraper",id:i}))},webScraperUpdateSuccess:function(e,r){var t=e.state,n=e.commit,i=r.id,a=r.mediaList;if(a){var u=t.sources[i],c=u?u.playList:[],o=u&&u.archive?u.archive:[],d=new Set([].concat(s(c.map(function(e){return e.id})),s(o))),l=a.filter(function(e){return!d.has(e.id)});if(l.length){for(var p=[].concat(s(c),s(l));p.length>3e3;){var f=p.shift();o.push(f.id)}l.length&&n("updateWebScraper",{id:i,values:{playList:p,archive:o}})}else n("error","No new videos found for "+i+". Try agin.")}else n("error","Requesting "+i+" did not return results.")},initWebScraper:function(e,r){var t=e.state,n=e.commit,s=e.dispatch;!r||r in t.sources||n("addWebScraper",r),t.sources[r].playList.length||s("runWebScraper",r)},runWebScraper:function(e,r){var t=e.state,s=e.commit,a=e.dispatch,u=e.rootState;if(r){var c=t.sources[r],o=u.paginationIndex[r]||0;if("Imgur"===r)s("setPaginationIndex",{id:r,index:o+1}),n.webScraper.getImgurMedia(u.paginationIndex[r]).then(function(e){a("webScraperUpdateSuccess",{id:r,mediaList:e})}).catch(function(e){return s("error","Could not get Imgur. "+e)});else if("script"===c.settings.type)s("setPaginationIndex",{id:r,index:o+1}),t.sourcesInitialized[r]?i({audius:!0,type:"getNext",id:r}):i({audius:!0,type:"loadScript",id:r,code:c.settings.script,youtubeApiKey:t.youtubeApiKey,responseTemplate:{audius:!0,vuex:"commit",type:"initScraperSuccess",data:r}});else if("urls"===c.settings.type){var d=o;if(o>=c.settings.numPages-1)s("error","Checked all URLs in channel, try again next time.");else if(c.settings.urls){var l=0,p=void 0;if(c.settings.urls.every(function(e){return(l+=e.numPages)>o?(p=e.url,!1):(d-=e.numPages,!0)}),!t.extensionAvilable)return s("error","The audius extension is not installed. Please install it."),void s("setShowSettings");s("setPaginationIndex",{id:r,index:o+1}),i({audius:!0,type:"scanUrl",url:n.webScraper.patternToUrls(p)[d],youtubeApiKey:t.youtubeApiKey,responseTemplate:{audius:!0,vuex:"dispatch",type:"webScraperUpdateSuccess",data:{id:r}}})}else s("error","Channel URLs missing")}}else s("error",'Can not find channel "'+r+'".')}}},319:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.mutations=void 0;var n=t(2);function s(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}r.mutations={recoverState_webScraper:function(e,r){Object.assign(e,r)},addWebScraper:function(e,r){if(!r){var t=1;for(r="Channel "+t;r in e.sources;)r="Channel "+t++}e.sources[r]={playList:[],playedMedia:{},settings:{},archive:[]},e.sourcesOrdered.includes(r)||e.sourcesOrdered.push(r),e.currentWebScraper=r},deleteWebScraper:function(e,r){delete e.sources[r],e.sourcesOrdered=e.sourcesOrdered.filter(function(e){return e!==r})},initScraperSuccess:function(e,r){e.sourcesInitialized[r]=!0},addUrlPattern:function(e,r){var t=r.id,i=r.urlPattern,a=e.sources[t].settings.urls||[],u=e.sources[t].settings;a.some(function(e){return e===i})||(u.urls=[].concat(s(a),[{url:i,numPages:n.webScraper.patternToUrls(i).length}]),u.numPages=u.urls.reduce(function(e,r){return e+r.numPages},0)),e.sources=Object.assign({},e.sources)},updateWebScraper:function(e,r){var t=r.id,n=r.values;e.sources[t]=Object.assign({},e.sources[t],n),e.sources=Object.assign({},e.sources)},renameWebScraper:function(e,r){var t=r.newName,n=r.oldName,i=Object.assign({},e.sources);i[t]=i[n];var a=[].concat(s(e.sourcesOrdered));a[a.indexOf(n)]=t,delete i[n],e.sources=i,e.sourcesOrdered=a}}}}]);