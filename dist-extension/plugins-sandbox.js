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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension/plugins-sandbox.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/extension/plugins-sandbox.js":
/*!******************************************!*\
  !*** ./src/extension/plugins-sandbox.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var logger = window.console.log;

/* eslint-disable no-eval */
var pluginSandbox = {
	parsers: {},
	youtubeApiKey: '',
	init: function init() {
		var _this = this;

		window.addEventListener('message', function (event) {
			logger('## sandbox event', event.data);
			if (!_this.messageSource) {
				logger('## sandbox handshake complete');
				_this.messageSource = event.source;
				_this.messageOrigin = event.origin;
			}
			if (event.data.type === 'loadScript') _this.loadScript(event.data);else if (event.data.type === 'getNext') _this.getNext(event.data.id);else if (event.data.id in _this.parsers && event.data.type in _this.parsers[event.data.id]) {
				var parseResult = void 0;
				try {
					parseResult = _this.parsers[event.data.id][event.data.type](event.data.data);
				} catch (error) {
					_this.message({
						audius: true,
						vuex: 'commit',
						type: 'error',
						data: 'Error parsing ' + event.data.id + '. ' + error
					});
				}
				if (['getYouTubeInfo', 'scanOneUrl', 'ajaxRaw', 'ajaxJSON'].includes(parseResult.type)) {
					_this.message(Object.assign(parseResult, { id: event.data.id, youtubeApiKey: _this.youtubeApiKey }));
				} else if (parseResult.type === 'mediaList') {
					_this.message({
						audius: true,
						vuex: 'dispatch',
						type: 'webScraperUpdateSuccess',
						data: {
							id: event.data.id,
							mediaList: parseResult.data
						}
					});
				} else if (parseResult.type === 'noop') {
					// Don't do anything, relax.
				} else {
					_this.message({
						audius: true,
						vuex: 'commit',
						type: 'error',
						data: 'Unknown plugin command ' + parseResult[0] + '.'
					});
				}
			}
		});
	},
	message: function message(data) {
		this.messageSource.postMessage(data, this.messageOrigin);
	},
	getNext: function getNext(id) {
		try {
			var result = this.parsers[id].getUrl();
			this.message(Object.assign(result, { id: id })); // parser calls getJSON
		} catch (error) {
			this.message({
				audius: true,
				vuex: 'commit',
				type: 'error',
				data: 'Error getting next page. ' + error
			});
		}
	},
	loadScript: function loadScript(options) {
		var id = options.id,
		    code = options.code,
		    youtubeApiKey = options.youtubeApiKey;

		if (this.parsers[id]) this.message({
			audius: true,
			vuex: 'commit',
			type: 'error',
			data: 'Script \'' + id + '\' is already loaded'
		});
		try {
			this.parsers[id] = eval(code);
			if (options.responseTemplate) this.message(options.responseTemplate);
			this.youtubeApiKey = youtubeApiKey;
			this.getNext(id);
		} catch (error) {
			this.message({
				audius: true,
				vuex: 'commit',
				type: 'error',
				data: 'Error loading script. ' + error
			});
		}
	}
};

logger('# Plugin sandbox');
pluginSandbox.init();

/***/ })

/******/ });
//# sourceMappingURL=plugins-sandbox.js.map