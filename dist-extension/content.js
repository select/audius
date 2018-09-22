/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension/content.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/extension/content.js":
/*!**********************************!*\
  !*** ./src/extension/content.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_webScraper_extension__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/webScraper.extension */ "./src/utils/webScraper.extension.js");
/* harmony import */ var _utils_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/debounce */ "./src/utils/debounce.js");


var isRunningInAudiusApp = !!document.querySelector('#audius-website');
var watchChanges = false; // When the audius website sends a handshake it's ready to set the extensionAvailable
// flag in the store.

window.addEventListener('audiusExtensionHandshake', function (event) {
  window.dispatchEvent(new CustomEvent('audius', {
    detail: {
      vuex: 'commit',
      type: 'setExtensionAvilable',
      data: true
    }
  }));
}, false);
var observer;
var knownMedia = new Set();

function scrapePage(request) {
  var mediaList = _utils_webScraper_extension__WEBPACK_IMPORTED_MODULE_0__["webScraper"].findMediaInElement(document.body).filter(function (_ref) {
    var id = _ref.id;
    return !knownMedia.has(id);
  });
  mediaList.forEach(function (_ref2) {
    var id = _ref2.id;
    return knownMedia.add(id);
  });
  window.console.log('## Audius searching ', mediaList.length);

  if (mediaList.length) {
    chrome.runtime.sendMessage({
      audius: true,
      vuex: 'dispatch',
      type: 'webScraperUpdateSuccess',
      data: {
        id: request.id,
        mediaList: mediaList
      }
    }, function () {});
  }

  return mediaList;
} // Listen to messages from background script and forward them to the audius website.


chrome.runtime.onMessage.addListener(function (request) {
  // if we are on a audius player page.
  if (request.audius) {
    if (isRunningInAudiusApp) {
      window.dispatchEvent(new CustomEvent('audius', {
        detail: request
      }));
    } else if (request.type === 'startWatching') {
      watchChanges = true;

      if (!observer) {
        window.console.log('## Audius startWatching request observer', request, observer);
        observer = new MutationObserver(Object(_utils_debounce__WEBPACK_IMPORTED_MODULE_1__["debounce"])(function () {
          if (!watchChanges) return;
          if (request.css && !document.querySelector(request.css)) return;
          var mediaList = scrapePage(request);
          window.console.log('## Audius searching ', mediaList.length);
        }), 1000);

        if (!request.css || document.querySelector(request.css)) {
          var mediaList = scrapePage(request);
          window.console.log('## Audius inital scrape: ', mediaList.length);
        }
      } // Start observing the DOM again


      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true
      });
    } else if (observer && request.type === 'stopWatching') {
      watchChanges = false;
      window.console.log('## Audius stopWatching');
      observer.disconnect();
    }
  }
}); // Forward messages from audius website to the background script of this extension.

window.addEventListener('audiusExtension', function (event) {
  // window.console.log('content message relay request ', event.detail);
  chrome.runtime.sendMessage(event.detail, function () {});
}, false);

/***/ }),

/***/ "./src/utils/ajax.js":
/*!***************************!*\
  !*** ./src/utils/ajax.js ***!
  \***************************/
/*! exports provided: ajaxJSON, ajaxRaw, ajaxPostJSON */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ajaxJSON", function() { return ajaxJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ajaxRaw", function() { return ajaxRaw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ajaxPostJSON", function() { return ajaxPostJSON; });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ajaxJSON(url, callback, params) {
  return new Promise(function (resolve, reject) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          try {
            var json = JSON.parse(xmlhttp.responseText);
            if (callback !== undefined) callback(json);
            resolve(json);
          } catch (e) {
            reject("Ajax JSON parse failed ".concat(e));
          }
        } else {
          if (callback !== undefined) console.warn("Ajax error ".concat(xmlhttp.status, " loading ").concat(url));
          reject("Ajax error ".concat(xmlhttp.status, " loading ").concat(url));
        }
      }
    };

    xmlhttp.open(params ? 'POST' : 'GET', url, true);
    xmlhttp.send(params);
  });
}
function ajaxRaw(url, requestHeader) {
  var promise = new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function load() {
      if (this.status >= 200 && this.status < 300) resolve(this.responseText);else reject("Ajax request for ".concat(url, " failed , because ").concat(this.statusText));
    };

    if (requestHeader) {
      xhr.setRequestHeader.apply(xhr, _toConsumableArray(requestHeader));
    }

    xhr.onerror = function (event) {
      reject("Error requesting ".concat(url));
    };

    xhr.send();
  });
  return promise;
}
function ajaxPostJSON(url, params) {
  return new Promise(function (resolve, reject) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) resolve(xmlhttp.responseText);else reject("Ajax error ".concat(xmlhttp.status, " posting data to ").concat(url));
      }
    };

    xmlhttp.open(params ? 'POST' : 'GET', url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xmlhttp.send(params);
  });
}

