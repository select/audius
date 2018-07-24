webpackJsonp([1],{158:function(t,e,n){"use strict";function a(t){c||n(178)}Object.defineProperty(e,"__esModule",{value:!0});var o=n(180),s=n.n(o),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("table",{staticClass:"matrix-login"},[t._m(0),t._v(" "),t._m(1),t._v(" "),n("tr",[n("td"),t._v(" "),n("td",{staticStyle:{"text-align":"right"}},[n("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixLogin}},[t._v("Login")])])])])},i=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("td",[t._v("Username")]),t._v(" "),n("td",[n("input",{staticClass:"input--border",attrs:{type:"text",id:"username"}})])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("td",[t._v("Password")]),t._v(" "),n("td",[n("input",{staticClass:"input--border",attrs:{type:"password",id:"password"}})])])}];r._withStripped=!0;var l={render:r,staticRenderFns:i},u=l,c=!1,p=n(1),d=a,v=p(s.a,u,!1,d,null,null);v.options.__file="src/components/matrix-login.vue",v.esModule&&Object.keys(v.esModule).some(function(t){return"default"!==t&&"__"!==t.substr(0,2)})&&console.error("named exports are not supported in *.vue files.");e.default=v.exports},178:function(t,e,n){var a=n(179);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n(3)("73030a90",a,!1)},179:function(t,e,n){e=t.exports=n(2)(void 0),e.push([t.i,"",""])},180:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},o=n(0);e.default={methods:a({},(0,o.mapActions)(["loginMatrixWithPassword"]),{matrixLogin:function(){var t=this.$el.querySelector("#username"),e=this.$el.querySelector("#password");this.loginMatrixWithPassword({username:t.value,password:e.value}),this.$el.querySelector("#username").value="",this.$el.querySelector("#password").value=""}})}},31:function(t,e,n){"use strict";function a(t){c||n(322)}Object.defineProperty(e,"__esModule",{value:!0});var o=n(324),s=n.n(o),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"settings"},[n("h1",[t._v("Settings")]),t._v(" "),n("h3",[t._v("Backup")]),t._v(" "),n("p",[n("button",{staticClass:"button btn--blue",on:{click:t.saveBackup}},[t._v("Save backup")]),t._v(" "),n("button",{staticClass:"button btn--blue-ghost",attrs:{title:"Load backup from file"},on:{click:function(e){t.showConfirmLoadBackup=!0}}},[t._v("Load backup")]),t._v(" "),n("a",{staticClass:"button btn--gray-ghost",staticStyle:{float:"right"},attrs:{title:"Download Audius app",href:"audius.app.html",download:""}},[t._v("Audius app")])]),t._v(" "),t.showConfirmLoadBackup?n("div",{staticClass:"modal",on:{click:function(e){e.stopPropagation(),t.showConfirmLoadBackup=!1}}},[n("div",{staticClass:"modal__body",on:{click:function(t){t.stopPropagation()}}},[t._v("\n\t\t\tLoading the backup will overwirte all current data!\n\t\t\t"),n("div",{staticClass:"modal__btn-group"},[n("button",{staticClass:"button",on:{click:function(e){t.showConfirmLoadBackup=!1}}},[t._v("Cancel")]),t._v(" "),n("input",{attrs:{type:"file",id:"settings-backup",title:"Load backup from file"},on:{change:t._loadBackup}}),t._v(" "),n("label",{staticClass:"button btn--blue",attrs:{for:"settings-backup"}},[t._v("Load backup")])])])]):t._e(),t._v(" "),n("h3",[t._v("Extension")]),t._v(" "),n("p",[t._v("\n\t\tThen extension is "),t.extensionAvilable?n("b",[t._v("installed")]):n("span",[n("b",[t._v("not installed")]),t._v(". You can install it from the "),n("a",{attrs:{href:"https://chrome.google.com/webstore/detail/ekpajajepcojhnjmlibfbjmdjcafajoh",target:"_blank",rel:"noopener"}},[t._v("Chrome web store")]),t._v(". If you just installed it please reload this page and this message will disappear")]),t._v(".\n\t")]),t._v(" "),n("h3",[t._v("YouTube")]),t._v(" "),n("p",[t._v("\n\t\tYouTube API key\n\t\t"),n("input",{staticClass:"input--border",attrs:{type:"text",placeholder:"… 39 digit API key"},domProps:{value:t.youtubeApiKeyUI},on:{input:function(e){t.setYoutubeApiKey(e.target.value)}}}),t._v(" "),n("br"),t._v(" "),t._m(0)]),t._v(" "),n("h3",[t._v("Matrix")]),t._v(" "),n("div",{staticClass:"settings__buttons",on:{click:t.setMatrixEnabled}},[t.matrixEnabled?n("div",{staticClass:"button"},[t._v("disable Matrix")]):n("div",{staticClass:"button btn--blue"},[t._v("enable Matrix")])]),t._v(" "),t.matrixEnabled?n("div",[t.matrixLoggedIn?n("p",[t._v("\n\t\t\t\tYou are "),n("b",[t._v("connected")]),t._v(" as "+t._s(t.matrix.credentials.userId)+".\n\t\t\t\t"),!1!==t.matrix.isGuest?n("span",[t._v("You are a "),n("b",[t._v("guest")]),t._v(" user.")]):t._e(),t._v(" "),n("br"),n("br"),t._v(" "),n("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixLogout}},[t._v("Log out")]),t._v(" "),n("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixRemoveAccount}},[t._v("Remove Account")])]):n("p",[t._v("\n\t\t\tYou are currently "),n("b",[t._v("not connected")]),t._v("."),n("br"),n("br")]),t._v(" "),n("p",[n("matrix-login")],1)]):t._e()])},i=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",{staticClass:"smaller"},[t._v("Create your own key in the "),n("a",{attrs:{href:"https://console.developers.google.com/",target:"_blank",rel:"noopener"}},[t._v("Google Developers Console")])])}];r._withStripped=!0;var l={render:r,staticRenderFns:i},u=l,c=!1,p=n(1),d=a,v=p(s.a,u,!1,d,null,null);v.options.__file="src/components/settings.vue",v.esModule&&Object.keys(v.esModule).some(function(t){return"default"!==t&&"__"!==t.substr(0,2)})&&console.error("named exports are not supported in *.vue files.");e.default=v.exports},322:function(t,e,n){var a=n(323);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n(3)("0188699e",a,!1)},323:function(t,e,n){e=t.exports=n(2)(void 0),e.push([t.i,"\n.settings h1 {\n  text-align: center;\n}\n.settings h3 {\n  padding-left: 0.45rem;\n}\n.settings p, .settings .settings__buttons {\n  padding: 0.45rem;\n}\n.settings__buttons .button {\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n#settings-backup {\n  display: none;\n}\n#settings-backup + label {\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n}\n",""])},324:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},o=n(0),s=n(158),r=function(t){return t&&t.__esModule?t:{default:t}}(s),i=n(4);e.default={components:{MatrixLogin:r.default},data:function(){return{showConfirmLoadBackup:!1}},created:function(){this.matrixEnabled&&this.initModule("matrix")},computed:a({},(0,o.mapGetters)(["youtubeApiKeyUI"]),(0,o.mapState)(["matrixEnabled","extensionAvilable"]),(0,i.mapModuleState)("matrix",["matrixLoggedIn","matrix"])),methods:a({},(0,o.mapMutations)(["setYoutubeApiKey","matrixRemoveAccount","matrixLogout","setMatrixEnabled","loadBackup","error"]),(0,o.mapActions)(["saveBackup","initModule"]),{_loadBackup:function(t){var e=this,n=t.target.files||t.dataTransfer.files;Array.from(n).forEach(function(t){var n=new FileReader;n.onload=function(t){try{e.loadBackup(JSON.parse(t.target.result)),e.showConfirmLoadBackup=!1}catch(t){e.error("Error loading backup. "+t)}},n.readAsText(t)})}})}}});