(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{172:function(t,e,a){"use strict";a.r(e);var n=a(173),o=a.n(n);for(var r in n)"default"!==r&&function(t){a.d(e,t,function(){return n[t]})}(r);e.default=o.a},173:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n])}return t},o=a(1),r=a(2);e.default={computed:n({},(0,r.mapModuleState)("matrix",["credentials","isGuest"])),methods:n({},(0,o.mapActions)(["loginMatrixWithPassword"]),{matrixLogin:function(){var t=this.$el.querySelector("#username"),e=this.$el.querySelector("#password");this.loginMatrixWithPassword({username:t.value,password:e.value}),this.$el.querySelector("#username").value="",this.$el.querySelector("#password").value=""}})}},174:function(t,e,a){},189:function(t,e,a){"use strict";a.r(e);var n=a(281),o=a(172);for(var r in o)"default"!==r&&function(t){a.d(e,t,function(){return o[t]})}(r);a(208);var s=a(0),i=Object(s.a)(o.default,n.a,n.b,!1,null,null,null);e.default=i.exports},206:function(t,e,a){"use strict";a.r(e);var n=a(207),o=a.n(n);for(var r in n)"default"!==r&&function(t){a.d(e,t,function(){return n[t]})}(r);e.default=o.a},207:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n])}return t},o=a(1),r=function(t){return t&&t.__esModule?t:{default:t}}(a(189)),s=a(2);e.default={components:{MatrixLogin:r.default},data:function(){return{showConfirmLoadBackup:!1}},created:function(){this.initModule("matrix")},computed:n({},(0,o.mapGetters)(["youtubeApiKeyUI"]),(0,o.mapState)(["extensionAvilable"]),(0,s.mapModuleState)("matrix",["matrixLoggedIn","matrix","credentials","isGuest"])),methods:n({},(0,o.mapMutations)(["setYoutubeApiKey","matrixRemoveAccount","matrixLogout","loadBackup","error"]),(0,o.mapActions)(["saveBackup","initModule"]),{_loadBackup:function(t){var e=this,a=t.target.files||t.dataTransfer.files;Array.from(a).forEach(function(t){var a=new FileReader;a.onload=function(t){try{e.loadBackup(JSON.parse(t.target.result)),e.showConfirmLoadBackup=!1}catch(t){e.error("Error loading backup. "+t)}},a.readAsText(t)})}})}},208:function(t,e,a){"use strict";var n=a(174);a.n(n).a},210:function(t,e,a){},281:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("table",{staticClass:"matrix-login"},[a("tr",[a("td",[t._v("Username")]),t._v(" "),a("td",[a("input",{staticClass:"input--border",attrs:{type:"text",id:"username"},domProps:{value:t.isGuest?"":t.credentials.userId}})])]),t._v(" "),t._m(0),t._v(" "),a("tr",[a("td"),t._v(" "),a("td",{staticStyle:{"text-align":"right"}},[a("a",{staticClass:"button btn--blue-ghost create-room__register",attrs:{target:"_blank",href:"https://riot.im/app/#/register"}},[t._v("Register")]),t._v(" "),a("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixLogin}},[t._v("Login")])])])])},o=[function(){var t=this.$createElement,e=this._self._c||t;return e("tr",[e("td",[this._v("Password")]),this._v(" "),e("td",[e("input",{staticClass:"input--border",attrs:{type:"password",id:"password"}})])])}];a.d(e,"a",function(){return n}),a.d(e,"b",function(){return o})},322:function(t,e,a){"use strict";var n=a(210);a.n(n).a},462:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"settings"},[a("h1",[t._v("Settings")]),t._v(" "),a("h3",[t._v("Backup")]),t._v(" "),a("p",[a("button",{staticClass:"button btn--blue",on:{click:t.saveBackup}},[t._v("Save backup")]),t._v(" "),a("button",{staticClass:"button btn--blue-ghost",attrs:{title:"Load backup from file"},on:{click:function(e){t.showConfirmLoadBackup=!0}}},[t._v("Load backup")]),t._v(" "),a("a",{staticClass:"button btn--gray-ghost",staticStyle:{float:"right"},attrs:{title:"Download Audius app",href:"audius.app.html",download:""}},[t._v("Audius app")])]),t._v(" "),t.showConfirmLoadBackup?a("div",{staticClass:"modal",on:{click:function(e){e.stopPropagation(),t.showConfirmLoadBackup=!1}}},[a("div",{staticClass:"modal__body",on:{click:function(t){t.stopPropagation()}}},[t._v("\n\t\t\tLoading the backup will overwirte all current data!\n\t\t\t"),a("div",{staticClass:"modal__btn-group"},[a("button",{staticClass:"button",on:{click:function(e){t.showConfirmLoadBackup=!1}}},[t._v("Cancel")]),t._v(" "),a("input",{attrs:{type:"file",id:"settings-backup",title:"Load backup from file"},on:{change:t._loadBackup}}),t._v(" "),a("label",{staticClass:"button btn--blue",attrs:{for:"settings-backup"}},[t._v("Load backup")])])])]):t._e(),t._v(" "),a("h3",[t._v("Extension")]),t._v(" "),a("p",[t._v("\n\t\tThe extension is "),t.extensionAvilable?a("b",[t._v("installed")]):a("span",[a("b",[t._v("not installed")]),t._v(". You can install it from the "),a("a",{attrs:{href:"https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh",target:"_blank",rel:"noopener"}},[t._v("Chrome web store")]),t._v(". If you just installed it please reload this page and this message will disappear")]),t._v(".\n\t")]),t._v(" "),a("h3",[t._v("YouTube")]),t._v(" "),a("p",[t._v("\n\t\tYouTube API key\n\t\t"),a("input",{staticClass:"input--border",attrs:{type:"text",placeholder:"… 39 digit API key"},domProps:{value:t.youtubeApiKeyUI},on:{input:function(e){t.setYoutubeApiKey(e.target.value)}}}),t._v(" "),a("br"),t._v(" "),t._m(0)]),t._v(" "),a("h3",[t._v("Matrix / Riot.im")]),t._v(" "),a("div",[t.matrixLoggedIn?a("p",[t._v("\n\t\t\t\tYou are "),a("b",[t._v("connected")]),t._v(" as "+t._s(t.credentials.userId)+".\n\t\t\t\t"),!1!==t.isGuest?a("span",[t._v("You are a "),a("b",[t._v("guest")]),t._v(" user.")]):t._e(),t._v(" "),a("br"),a("br"),t._v(" "),a("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixLogout}},[t._v("Log out")]),t._v(" "),a("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixRemoveAccount}},[t._v("Remove Account")])]):a("p",[t._v("\n\t\t\tYou are currently "),a("b",[t._v("not connected")]),t._v(" ("+t._s(t.credentials.userId)+")."),a("br"),a("br")]),t._v(" "),a("p",[a("matrix-login")],1)])])},o=[function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"smaller"},[this._v("Create your own key in the "),e("a",{attrs:{href:"https://console.developers.google.com/",target:"_blank",rel:"noopener"}},[this._v("Google Developers Console")])])}];a.d(e,"a",function(){return n}),a.d(e,"b",function(){return o})},85:function(t,e,a){"use strict";a.r(e);var n=a(462),o=a(206);for(var r in o)"default"!==r&&function(t){a.d(e,t,function(){return o[t]})}(r);a(322);var s=a(0),i=Object(s.a)(o.default,n.a,n.b,!1,null,null,null);e.default=i.exports}}]);