/***/ }),

/***/ "./src/utils/debounce.js":
/*!*******************************!*\
  !*** ./src/utils/debounce.js ***!
  \*******************************/
/*! exports provided: debounceImmediate, debounce, throttle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounceImmediate", function() { return debounceImmediate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return throttle; });
/**
 * ##customDebounce
 * Debounce Immediatly (custom made) - Fire once immediately and then when
 * the last change was done once again but take care that we do not fire
 * twice on the first time we fired
 * http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
 * @param {function} func founction to debounce
 * @param {number} wait number of milliseconds to wait
 * @return {function}      debounced function
 */
function debounceImmediate(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  // we need to save these in the closure
  var timeout;
  var args;
  var context;
  var timestamp;
  var callCount = 0;
  return function _callback() {
    // save details of latest call
    context = this;
    args = [].slice.call(arguments, 0);
    timestamp = new Date(); // immediately fire on the first call

    if (callCount === 0) {
      func.apply(context, args);
    }

    ++callCount; // this is where the magic happens

    var later = function later() {
      // how long ago was the last call
      var last = new Date() - timestamp; // if the latest call was less that the wait period ago
      // then we reset the timeout to wait for the difference

      if (last < wait) {
        timeout = setTimeout(later, wait - last); // or if not we can null out the timer and run the latest
      } else {
        timeout = null; // only fire if this was not the first call (index 0), first call aready fired

        if (callCount > 1) {
          func.apply(context, args);
        }

        callCount = 0; // time is over reset the counter
      }
    }; // we only need to set the timer now if one isn't already running


    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  };
}
function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  // we need to save these in the closure
  var timeout;
  var args;
  var context;
  var timestamp;
  return function _callback() {
    // save details of latest call
    context = this;
    args = [].slice.call(arguments, 0);
    timestamp = new Date(); // this is where the magic happens

    var later = function later() {
      // how long ago was the last call
      var last = new Date() - timestamp; // if the latest call was less that the wait period ago
      // then we reset the timeout to wait for the difference

      if (last < wait) {
        timeout = setTimeout(later, wait - last); // or if not we can null out the timer and run the latest
      } else {
        timeout = null;
        func.apply(context, args);
      }
    }; // we only need to set the timer now if one isn't already running


    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  };
} // https://remysharp.com/2010/07/21/throttling-function-calls

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last;
  var deferTimer;
  return function _callback() {
    var context = scope || this;
    var now = +new Date();
    var args = arguments;

    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

/***/ }),

/***/ "./src/utils/hashCode.js":
/*!*******************************!*\
  !*** ./src/utils/hashCode.js ***!
  \*******************************/
/*! exports provided: hashCode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hashCode", function() { return hashCode; });
function hashCode(str) {
  var hash = 0;
  var i;
  var chr;
  if (str.length === 0) return hash;

  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

/***/ }),

/***/ "./src/utils/timeConverter.js":
/*!************************************!*\
  !*** ./src/utils/timeConverter.js ***!
  \************************************/
/*! exports provided: zeroPad, s2time, time2s, duration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zeroPad", function() { return zeroPad; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s2time", function() { return s2time; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "time2s", function() { return time2s; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "duration", function() { return duration; });
/**
 * ##zeroPad
 * Zero pad a number and return the zero padded string.
 * @param {Integer} num number that should be padded
 * @param {Integer} size number of digits
 * @return {String}
 */
