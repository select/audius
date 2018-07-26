(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{143:function(t,e,n){"use strict";n.r(e);var o=n(455),i=n(203);for(var r in i)"default"!==r&&function(t){n.d(e,t,function(){return i[t]})}(r);n(320);var a=n(0),s=Object(a.a)(i.default,o.a,o.b,!1,null,null,null);e.default=s.exports},203:function(t,e,n){"use strict";n.r(e);var o=n(204),i=n.n(o);for(var r in o)"default"!==r&&function(t){n.d(e,t,function(){return o[t]})}(r);e.default=i.a},204:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},i=n(1),r=n(2);e.default={data:function(){return{importName:"",overwriteChannel:!1}},mounted:function(){this.importName=this.pendingImportURL?this.pendingImportURL.name:"",this.matrixLoggedIn||this.initModule("matrix")},methods:o({},(0,i.mapActions)(["importURL","joinMatrixRoom","initModule"]),(0,i.mapMutations)(["setPendingImportURL","error"]),{close:function(){this.setPendingImportURL(null)},addToPlayList:function(){var t=document.querySelector(".import-modal__other-playlist-input").value||null;this.importURL({url:this.pendingImportURL.url,name:t})},importPlayList:function(){var t=document.querySelector(".import-modal__name-input");this.importURL({url:this.pendingImportURL.url,name:t.value})},setOverwrite:function(t){this.overwriteChannel=t.target.checked},setImportName:function(t){this.importName=t.target.value},importRoom:function(){this.joinMatrixRoom({id:this.pendingImportURL.url,name:this.pendingImportURL.name}),this.close()},importChannel:function(){this.error("Not implemented yet .·´¯`(>▂<)´¯`·.")}}),computed:o({},(0,i.mapState)(["pendingImportURL","extensionAvilable"]),(0,r.mapModuleState)("matrix",["matrixLoggedIn"]),(0,r.mapModuleState)("webScraper",{webScrapers:"matrixLoggedIn"}),(0,i.mapGetters)(["sourcesOrdered"]))}},205:function(t,e,n){},320:function(t,e,n){"use strict";var o=n(205);n.n(o).a},455:function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.pendingImportURL?n("div",{staticClass:"import-modal modal",on:{click:t.close}},[n("div",{staticClass:"modal__body",on:{click:function(t){t.stopPropagation()}}},["webScraper"===t.pendingImportURL.type?n("div",[n("p"),n("h3",[t._v("Import channel")]),t._v(" "),n("div",{staticClass:"import-modal__row"},[n("input",{staticClass:"import-modal__name-input input--border",attrs:{type:"text",placeholder:"… name"},domProps:{value:t.importName},on:{input:t.setImportName}}),t._v(" "),n("button",{staticClass:"button btn--blue",class:{disabled:t.importName in t.webScrapers&&!t.overwriteChannel},on:{click:t.importChannel}},[t._v("Import")])]),t._v(" "),t.importName in t.webScrapers?n("div",[n("input",{attrs:{type:"checkbox",id:"overwrite"},on:{change:t.setOverwrite}}),t._v(" "),n("label",{attrs:{for:"overwrite"}},[t._v("\n\t\t\t\t\t\toverwrite channel\n\t\t\t\t\t")])]):t._e(),t._v(" "),t.extensionAvilable?t._e():n("p",[t._v("\n\t\t\t\t\tPlease install the "),n("a",{attrs:{href:"https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh",target:"_blank",rel:"noopener"}},[t._v("Audius extension")]),t._v(" for this feature.\n\t\t\t\t")]),t._v(" "),n("p")]):t._e(),t._v(" "),"matrix"===t.pendingImportURL.type?n("div",[n("h3",[t._v("Join room")]),t._v(" "),t.matrixLoggedIn?t._e():n("p",[t._v("\n\t\t\t\t\t\t… connecting to Matrix. Please be patient.\n\t\t\t\t")]),t._v(" "),n("p"),n("div",{staticClass:"import-modal__row"},[n("div",[t._v(t._s(t.pendingImportURL.name))]),t._v(" "),n("button",{staticClass:"button btn--blue",class:{disabled:!t.matrixLoggedIn},on:{click:t.importRoom}},[t._v("Join")])]),t._v(" "),n("p")]):t._e(),t._v(" "),"webScraper"!=t.pendingImportURL.type&&"matrix"!=t.pendingImportURL.type?n("div",[n("p",[t._v("\n\t\t\t\tCreate new playlist\n\t\t\t\t")]),n("div",{staticClass:"import-modal__row"},[n("input",{staticClass:"import-modal__name-input input--border",attrs:{type:"text",placeholder:"… name"},domProps:{value:t.pendingImportURL.name}}),t._v(" "),n("button",{staticClass:"button btn--blue",on:{click:t.importPlayList}},[t._v("Create")])]),t._v(" "),n("p"),t._v(" "),n("p",[t._v("\n\t\t\t\tAdd songs to playlist\n\t\t\t\t")]),n("div",{staticClass:"import-modal__row"},[n("select",{staticClass:"import-modal__other-playlist-input"},[n("option",{attrs:{value:""}},[t._v("Default")]),t._v(" "),t._l(t.sourcesOrdered,function(e){return n("option",[t._v(t._s(e))])})],2),t._v(" "),n("button",{staticClass:"button btn--blue",on:{click:t.addToPlayList}},[t._v("Add")])]),t._v(" "),n("p")]):t._e(),t._v(" "),n("p",{staticClass:"import-modal__last"},[n("button",{staticClass:"button",on:{click:t.close}},[t._v("Cancel")])])])]):t._e()},i=[];n.d(e,"a",function(){return o}),n.d(e,"b",function(){return i})}}]);