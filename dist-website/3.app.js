webpackJsonp([3],{190:function(t,e,n){var s=n(191);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);n(3)("593e6fa9",s,!1)},191:function(t,e,n){e=t.exports=n(2)(void 0),e.push([t.i,"\n.settings h1 {\n  text-align: center;\n}\n.settings h3 {\n  padding-left: 0.45rem;\n}\n.settings p, .settings .settings__buttons {\n  padding: 0.45rem;\n}\n.settings__buttons .button {\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.settings__btn-group {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.settings__btn-group > * {\n    margin-right: 0.45rem;\n}\n",""])},192:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=n[s])}return t},r=n(0);e.default={computed:s({},(0,r.mapGetters)(["youtubeApiKeyUI"]),(0,r.mapState)(["matrixLoggedIn","matrix","matrixEnabled","reloadScript"])),methods:s({},(0,r.mapMutations)(["setYoutubeApiKey","matrixRemoveAccount","matrixLogout","setMatrixEnabled","setReloadScript"]),(0,r.mapActions)(["loginMatrixWithPassword"]),{matrixLogin:function(){var t=document.querySelector("#username"),e=document.querySelector("#password");this.loginMatrixWithPassword({username:t.value,password:e.value}),document.querySelector("#username").value="",document.querySelector("#password").value=""}})}},193:function(t,e,n){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"settings"},[n("h1",[t._v("Settings")]),t._v(" "),n("h3",[t._v("YouTube")]),t._v(" "),n("p",[t._v("\n\t\tYouTube API key\n\t\t"),n("input",{staticClass:"input--border",attrs:{type:"text",placeholder:"… 39 digit API key"},domProps:{value:t.youtubeApiKeyUI},on:{input:function(e){t.setYoutubeApiKey(e.target.value)}}}),t._v(" "),n("br"),t._v(" "),t._m(0)]),t._v(" "),n("h3",[t._v("Matrix")]),t._v(" "),n("div",{staticClass:"settings__buttons",on:{click:t.setMatrixEnabled}},[t.matrixEnabled?n("div",{staticClass:"button"},[t._v("disable Matrix")]):n("div",{staticClass:"button btn--blue"},[t._v("enable Matrix")])]),t._v(" "),t.matrixEnabled?n("div",[t.matrixLoggedIn?n("p",[t._v("\n\t\t\t\tYou are "),n("b",[t._v("connected")]),t._v(" as "+t._s(t.matrix.credentials.userId)+". "),n("br"),n("br"),t._v(" "),n("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixLogout}},[t._v("Log out")]),t._v(" "),n("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixRemoveAccount}},[t._v("Remove Account")])]):n("p",[t._v("\n\t\t\tYou are currently "),n("b",[t._v("not connected")]),t._v("."),n("br"),n("br")]),t._v(" "),n("p",[n("table",[t._m(1),t._v(" "),t._m(2),t._v(" "),n("tr",[n("td"),t._v(" "),n("td",{staticStyle:{"text-align":"right"}},[n("button",{staticClass:"button btn--blue",attrs:{type:"button"},on:{click:t.matrixLogin}},[t._v("Login")])])])])])]):t._e()])},staticRenderFns:[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",{staticClass:"smaller"},[t._v("Create your own key in the "),n("a",{attrs:{href:"https://console.developers.google.com/",target:"_blank"}},[t._v("Google Developers Console")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("td",[t._v("Username")]),t._v(" "),n("td",[n("input",{staticClass:"input--border",attrs:{type:"text",id:"username"}})])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("td",[t._v("Password")]),t._v(" "),n("td",[n("input",{staticClass:"input--border",attrs:{type:"password",id:"password"}})])])}]},t.exports.render._withStripped=!0},24:function(t,e,n){function s(t){r||n(190)}var r=!1,o=n(1)(n(192),n(193),s,null,null);o.options.__file="/home/select/Dev/audius/src/components/settings.vue",o.esModule&&Object.keys(o.esModule).some(function(t){return"default"!==t&&"__"!==t.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),o.options.functional&&console.error("[vue-loader] settings.vue: functional components are not supported with templates, they should use render functions."),t.exports=o.exports}});