function zeroPad(num, size) {
  var s = "000000000".concat(num);
  return s.substr(s.length - size);
}
/**
 * Convert milliseconds to hours minutes seconds and milliseconds.
 * @param  {float} sms seconds float
 * @return {Object} `{h, m, s, ms}`
 */

function s2time(sms) {
  var h;
  var m;
  var s; // s = Math.floor(ms / 1000);

  s = Math.floor(sms);
  var ms = sms % 1;
  m = Math.floor(s / 60);
  s %= 60;
  h = Math.floor(m / 60);
  m %= 60;
  var d = Math.floor(h / 24);
  h %= 24;
  return {
    d: d,
    h: h,
    m: m,
    s: zeroPad(s, 2),
    ms: ms
  };
}
/**
 * Convert hours, minutes, seconds to seconds.
 * @return {integer} seconds
 */

function time2s(duration) {
  duration.s = parseInt(duration.s, 10);
  var t = Object.assign({
    h: 0,
    m: 0,
    s: 0
  }, duration);
  return (t.h * 60 + t.m) * 60 + t.s;
}
function duration(durationString) {
  if (!durationString) return {};
  var durationMatch = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  return {
    h: parseInt(durationMatch[1], 10) || 0,
    m: parseInt(durationMatch[2], 10) || 0,
    s: zeroPad(parseInt(durationMatch[3], 10) || 0, 2)
  };
}

/***/ }),

/***/ "./src/utils/vimeo.js":
/*!****************************!*\
  !*** ./src/utils/vimeo.js ***!
  \****************************/
/*! exports provided: getVimeoInfo, findVimeoIdsText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVimeoInfo", function() { return getVimeoInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findVimeoIdsText", function() { return findVimeoIdsText; });
/* harmony import */ var _ajax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajax */ "./src/utils/ajax.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./timeConverter */ "./src/utils/timeConverter.js");

 // https://github.com/regexhq/vimeo-regex/blob/master/index.js

var isVimeoVideoRegEx = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/g;
function getVimeoInfo(ids) {
  return Promise.all(ids.map(function (id) {
    return Object(_ajax__WEBPACK_IMPORTED_MODULE_0__["ajaxJSON"])("https://vimeo.com/api/v2/video/".concat(id, ".json")).then(function (info) {
      return {
        title: info[0].title,
        duration: Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["s2time"])(info[0].duration),
        durationS: info[0].duration,
        id: id,
        vimeoId: id,
        type: 'vimeo',
        href: info[0].url,
        thumbUrl: info[0].thumbnail_small
      };
    });
  }));
}
function findVimeoIdsText(text) {
  var ids = [];
  var match;

  while (match = isVimeoVideoRegEx.exec(text)) {
    ids.push(match[4]);
  }

  return ids;
}

/***/ }),

/***/ "./src/utils/webScraper.extension.js":
/*!*******************************************!*\
  !*** ./src/utils/webScraper.extension.js ***!
  \*******************************************/
/*! exports provided: webScraper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "webScraper", function() { return webScraper; });
/* harmony import */ var _hashCode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hashCode */ "./src/utils/hashCode.js");
/* harmony import */ var _youtube__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./youtube */ "./src/utils/youtube.js");
/* harmony import */ var _vimeo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vimeo */ "./src/utils/vimeo.js");
/* harmony import */ var _webScraper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./webScraper */ "./src/utils/webScraper.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






var MediaConverter =
/*#__PURE__*/
function () {
  function MediaConverter(localUrl, remoteUrl) {
    _classCallCheck(this, MediaConverter);

    this.localUrl = localUrl;
    this.remoteUrl = remoteUrl;
  }

  _createClass(MediaConverter, [{
    key: "getMediaData",
    value: function getMediaData(type, _url, _title) {
      var url = this.localUrl ? _url.replace(this.localUrl, this.remoteUrl) : _url;

      var title = _title || url.substring(url.lastIndexOf('/') + 1, url.length);

      return {
        type: type,
        title: title,
        href: this.remoteUrl,
        url: url,
        id: "".concat(Object(_hashCode__WEBPACK_IMPORTED_MODULE_0__["hashCode"])(url))
      };
    }
  }]);

  return MediaConverter;
}();

var audioRegEx = /(http|https)?:\/\/\S+\.(mp3|oga|m4a|flac|wav|aiff|aif|wma|asf|opus)$/gi;
var videoRegEx = /(http|https)?:\/\/\S+\.(avi|mkv|mp4|webm|ogg)$/gi;

function findMediaText(mc, text, innerHTML) {
  var res = [];
  if (videoRegEx.test(text)) res.push(mc.getMediaData('video', text, innerHTML));else if (audioRegEx.test(text)) res.push(mc.getMediaData('audio', text, innerHTML));
  return res.concat(_toConsumableArray(Object(_youtube__WEBPACK_IMPORTED_MODULE_1__["findYouTubeIdsText"])(text).map(function (id) {
    return {
      type: 'youtube',
      id: id
    };
  })), _toConsumableArray(Object(_vimeo__WEBPACK_IMPORTED_MODULE_2__["findVimeoIdsText"])(text).map(function (id) {
    return {
      type: 'vimeo',
      id: id
    };
  })));
}

var webScraper = Object.assign({}, _webScraper__WEBPACK_IMPORTED_MODULE_3__["webScraper"], {
  findMediaInElement: function findMediaInElement(node, localUrl, remoteUrl) {
    var mc = new MediaConverter(localUrl, remoteUrl); // Get all iframes with possible yt or vimeo embed.

    var iframes = node.querySelectorAll('iframe');
    var ytEmbedRegEx = /youtube\.com\/(v|embed)\/([^"?]+)/;
    var vimeoEmbedRegEx = /vimeo.com\/video\/([^"?]+)/; // Check all `<audiu>`, `<video>`, `<source>`, `<a>` elements for media.

    return _toConsumableArray(_toConsumableArray(node.querySelectorAll('[href]')).reduce(function (acc, _node) {
      return _toConsumableArray(acc).concat(_toConsumableArray(findMediaText(mc, _node.href, node.innerHTML)));
    }, [])).concat(_toConsumableArray(_toConsumableArray(node.querySelectorAll('[src]')).reduce(function (acc, _node) {
      return _toConsumableArray(acc).concat(_toConsumableArray(findMediaText(mc, _node.src)));
    }, [])), _toConsumableArray(_toConsumableArray(iframes).reduce(function (acc, _node) {
      var match = ytEmbedRegEx.exec(_node.src);
      if (match) acc.push({
        type: 'youtube',
        id: match[2]
      });
      return acc;
    }, [])), _toConsumableArray(_toConsumableArray(iframes).reduce(function (acc, _node) {
      var match = vimeoEmbedRegEx.exec(_node.src);
      if (match) acc.push({
        type: 'vimeo',
        id: match[1]
      });
      return acc;
    }, [])));
  },
  findMediaHtml: function findMediaHtml(html, localUrl, remoteUrl) {
    var node = document.createElement('div');
    node.innerHTML = html;
    var mediaList = this.findMediaInElement(node, localUrl, remoteUrl);
    node.remove();
    return mediaList;
  },
  scanOneUrl: function scanOneUrl(_ref) {
    var _this = this;

    var url = _ref.url;
    console.log('scanOneUrl url', url); // FIXME this breaks for root URLs without a trailing `/`` !!

    return this.ajaxRaw(url).then(function (rawHTML) {
      return _this.findMediaHtml(rawHTML, "".concat(window.location.origin, "/"), url.substring(0, url.lastIndexOf('/') + 1));
    });
  },

  /**
   * scanUrl - from a URL or URL pattern return a list of
   * promises that each return a list of media objects that could be
   * found at the URL or list of URLS
   * @param {Mixed} options.inUrls Array of URLs or URL or URL pattern e.g. `http://example.com/page/[1-5]`
   * @param {String} options.youtubeApiKey key for youtube API
   * @return {[Promise]} list of promises that each return media a object list
   */
  scanUrl: function scanUrl(_ref2) {
    var _this2 = this;

    var url = _ref2.url;
    console.log('scanUrl url', url);

    try {
      var urls = Array.isArray(url) ? url : this.patternToUrls(url);
      return urls.map(function (_url) {
        return _this2.scanOneUrl({
          url: _url
        });
      });
    } catch (error) {
      return [];
    }
  }
});

/***/ }),

/***/ "./src/utils/webScraper.js":
/*!*********************************!*\
  !*** ./src/utils/webScraper.js ***!
  \*********************************/
/*! exports provided: webScraper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "webScraper", function() { return webScraper; });
/* harmony import */ var _hashCode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hashCode */ "./src/utils/hashCode.js");
/* harmony import */ var _ajax__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ajax */ "./src/utils/ajax.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var range = function range(start, end) {
  return Array(end - start + 1).fill().map(function (_, idx) {
    return start + idx;
  });
};

var globbingRegEx = /\[(\d+)-(\d+)\]/;
var webScraper = {
  baseURL: 'https://api.imgur.com/3/gallery/hot/viral/',
  requestHeader: ['Authorization', 'Client-ID c35fbc04fe9ccda'],
  ajaxJSON: _ajax__WEBPACK_IMPORTED_MODULE_1__["ajaxJSON"],
  ajaxRaw: _ajax__WEBPACK_IMPORTED_MODULE_1__["ajaxRaw"],
  getImgurMedia: function getImgurMedia(currentPageIndex) {
    return Object(_ajax__WEBPACK_IMPORTED_MODULE_1__["ajaxRaw"])("".concat(this.baseURL).concat(currentPageIndex, ".json"), this.requestHeader).then(function (res) {
      return JSON.parse(res).data.filter(function (item) {
        return item.mp4;
      }).map(function (item) {
        return {
          id: "".concat(Object(_hashCode__WEBPACK_IMPORTED_MODULE_0__["hashCode"])(item.mp4)),
          href: item.link,
          url: item.mp4,
          type: 'video',
          title: item.title,
          thumbUrl: "//i.imgur.com/".concat(item.id, "s.jpg")
        };
      });
    });
  },
  patternToUrls: function patternToUrls(url) {
    if (!globbingRegEx.test(url)) return [url];

    var _globbingRegEx$exec = globbingRegEx.exec(url),
        _globbingRegEx$exec2 = _slicedToArray(_globbingRegEx$exec, 3),
        fullMatch = _globbingRegEx$exec2[0],
        start = _globbingRegEx$exec2[1],
        end = _globbingRegEx$exec2[2];

    return range(parseInt(start, 10), parseInt(end, 10)).map(function (index) {
      return url.replace(fullMatch, index);
    });
  }
};

/***/ }),

/***/ "./src/utils/youtube.js":
/*!******************************!*\
  !*** ./src/utils/youtube.js ***!
  \******************************/
/*! exports provided: isYouTubeVideoRegEx, youTubePlaylistRexEx, parseYoutubeDescription, findYouTubeIdsText, getYtContentDetailURL, getPlayList, searchYoutube, getYouTubeInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isYouTubeVideoRegEx", function() { return isYouTubeVideoRegEx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "youTubePlaylistRexEx", function() { return youTubePlaylistRexEx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseYoutubeDescription", function() { return parseYoutubeDescription; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findYouTubeIdsText", function() { return findYouTubeIdsText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getYtContentDetailURL", function() { return getYtContentDetailURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPlayList", function() { return getPlayList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "searchYoutube", function() { return searchYoutube; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getYouTubeInfo", function() { return getYouTubeInfo; });
/* harmony import */ var _ajax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajax */ "./src/utils/ajax.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./timeConverter */ "./src/utils/timeConverter.js");
/* harmony import */ var _vuex_audius_mediaBaseObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../vuex/audius/mediaBaseObject */ "./src/vuex/audius/mediaBaseObject.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var isYouTubeVideoRegEx = /.*youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?/;
var youTubePlaylistRexEx = /.*youtu(?:be\.com\/|\.be\/).*list=([\w\-_]*)/;
var youtubeExtract1g = /youtu.be\/([\w-]+)/g;
var youtubeExtract2g = /youtube.com\/watch\?.*v=([\w-]+)/g;
var timeRegex = /((\d+):)?(\d+):(\d{1,2})/;
var trimFRegex = /^[-\W\d]*/;
var trimBRegex = /[-\W\d]*$/;
/* eslint-disable no-param-reassign */

function parseYoutubeDescription(v) {
  var snippet = v.snippet || {};
  var description = snippet.description || '';
  var durationYt = v.contentDetails ? v.contentDetails.duration : undefined;
  var id = v.id;
  var descriptionLines = description.split('\n');
  return descriptionLines.filter(function (line) {
    return timeRegex.test(line);
  }) // only lines with time information
  .map(function (line, idx) {
    // Get the time parts
    var _timeRegex$exec = timeRegex.exec(line),
        _timeRegex$exec2 = _slicedToArray(_timeRegex$exec, 5),
        ht = _timeRegex$exec2[2],
        mt = _timeRegex$exec2[3],
        st = _timeRegex$exec2[4];

    var h = ht ? parseInt(ht, 10) : 0;
    var m = parseInt(mt, 10);
    var s = parseInt(st, 10); // Clean up the title from spaces minus and time

    var title = "".concat(line.replace(trimFRegex, '').replace(trimBRegex, ''), " - ").concat(snippet.title);
    return Object.assign({}, _vuex_audius_mediaBaseObject__WEBPACK_IMPORTED_MODULE_2__["mediaBaseObject"], {
      id: "".concat(id, "-track").concat(idx + 1),
      start: h * 3600 + m * 60 + s,
      title: title,
      fullTitle: line,
      durationAlbum: Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["time2s"])(Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["duration"])(durationYt)),
      type: 'youtube',
      isTrack: true,
      trackId: idx + 1,
      youtubeId: id
    });
  }).map(function (song, idx, thisArray) {
    // Add end times of each song from start of song after and end time of the media
    if (idx === thisArray.length - 1) song.stop = Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["time2s"])(Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["duration"])(durationYt));else song.stop = thisArray[idx + 1].start;
    return song;
  }).map(function (song) {
    // Calculate duration of each song.
    song.durationS = song.stop - song.start;
    song.duration = Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["s2time"])(song.durationS);
    return song;
  });
}

function normalizeYouTubeData(videoData) {
  var snippet = videoData.snippet || {};
  var tracks = parseYoutubeDescription(videoData);
  var durationYt = videoData.contentDetails ? videoData.contentDetails.duration : undefined;
  return Object.assign({}, _vuex_audius_mediaBaseObject__WEBPACK_IMPORTED_MODULE_2__["mediaBaseObject"], {
    title: snippet.title,
    duration: Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["duration"])(durationYt),
    durationS: Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["time2s"])(Object(_timeConverter__WEBPACK_IMPORTED_MODULE_1__["duration"])(durationYt)),
    id: videoData.id,
    youtubeId: videoData.id,
    type: 'youtube',
    tracks: tracks.length ? tracks : undefined
  });
}

function findYouTubeIdsText(text) {
  var hits = [];
  var matches;

  while (matches = youtubeExtract1g.exec(text)) {
    hits.push(decodeURIComponent(matches[1]));
  }

  while (matches = youtubeExtract2g.exec(text)) {
    hits.push(decodeURIComponent(matches[1]));
  }

  return hits;
}
function getYtContentDetailURL(YOUTUBE_API_KEY, ids, withSnippet) {
  return "https://www.googleapis.com/youtube/v3/videos?part=contentDetails".concat(withSnippet ? ',snippet' : '', "&id=").concat(ids, "&key=").concat(YOUTUBE_API_KEY);
}
function getPlayList(YOUTUBE_API_KEY, playListUrl) {
  var playListId = youTubePlaylistRexEx.exec(playListUrl)[1];
  var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&type=video&maxResults=50&playlistId=".concat(playListId, "&key=").concat(YOUTUBE_API_KEY);
  var searchData;
  return Object(_ajax__WEBPACK_IMPORTED_MODULE_0__["ajaxJSON"])(url).then(function (sd) {
    searchData = sd;
    return Object(_ajax__WEBPACK_IMPORTED_MODULE_0__["ajaxJSON"])(getYtContentDetailURL(YOUTUBE_API_KEY, searchData.items.map(function (item) {
      return item.contentDetails.videoId;
    }).join(','), true));
  }).then(function (data) {
    return searchData.items.map(function (item, idx) {
      return normalizeYouTubeData(Object.assign({}, item, data.items[idx]));
    });
  });
}
function searchYoutube(YOUTUBE_API_KEY, query) {
  if (isYouTubeVideoRegEx.test(query)) {
    return Object(_ajax__WEBPACK_IMPORTED_MODULE_0__["ajaxJSON"])(getYtContentDetailURL(YOUTUBE_API_KEY, isYouTubeVideoRegEx.exec(query)[1], true)).then(function (data) {
      return data.items.map(function (v) {
        return normalizeYouTubeData(v);
      });
    });
  }

  var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=".concat(query, "&key=").concat(YOUTUBE_API_KEY);
  var searchData;
  return Object(_ajax__WEBPACK_IMPORTED_MODULE_0__["ajaxJSON"])(url).then(function (sd) {
    searchData = sd;
    return Object(_ajax__WEBPACK_IMPORTED_MODULE_0__["ajaxJSON"])(getYtContentDetailURL(YOUTUBE_API_KEY, searchData.items.map(function (item) {
      return item.id.videoId;
    }).join(','), true));
  }).then(function (data) {
    return searchData.items.map(function (item, idx) {
      return normalizeYouTubeData(Object.assign({}, item, data.items[idx]));
    });
  });
}
function getYouTubeInfo(_ref) {
  var ids = _ref.ids,
      youtubeApiKey = _ref.youtubeApiKey;
  var url = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=".concat(ids.join(','), "&key=").concat(youtubeApiKey);
  return Object(_ajax__WEBPACK_IMPORTED_MODULE_0__["ajaxJSON"])(url).then(function (data) {
    return data.items.map(function (v) {
      return normalizeYouTubeData(v);
    });
  });
} // const youtubeRegEx = /(youtube.com)|(youtu.be)/;
// const youtubeExtract1 = /youtu.be\/([\w-]+)/;
// const youtubeExtract2 = /youtube.com\/watch\?v=([\w-]+)/;
// export function findYouTubeIdsHTML() {
// 	const YOUTUBE_API_KEY = store.getState().mediaPlayer.youtubeApiKey;
// 	const youtubeUrls = Array
// 		.from(document.querySelectorAll('a'))
// 		.map(el => el.href.match(youtubeRegEx) ? el.href : null)
// 		.filter(link => link);
// 	Array.from(document.querySelectorAll('iframe')).forEach((iframe) => {
// 		const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
// 		youtubeUrls.concat(
// 			Array
// 				.from(innerDoc.querySelectorAll('a'))
// 				.map(el => el.href.match(youtubeRegEx) ? el.href : null)
// 				.filter(link => link)
// 		);
// 	});
// 	return [
// 		...youtubeUrls
// 			.map((link) => {
// 				const match = link.match(youtubeExtract1);
// 				return match ? match[1] : undefined;
// 			}),
// 		...youtubeUrls
// 			.map((link) => {
// 				const match = link.match(youtubeExtract2);
// 				return match ? match[1] : undefined;
// 			}),
// 	];
// }

/***/ }),

/***/ "./src/vuex/audius/mediaBaseObject.js":
/*!********************************************!*\
  !*** ./src/vuex/audius/mediaBaseObject.js ***!
  \********************************************/
/*! exports provided: mediaBaseObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mediaBaseObject", function() { return mediaBaseObject; });
var mediaBaseObject = {
  title: '',
  duration: {},
  durationS: 0,
  id: '',
  type: '' // audio, youtube

};

/***/ })

/******/ });
//# sourceMappingURL=content.js.map