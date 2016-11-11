/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(1);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.config.devtools = true;
	
	// chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Vue.js v2.0.3
	 * (c) 2014-2016 Evan You
	 * Released under the MIT License.
	 */
	(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  (global.Vue = factory());
	}(this, (function () { 'use strict';
	
	/*  */
	
	/**
	 * Convert a value to a string that is actually rendered.
	 */
	function _toString (val) {
	  return val == null
	    ? ''
	    : typeof val === 'object'
	      ? JSON.stringify(val, null, 2)
	      : String(val)
	}
	
	/**
	 * Convert a input value to a number for persistence.
	 * If the conversion fails, return original string.
	 */
	function toNumber (val) {
	  var n = parseFloat(val, 10);
	  return (n || n === 0) ? n : val
	}
	
	/**
	 * Make a map and return a function for checking if a key
	 * is in that map.
	 */
	function makeMap (
	  str,
	  expectsLowerCase
	) {
	  var map = Object.create(null);
	  var list = str.split(',');
	  for (var i = 0; i < list.length; i++) {
	    map[list[i]] = true;
	  }
	  return expectsLowerCase
	    ? function (val) { return map[val.toLowerCase()]; }
	    : function (val) { return map[val]; }
	}
	
	/**
	 * Check if a tag is a built-in tag.
	 */
	var isBuiltInTag = makeMap('slot,component', true);
	
	/**
	 * Remove an item from an array
	 */
	function remove$1 (arr, item) {
	  if (arr.length) {
	    var index = arr.indexOf(item);
	    if (index > -1) {
	      return arr.splice(index, 1)
	    }
	  }
	}
	
	/**
	 * Check whether the object has the property.
	 */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn (obj, key) {
	  return hasOwnProperty.call(obj, key)
	}
	
	/**
	 * Check if value is primitive
	 */
	function isPrimitive (value) {
	  return typeof value === 'string' || typeof value === 'number'
	}
	
	/**
	 * Create a cached version of a pure function.
	 */
	function cached (fn) {
	  var cache = Object.create(null);
	  return function cachedFn (str) {
	    var hit = cache[str];
	    return hit || (cache[str] = fn(str))
	  }
	}
	
	/**
	 * Camelize a hyphen-delmited string.
	 */
	var camelizeRE = /-(\w)/g;
	var camelize = cached(function (str) {
	  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
	});
	
	/**
	 * Capitalize a string.
	 */
	var capitalize = cached(function (str) {
	  return str.charAt(0).toUpperCase() + str.slice(1)
	});
	
	/**
	 * Hyphenate a camelCase string.
	 */
	var hyphenateRE = /([^-])([A-Z])/g;
	var hyphenate = cached(function (str) {
	  return str
	    .replace(hyphenateRE, '$1-$2')
	    .replace(hyphenateRE, '$1-$2')
	    .toLowerCase()
	});
	
	/**
	 * Simple bind, faster than native
	 */
	function bind$1 (fn, ctx) {
	  function boundFn (a) {
	    var l = arguments.length;
	    return l
	      ? l > 1
	        ? fn.apply(ctx, arguments)
	        : fn.call(ctx, a)
	      : fn.call(ctx)
	  }
	  // record original fn length
	  boundFn._length = fn.length;
	  return boundFn
	}
	
	/**
	 * Convert an Array-like object to a real Array.
	 */
	function toArray (list, start) {
	  start = start || 0;
	  var i = list.length - start;
	  var ret = new Array(i);
	  while (i--) {
	    ret[i] = list[i + start];
	  }
	  return ret
	}
	
	/**
	 * Mix properties into target object.
	 */
	function extend (to, _from) {
	  for (var key in _from) {
	    to[key] = _from[key];
	  }
	  return to
	}
	
	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 */
	function isObject (obj) {
	  return obj !== null && typeof obj === 'object'
	}
	
	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 */
	var toString = Object.prototype.toString;
	var OBJECT_STRING = '[object Object]';
	function isPlainObject (obj) {
	  return toString.call(obj) === OBJECT_STRING
	}
	
	/**
	 * Merge an Array of Objects into a single Object.
	 */
	function toObject (arr) {
	  var res = {};
	  for (var i = 0; i < arr.length; i++) {
	    if (arr[i]) {
	      extend(res, arr[i]);
	    }
	  }
	  return res
	}
	
	/**
	 * Perform no operation.
	 */
	function noop () {}
	
	/**
	 * Always return false.
	 */
	var no = function () { return false; };
	
	/**
	 * Generate a static keys string from compiler modules.
	 */
	function genStaticKeys (modules) {
	  return modules.reduce(function (keys, m) {
	    return keys.concat(m.staticKeys || [])
	  }, []).join(',')
	}
	
	/**
	 * Check if two values are loosely equal - that is,
	 * if they are plain objects, do they have the same shape?
	 */
	function looseEqual (a, b) {
	  /* eslint-disable eqeqeq */
	  return a == b || (
	    isObject(a) && isObject(b)
	      ? JSON.stringify(a) === JSON.stringify(b)
	      : false
	  )
	  /* eslint-enable eqeqeq */
	}
	
	function looseIndexOf (arr, val) {
	  for (var i = 0; i < arr.length; i++) {
	    if (looseEqual(arr[i], val)) { return i }
	  }
	  return -1
	}
	
	/*  */
	
	var config = {
	  /**
	   * Option merge strategies (used in core/util/options)
	   */
	  optionMergeStrategies: Object.create(null),
	
	  /**
	   * Whether to suppress warnings.
	   */
	  silent: false,
	
	  /**
	   * Whether to enable devtools
	   */
	  devtools: "development" !== 'production',
	
	  /**
	   * Error handler for watcher errors
	   */
	  errorHandler: null,
	
	  /**
	   * Ignore certain custom elements
	   */
	  ignoredElements: null,
	
	  /**
	   * Custom user key aliases for v-on
	   */
	  keyCodes: Object.create(null),
	
	  /**
	   * Check if a tag is reserved so that it cannot be registered as a
	   * component. This is platform-dependent and may be overwritten.
	   */
	  isReservedTag: no,
	
	  /**
	   * Check if a tag is an unknown element.
	   * Platform-dependent.
	   */
	  isUnknownElement: no,
	
	  /**
	   * Get the namespace of an element
	   */
	  getTagNamespace: noop,
	
	  /**
	   * Check if an attribute must be bound using property, e.g. value
	   * Platform-dependent.
	   */
	  mustUseProp: no,
	
	  /**
	   * List of asset types that a component can own.
	   */
	  _assetTypes: [
	    'component',
	    'directive',
	    'filter'
	  ],
	
	  /**
	   * List of lifecycle hooks.
	   */
	  _lifecycleHooks: [
	    'beforeCreate',
	    'created',
	    'beforeMount',
	    'mounted',
	    'beforeUpdate',
	    'updated',
	    'beforeDestroy',
	    'destroyed',
	    'activated',
	    'deactivated'
	  ],
	
	  /**
	   * Max circular updates allowed in a scheduler flush cycle.
	   */
	  _maxUpdateCount: 100,
	
	  /**
	   * Server rendering?
	   */
	  _isServer: "client" === 'server'
	};
	
	/*  */
	
	/**
	 * Check if a string starts with $ or _
	 */
	function isReserved (str) {
	  var c = (str + '').charCodeAt(0);
	  return c === 0x24 || c === 0x5F
	}
	
	/**
	 * Define a property.
	 */
	function def (obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: !!enumerable,
	    writable: true,
	    configurable: true
	  });
	}
	
	/**
	 * Parse simple path.
	 */
	var bailRE = /[^\w\.\$]/;
	function parsePath (path) {
	  if (bailRE.test(path)) {
	    return
	  } else {
	    var segments = path.split('.');
	    return function (obj) {
	      for (var i = 0; i < segments.length; i++) {
	        if (!obj) { return }
	        obj = obj[segments[i]];
	      }
	      return obj
	    }
	  }
	}
	
	/*  */
	/* globals MutationObserver */
	
	// can we use __proto__?
	var hasProto = '__proto__' in {};
	
	// Browser environment sniffing
	var inBrowser =
	  typeof window !== 'undefined' &&
	  Object.prototype.toString.call(window) !== '[object Object]';
	
	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE = UA && /msie|trident/.test(UA);
	var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isEdge = UA && UA.indexOf('edge/') > 0;
	var isAndroid = UA && UA.indexOf('android') > 0;
	var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
	
	// detect devtools
	var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
	
	/* istanbul ignore next */
	function isNative (Ctor) {
	  return /native code/.test(Ctor.toString())
	}
	
	/**
	 * Defer a task to execute it asynchronously.
	 */
	var nextTick = (function () {
	  var callbacks = [];
	  var pending = false;
	  var timerFunc;
	
	  function nextTickHandler () {
	    pending = false;
	    var copies = callbacks.slice(0);
	    callbacks.length = 0;
	    for (var i = 0; i < copies.length; i++) {
	      copies[i]();
	    }
	  }
	
	  // the nextTick behavior leverages the microtask queue, which can be accessed
	  // via either native Promise.then or MutationObserver.
	  // MutationObserver has wider support, however it is seriously bugged in
	  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
	  // completely stops working after triggering a few times... so, if native
	  // Promise is available, we will use it:
	  /* istanbul ignore if */
	  if (typeof Promise !== 'undefined' && isNative(Promise)) {
	    var p = Promise.resolve();
	    timerFunc = function () {
	      p.then(nextTickHandler);
	      // in problematic UIWebViews, Promise.then doesn't completely break, but
	      // it can get stuck in a weird state where callbacks are pushed into the
	      // microtask queue but the queue isn't being flushed, until the browser
	      // needs to do some other work, e.g. handle a timer. Therefore we can
	      // "force" the microtask queue to be flushed by adding an empty timer.
	      if (isIOS) { setTimeout(noop); }
	    };
	  } else if (typeof MutationObserver !== 'undefined' && (
	    isNative(MutationObserver) ||
	    // PhantomJS and iOS 7.x
	    MutationObserver.toString() === '[object MutationObserverConstructor]'
	  )) {
	    // use MutationObserver where native Promise is not available,
	    // e.g. PhantomJS IE11, iOS7, Android 4.4
	    var counter = 1;
	    var observer = new MutationObserver(nextTickHandler);
	    var textNode = document.createTextNode(String(counter));
	    observer.observe(textNode, {
	      characterData: true
	    });
	    timerFunc = function () {
	      counter = (counter + 1) % 2;
	      textNode.data = String(counter);
	    };
	  } else {
	    // fallback to setTimeout
	    /* istanbul ignore next */
	    timerFunc = function () {
	      setTimeout(nextTickHandler, 0);
	    };
	  }
	
	  return function queueNextTick (cb, ctx) {
	    var func = ctx
	      ? function () { cb.call(ctx); }
	      : cb;
	    callbacks.push(func);
	    if (!pending) {
	      pending = true;
	      timerFunc();
	    }
	  }
	})();
	
	var _Set;
	/* istanbul ignore if */
	if (typeof Set !== 'undefined' && isNative(Set)) {
	  // use native Set when available.
	  _Set = Set;
	} else {
	  // a non-standard Set polyfill that only works with primitive keys.
	  _Set = (function () {
	    function Set () {
	      this.set = Object.create(null);
	    }
	    Set.prototype.has = function has (key) {
	      return this.set[key] !== undefined
	    };
	    Set.prototype.add = function add (key) {
	      this.set[key] = 1;
	    };
	    Set.prototype.clear = function clear () {
	      this.set = Object.create(null);
	    };
	
	    return Set;
	  }());
	}
	
	/* not type checking this file because flow doesn't play well with Proxy */
	
	var hasProxy;
	var proxyHandlers;
	var initProxy;
	
	{
	  var allowedGlobals = makeMap(
	    'Infinity,undefined,NaN,isFinite,isNaN,' +
	    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
	    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
	    'require' // for Webpack/Browserify
	  );
	
	  hasProxy =
	    typeof Proxy !== 'undefined' &&
	    Proxy.toString().match(/native code/);
	
	  proxyHandlers = {
	    has: function has (target, key) {
	      var has = key in target;
	      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
	      if (!has && !isAllowed) {
	        warn(
	          "Property or method \"" + key + "\" is not defined on the instance but " +
	          "referenced during render. Make sure to declare reactive data " +
	          "properties in the data option.",
	          target
	        );
	      }
	      return has || !isAllowed
	    }
	  };
	
	  initProxy = function initProxy (vm) {
	    if (hasProxy) {
	      vm._renderProxy = new Proxy(vm, proxyHandlers);
	    } else {
	      vm._renderProxy = vm;
	    }
	  };
	}
	
	/*  */
	
	
	var uid$2 = 0;
	
	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 */
	var Dep = function Dep () {
	  this.id = uid$2++;
	  this.subs = [];
	};
	
	Dep.prototype.addSub = function addSub (sub) {
	  this.subs.push(sub);
	};
	
	Dep.prototype.removeSub = function removeSub (sub) {
	  remove$1(this.subs, sub);
	};
	
	Dep.prototype.depend = function depend () {
	  if (Dep.target) {
	    Dep.target.addDep(this);
	  }
	};
	
	Dep.prototype.notify = function notify () {
	  // stablize the subscriber list first
	  var subs = this.subs.slice();
	  for (var i = 0, l = subs.length; i < l; i++) {
	    subs[i].update();
	  }
	};
	
	// the current target watcher being evaluated.
	// this is globally unique because there could be only one
	// watcher being evaluated at any time.
	Dep.target = null;
	var targetStack = [];
	
	function pushTarget (_target) {
	  if (Dep.target) { targetStack.push(Dep.target); }
	  Dep.target = _target;
	}
	
	function popTarget () {
	  Dep.target = targetStack.pop();
	}
	
	/*  */
	
	
	var queue = [];
	var has$1 = {};
	var circular = {};
	var waiting = false;
	var flushing = false;
	var index = 0;
	
	/**
	 * Reset the scheduler's state.
	 */
	function resetSchedulerState () {
	  queue.length = 0;
	  has$1 = {};
	  {
	    circular = {};
	  }
	  waiting = flushing = false;
	}
	
	/**
	 * Flush both queues and run the watchers.
	 */
	function flushSchedulerQueue () {
	  flushing = true;
	
	  // Sort queue before flush.
	  // This ensures that:
	  // 1. Components are updated from parent to child. (because parent is always
	  //    created before the child)
	  // 2. A component's user watchers are run before its render watcher (because
	  //    user watchers are created before the render watcher)
	  // 3. If a component is destroyed during a parent component's watcher run,
	  //    its watchers can be skipped.
	  queue.sort(function (a, b) { return a.id - b.id; });
	
	  // do not cache length because more watchers might be pushed
	  // as we run existing watchers
	  for (index = 0; index < queue.length; index++) {
	    var watcher = queue[index];
	    var id = watcher.id;
	    has$1[id] = null;
	    watcher.run();
	    // in dev build, check and stop circular updates.
	    if ("development" !== 'production' && has$1[id] != null) {
	      circular[id] = (circular[id] || 0) + 1;
	      if (circular[id] > config._maxUpdateCount) {
	        warn(
	          'You may have an infinite update loop ' + (
	            watcher.user
	              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
	              : "in a component render function."
	          ),
	          watcher.vm
	        );
	        break
	      }
	    }
	  }
	
	  // devtool hook
	  /* istanbul ignore if */
	  if (devtools && config.devtools) {
	    devtools.emit('flush');
	  }
	
	  resetSchedulerState();
	}
	
	/**
	 * Push a watcher into the watcher queue.
	 * Jobs with duplicate IDs will be skipped unless it's
	 * pushed when the queue is being flushed.
	 */
	function queueWatcher (watcher) {
	  var id = watcher.id;
	  if (has$1[id] == null) {
	    has$1[id] = true;
	    if (!flushing) {
	      queue.push(watcher);
	    } else {
	      // if already flushing, splice the watcher based on its id
	      // if already past its id, it will be run next immediately.
	      var i = queue.length - 1;
	      while (i >= 0 && queue[i].id > watcher.id) {
	        i--;
	      }
	      queue.splice(Math.max(i, index) + 1, 0, watcher);
	    }
	    // queue the flush
	    if (!waiting) {
	      waiting = true;
	      nextTick(flushSchedulerQueue);
	    }
	  }
	}
	
	/*  */
	
	var uid$1 = 0;
	
	/**
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 */
	var Watcher = function Watcher (
	  vm,
	  expOrFn,
	  cb,
	  options
	) {
	  if ( options === void 0 ) options = {};
	
	  this.vm = vm;
	  vm._watchers.push(this);
	  // options
	  this.deep = !!options.deep;
	  this.user = !!options.user;
	  this.lazy = !!options.lazy;
	  this.sync = !!options.sync;
	  this.expression = expOrFn.toString();
	  this.cb = cb;
	  this.id = ++uid$1; // uid for batching
	  this.active = true;
	  this.dirty = this.lazy; // for lazy watchers
	  this.deps = [];
	  this.newDeps = [];
	  this.depIds = new _Set();
	  this.newDepIds = new _Set();
	  // parse expression for getter
	  if (typeof expOrFn === 'function') {
	    this.getter = expOrFn;
	  } else {
	    this.getter = parsePath(expOrFn);
	    if (!this.getter) {
	      this.getter = function () {};
	      "development" !== 'production' && warn(
	        "Failed watching path: \"" + expOrFn + "\" " +
	        'Watcher only accepts simple dot-delimited paths. ' +
	        'For full control, use a function instead.',
	        vm
	      );
	    }
	  }
	  this.value = this.lazy
	    ? undefined
	    : this.get();
	};
	
	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */
	Watcher.prototype.get = function get () {
	  pushTarget(this);
	  var value = this.getter.call(this.vm, this.vm);
	  // "touch" every property so they are all tracked as
	  // dependencies for deep watching
	  if (this.deep) {
	    traverse(value);
	  }
	  popTarget();
	  this.cleanupDeps();
	  return value
	};
	
	/**
	 * Add a dependency to this directive.
	 */
	Watcher.prototype.addDep = function addDep (dep) {
	  var id = dep.id;
	  if (!this.newDepIds.has(id)) {
	    this.newDepIds.add(id);
	    this.newDeps.push(dep);
	    if (!this.depIds.has(id)) {
	      dep.addSub(this);
	    }
	  }
	};
	
	/**
	 * Clean up for dependency collection.
	 */
	Watcher.prototype.cleanupDeps = function cleanupDeps () {
	    var this$1 = this;
	
	  var i = this.deps.length;
	  while (i--) {
	    var dep = this$1.deps[i];
	    if (!this$1.newDepIds.has(dep.id)) {
	      dep.removeSub(this$1);
	    }
	  }
	  var tmp = this.depIds;
	  this.depIds = this.newDepIds;
	  this.newDepIds = tmp;
	  this.newDepIds.clear();
	  tmp = this.deps;
	  this.deps = this.newDeps;
	  this.newDeps = tmp;
	  this.newDeps.length = 0;
	};
	
	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 */
	Watcher.prototype.update = function update () {
	  /* istanbul ignore else */
	  if (this.lazy) {
	    this.dirty = true;
	  } else if (this.sync) {
	    this.run();
	  } else {
	    queueWatcher(this);
	  }
	};
	
	/**
	 * Scheduler job interface.
	 * Will be called by the scheduler.
	 */
	Watcher.prototype.run = function run () {
	  if (this.active) {
	    var value = this.get();
	      if (
	        value !== this.value ||
	      // Deep watchers and watchers on Object/Arrays should fire even
	      // when the value is the same, because the value may
	      // have mutated.
	      isObject(value) ||
	      this.deep
	    ) {
	      // set new value
	      var oldValue = this.value;
	      this.value = value;
	      if (this.user) {
	        try {
	          this.cb.call(this.vm, value, oldValue);
	        } catch (e) {
	          "development" !== 'production' && warn(
	            ("Error in watcher \"" + (this.expression) + "\""),
	            this.vm
	          );
	          /* istanbul ignore else */
	          if (config.errorHandler) {
	            config.errorHandler.call(null, e, this.vm);
	          } else {
	            throw e
	          }
	        }
	      } else {
	        this.cb.call(this.vm, value, oldValue);
	      }
	    }
	  }
	};
	
	/**
	 * Evaluate the value of the watcher.
	 * This only gets called for lazy watchers.
	 */
	Watcher.prototype.evaluate = function evaluate () {
	  this.value = this.get();
	  this.dirty = false;
	};
	
	/**
	 * Depend on all deps collected by this watcher.
	 */
	Watcher.prototype.depend = function depend () {
	    var this$1 = this;
	
	  var i = this.deps.length;
	  while (i--) {
	    this$1.deps[i].depend();
	  }
	};
	
	/**
	 * Remove self from all dependencies' subcriber list.
	 */
	Watcher.prototype.teardown = function teardown () {
	    var this$1 = this;
	
	  if (this.active) {
	    // remove self from vm's watcher list
	    // this is a somewhat expensive operation so we skip it
	    // if the vm is being destroyed or is performing a v-for
	    // re-render (the watcher list is then filtered by v-for).
	    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
	      remove$1(this.vm._watchers, this);
	    }
	    var i = this.deps.length;
	    while (i--) {
	      this$1.deps[i].removeSub(this$1);
	    }
	    this.active = false;
	  }
	};
	
	/**
	 * Recursively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 */
	var seenObjects = new _Set();
	function traverse (val, seen) {
	  var i, keys;
	  if (!seen) {
	    seen = seenObjects;
	    seen.clear();
	  }
	  var isA = Array.isArray(val);
	  var isO = isObject(val);
	  if ((isA || isO) && Object.isExtensible(val)) {
	    if (val.__ob__) {
	      var depId = val.__ob__.dep.id;
	      if (seen.has(depId)) {
	        return
	      } else {
	        seen.add(depId);
	      }
	    }
	    if (isA) {
	      i = val.length;
	      while (i--) { traverse(val[i], seen); }
	    } else if (isO) {
	      keys = Object.keys(val);
	      i = keys.length;
	      while (i--) { traverse(val[keys[i]], seen); }
	    }
	  }
	}
	
	/*
	 * not type checking this file because flow doesn't play well with
	 * dynamically accessing methods on Array prototype
	 */
	
	var arrayProto = Array.prototype;
	var arrayMethods = Object.create(arrayProto);[
	  'push',
	  'pop',
	  'shift',
	  'unshift',
	  'splice',
	  'sort',
	  'reverse'
	]
	.forEach(function (method) {
	  // cache original method
	  var original = arrayProto[method];
	  def(arrayMethods, method, function mutator () {
	    var arguments$1 = arguments;
	
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length;
	    var args = new Array(i);
	    while (i--) {
	      args[i] = arguments$1[i];
	    }
	    var result = original.apply(this, args);
	    var ob = this.__ob__;
	    var inserted;
	    switch (method) {
	      case 'push':
	        inserted = args;
	        break
	      case 'unshift':
	        inserted = args;
	        break
	      case 'splice':
	        inserted = args.slice(2);
	        break
	    }
	    if (inserted) { ob.observeArray(inserted); }
	    // notify change
	    ob.dep.notify();
	    return result
	  });
	});
	
	/*  */
	
	var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
	
	/**
	 * By default, when a reactive property is set, the new value is
	 * also converted to become reactive. However when passing down props,
	 * we don't want to force conversion because the value may be a nested value
	 * under a frozen data structure. Converting it would defeat the optimization.
	 */
	var observerState = {
	  shouldConvert: true,
	  isSettingProps: false
	};
	
	/**
	 * Observer class that are attached to each observed
	 * object. Once attached, the observer converts target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatches updates.
	 */
	var Observer = function Observer (value) {
	  this.value = value;
	  this.dep = new Dep();
	  this.vmCount = 0;
	  def(value, '__ob__', this);
	  if (Array.isArray(value)) {
	    var augment = hasProto
	      ? protoAugment
	      : copyAugment;
	    augment(value, arrayMethods, arrayKeys);
	    this.observeArray(value);
	  } else {
	    this.walk(value);
	  }
	};
	
	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object.
	 */
	Observer.prototype.walk = function walk (obj) {
	  var keys = Object.keys(obj);
	  for (var i = 0; i < keys.length; i++) {
	    defineReactive$$1(obj, keys[i], obj[keys[i]]);
	  }
	};
	
	/**
	 * Observe a list of Array items.
	 */
	Observer.prototype.observeArray = function observeArray (items) {
	  for (var i = 0, l = items.length; i < l; i++) {
	    observe(items[i]);
	  }
	};
	
	// helpers
	
	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 */
	function protoAugment (target, src) {
	  /* eslint-disable no-proto */
	  target.__proto__ = src;
	  /* eslint-enable no-proto */
	}
	
	/**
	 * Augment an target Object or Array by defining
	 * hidden properties.
	 *
	 * istanbul ignore next
	 */
	function copyAugment (target, src, keys) {
	  for (var i = 0, l = keys.length; i < l; i++) {
	    var key = keys[i];
	    def(target, key, src[key]);
	  }
	}
	
	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 */
	function observe (value) {
	  if (!isObject(value)) {
	    return
	  }
	  var ob;
	  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
	    ob = value.__ob__;
	  } else if (
	    observerState.shouldConvert &&
	    !config._isServer &&
	    (Array.isArray(value) || isPlainObject(value)) &&
	    Object.isExtensible(value) &&
	    !value._isVue
	  ) {
	    ob = new Observer(value);
	  }
	  return ob
	}
	
	/**
	 * Define a reactive property on an Object.
	 */
	function defineReactive$$1 (
	  obj,
	  key,
	  val,
	  customSetter
	) {
	  var dep = new Dep();
	
	  var property = Object.getOwnPropertyDescriptor(obj, key);
	  if (property && property.configurable === false) {
	    return
	  }
	
	  // cater for pre-defined getter/setters
	  var getter = property && property.get;
	  var setter = property && property.set;
	
	  var childOb = observe(val);
	  Object.defineProperty(obj, key, {
	    enumerable: true,
	    configurable: true,
	    get: function reactiveGetter () {
	      var value = getter ? getter.call(obj) : val;
	      if (Dep.target) {
	        dep.depend();
	        if (childOb) {
	          childOb.dep.depend();
	        }
	        if (Array.isArray(value)) {
	          dependArray(value);
	        }
	      }
	      return value
	    },
	    set: function reactiveSetter (newVal) {
	      var value = getter ? getter.call(obj) : val;
	      if (newVal === value) {
	        return
	      }
	      if ("development" !== 'production' && customSetter) {
	        customSetter();
	      }
	      if (setter) {
	        setter.call(obj, newVal);
	      } else {
	        val = newVal;
	      }
	      childOb = observe(newVal);
	      dep.notify();
	    }
	  });
	}
	
	/**
	 * Set a property on an object. Adds the new property and
	 * triggers change notification if the property doesn't
	 * already exist.
	 */
	function set (obj, key, val) {
	  if (Array.isArray(obj)) {
	    obj.splice(key, 1, val);
	    return val
	  }
	  if (hasOwn(obj, key)) {
	    obj[key] = val;
	    return
	  }
	  var ob = obj.__ob__;
	  if (obj._isVue || (ob && ob.vmCount)) {
	    "development" !== 'production' && warn(
	      'Avoid adding reactive properties to a Vue instance or its root $data ' +
	      'at runtime - declare it upfront in the data option.'
	    );
	    return
	  }
	  if (!ob) {
	    obj[key] = val;
	    return
	  }
	  defineReactive$$1(ob.value, key, val);
	  ob.dep.notify();
	  return val
	}
	
	/**
	 * Delete a property and trigger change if necessary.
	 */
	function del (obj, key) {
	  var ob = obj.__ob__;
	  if (obj._isVue || (ob && ob.vmCount)) {
	    "development" !== 'production' && warn(
	      'Avoid deleting properties on a Vue instance or its root $data ' +
	      '- just set it to null.'
	    );
	    return
	  }
	  if (!hasOwn(obj, key)) {
	    return
	  }
	  delete obj[key];
	  if (!ob) {
	    return
	  }
	  ob.dep.notify();
	}
	
	/**
	 * Collect dependencies on array elements when the array is touched, since
	 * we cannot intercept array element access like property getters.
	 */
	function dependArray (value) {
	  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
	    e = value[i];
	    e && e.__ob__ && e.__ob__.dep.depend();
	    if (Array.isArray(e)) {
	      dependArray(e);
	    }
	  }
	}
	
	/*  */
	
	function initState (vm) {
	  vm._watchers = [];
	  initProps(vm);
	  initData(vm);
	  initComputed(vm);
	  initMethods(vm);
	  initWatch(vm);
	}
	
	function initProps (vm) {
	  var props = vm.$options.props;
	  if (props) {
	    var propsData = vm.$options.propsData || {};
	    var keys = vm.$options._propKeys = Object.keys(props);
	    var isRoot = !vm.$parent;
	    // root instance props should be converted
	    observerState.shouldConvert = isRoot;
	    var loop = function ( i ) {
	      var key = keys[i];
	      /* istanbul ignore else */
	      {
	        defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function () {
	          if (vm.$parent && !observerState.isSettingProps) {
	            warn(
	              "Avoid mutating a prop directly since the value will be " +
	              "overwritten whenever the parent component re-renders. " +
	              "Instead, use a data or computed property based on the prop's " +
	              "value. Prop being mutated: \"" + key + "\"",
	              vm
	            );
	          }
	        });
	      }
	    };
	
	    for (var i = 0; i < keys.length; i++) loop( i );
	    observerState.shouldConvert = true;
	  }
	}
	
	function initData (vm) {
	  var data = vm.$options.data;
	  data = vm._data = typeof data === 'function'
	    ? data.call(vm)
	    : data || {};
	  if (!isPlainObject(data)) {
	    data = {};
	    "development" !== 'production' && warn(
	      'data functions should return an object.',
	      vm
	    );
	  }
	  // proxy data on instance
	  var keys = Object.keys(data);
	  var props = vm.$options.props;
	  var i = keys.length;
	  while (i--) {
	    if (props && hasOwn(props, keys[i])) {
	      "development" !== 'production' && warn(
	        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
	        "Use prop default value instead.",
	        vm
	      );
	    } else {
	      proxy(vm, keys[i]);
	    }
	  }
	  // observe data
	  observe(data);
	  data.__ob__ && data.__ob__.vmCount++;
	}
	
	var computedSharedDefinition = {
	  enumerable: true,
	  configurable: true,
	  get: noop,
	  set: noop
	};
	
	function initComputed (vm) {
	  var computed = vm.$options.computed;
	  if (computed) {
	    for (var key in computed) {
	      var userDef = computed[key];
	      if (typeof userDef === 'function') {
	        computedSharedDefinition.get = makeComputedGetter(userDef, vm);
	        computedSharedDefinition.set = noop;
	      } else {
	        computedSharedDefinition.get = userDef.get
	          ? userDef.cache !== false
	            ? makeComputedGetter(userDef.get, vm)
	            : bind$1(userDef.get, vm)
	          : noop;
	        computedSharedDefinition.set = userDef.set
	          ? bind$1(userDef.set, vm)
	          : noop;
	      }
	      Object.defineProperty(vm, key, computedSharedDefinition);
	    }
	  }
	}
	
	function makeComputedGetter (getter, owner) {
	  var watcher = new Watcher(owner, getter, noop, {
	    lazy: true
	  });
	  return function computedGetter () {
	    if (watcher.dirty) {
	      watcher.evaluate();
	    }
	    if (Dep.target) {
	      watcher.depend();
	    }
	    return watcher.value
	  }
	}
	
	function initMethods (vm) {
	  var methods = vm.$options.methods;
	  if (methods) {
	    for (var key in methods) {
	      vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
	      if ("development" !== 'production' && methods[key] == null) {
	        warn(
	          "method \"" + key + "\" has an undefined value in the component definition. " +
	          "Did you reference the function correctly?",
	          vm
	        );
	      }
	    }
	  }
	}
	
	function initWatch (vm) {
	  var watch = vm.$options.watch;
	  if (watch) {
	    for (var key in watch) {
	      var handler = watch[key];
	      if (Array.isArray(handler)) {
	        for (var i = 0; i < handler.length; i++) {
	          createWatcher(vm, key, handler[i]);
	        }
	      } else {
	        createWatcher(vm, key, handler);
	      }
	    }
	  }
	}
	
	function createWatcher (vm, key, handler) {
	  var options;
	  if (isPlainObject(handler)) {
	    options = handler;
	    handler = handler.handler;
	  }
	  if (typeof handler === 'string') {
	    handler = vm[handler];
	  }
	  vm.$watch(key, handler, options);
	}
	
	function stateMixin (Vue) {
	  // flow somehow has problems with directly declared definition object
	  // when using Object.defineProperty, so we have to procedurally build up
	  // the object here.
	  var dataDef = {};
	  dataDef.get = function () {
	    return this._data
	  };
	  {
	    dataDef.set = function (newData) {
	      warn(
	        'Avoid replacing instance root $data. ' +
	        'Use nested data properties instead.',
	        this
	      );
	    };
	  }
	  Object.defineProperty(Vue.prototype, '$data', dataDef);
	
	  Vue.prototype.$set = set;
	  Vue.prototype.$delete = del;
	
	  Vue.prototype.$watch = function (
	    expOrFn,
	    cb,
	    options
	  ) {
	    var vm = this;
	    options = options || {};
	    options.user = true;
	    var watcher = new Watcher(vm, expOrFn, cb, options);
	    if (options.immediate) {
	      cb.call(vm, watcher.value);
	    }
	    return function unwatchFn () {
	      watcher.teardown();
	    }
	  };
	}
	
	function proxy (vm, key) {
	  if (!isReserved(key)) {
	    Object.defineProperty(vm, key, {
	      configurable: true,
	      enumerable: true,
	      get: function proxyGetter () {
	        return vm._data[key]
	      },
	      set: function proxySetter (val) {
	        vm._data[key] = val;
	      }
	    });
	  }
	}
	
	/*  */
	
	var VNode = function VNode (
	  tag,
	  data,
	  children,
	  text,
	  elm,
	  ns,
	  context,
	  componentOptions
	) {
	  this.tag = tag;
	  this.data = data;
	  this.children = children;
	  this.text = text;
	  this.elm = elm;
	  this.ns = ns;
	  this.context = context;
	  this.functionalContext = undefined;
	  this.key = data && data.key;
	  this.componentOptions = componentOptions;
	  this.child = undefined;
	  this.parent = undefined;
	  this.raw = false;
	  this.isStatic = false;
	  this.isRootInsert = true;
	  this.isComment = false;
	  this.isCloned = false;
	};
	
	var emptyVNode = function () {
	  var node = new VNode();
	  node.text = '';
	  node.isComment = true;
	  return node
	};
	
	// optimized shallow clone
	// used for static nodes and slot nodes because they may be reused across
	// multiple renders, cloning them avoids errors when DOM manipulations rely
	// on their elm reference.
	function cloneVNode (vnode) {
	  var cloned = new VNode(
	    vnode.tag,
	    vnode.data,
	    vnode.children,
	    vnode.text,
	    vnode.elm,
	    vnode.ns,
	    vnode.context,
	    vnode.componentOptions
	  );
	  cloned.isStatic = vnode.isStatic;
	  cloned.key = vnode.key;
	  cloned.isCloned = true;
	  return cloned
	}
	
	function cloneVNodes (vnodes) {
	  var res = new Array(vnodes.length);
	  for (var i = 0; i < vnodes.length; i++) {
	    res[i] = cloneVNode(vnodes[i]);
	  }
	  return res
	}
	
	/*  */
	
	function mergeVNodeHook (def, hookKey, hook, key) {
	  key = key + hookKey;
	  var injectedHash = def.__injected || (def.__injected = {});
	  if (!injectedHash[key]) {
	    injectedHash[key] = true;
	    var oldHook = def[hookKey];
	    if (oldHook) {
	      def[hookKey] = function () {
	        oldHook.apply(this, arguments);
	        hook.apply(this, arguments);
	      };
	    } else {
	      def[hookKey] = hook;
	    }
	  }
	}
	
	/*  */
	
	function updateListeners (
	  on,
	  oldOn,
	  add,
	  remove$$1,
	  vm
	) {
	  var name, cur, old, fn, event, capture;
	  for (name in on) {
	    cur = on[name];
	    old = oldOn[name];
	    if (!cur) {
	      "development" !== 'production' && warn(
	        "Invalid handler for event \"" + name + "\": got " + String(cur),
	        vm
	      );
	    } else if (!old) {
	      capture = name.charAt(0) === '!';
	      event = capture ? name.slice(1) : name;
	      if (Array.isArray(cur)) {
	        add(event, (cur.invoker = arrInvoker(cur)), capture);
	      } else {
	        if (!cur.invoker) {
	          fn = cur;
	          cur = on[name] = {};
	          cur.fn = fn;
	          cur.invoker = fnInvoker(cur);
	        }
	        add(event, cur.invoker, capture);
	      }
	    } else if (cur !== old) {
	      if (Array.isArray(old)) {
	        old.length = cur.length;
	        for (var i = 0; i < old.length; i++) { old[i] = cur[i]; }
	        on[name] = old;
	      } else {
	        old.fn = cur;
	        on[name] = old;
	      }
	    }
	  }
	  for (name in oldOn) {
	    if (!on[name]) {
	      event = name.charAt(0) === '!' ? name.slice(1) : name;
	      remove$$1(event, oldOn[name].invoker);
	    }
	  }
	}
	
	function arrInvoker (arr) {
	  return function (ev) {
	    var arguments$1 = arguments;
	
	    var single = arguments.length === 1;
	    for (var i = 0; i < arr.length; i++) {
	      single ? arr[i](ev) : arr[i].apply(null, arguments$1);
	    }
	  }
	}
	
	function fnInvoker (o) {
	  return function (ev) {
	    var single = arguments.length === 1;
	    single ? o.fn(ev) : o.fn.apply(null, arguments);
	  }
	}
	
	/*  */
	
	function normalizeChildren (
	  children,
	  ns,
	  nestedIndex
	) {
	  if (isPrimitive(children)) {
	    return [createTextVNode(children)]
	  }
	  if (Array.isArray(children)) {
	    var res = [];
	    for (var i = 0, l = children.length; i < l; i++) {
	      var c = children[i];
	      var last = res[res.length - 1];
	      //  nested
	      if (Array.isArray(c)) {
	        res.push.apply(res, normalizeChildren(c, ns, ((nestedIndex || '') + "_" + i)));
	      } else if (isPrimitive(c)) {
	        if (last && last.text) {
	          last.text += String(c);
	        } else if (c !== '') {
	          // convert primitive to vnode
	          res.push(createTextVNode(c));
	        }
	      } else if (c instanceof VNode) {
	        if (c.text && last && last.text) {
	          last.text += c.text;
	        } else {
	          // inherit parent namespace
	          if (ns) {
	            applyNS(c, ns);
	          }
	          // default key for nested array children (likely generated by v-for)
	          if (c.tag && c.key == null && nestedIndex != null) {
	            c.key = "__vlist" + nestedIndex + "_" + i + "__";
	          }
	          res.push(c);
	        }
	      }
	    }
	    return res
	  }
	}
	
	function createTextVNode (val) {
	  return new VNode(undefined, undefined, undefined, String(val))
	}
	
	function applyNS (vnode, ns) {
	  if (vnode.tag && !vnode.ns) {
	    vnode.ns = ns;
	    if (vnode.children) {
	      for (var i = 0, l = vnode.children.length; i < l; i++) {
	        applyNS(vnode.children[i], ns);
	      }
	    }
	  }
	}
	
	/*  */
	
	function getFirstComponentChild (children) {
	  return children && children.filter(function (c) { return c && c.componentOptions; })[0]
	}
	
	/*  */
	
	var activeInstance = null;
	
	function initLifecycle (vm) {
	  var options = vm.$options;
	
	  // locate first non-abstract parent
	  var parent = options.parent;
	  if (parent && !options.abstract) {
	    while (parent.$options.abstract && parent.$parent) {
	      parent = parent.$parent;
	    }
	    parent.$children.push(vm);
	  }
	
	  vm.$parent = parent;
	  vm.$root = parent ? parent.$root : vm;
	
	  vm.$children = [];
	  vm.$refs = {};
	
	  vm._watcher = null;
	  vm._inactive = false;
	  vm._isMounted = false;
	  vm._isDestroyed = false;
	  vm._isBeingDestroyed = false;
	}
	
	function lifecycleMixin (Vue) {
	  Vue.prototype._mount = function (
	    el,
	    hydrating
	  ) {
	    var vm = this;
	    vm.$el = el;
	    if (!vm.$options.render) {
	      vm.$options.render = emptyVNode;
	      {
	        /* istanbul ignore if */
	        if (vm.$options.template) {
	          warn(
	            'You are using the runtime-only build of Vue where the template ' +
	            'option is not available. Either pre-compile the templates into ' +
	            'render functions, or use the compiler-included build.',
	            vm
	          );
	        } else {
	          warn(
	            'Failed to mount component: template or render function not defined.',
	            vm
	          );
	        }
	      }
	    }
	    callHook(vm, 'beforeMount');
	    vm._watcher = new Watcher(vm, function () {
	      vm._update(vm._render(), hydrating);
	    }, noop);
	    hydrating = false;
	    // manually mounted instance, call mounted on self
	    // mounted is called for render-created child components in its inserted hook
	    if (vm.$vnode == null) {
	      vm._isMounted = true;
	      callHook(vm, 'mounted');
	    }
	    return vm
	  };
	
	  Vue.prototype._update = function (vnode, hydrating) {
	    var vm = this;
	    if (vm._isMounted) {
	      callHook(vm, 'beforeUpdate');
	    }
	    var prevEl = vm.$el;
	    var prevActiveInstance = activeInstance;
	    activeInstance = vm;
	    var prevVnode = vm._vnode;
	    vm._vnode = vnode;
	    if (!prevVnode) {
	      // Vue.prototype.__patch__ is injected in entry points
	      // based on the rendering backend used.
	      vm.$el = vm.__patch__(vm.$el, vnode, hydrating);
	    } else {
	      vm.$el = vm.__patch__(prevVnode, vnode);
	    }
	    activeInstance = prevActiveInstance;
	    // update __vue__ reference
	    if (prevEl) {
	      prevEl.__vue__ = null;
	    }
	    if (vm.$el) {
	      vm.$el.__vue__ = vm;
	    }
	    // if parent is an HOC, update its $el as well
	    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
	      vm.$parent.$el = vm.$el;
	    }
	    if (vm._isMounted) {
	      callHook(vm, 'updated');
	    }
	  };
	
	  Vue.prototype._updateFromParent = function (
	    propsData,
	    listeners,
	    parentVnode,
	    renderChildren
	  ) {
	    var vm = this;
	    var hasChildren = !!(vm.$options._renderChildren || renderChildren);
	    vm.$options._parentVnode = parentVnode;
	    vm.$options._renderChildren = renderChildren;
	    // update props
	    if (propsData && vm.$options.props) {
	      observerState.shouldConvert = false;
	      {
	        observerState.isSettingProps = true;
	      }
	      var propKeys = vm.$options._propKeys || [];
	      for (var i = 0; i < propKeys.length; i++) {
	        var key = propKeys[i];
	        vm[key] = validateProp(key, vm.$options.props, propsData, vm);
	      }
	      observerState.shouldConvert = true;
	      {
	        observerState.isSettingProps = false;
	      }
	    }
	    // update listeners
	    if (listeners) {
	      var oldListeners = vm.$options._parentListeners;
	      vm.$options._parentListeners = listeners;
	      vm._updateListeners(listeners, oldListeners);
	    }
	    // resolve slots + force update if has children
	    if (hasChildren) {
	      vm.$slots = resolveSlots(renderChildren, vm._renderContext);
	      vm.$forceUpdate();
	    }
	  };
	
	  Vue.prototype.$forceUpdate = function () {
	    var vm = this;
	    if (vm._watcher) {
	      vm._watcher.update();
	    }
	  };
	
	  Vue.prototype.$destroy = function () {
	    var vm = this;
	    if (vm._isBeingDestroyed) {
	      return
	    }
	    callHook(vm, 'beforeDestroy');
	    vm._isBeingDestroyed = true;
	    // remove self from parent
	    var parent = vm.$parent;
	    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
	      remove$1(parent.$children, vm);
	    }
	    // teardown watchers
	    if (vm._watcher) {
	      vm._watcher.teardown();
	    }
	    var i = vm._watchers.length;
	    while (i--) {
	      vm._watchers[i].teardown();
	    }
	    // remove reference from data ob
	    // frozen object may not have observer.
	    if (vm._data.__ob__) {
	      vm._data.__ob__.vmCount--;
	    }
	    // call the last hook...
	    vm._isDestroyed = true;
	    callHook(vm, 'destroyed');
	    // turn off all instance listeners.
	    vm.$off();
	    // remove __vue__ reference
	    if (vm.$el) {
	      vm.$el.__vue__ = null;
	    }
	    // invoke destroy hooks on current rendered tree
	    vm.__patch__(vm._vnode, null);
	  };
	}
	
	function callHook (vm, hook) {
	  var handlers = vm.$options[hook];
	  if (handlers) {
	    for (var i = 0, j = handlers.length; i < j; i++) {
	      handlers[i].call(vm);
	    }
	  }
	  vm.$emit('hook:' + hook);
	}
	
	/*  */
	
	var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
	var hooksToMerge = Object.keys(hooks);
	
	function createComponent (
	  Ctor,
	  data,
	  context,
	  children,
	  tag
	) {
	  if (!Ctor) {
	    return
	  }
	
	  if (isObject(Ctor)) {
	    Ctor = Vue$3.extend(Ctor);
	  }
	
	  if (typeof Ctor !== 'function') {
	    {
	      warn(("Invalid Component definition: " + (String(Ctor))), context);
	    }
	    return
	  }
	
	  // async component
	  if (!Ctor.cid) {
	    if (Ctor.resolved) {
	      Ctor = Ctor.resolved;
	    } else {
	      Ctor = resolveAsyncComponent(Ctor, function () {
	        // it's ok to queue this on every render because
	        // $forceUpdate is buffered by the scheduler.
	        context.$forceUpdate();
	      });
	      if (!Ctor) {
	        // return nothing if this is indeed an async component
	        // wait for the callback to trigger parent update.
	        return
	      }
	    }
	  }
	
	  data = data || {};
	
	  // extract props
	  var propsData = extractProps(data, Ctor);
	
	  // functional component
	  if (Ctor.options.functional) {
	    return createFunctionalComponent(Ctor, propsData, data, context, children)
	  }
	
	  // extract listeners, since these needs to be treated as
	  // child component listeners instead of DOM listeners
	  var listeners = data.on;
	  // replace with listeners with .native modifier
	  data.on = data.nativeOn;
	
	  if (Ctor.options.abstract) {
	    // abstract components do not keep anything
	    // other than props & listeners
	    data = {};
	  }
	
	  // merge component management hooks onto the placeholder node
	  mergeHooks(data);
	
	  // return a placeholder vnode
	  var name = Ctor.options.name || tag;
	  var vnode = new VNode(
	    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
	    data, undefined, undefined, undefined, undefined, context,
	    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
	  );
	  return vnode
	}
	
	function createFunctionalComponent (
	  Ctor,
	  propsData,
	  data,
	  context,
	  children
	) {
	  var props = {};
	  var propOptions = Ctor.options.props;
	  if (propOptions) {
	    for (var key in propOptions) {
	      props[key] = validateProp(key, propOptions, propsData);
	    }
	  }
	  var vnode = Ctor.options.render.call(
	    null,
	    // ensure the createElement function in functional components
	    // gets a unique context - this is necessary for correct named slot check
	    bind$1(createElement, { _self: Object.create(context) }),
	    {
	      props: props,
	      data: data,
	      parent: context,
	      children: normalizeChildren(children),
	      slots: function () { return resolveSlots(children, context); }
	    }
	  );
	  if (vnode instanceof VNode) {
	    vnode.functionalContext = context;
	    if (data.slot) {
	      (vnode.data || (vnode.data = {})).slot = data.slot;
	    }
	  }
	  return vnode
	}
	
	function createComponentInstanceForVnode (
	  vnode, // we know it's MountedComponentVNode but flow doesn't
	  parent // activeInstance in lifecycle state
	) {
	  var vnodeComponentOptions = vnode.componentOptions;
	  var options = {
	    _isComponent: true,
	    parent: parent,
	    propsData: vnodeComponentOptions.propsData,
	    _componentTag: vnodeComponentOptions.tag,
	    _parentVnode: vnode,
	    _parentListeners: vnodeComponentOptions.listeners,
	    _renderChildren: vnodeComponentOptions.children
	  };
	  // check inline-template render functions
	  var inlineTemplate = vnode.data.inlineTemplate;
	  if (inlineTemplate) {
	    options.render = inlineTemplate.render;
	    options.staticRenderFns = inlineTemplate.staticRenderFns;
	  }
	  return new vnodeComponentOptions.Ctor(options)
	}
	
	function init (vnode, hydrating) {
	  if (!vnode.child || vnode.child._isDestroyed) {
	    var child = vnode.child = createComponentInstanceForVnode(vnode, activeInstance);
	    child.$mount(hydrating ? vnode.elm : undefined, hydrating);
	  }
	}
	
	function prepatch (
	  oldVnode,
	  vnode
	) {
	  var options = vnode.componentOptions;
	  var child = vnode.child = oldVnode.child;
	  child._updateFromParent(
	    options.propsData, // updated props
	    options.listeners, // updated listeners
	    vnode, // new parent vnode
	    options.children // new children
	  );
	}
	
	function insert (vnode) {
	  if (!vnode.child._isMounted) {
	    vnode.child._isMounted = true;
	    callHook(vnode.child, 'mounted');
	  }
	  if (vnode.data.keepAlive) {
	    vnode.child._inactive = false;
	    callHook(vnode.child, 'activated');
	  }
	}
	
	function destroy$1 (vnode) {
	  if (!vnode.child._isDestroyed) {
	    if (!vnode.data.keepAlive) {
	      vnode.child.$destroy();
	    } else {
	      vnode.child._inactive = true;
	      callHook(vnode.child, 'deactivated');
	    }
	  }
	}
	
	function resolveAsyncComponent (
	  factory,
	  cb
	) {
	  if (factory.requested) {
	    // pool callbacks
	    factory.pendingCallbacks.push(cb);
	  } else {
	    factory.requested = true;
	    var cbs = factory.pendingCallbacks = [cb];
	    var sync = true;
	
	    var resolve = function (res) {
	      if (isObject(res)) {
	        res = Vue$3.extend(res);
	      }
	      // cache resolved
	      factory.resolved = res;
	      // invoke callbacks only if this is not a synchronous resolve
	      // (async resolves are shimmed as synchronous during SSR)
	      if (!sync) {
	        for (var i = 0, l = cbs.length; i < l; i++) {
	          cbs[i](res);
	        }
	      }
	    };
	
	    var reject = function (reason) {
	      "development" !== 'production' && warn(
	        "Failed to resolve async component: " + (String(factory)) +
	        (reason ? ("\nReason: " + reason) : '')
	      );
	    };
	
	    var res = factory(resolve, reject);
	
	    // handle promise
	    if (res && typeof res.then === 'function' && !factory.resolved) {
	      res.then(resolve, reject);
	    }
	
	    sync = false;
	    // return in case resolved synchronously
	    return factory.resolved
	  }
	}
	
	function extractProps (data, Ctor) {
	  // we are only extrating raw values here.
	  // validation and default values are handled in the child
	  // component itself.
	  var propOptions = Ctor.options.props;
	  if (!propOptions) {
	    return
	  }
	  var res = {};
	  var attrs = data.attrs;
	  var props = data.props;
	  var domProps = data.domProps;
	  if (attrs || props || domProps) {
	    for (var key in propOptions) {
	      var altKey = hyphenate(key);
	      checkProp(res, props, key, altKey, true) ||
	      checkProp(res, attrs, key, altKey) ||
	      checkProp(res, domProps, key, altKey);
	    }
	  }
	  return res
	}
	
	function checkProp (
	  res,
	  hash,
	  key,
	  altKey,
	  preserve
	) {
	  if (hash) {
	    if (hasOwn(hash, key)) {
	      res[key] = hash[key];
	      if (!preserve) {
	        delete hash[key];
	      }
	      return true
	    } else if (hasOwn(hash, altKey)) {
	      res[key] = hash[altKey];
	      if (!preserve) {
	        delete hash[altKey];
	      }
	      return true
	    }
	  }
	  return false
	}
	
	function mergeHooks (data) {
	  if (!data.hook) {
	    data.hook = {};
	  }
	  for (var i = 0; i < hooksToMerge.length; i++) {
	    var key = hooksToMerge[i];
	    var fromParent = data.hook[key];
	    var ours = hooks[key];
	    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
	  }
	}
	
	function mergeHook$1 (a, b) {
	  // since all hooks have at most two args, use fixed args
	  // to avoid having to use fn.apply().
	  return function (_, __) {
	    a(_, __);
	    b(_, __);
	  }
	}
	
	/*  */
	
	// wrapper function for providing a more flexible interface
	// without getting yelled at by flow
	function createElement (
	  tag,
	  data,
	  children
	) {
	  if (data && (Array.isArray(data) || typeof data !== 'object')) {
	    children = data;
	    data = undefined;
	  }
	  // make sure to use real instance instead of proxy as context
	  return _createElement(this._self, tag, data, children)
	}
	
	function _createElement (
	  context,
	  tag,
	  data,
	  children
	) {
	  if (data && data.__ob__) {
	    "development" !== 'production' && warn(
	      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
	      'Always create fresh vnode data objects in each render!',
	      context
	    );
	    return
	  }
	  if (!tag) {
	    // in case of component :is set to falsy value
	    return emptyVNode()
	  }
	  if (typeof tag === 'string') {
	    var Ctor;
	    var ns = config.getTagNamespace(tag);
	    if (config.isReservedTag(tag)) {
	      // platform built-in elements
	      return new VNode(
	        tag, data, normalizeChildren(children, ns),
	        undefined, undefined, ns, context
	      )
	    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
	      // component
	      return createComponent(Ctor, data, context, children, tag)
	    } else {
	      // unknown or unlisted namespaced elements
	      // check at runtime because it may get assigned a namespace when its
	      // parent normalizes children
	      return new VNode(
	        tag, data, normalizeChildren(children, ns),
	        undefined, undefined, ns, context
	      )
	    }
	  } else {
	    // direct component options / constructor
	    return createComponent(tag, data, context, children)
	  }
	}
	
	/*  */
	
	function initRender (vm) {
	  vm.$vnode = null; // the placeholder node in parent tree
	  vm._vnode = null; // the root of the child tree
	  vm._staticTrees = null;
	  vm._renderContext = vm.$options._parentVnode && vm.$options._parentVnode.context;
	  vm.$slots = resolveSlots(vm.$options._renderChildren, vm._renderContext);
	  // bind the public createElement fn to this instance
	  // so that we get proper render context inside it.
	  vm.$createElement = bind$1(createElement, vm);
	  if (vm.$options.el) {
	    vm.$mount(vm.$options.el);
	  }
	}
	
	function renderMixin (Vue) {
	  Vue.prototype.$nextTick = function (fn) {
	    nextTick(fn, this);
	  };
	
	  Vue.prototype._render = function () {
	    var vm = this;
	    var ref = vm.$options;
	    var render = ref.render;
	    var staticRenderFns = ref.staticRenderFns;
	    var _parentVnode = ref._parentVnode;
	
	    if (vm._isMounted) {
	      // clone slot nodes on re-renders
	      for (var key in vm.$slots) {
	        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
	      }
	    }
	
	    if (staticRenderFns && !vm._staticTrees) {
	      vm._staticTrees = [];
	    }
	    // set parent vnode. this allows render functions to have access
	    // to the data on the placeholder node.
	    vm.$vnode = _parentVnode;
	    // render self
	    var vnode;
	    try {
	      vnode = render.call(vm._renderProxy, vm.$createElement);
	    } catch (e) {
	      {
	        warn(("Error when rendering " + (formatComponentName(vm)) + ":"));
	      }
	      /* istanbul ignore else */
	      if (config.errorHandler) {
	        config.errorHandler.call(null, e, vm);
	      } else {
	        if (config._isServer) {
	          throw e
	        } else {
	          setTimeout(function () { throw e }, 0);
	        }
	      }
	      // return previous vnode to prevent render error causing blank component
	      vnode = vm._vnode;
	    }
	    // return empty vnode in case the render function errored out
	    if (!(vnode instanceof VNode)) {
	      if ("development" !== 'production' && Array.isArray(vnode)) {
	        warn(
	          'Multiple root nodes returned from render function. Render function ' +
	          'should return a single root node.',
	          vm
	        );
	      }
	      vnode = emptyVNode();
	    }
	    // set parent
	    vnode.parent = _parentVnode;
	    return vnode
	  };
	
	  // shorthands used in render functions
	  Vue.prototype._h = createElement;
	  // toString for mustaches
	  Vue.prototype._s = _toString;
	  // number conversion
	  Vue.prototype._n = toNumber;
	  // empty vnode
	  Vue.prototype._e = emptyVNode;
	  // loose equal
	  Vue.prototype._q = looseEqual;
	  // loose indexOf
	  Vue.prototype._i = looseIndexOf;
	
	  // render static tree by index
	  Vue.prototype._m = function renderStatic (
	    index,
	    isInFor
	  ) {
	    var tree = this._staticTrees[index];
	    // if has already-rendered static tree and not inside v-for,
	    // we can reuse the same tree by doing a shallow clone.
	    if (tree && !isInFor) {
	      return Array.isArray(tree)
	        ? cloneVNodes(tree)
	        : cloneVNode(tree)
	    }
	    // otherwise, render a fresh tree.
	    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
	    if (Array.isArray(tree)) {
	      for (var i = 0; i < tree.length; i++) {
	        if (typeof tree[i] !== 'string') {
	          tree[i].isStatic = true;
	          tree[i].key = "__static__" + index + "_" + i;
	        }
	      }
	    } else {
	      tree.isStatic = true;
	      tree.key = "__static__" + index;
	    }
	    return tree
	  };
	
	  // filter resolution helper
	  var identity = function (_) { return _; };
	  Vue.prototype._f = function resolveFilter (id) {
	    return resolveAsset(this.$options, 'filters', id, true) || identity
	  };
	
	  // render v-for
	  Vue.prototype._l = function renderList (
	    val,
	    render
	  ) {
	    var ret, i, l, keys, key;
	    if (Array.isArray(val)) {
	      ret = new Array(val.length);
	      for (i = 0, l = val.length; i < l; i++) {
	        ret[i] = render(val[i], i);
	      }
	    } else if (typeof val === 'number') {
	      ret = new Array(val);
	      for (i = 0; i < val; i++) {
	        ret[i] = render(i + 1, i);
	      }
	    } else if (isObject(val)) {
	      keys = Object.keys(val);
	      ret = new Array(keys.length);
	      for (i = 0, l = keys.length; i < l; i++) {
	        key = keys[i];
	        ret[i] = render(val[key], key, i);
	      }
	    }
	    return ret
	  };
	
	  // renderSlot
	  Vue.prototype._t = function (
	    name,
	    fallback
	  ) {
	    var slotNodes = this.$slots[name];
	    // warn duplicate slot usage
	    if (slotNodes && "development" !== 'production') {
	      slotNodes._rendered && warn(
	        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
	        "- this will likely cause render errors.",
	        this
	      );
	      slotNodes._rendered = true;
	    }
	    return slotNodes || fallback
	  };
	
	  // apply v-bind object
	  Vue.prototype._b = function bindProps (
	    data,
	    value,
	    asProp
	  ) {
	    if (value) {
	      if (!isObject(value)) {
	        "development" !== 'production' && warn(
	          'v-bind without argument expects an Object or Array value',
	          this
	        );
	      } else {
	        if (Array.isArray(value)) {
	          value = toObject(value);
	        }
	        for (var key in value) {
	          if (key === 'class' || key === 'style') {
	            data[key] = value[key];
	          } else {
	            var hash = asProp || config.mustUseProp(key)
	              ? data.domProps || (data.domProps = {})
	              : data.attrs || (data.attrs = {});
	            hash[key] = value[key];
	          }
	        }
	      }
	    }
	    return data
	  };
	
	  // expose v-on keyCodes
	  Vue.prototype._k = function getKeyCodes (key) {
	    return config.keyCodes[key]
	  };
	}
	
	function resolveSlots (
	  renderChildren,
	  context
	) {
	  var slots = {};
	  if (!renderChildren) {
	    return slots
	  }
	  var children = normalizeChildren(renderChildren) || [];
	  var defaultSlot = [];
	  var name, child;
	  for (var i = 0, l = children.length; i < l; i++) {
	    child = children[i];
	    // named slots should only be respected if the vnode was rendered in the
	    // same context.
	    if ((child.context === context || child.functionalContext === context) &&
	        child.data && (name = child.data.slot)) {
	      var slot = (slots[name] || (slots[name] = []));
	      if (child.tag === 'template') {
	        slot.push.apply(slot, child.children);
	      } else {
	        slot.push(child);
	      }
	    } else {
	      defaultSlot.push(child);
	    }
	  }
	  // ignore single whitespace
	  if (defaultSlot.length && !(
	    defaultSlot.length === 1 &&
	    (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
	  )) {
	    slots.default = defaultSlot;
	  }
	  return slots
	}
	
	/*  */
	
	function initEvents (vm) {
	  vm._events = Object.create(null);
	  // init parent attached events
	  var listeners = vm.$options._parentListeners;
	  var on = bind$1(vm.$on, vm);
	  var off = bind$1(vm.$off, vm);
	  vm._updateListeners = function (listeners, oldListeners) {
	    updateListeners(listeners, oldListeners || {}, on, off, vm);
	  };
	  if (listeners) {
	    vm._updateListeners(listeners);
	  }
	}
	
	function eventsMixin (Vue) {
	  Vue.prototype.$on = function (event, fn) {
	    var vm = this;(vm._events[event] || (vm._events[event] = [])).push(fn);
	    return vm
	  };
	
	  Vue.prototype.$once = function (event, fn) {
	    var vm = this;
	    function on () {
	      vm.$off(event, on);
	      fn.apply(vm, arguments);
	    }
	    on.fn = fn;
	    vm.$on(event, on);
	    return vm
	  };
	
	  Vue.prototype.$off = function (event, fn) {
	    var vm = this;
	    // all
	    if (!arguments.length) {
	      vm._events = Object.create(null);
	      return vm
	    }
	    // specific event
	    var cbs = vm._events[event];
	    if (!cbs) {
	      return vm
	    }
	    if (arguments.length === 1) {
	      vm._events[event] = null;
	      return vm
	    }
	    // specific handler
	    var cb;
	    var i = cbs.length;
	    while (i--) {
	      cb = cbs[i];
	      if (cb === fn || cb.fn === fn) {
	        cbs.splice(i, 1);
	        break
	      }
	    }
	    return vm
	  };
	
	  Vue.prototype.$emit = function (event) {
	    var vm = this;
	    var cbs = vm._events[event];
	    if (cbs) {
	      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
	      var args = toArray(arguments, 1);
	      for (var i = 0, l = cbs.length; i < l; i++) {
	        cbs[i].apply(vm, args);
	      }
	    }
	    return vm
	  };
	}
	
	/*  */
	
	var uid = 0;
	
	function initMixin (Vue) {
	  Vue.prototype._init = function (options) {
	    var vm = this;
	    // a uid
	    vm._uid = uid++;
	    // a flag to avoid this being observed
	    vm._isVue = true;
	    // merge options
	    if (options && options._isComponent) {
	      // optimize internal component instantiation
	      // since dynamic options merging is pretty slow, and none of the
	      // internal component options needs special treatment.
	      initInternalComponent(vm, options);
	    } else {
	      vm.$options = mergeOptions(
	        resolveConstructorOptions(vm),
	        options || {},
	        vm
	      );
	    }
	    /* istanbul ignore else */
	    {
	      initProxy(vm);
	    }
	    // expose real self
	    vm._self = vm;
	    initLifecycle(vm);
	    initEvents(vm);
	    callHook(vm, 'beforeCreate');
	    initState(vm);
	    callHook(vm, 'created');
	    initRender(vm);
	  };
	
	  function initInternalComponent (vm, options) {
	    var opts = vm.$options = Object.create(resolveConstructorOptions(vm));
	    // doing this because it's faster than dynamic enumeration.
	    opts.parent = options.parent;
	    opts.propsData = options.propsData;
	    opts._parentVnode = options._parentVnode;
	    opts._parentListeners = options._parentListeners;
	    opts._renderChildren = options._renderChildren;
	    opts._componentTag = options._componentTag;
	    if (options.render) {
	      opts.render = options.render;
	      opts.staticRenderFns = options.staticRenderFns;
	    }
	  }
	
	  function resolveConstructorOptions (vm) {
	    var Ctor = vm.constructor;
	    var options = Ctor.options;
	    if (Ctor.super) {
	      var superOptions = Ctor.super.options;
	      var cachedSuperOptions = Ctor.superOptions;
	      if (superOptions !== cachedSuperOptions) {
	        // super option changed
	        Ctor.superOptions = superOptions;
	        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
	        if (options.name) {
	          options.components[options.name] = Ctor;
	        }
	      }
	    }
	    return options
	  }
	}
	
	function Vue$3 (options) {
	  if ("development" !== 'production' &&
	    !(this instanceof Vue$3)) {
	    warn('Vue is a constructor and should be called with the `new` keyword');
	  }
	  this._init(options);
	}
	
	initMixin(Vue$3);
	stateMixin(Vue$3);
	eventsMixin(Vue$3);
	lifecycleMixin(Vue$3);
	renderMixin(Vue$3);
	
	var warn = noop;
	var formatComponentName;
	
	{
	  var hasConsole = typeof console !== 'undefined';
	
	  warn = function (msg, vm) {
	    if (hasConsole && (!config.silent)) {
	      console.error("[Vue warn]: " + msg + " " + (
	        vm ? formatLocation(formatComponentName(vm)) : ''
	      ));
	    }
	  };
	
	  formatComponentName = function (vm) {
	    if (vm.$root === vm) {
	      return 'root instance'
	    }
	    var name = vm._isVue
	      ? vm.$options.name || vm.$options._componentTag
	      : vm.name;
	    return (
	      (name ? ("component <" + name + ">") : "anonymous component") +
	      (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
	    )
	  };
	
	  var formatLocation = function (str) {
	    if (str === 'anonymous component') {
	      str += " - use the \"name\" option for better debugging messages.";
	    }
	    return ("\n(found in " + str + ")")
	  };
	}
	
	/*  */
	
	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 */
	var strats = config.optionMergeStrategies;
	
	/**
	 * Options with restrictions
	 */
	{
	  strats.el = strats.propsData = function (parent, child, vm, key) {
	    if (!vm) {
	      warn(
	        "option \"" + key + "\" can only be used during instance " +
	        'creation with the `new` keyword.'
	      );
	    }
	    return defaultStrat(parent, child)
	  };
	}
	
	/**
	 * Helper that recursively merges two data objects together.
	 */
	function mergeData (to, from) {
	  var key, toVal, fromVal;
	  for (key in from) {
	    toVal = to[key];
	    fromVal = from[key];
	    if (!hasOwn(to, key)) {
	      set(to, key, fromVal);
	    } else if (isObject(toVal) && isObject(fromVal)) {
	      mergeData(toVal, fromVal);
	    }
	  }
	  return to
	}
	
	/**
	 * Data
	 */
	strats.data = function (
	  parentVal,
	  childVal,
	  vm
	) {
	  if (!vm) {
	    // in a Vue.extend merge, both should be functions
	    if (!childVal) {
	      return parentVal
	    }
	    if (typeof childVal !== 'function') {
	      "development" !== 'production' && warn(
	        'The "data" option should be a function ' +
	        'that returns a per-instance value in component ' +
	        'definitions.',
	        vm
	      );
	      return parentVal
	    }
	    if (!parentVal) {
	      return childVal
	    }
	    // when parentVal & childVal are both present,
	    // we need to return a function that returns the
	    // merged result of both functions... no need to
	    // check if parentVal is a function here because
	    // it has to be a function to pass previous merges.
	    return function mergedDataFn () {
	      return mergeData(
	        childVal.call(this),
	        parentVal.call(this)
	      )
	    }
	  } else if (parentVal || childVal) {
	    return function mergedInstanceDataFn () {
	      // instance merge
	      var instanceData = typeof childVal === 'function'
	        ? childVal.call(vm)
	        : childVal;
	      var defaultData = typeof parentVal === 'function'
	        ? parentVal.call(vm)
	        : undefined;
	      if (instanceData) {
	        return mergeData(instanceData, defaultData)
	      } else {
	        return defaultData
	      }
	    }
	  }
	};
	
	/**
	 * Hooks and param attributes are merged as arrays.
	 */
	function mergeHook (
	  parentVal,
	  childVal
	) {
	  return childVal
	    ? parentVal
	      ? parentVal.concat(childVal)
	      : Array.isArray(childVal)
	        ? childVal
	        : [childVal]
	    : parentVal
	}
	
	config._lifecycleHooks.forEach(function (hook) {
	  strats[hook] = mergeHook;
	});
	
	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 */
	function mergeAssets (parentVal, childVal) {
	  var res = Object.create(parentVal || null);
	  return childVal
	    ? extend(res, childVal)
	    : res
	}
	
	config._assetTypes.forEach(function (type) {
	  strats[type + 's'] = mergeAssets;
	});
	
	/**
	 * Watchers.
	 *
	 * Watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 */
	strats.watch = function (parentVal, childVal) {
	  /* istanbul ignore if */
	  if (!childVal) { return parentVal }
	  if (!parentVal) { return childVal }
	  var ret = {};
	  extend(ret, parentVal);
	  for (var key in childVal) {
	    var parent = ret[key];
	    var child = childVal[key];
	    if (parent && !Array.isArray(parent)) {
	      parent = [parent];
	    }
	    ret[key] = parent
	      ? parent.concat(child)
	      : [child];
	  }
	  return ret
	};
	
	/**
	 * Other object hashes.
	 */
	strats.props =
	strats.methods =
	strats.computed = function (parentVal, childVal) {
	  if (!childVal) { return parentVal }
	  if (!parentVal) { return childVal }
	  var ret = Object.create(null);
	  extend(ret, parentVal);
	  extend(ret, childVal);
	  return ret
	};
	
	/**
	 * Default strategy.
	 */
	var defaultStrat = function (parentVal, childVal) {
	  return childVal === undefined
	    ? parentVal
	    : childVal
	};
	
	/**
	 * Make sure component options get converted to actual
	 * constructors.
	 */
	function normalizeComponents (options) {
	  if (options.components) {
	    var components = options.components;
	    var def;
	    for (var key in components) {
	      var lower = key.toLowerCase();
	      if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
	        "development" !== 'production' && warn(
	          'Do not use built-in or reserved HTML elements as component ' +
	          'id: ' + key
	        );
	        continue
	      }
	      def = components[key];
	      if (isPlainObject(def)) {
	        components[key] = Vue$3.extend(def);
	      }
	    }
	  }
	}
	
	/**
	 * Ensure all props option syntax are normalized into the
	 * Object-based format.
	 */
	function normalizeProps (options) {
	  var props = options.props;
	  if (!props) { return }
	  var res = {};
	  var i, val, name;
	  if (Array.isArray(props)) {
	    i = props.length;
	    while (i--) {
	      val = props[i];
	      if (typeof val === 'string') {
	        name = camelize(val);
	        res[name] = { type: null };
	      } else {
	        warn('props must be strings when using array syntax.');
	      }
	    }
	  } else if (isPlainObject(props)) {
	    for (var key in props) {
	      val = props[key];
	      name = camelize(key);
	      res[name] = isPlainObject(val)
	        ? val
	        : { type: val };
	    }
	  }
	  options.props = res;
	}
	
	/**
	 * Normalize raw function directives into object format.
	 */
	function normalizeDirectives (options) {
	  var dirs = options.directives;
	  if (dirs) {
	    for (var key in dirs) {
	      var def = dirs[key];
	      if (typeof def === 'function') {
	        dirs[key] = { bind: def, update: def };
	      }
	    }
	  }
	}
	
	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 */
	function mergeOptions (
	  parent,
	  child,
	  vm
	) {
	  normalizeComponents(child);
	  normalizeProps(child);
	  normalizeDirectives(child);
	  var extendsFrom = child.extends;
	  if (extendsFrom) {
	    parent = typeof extendsFrom === 'function'
	      ? mergeOptions(parent, extendsFrom.options, vm)
	      : mergeOptions(parent, extendsFrom, vm);
	  }
	  if (child.mixins) {
	    for (var i = 0, l = child.mixins.length; i < l; i++) {
	      var mixin = child.mixins[i];
	      if (mixin.prototype instanceof Vue$3) {
	        mixin = mixin.options;
	      }
	      parent = mergeOptions(parent, mixin, vm);
	    }
	  }
	  var options = {};
	  var key;
	  for (key in parent) {
	    mergeField(key);
	  }
	  for (key in child) {
	    if (!hasOwn(parent, key)) {
	      mergeField(key);
	    }
	  }
	  function mergeField (key) {
	    var strat = strats[key] || defaultStrat;
	    options[key] = strat(parent[key], child[key], vm, key);
	  }
	  return options
	}
	
	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 */
	function resolveAsset (
	  options,
	  type,
	  id,
	  warnMissing
	) {
	  /* istanbul ignore if */
	  if (typeof id !== 'string') {
	    return
	  }
	  var assets = options[type];
	  var res = assets[id] ||
	    // camelCase ID
	    assets[camelize(id)] ||
	    // Pascal Case ID
	    assets[capitalize(camelize(id))];
	  if ("development" !== 'production' && warnMissing && !res) {
	    warn(
	      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
	      options
	    );
	  }
	  return res
	}
	
	/*  */
	
	function validateProp (
	  key,
	  propOptions,
	  propsData,
	  vm
	) {
	  var prop = propOptions[key];
	  var absent = !hasOwn(propsData, key);
	  var value = propsData[key];
	  // handle boolean props
	  if (isBooleanType(prop.type)) {
	    if (absent && !hasOwn(prop, 'default')) {
	      value = false;
	    } else if (value === '' || value === hyphenate(key)) {
	      value = true;
	    }
	  }
	  // check default value
	  if (value === undefined) {
	    value = getPropDefaultValue(vm, prop, key);
	    // since the default value is a fresh copy,
	    // make sure to observe it.
	    var prevShouldConvert = observerState.shouldConvert;
	    observerState.shouldConvert = true;
	    observe(value);
	    observerState.shouldConvert = prevShouldConvert;
	  }
	  {
	    assertProp(prop, key, value, vm, absent);
	  }
	  return value
	}
	
	/**
	 * Get the default value of a prop.
	 */
	function getPropDefaultValue (vm, prop, name) {
	  // no default, return undefined
	  if (!hasOwn(prop, 'default')) {
	    return undefined
	  }
	  var def = prop.default;
	  // warn against non-factory defaults for Object & Array
	  if (isObject(def)) {
	    "development" !== 'production' && warn(
	      'Invalid default value for prop "' + name + '": ' +
	      'Props with type Object/Array must use a factory function ' +
	      'to return the default value.',
	      vm
	    );
	  }
	  // call factory function for non-Function types
	  return typeof def === 'function' && prop.type !== Function
	    ? def.call(vm)
	    : def
	}
	
	/**
	 * Assert whether a prop is valid.
	 */
	function assertProp (
	  prop,
	  name,
	  value,
	  vm,
	  absent
	) {
	  if (prop.required && absent) {
	    warn(
	      'Missing required prop: "' + name + '"',
	      vm
	    );
	    return
	  }
	  if (value == null && !prop.required) {
	    return
	  }
	  var type = prop.type;
	  var valid = !type || type === true;
	  var expectedTypes = [];
	  if (type) {
	    if (!Array.isArray(type)) {
	      type = [type];
	    }
	    for (var i = 0; i < type.length && !valid; i++) {
	      var assertedType = assertType(value, type[i]);
	      expectedTypes.push(assertedType.expectedType);
	      valid = assertedType.valid;
	    }
	  }
	  if (!valid) {
	    warn(
	      'Invalid prop: type check failed for prop "' + name + '".' +
	      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
	      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
	      vm
	    );
	    return
	  }
	  var validator = prop.validator;
	  if (validator) {
	    if (!validator(value)) {
	      warn(
	        'Invalid prop: custom validator check failed for prop "' + name + '".',
	        vm
	      );
	    }
	  }
	}
	
	/**
	 * Assert the type of a value
	 */
	function assertType (value, type) {
	  var valid;
	  var expectedType = getType(type);
	  if (expectedType === 'String') {
	    valid = typeof value === (expectedType = 'string');
	  } else if (expectedType === 'Number') {
	    valid = typeof value === (expectedType = 'number');
	  } else if (expectedType === 'Boolean') {
	    valid = typeof value === (expectedType = 'boolean');
	  } else if (expectedType === 'Function') {
	    valid = typeof value === (expectedType = 'function');
	  } else if (expectedType === 'Object') {
	    valid = isPlainObject(value);
	  } else if (expectedType === 'Array') {
	    valid = Array.isArray(value);
	  } else {
	    valid = value instanceof type;
	  }
	  return {
	    valid: valid,
	    expectedType: expectedType
	  }
	}
	
	/**
	 * Use function string name to check built-in types,
	 * because a simple equality check will fail when running
	 * across different vms / iframes.
	 */
	function getType (fn) {
	  var match = fn && fn.toString().match(/^\s*function (\w+)/);
	  return match && match[1]
	}
	
	function isBooleanType (fn) {
	  if (!Array.isArray(fn)) {
	    return getType(fn) === 'Boolean'
	  }
	  for (var i = 0, len = fn.length; i < len; i++) {
	    if (getType(fn[i]) === 'Boolean') {
	      return true
	    }
	  }
	  /* istanbul ignore next */
	  return false
	}
	
	
	
	var util = Object.freeze({
		defineReactive: defineReactive$$1,
		_toString: _toString,
		toNumber: toNumber,
		makeMap: makeMap,
		isBuiltInTag: isBuiltInTag,
		remove: remove$1,
		hasOwn: hasOwn,
		isPrimitive: isPrimitive,
		cached: cached,
		camelize: camelize,
		capitalize: capitalize,
		hyphenate: hyphenate,
		bind: bind$1,
		toArray: toArray,
		extend: extend,
		isObject: isObject,
		isPlainObject: isPlainObject,
		toObject: toObject,
		noop: noop,
		no: no,
		genStaticKeys: genStaticKeys,
		looseEqual: looseEqual,
		looseIndexOf: looseIndexOf,
		isReserved: isReserved,
		def: def,
		parsePath: parsePath,
		hasProto: hasProto,
		inBrowser: inBrowser,
		UA: UA,
		isIE: isIE,
		isIE9: isIE9,
		isEdge: isEdge,
		isAndroid: isAndroid,
		isIOS: isIOS,
		devtools: devtools,
		nextTick: nextTick,
		get _Set () { return _Set; },
		mergeOptions: mergeOptions,
		resolveAsset: resolveAsset,
		get warn () { return warn; },
		get formatComponentName () { return formatComponentName; },
		validateProp: validateProp
	});
	
	/*  */
	
	function initUse (Vue) {
	  Vue.use = function (plugin) {
	    /* istanbul ignore if */
	    if (plugin.installed) {
	      return
	    }
	    // additional parameters
	    var args = toArray(arguments, 1);
	    args.unshift(this);
	    if (typeof plugin.install === 'function') {
	      plugin.install.apply(plugin, args);
	    } else {
	      plugin.apply(null, args);
	    }
	    plugin.installed = true;
	    return this
	  };
	}
	
	/*  */
	
	function initMixin$1 (Vue) {
	  Vue.mixin = function (mixin) {
	    Vue.options = mergeOptions(Vue.options, mixin);
	  };
	}
	
	/*  */
	
	function initExtend (Vue) {
	  /**
	   * Each instance constructor, including Vue, has a unique
	   * cid. This enables us to create wrapped "child
	   * constructors" for prototypal inheritance and cache them.
	   */
	  Vue.cid = 0;
	  var cid = 1;
	
	  /**
	   * Class inheritance
	   */
	  Vue.extend = function (extendOptions) {
	    extendOptions = extendOptions || {};
	    var Super = this;
	    var isFirstExtend = Super.cid === 0;
	    if (isFirstExtend && extendOptions._Ctor) {
	      return extendOptions._Ctor
	    }
	    var name = extendOptions.name || Super.options.name;
	    {
	      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
	        warn(
	          'Invalid component name: "' + name + '". Component names ' +
	          'can only contain alphanumeric characaters and the hyphen.'
	        );
	        name = null;
	      }
	    }
	    var Sub = function VueComponent (options) {
	      this._init(options);
	    };
	    Sub.prototype = Object.create(Super.prototype);
	    Sub.prototype.constructor = Sub;
	    Sub.cid = cid++;
	    Sub.options = mergeOptions(
	      Super.options,
	      extendOptions
	    );
	    Sub['super'] = Super;
	    // allow further extension
	    Sub.extend = Super.extend;
	    // create asset registers, so extended classes
	    // can have their private assets too.
	    config._assetTypes.forEach(function (type) {
	      Sub[type] = Super[type];
	    });
	    // enable recursive self-lookup
	    if (name) {
	      Sub.options.components[name] = Sub;
	    }
	    // keep a reference to the super options at extension time.
	    // later at instantiation we can check if Super's options have
	    // been updated.
	    Sub.superOptions = Super.options;
	    Sub.extendOptions = extendOptions;
	    // cache constructor
	    if (isFirstExtend) {
	      extendOptions._Ctor = Sub;
	    }
	    return Sub
	  };
	}
	
	/*  */
	
	function initAssetRegisters (Vue) {
	  /**
	   * Create asset registration methods.
	   */
	  config._assetTypes.forEach(function (type) {
	    Vue[type] = function (
	      id,
	      definition
	    ) {
	      if (!definition) {
	        return this.options[type + 's'][id]
	      } else {
	        /* istanbul ignore if */
	        {
	          if (type === 'component' && config.isReservedTag(id)) {
	            warn(
	              'Do not use built-in or reserved HTML elements as component ' +
	              'id: ' + id
	            );
	          }
	        }
	        if (type === 'component' && isPlainObject(definition)) {
	          definition.name = definition.name || id;
	          definition = Vue.extend(definition);
	        }
	        if (type === 'directive' && typeof definition === 'function') {
	          definition = { bind: definition, update: definition };
	        }
	        this.options[type + 's'][id] = definition;
	        return definition
	      }
	    };
	  });
	}
	
	var KeepAlive = {
	  name: 'keep-alive',
	  abstract: true,
	  created: function created () {
	    this.cache = Object.create(null);
	  },
	  render: function render () {
	    var vnode = getFirstComponentChild(this.$slots.default);
	    if (vnode && vnode.componentOptions) {
	      var opts = vnode.componentOptions;
	      var key = vnode.key == null
	        // same constructor may get registered as different local components
	        // so cid alone is not enough (#3269)
	        ? opts.Ctor.cid + '::' + opts.tag
	        : vnode.key;
	      if (this.cache[key]) {
	        vnode.child = this.cache[key].child;
	      } else {
	        this.cache[key] = vnode;
	      }
	      vnode.data.keepAlive = true;
	    }
	    return vnode
	  },
	  destroyed: function destroyed () {
	    var this$1 = this;
	
	    for (var key in this.cache) {
	      var vnode = this$1.cache[key];
	      callHook(vnode.child, 'deactivated');
	      vnode.child.$destroy();
	    }
	  }
	};
	
	var builtInComponents = {
	  KeepAlive: KeepAlive
	};
	
	/*  */
	
	function initGlobalAPI (Vue) {
	  // config
	  var configDef = {};
	  configDef.get = function () { return config; };
	  {
	    configDef.set = function () {
	      warn(
	        'Do not replace the Vue.config object, set individual fields instead.'
	      );
	    };
	  }
	  Object.defineProperty(Vue, 'config', configDef);
	  Vue.util = util;
	  Vue.set = set;
	  Vue.delete = del;
	  Vue.nextTick = nextTick;
	
	  Vue.options = Object.create(null);
	  config._assetTypes.forEach(function (type) {
	    Vue.options[type + 's'] = Object.create(null);
	  });
	
	  extend(Vue.options.components, builtInComponents);
	
	  initUse(Vue);
	  initMixin$1(Vue);
	  initExtend(Vue);
	  initAssetRegisters(Vue);
	}
	
	initGlobalAPI(Vue$3);
	
	Object.defineProperty(Vue$3.prototype, '$isServer', {
	  get: function () { return config._isServer; }
	});
	
	Vue$3.version = '2.0.3';
	
	/*  */
	
	// attributes that should be using props for binding
	var mustUseProp = makeMap('value,selected,checked,muted');
	
	var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
	
	var isBooleanAttr = makeMap(
	  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
	  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
	  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
	  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
	  'required,reversed,scoped,seamless,selected,sortable,translate,' +
	  'truespeed,typemustmatch,visible'
	);
	
	var isAttr = makeMap(
	  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
	  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
	  'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
	  'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
	  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
	  'form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv,' +
	  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
	  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
	  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
	  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
	  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
	  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
	  'target,title,type,usemap,value,width,wrap'
	);
	
	
	
	var xlinkNS = 'http://www.w3.org/1999/xlink';
	
	var isXlink = function (name) {
	  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
	};
	
	var getXlinkProp = function (name) {
	  return isXlink(name) ? name.slice(6, name.length) : ''
	};
	
	var isFalsyAttrValue = function (val) {
	  return val == null || val === false
	};
	
	/*  */
	
	function genClassForVnode (vnode) {
	  var data = vnode.data;
	  var parentNode = vnode;
	  var childNode = vnode;
	  while (childNode.child) {
	    childNode = childNode.child._vnode;
	    if (childNode.data) {
	      data = mergeClassData(childNode.data, data);
	    }
	  }
	  while ((parentNode = parentNode.parent)) {
	    if (parentNode.data) {
	      data = mergeClassData(data, parentNode.data);
	    }
	  }
	  return genClassFromData(data)
	}
	
	function mergeClassData (child, parent) {
	  return {
	    staticClass: concat(child.staticClass, parent.staticClass),
	    class: child.class
	      ? [child.class, parent.class]
	      : parent.class
	  }
	}
	
	function genClassFromData (data) {
	  var dynamicClass = data.class;
	  var staticClass = data.staticClass;
	  if (staticClass || dynamicClass) {
	    return concat(staticClass, stringifyClass(dynamicClass))
	  }
	  /* istanbul ignore next */
	  return ''
	}
	
	function concat (a, b) {
	  return a ? b ? (a + ' ' + b) : a : (b || '')
	}
	
	function stringifyClass (value) {
	  var res = '';
	  if (!value) {
	    return res
	  }
	  if (typeof value === 'string') {
	    return value
	  }
	  if (Array.isArray(value)) {
	    var stringified;
	    for (var i = 0, l = value.length; i < l; i++) {
	      if (value[i]) {
	        if ((stringified = stringifyClass(value[i]))) {
	          res += stringified + ' ';
	        }
	      }
	    }
	    return res.slice(0, -1)
	  }
	  if (isObject(value)) {
	    for (var key in value) {
	      if (value[key]) { res += key + ' '; }
	    }
	    return res.slice(0, -1)
	  }
	  /* istanbul ignore next */
	  return res
	}
	
	/*  */
	
	var namespaceMap = {
	  svg: 'http://www.w3.org/2000/svg',
	  math: 'http://www.w3.org/1998/Math/MathML'
	};
	
	var isHTMLTag = makeMap(
	  'html,body,base,head,link,meta,style,title,' +
	  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
	  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
	  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
	  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
	  'embed,object,param,source,canvas,script,noscript,del,ins,' +
	  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
	  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
	  'output,progress,select,textarea,' +
	  'details,dialog,menu,menuitem,summary,' +
	  'content,element,shadow,template'
	);
	
	var isUnaryTag = makeMap(
	  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
	  'link,meta,param,source,track,wbr',
	  true
	);
	
	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	var canBeLeftOpenTag = makeMap(
	  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
	  true
	);
	
	// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
	// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
	var isNonPhrasingTag = makeMap(
	  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
	  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
	  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
	  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
	  'title,tr,track',
	  true
	);
	
	// this map is intentionally selective, only covering SVG elements that may
	// contain child elements.
	var isSVG = makeMap(
	  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,' +
	  'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
	  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
	  true
	);
	
	var isPreTag = function (tag) { return tag === 'pre'; };
	
	var isReservedTag = function (tag) {
	  return isHTMLTag(tag) || isSVG(tag)
	};
	
	function getTagNamespace (tag) {
	  if (isSVG(tag)) {
	    return 'svg'
	  }
	  // basic support for MathML
	  // note it doesn't support other MathML elements being component roots
	  if (tag === 'math') {
	    return 'math'
	  }
	}
	
	var unknownElementCache = Object.create(null);
	function isUnknownElement (tag) {
	  /* istanbul ignore if */
	  if (!inBrowser) {
	    return true
	  }
	  if (isReservedTag(tag)) {
	    return false
	  }
	  tag = tag.toLowerCase();
	  /* istanbul ignore if */
	  if (unknownElementCache[tag] != null) {
	    return unknownElementCache[tag]
	  }
	  var el = document.createElement(tag);
	  if (tag.indexOf('-') > -1) {
	    // http://stackoverflow.com/a/28210364/1070244
	    return (unknownElementCache[tag] = (
	      el.constructor === window.HTMLUnknownElement ||
	      el.constructor === window.HTMLElement
	    ))
	  } else {
	    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
	  }
	}
	
	/*  */
	
	/**
	 * Query an element selector if it's not an element already.
	 */
	function query (el) {
	  if (typeof el === 'string') {
	    var selector = el;
	    el = document.querySelector(el);
	    if (!el) {
	      "development" !== 'production' && warn(
	        'Cannot find element: ' + selector
	      );
	      return document.createElement('div')
	    }
	  }
	  return el
	}
	
	/*  */
	
	function createElement$1 (tagName, vnode) {
	  var elm = document.createElement(tagName);
	  if (tagName !== 'select') {
	    return elm
	  }
	  if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
	    elm.setAttribute('multiple', 'multiple');
	  }
	  return elm
	}
	
	function createElementNS (namespace, tagName) {
	  return document.createElementNS(namespaceMap[namespace], tagName)
	}
	
	function createTextNode (text) {
	  return document.createTextNode(text)
	}
	
	function createComment (text) {
	  return document.createComment(text)
	}
	
	function insertBefore (parentNode, newNode, referenceNode) {
	  parentNode.insertBefore(newNode, referenceNode);
	}
	
	function removeChild (node, child) {
	  node.removeChild(child);
	}
	
	function appendChild (node, child) {
	  node.appendChild(child);
	}
	
	function parentNode (node) {
	  return node.parentNode
	}
	
	function nextSibling (node) {
	  return node.nextSibling
	}
	
	function tagName (node) {
	  return node.tagName
	}
	
	function setTextContent (node, text) {
	  node.textContent = text;
	}
	
	function childNodes (node) {
	  return node.childNodes
	}
	
	function setAttribute (node, key, val) {
	  node.setAttribute(key, val);
	}
	
	
	var nodeOps = Object.freeze({
		createElement: createElement$1,
		createElementNS: createElementNS,
		createTextNode: createTextNode,
		createComment: createComment,
		insertBefore: insertBefore,
		removeChild: removeChild,
		appendChild: appendChild,
		parentNode: parentNode,
		nextSibling: nextSibling,
		tagName: tagName,
		setTextContent: setTextContent,
		childNodes: childNodes,
		setAttribute: setAttribute
	});
	
	/*  */
	
	var ref = {
	  create: function create (_, vnode) {
	    registerRef(vnode);
	  },
	  update: function update (oldVnode, vnode) {
	    if (oldVnode.data.ref !== vnode.data.ref) {
	      registerRef(oldVnode, true);
	      registerRef(vnode);
	    }
	  },
	  destroy: function destroy (vnode) {
	    registerRef(vnode, true);
	  }
	};
	
	function registerRef (vnode, isRemoval) {
	  var key = vnode.data.ref;
	  if (!key) { return }
	
	  var vm = vnode.context;
	  var ref = vnode.child || vnode.elm;
	  var refs = vm.$refs;
	  if (isRemoval) {
	    if (Array.isArray(refs[key])) {
	      remove$1(refs[key], ref);
	    } else if (refs[key] === ref) {
	      refs[key] = undefined;
	    }
	  } else {
	    if (vnode.data.refInFor) {
	      if (Array.isArray(refs[key])) {
	        refs[key].push(ref);
	      } else {
	        refs[key] = [ref];
	      }
	    } else {
	      refs[key] = ref;
	    }
	  }
	}
	
	/**
	 * Virtual DOM patching algorithm based on Snabbdom by
	 * Simon Friis Vindum (@paldepind)
	 * Licensed under the MIT License
	 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
	 *
	 * modified by Evan You (@yyx990803)
	 *
	
	/*
	 * Not type-checking this because this file is perf-critical and the cost
	 * of making flow understand it is not worth it.
	 */
	
	var emptyNode = new VNode('', {}, []);
	
	var hooks$1 = ['create', 'update', 'remove', 'destroy'];
	
	function isUndef (s) {
	  return s == null
	}
	
	function isDef (s) {
	  return s != null
	}
	
	function sameVnode (vnode1, vnode2) {
	  return (
	    vnode1.key === vnode2.key &&
	    vnode1.tag === vnode2.tag &&
	    vnode1.isComment === vnode2.isComment &&
	    !vnode1.data === !vnode2.data
	  )
	}
	
	function createKeyToOldIdx (children, beginIdx, endIdx) {
	  var i, key;
	  var map = {};
	  for (i = beginIdx; i <= endIdx; ++i) {
	    key = children[i].key;
	    if (isDef(key)) { map[key] = i; }
	  }
	  return map
	}
	
	function createPatchFunction (backend) {
	  var i, j;
	  var cbs = {};
	
	  var modules = backend.modules;
	  var nodeOps = backend.nodeOps;
	
	  for (i = 0; i < hooks$1.length; ++i) {
	    cbs[hooks$1[i]] = [];
	    for (j = 0; j < modules.length; ++j) {
	      if (modules[j][hooks$1[i]] !== undefined) { cbs[hooks$1[i]].push(modules[j][hooks$1[i]]); }
	    }
	  }
	
	  function emptyNodeAt (elm) {
	    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
	  }
	
	  function createRmCb (childElm, listeners) {
	    function remove$$1 () {
	      if (--remove$$1.listeners === 0) {
	        removeElement(childElm);
	      }
	    }
	    remove$$1.listeners = listeners;
	    return remove$$1
	  }
	
	  function removeElement (el) {
	    var parent = nodeOps.parentNode(el);
	    nodeOps.removeChild(parent, el);
	  }
	
	  function createElm (vnode, insertedVnodeQueue, nested) {
	    var i;
	    var data = vnode.data;
	    vnode.isRootInsert = !nested;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode); }
	      // after calling the init hook, if the vnode is a child component
	      // it should've created a child instance and mounted it. the child
	      // component also has set the placeholder vnode's elm.
	      // in that case we can just return the element and be done.
	      if (isDef(i = vnode.child)) {
	        initComponent(vnode, insertedVnodeQueue);
	        return vnode.elm
	      }
	    }
	    var children = vnode.children;
	    var tag = vnode.tag;
	    if (isDef(tag)) {
	      {
	        if (
	          !vnode.ns &&
	          !(config.ignoredElements && config.ignoredElements.indexOf(tag) > -1) &&
	          config.isUnknownElement(tag)
	        ) {
	          warn(
	            'Unknown custom element: <' + tag + '> - did you ' +
	            'register the component correctly? For recursive components, ' +
	            'make sure to provide the "name" option.',
	            vnode.context
	          );
	        }
	      }
	      vnode.elm = vnode.ns
	        ? nodeOps.createElementNS(vnode.ns, tag)
	        : nodeOps.createElement(tag, vnode);
	      setScope(vnode);
	      createChildren(vnode, children, insertedVnodeQueue);
	      if (isDef(data)) {
	        invokeCreateHooks(vnode, insertedVnodeQueue);
	      }
	    } else if (vnode.isComment) {
	      vnode.elm = nodeOps.createComment(vnode.text);
	    } else {
	      vnode.elm = nodeOps.createTextNode(vnode.text);
	    }
	    return vnode.elm
	  }
	
	  function createChildren (vnode, children, insertedVnodeQueue) {
	    if (Array.isArray(children)) {
	      for (var i = 0; i < children.length; ++i) {
	        nodeOps.appendChild(vnode.elm, createElm(children[i], insertedVnodeQueue, true));
	      }
	    } else if (isPrimitive(vnode.text)) {
	      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
	    }
	  }
	
	  function isPatchable (vnode) {
	    while (vnode.child) {
	      vnode = vnode.child._vnode;
	    }
	    return isDef(vnode.tag)
	  }
	
	  function invokeCreateHooks (vnode, insertedVnodeQueue) {
	    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
	      cbs.create[i$1](emptyNode, vnode);
	    }
	    i = vnode.data.hook; // Reuse variable
	    if (isDef(i)) {
	      if (i.create) { i.create(emptyNode, vnode); }
	      if (i.insert) { insertedVnodeQueue.push(vnode); }
	    }
	  }
	
	  function initComponent (vnode, insertedVnodeQueue) {
	    if (vnode.data.pendingInsert) {
	      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
	    }
	    vnode.elm = vnode.child.$el;
	    if (isPatchable(vnode)) {
	      invokeCreateHooks(vnode, insertedVnodeQueue);
	      setScope(vnode);
	    } else {
	      // empty component root.
	      // skip all element-related modules except for ref (#3455)
	      registerRef(vnode);
	      // make sure to invoke the insert hook
	      insertedVnodeQueue.push(vnode);
	    }
	  }
	
	  // set scope id attribute for scoped CSS.
	  // this is implemented as a special case to avoid the overhead
	  // of going through the normal attribute patching process.
	  function setScope (vnode) {
	    var i;
	    if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
	      nodeOps.setAttribute(vnode.elm, i, '');
	    }
	    if (isDef(i = activeInstance) &&
	        i !== vnode.context &&
	        isDef(i = i.$options._scopeId)) {
	      nodeOps.setAttribute(vnode.elm, i, '');
	    }
	  }
	
	  function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
	    }
	  }
	
	  function invokeDestroyHook (vnode) {
	    var i, j;
	    var data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
	      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
	    }
	    if (isDef(i = vnode.children)) {
	      for (j = 0; j < vnode.children.length; ++j) {
	        invokeDestroyHook(vnode.children[j]);
	      }
	    }
	  }
	
	  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      var ch = vnodes[startIdx];
	      if (isDef(ch)) {
	        if (isDef(ch.tag)) {
	          removeAndInvokeRemoveHook(ch);
	          invokeDestroyHook(ch);
	        } else { // Text node
	          nodeOps.removeChild(parentElm, ch.elm);
	        }
	      }
	    }
	  }
	
	  function removeAndInvokeRemoveHook (vnode, rm) {
	    if (rm || isDef(vnode.data)) {
	      var listeners = cbs.remove.length + 1;
	      if (!rm) {
	        // directly removing
	        rm = createRmCb(vnode.elm, listeners);
	      } else {
	        // we have a recursively passed down rm callback
	        // increase the listeners count
	        rm.listeners += listeners;
	      }
	      // recursively invoke hooks on child component root node
	      if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
	        removeAndInvokeRemoveHook(i, rm);
	      }
	      for (i = 0; i < cbs.remove.length; ++i) {
	        cbs.remove[i](vnode, rm);
	      }
	      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
	        i(vnode, rm);
	      } else {
	        rm();
	      }
	    } else {
	      removeElement(vnode.elm);
	    }
	  }
	
	  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
	    var oldStartIdx = 0;
	    var newStartIdx = 0;
	    var oldEndIdx = oldCh.length - 1;
	    var oldStartVnode = oldCh[0];
	    var oldEndVnode = oldCh[oldEndIdx];
	    var newEndIdx = newCh.length - 1;
	    var newStartVnode = newCh[0];
	    var newEndVnode = newCh[newEndIdx];
	    var oldKeyToIdx, idxInOld, elmToMove, before;
	
	    // removeOnly is a special flag used only by <transition-group>
	    // to ensure removed elements stay in correct relative positions
	    // during leaving transitions
	    var canMove = !removeOnly;
	
	    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	      if (isUndef(oldStartVnode)) {
	        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	      } else if (isUndef(oldEndVnode)) {
	        oldEndVnode = oldCh[--oldEndIdx];
	      } else if (sameVnode(oldStartVnode, newStartVnode)) {
	        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	        oldStartVnode = oldCh[++oldStartIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else if (sameVnode(oldEndVnode, newEndVnode)) {
	        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
	        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
	        oldStartVnode = oldCh[++oldStartIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
	        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else {
	        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
	        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
	        if (isUndef(idxInOld)) { // New element
	          nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        } else {
	          elmToMove = oldCh[idxInOld];
	          /* istanbul ignore if */
	          if ("development" !== 'production' && !elmToMove) {
	            warn(
	              'It seems there are duplicate keys that is causing an update error. ' +
	              'Make sure each v-for item has a unique key.'
	            );
	          }
	          if (elmToMove.tag !== newStartVnode.tag) {
	            // same key but different element. treat as new element
	            nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	            newStartVnode = newCh[++newStartIdx];
	          } else {
	            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	            oldCh[idxInOld] = undefined;
	            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
	            newStartVnode = newCh[++newStartIdx];
	          }
	        }
	      }
	    }
	    if (oldStartIdx > oldEndIdx) {
	      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
	      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	    } else if (newStartIdx > newEndIdx) {
	      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	    }
	  }
	
	  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
	    if (oldVnode === vnode) {
	      return
	    }
	    // reuse element for static trees.
	    // note we only do this if the vnode is cloned -
	    // if the new node is not cloned it means the render functions have been
	    // reset by the hot-reload-api and we need to do a proper re-render.
	    if (vnode.isStatic &&
	        oldVnode.isStatic &&
	        vnode.key === oldVnode.key &&
	        vnode.isCloned) {
	      vnode.elm = oldVnode.elm;
	      return
	    }
	    var i;
	    var data = vnode.data;
	    var hasData = isDef(data);
	    if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
	      i(oldVnode, vnode);
	    }
	    var elm = vnode.elm = oldVnode.elm;
	    var oldCh = oldVnode.children;
	    var ch = vnode.children;
	    if (hasData && isPatchable(vnode)) {
	      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
	      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
	    }
	    if (isUndef(vnode.text)) {
	      if (isDef(oldCh) && isDef(ch)) {
	        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
	      } else if (isDef(ch)) {
	        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
	        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	      } else if (isDef(oldCh)) {
	        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
	      } else if (isDef(oldVnode.text)) {
	        nodeOps.setTextContent(elm, '');
	      }
	    } else if (oldVnode.text !== vnode.text) {
	      nodeOps.setTextContent(elm, vnode.text);
	    }
	    if (hasData) {
	      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
	    }
	  }
	
	  function invokeInsertHook (vnode, queue, initial) {
	    // delay insert hooks for component root nodes, invoke them after the
	    // element is really inserted
	    if (initial && vnode.parent) {
	      vnode.parent.data.pendingInsert = queue;
	    } else {
	      for (var i = 0; i < queue.length; ++i) {
	        queue[i].data.hook.insert(queue[i]);
	      }
	    }
	  }
	
	  var bailed = false;
	  function hydrate (elm, vnode, insertedVnodeQueue) {
	    {
	      if (!assertNodeMatch(elm, vnode)) {
	        return false
	      }
	    }
	    vnode.elm = elm;
	    var tag = vnode.tag;
	    var data = vnode.data;
	    var children = vnode.children;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
	      if (isDef(i = vnode.child)) {
	        // child component. it should have hydrated its own tree.
	        initComponent(vnode, insertedVnodeQueue);
	        return true
	      }
	    }
	    if (isDef(tag)) {
	      if (isDef(children)) {
	        var childNodes = nodeOps.childNodes(elm);
	        // empty element, allow client to pick up and populate children
	        if (!childNodes.length) {
	          createChildren(vnode, children, insertedVnodeQueue);
	        } else {
	          var childrenMatch = true;
	          if (childNodes.length !== children.length) {
	            childrenMatch = false;
	          } else {
	            for (var i$1 = 0; i$1 < children.length; i$1++) {
	              if (!hydrate(childNodes[i$1], children[i$1], insertedVnodeQueue)) {
	                childrenMatch = false;
	                break
	              }
	            }
	          }
	          if (!childrenMatch) {
	            if ("development" !== 'production' &&
	                typeof console !== 'undefined' &&
	                !bailed) {
	              bailed = true;
	              console.warn('Parent: ', elm);
	              console.warn('Mismatching childNodes vs. VNodes: ', childNodes, children);
	            }
	            return false
	          }
	        }
	      }
	      if (isDef(data)) {
	        invokeCreateHooks(vnode, insertedVnodeQueue);
	      }
	    }
	    return true
	  }
	
	  function assertNodeMatch (node, vnode) {
	    if (vnode.tag) {
	      return (
	        vnode.tag.indexOf('vue-component') === 0 ||
	        vnode.tag === nodeOps.tagName(node).toLowerCase()
	      )
	    } else {
	      return _toString(vnode.text) === node.data
	    }
	  }
	
	  return function patch (oldVnode, vnode, hydrating, removeOnly) {
	    if (!vnode) {
	      if (oldVnode) { invokeDestroyHook(oldVnode); }
	      return
	    }
	
	    var elm, parent;
	    var isInitialPatch = false;
	    var insertedVnodeQueue = [];
	
	    if (!oldVnode) {
	      // empty mount, create new root element
	      isInitialPatch = true;
	      createElm(vnode, insertedVnodeQueue);
	    } else {
	      var isRealElement = isDef(oldVnode.nodeType);
	      if (!isRealElement && sameVnode(oldVnode, vnode)) {
	        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
	      } else {
	        if (isRealElement) {
	          // mounting to a real element
	          // check if this is server-rendered content and if we can perform
	          // a successful hydration.
	          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
	            oldVnode.removeAttribute('server-rendered');
	            hydrating = true;
	          }
	          if (hydrating) {
	            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
	              invokeInsertHook(vnode, insertedVnodeQueue, true);
	              return oldVnode
	            } else {
	              warn(
	                'The client-side rendered virtual DOM tree is not matching ' +
	                'server-rendered content. This is likely caused by incorrect ' +
	                'HTML markup, for example nesting block-level elements inside ' +
	                '<p>, or missing <tbody>. Bailing hydration and performing ' +
	                'full client-side render.'
	              );
	            }
	          }
	          // either not server-rendered, or hydration failed.
	          // create an empty node and replace it
	          oldVnode = emptyNodeAt(oldVnode);
	        }
	        elm = oldVnode.elm;
	        parent = nodeOps.parentNode(elm);
	
	        createElm(vnode, insertedVnodeQueue);
	
	        // component root element replaced.
	        // update parent placeholder node element.
	        if (vnode.parent) {
	          vnode.parent.elm = vnode.elm;
	          if (isPatchable(vnode)) {
	            for (var i = 0; i < cbs.create.length; ++i) {
	              cbs.create[i](emptyNode, vnode.parent);
	            }
	          }
	        }
	
	        if (parent !== null) {
	          nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm));
	          removeVnodes(parent, [oldVnode], 0, 0);
	        } else if (isDef(oldVnode.tag)) {
	          invokeDestroyHook(oldVnode);
	        }
	      }
	    }
	
	    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
	    return vnode.elm
	  }
	}
	
	/*  */
	
	var directives = {
	  create: updateDirectives,
	  update: updateDirectives,
	  destroy: function unbindDirectives (vnode) {
	    updateDirectives(vnode, emptyNode);
	  }
	};
	
	function updateDirectives (
	  oldVnode,
	  vnode
	) {
	  if (!oldVnode.data.directives && !vnode.data.directives) {
	    return
	  }
	  var isCreate = oldVnode === emptyNode;
	  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
	  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);
	
	  var dirsWithInsert = [];
	  var dirsWithPostpatch = [];
	
	  var key, oldDir, dir;
	  for (key in newDirs) {
	    oldDir = oldDirs[key];
	    dir = newDirs[key];
	    if (!oldDir) {
	      // new directive, bind
	      callHook$1(dir, 'bind', vnode, oldVnode);
	      if (dir.def && dir.def.inserted) {
	        dirsWithInsert.push(dir);
	      }
	    } else {
	      // existing directive, update
	      dir.oldValue = oldDir.value;
	      callHook$1(dir, 'update', vnode, oldVnode);
	      if (dir.def && dir.def.componentUpdated) {
	        dirsWithPostpatch.push(dir);
	      }
	    }
	  }
	
	  if (dirsWithInsert.length) {
	    var callInsert = function () {
	      dirsWithInsert.forEach(function (dir) {
	        callHook$1(dir, 'inserted', vnode, oldVnode);
	      });
	    };
	    if (isCreate) {
	      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
	    } else {
	      callInsert();
	    }
	  }
	
	  if (dirsWithPostpatch.length) {
	    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
	      dirsWithPostpatch.forEach(function (dir) {
	        callHook$1(dir, 'componentUpdated', vnode, oldVnode);
	      });
	    }, 'dir-postpatch');
	  }
	
	  if (!isCreate) {
	    for (key in oldDirs) {
	      if (!newDirs[key]) {
	        // no longer present, unbind
	        callHook$1(oldDirs[key], 'unbind', oldVnode);
	      }
	    }
	  }
	}
	
	var emptyModifiers = Object.create(null);
	
	function normalizeDirectives$1 (
	  dirs,
	  vm
	) {
	  var res = Object.create(null);
	  if (!dirs) {
	    return res
	  }
	  var i, dir;
	  for (i = 0; i < dirs.length; i++) {
	    dir = dirs[i];
	    if (!dir.modifiers) {
	      dir.modifiers = emptyModifiers;
	    }
	    res[getRawDirName(dir)] = dir;
	    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
	  }
	  return res
	}
	
	function getRawDirName (dir) {
	  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
	}
	
	function callHook$1 (dir, hook, vnode, oldVnode) {
	  var fn = dir.def && dir.def[hook];
	  if (fn) {
	    fn(vnode.elm, dir, vnode, oldVnode);
	  }
	}
	
	var baseModules = [
	  ref,
	  directives
	];
	
	/*  */
	
	function updateAttrs (oldVnode, vnode) {
	  if (!oldVnode.data.attrs && !vnode.data.attrs) {
	    return
	  }
	  var key, cur, old;
	  var elm = vnode.elm;
	  var oldAttrs = oldVnode.data.attrs || {};
	  var attrs = vnode.data.attrs || {};
	  // clone observed objects, as the user probably wants to mutate it
	  if (attrs.__ob__) {
	    attrs = vnode.data.attrs = extend({}, attrs);
	  }
	
	  for (key in attrs) {
	    cur = attrs[key];
	    old = oldAttrs[key];
	    if (old !== cur) {
	      setAttr(elm, key, cur);
	    }
	  }
	  for (key in oldAttrs) {
	    if (attrs[key] == null) {
	      if (isXlink(key)) {
	        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
	      } else if (!isEnumeratedAttr(key)) {
	        elm.removeAttribute(key);
	      }
	    }
	  }
	}
	
	function setAttr (el, key, value) {
	  if (isBooleanAttr(key)) {
	    // set attribute for blank value
	    // e.g. <option disabled>Select one</option>
	    if (isFalsyAttrValue(value)) {
	      el.removeAttribute(key);
	    } else {
	      el.setAttribute(key, key);
	    }
	  } else if (isEnumeratedAttr(key)) {
	    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
	  } else if (isXlink(key)) {
	    if (isFalsyAttrValue(value)) {
	      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
	    } else {
	      el.setAttributeNS(xlinkNS, key, value);
	    }
	  } else {
	    if (isFalsyAttrValue(value)) {
	      el.removeAttribute(key);
	    } else {
	      el.setAttribute(key, value);
	    }
	  }
	}
	
	var attrs = {
	  create: updateAttrs,
	  update: updateAttrs
	};
	
	/*  */
	
	function updateClass (oldVnode, vnode) {
	  var el = vnode.elm;
	  var data = vnode.data;
	  var oldData = oldVnode.data;
	  if (!data.staticClass && !data.class &&
	      (!oldData || (!oldData.staticClass && !oldData.class))) {
	    return
	  }
	
	  var cls = genClassForVnode(vnode);
	
	  // handle transition classes
	  var transitionClass = el._transitionClasses;
	  if (transitionClass) {
	    cls = concat(cls, stringifyClass(transitionClass));
	  }
	
	  // set the class
	  if (cls !== el._prevClass) {
	    el.setAttribute('class', cls);
	    el._prevClass = cls;
	  }
	}
	
	var klass = {
	  create: updateClass,
	  update: updateClass
	};
	
	// skip type checking this file because we need to attach private properties
	// to elements
	
	function updateDOMListeners (oldVnode, vnode) {
	  if (!oldVnode.data.on && !vnode.data.on) {
	    return
	  }
	  var on = vnode.data.on || {};
	  var oldOn = oldVnode.data.on || {};
	  var add = vnode.elm._v_add || (vnode.elm._v_add = function (event, handler, capture) {
	    vnode.elm.addEventListener(event, handler, capture);
	  });
	  var remove = vnode.elm._v_remove || (vnode.elm._v_remove = function (event, handler) {
	    vnode.elm.removeEventListener(event, handler);
	  });
	  updateListeners(on, oldOn, add, remove, vnode.context);
	}
	
	var events = {
	  create: updateDOMListeners,
	  update: updateDOMListeners
	};
	
	/*  */
	
	function updateDOMProps (oldVnode, vnode) {
	  if (!oldVnode.data.domProps && !vnode.data.domProps) {
	    return
	  }
	  var key, cur;
	  var elm = vnode.elm;
	  var oldProps = oldVnode.data.domProps || {};
	  var props = vnode.data.domProps || {};
	  // clone observed objects, as the user probably wants to mutate it
	  if (props.__ob__) {
	    props = vnode.data.domProps = extend({}, props);
	  }
	
	  for (key in oldProps) {
	    if (props[key] == null) {
	      elm[key] = undefined;
	    }
	  }
	  for (key in props) {
	    // ignore children if the node has textContent or innerHTML,
	    // as these will throw away existing DOM nodes and cause removal errors
	    // on subsequent patches (#3360)
	    if ((key === 'textContent' || key === 'innerHTML') && vnode.children) {
	      vnode.children.length = 0;
	    }
	    cur = props[key];
	    if (key === 'value') {
	      // store value as _value as well since
	      // non-string values will be stringified
	      elm._value = cur;
	      // avoid resetting cursor position when value is the same
	      var strCur = cur == null ? '' : String(cur);
	      if (elm.value !== strCur && !elm.composing) {
	        elm.value = strCur;
	      }
	    } else {
	      elm[key] = cur;
	    }
	  }
	}
	
	var domProps = {
	  create: updateDOMProps,
	  update: updateDOMProps
	};
	
	/*  */
	
	var prefixes = ['Webkit', 'Moz', 'ms'];
	
	var testEl;
	var normalize = cached(function (prop) {
	  testEl = testEl || document.createElement('div');
	  prop = camelize(prop);
	  if (prop !== 'filter' && (prop in testEl.style)) {
	    return prop
	  }
	  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
	  for (var i = 0; i < prefixes.length; i++) {
	    var prefixed = prefixes[i] + upper;
	    if (prefixed in testEl.style) {
	      return prefixed
	    }
	  }
	});
	
	function updateStyle (oldVnode, vnode) {
	  if ((!oldVnode.data || !oldVnode.data.style) && !vnode.data.style) {
	    return
	  }
	  var cur, name;
	  var el = vnode.elm;
	  var oldStyle = oldVnode.data.style || {};
	  var style = vnode.data.style || {};
	
	  // handle string
	  if (typeof style === 'string') {
	    el.style.cssText = style;
	    return
	  }
	
	  var needClone = style.__ob__;
	
	  // handle array syntax
	  if (Array.isArray(style)) {
	    style = vnode.data.style = toObject(style);
	  }
	
	  // clone the style for future updates,
	  // in case the user mutates the style object in-place.
	  if (needClone) {
	    style = vnode.data.style = extend({}, style);
	  }
	
	  for (name in oldStyle) {
	    if (style[name] == null) {
	      el.style[normalize(name)] = '';
	    }
	  }
	  for (name in style) {
	    cur = style[name];
	    if (cur !== oldStyle[name]) {
	      // ie9 setting to null has no effect, must use empty string
	      el.style[normalize(name)] = cur == null ? '' : cur;
	    }
	  }
	}
	
	var style = {
	  create: updateStyle,
	  update: updateStyle
	};
	
	/*  */
	
	/**
	 * Add class with compatibility for SVG since classList is not supported on
	 * SVG elements in IE
	 */
	function addClass (el, cls) {
	  /* istanbul ignore else */
	  if (el.classList) {
	    if (cls.indexOf(' ') > -1) {
	      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
	    } else {
	      el.classList.add(cls);
	    }
	  } else {
	    var cur = ' ' + el.getAttribute('class') + ' ';
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      el.setAttribute('class', (cur + cls).trim());
	    }
	  }
	}
	
	/**
	 * Remove class with compatibility for SVG since classList is not supported on
	 * SVG elements in IE
	 */
	function removeClass (el, cls) {
	  /* istanbul ignore else */
	  if (el.classList) {
	    if (cls.indexOf(' ') > -1) {
	      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
	    } else {
	      el.classList.remove(cls);
	    }
	  } else {
	    var cur = ' ' + el.getAttribute('class') + ' ';
	    var tar = ' ' + cls + ' ';
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ');
	    }
	    el.setAttribute('class', cur.trim());
	  }
	}
	
	/*  */
	
	var hasTransition = inBrowser && !isIE9;
	var TRANSITION = 'transition';
	var ANIMATION = 'animation';
	
	// Transition property/event sniffing
	var transitionProp = 'transition';
	var transitionEndEvent = 'transitionend';
	var animationProp = 'animation';
	var animationEndEvent = 'animationend';
	if (hasTransition) {
	  /* istanbul ignore if */
	  if (window.ontransitionend === undefined &&
	    window.onwebkittransitionend !== undefined) {
	    transitionProp = 'WebkitTransition';
	    transitionEndEvent = 'webkitTransitionEnd';
	  }
	  if (window.onanimationend === undefined &&
	    window.onwebkitanimationend !== undefined) {
	    animationProp = 'WebkitAnimation';
	    animationEndEvent = 'webkitAnimationEnd';
	  }
	}
	
	var raf = (inBrowser && window.requestAnimationFrame) || setTimeout;
	function nextFrame (fn) {
	  raf(function () {
	    raf(fn);
	  });
	}
	
	function addTransitionClass (el, cls) {
	  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
	  addClass(el, cls);
	}
	
	function removeTransitionClass (el, cls) {
	  if (el._transitionClasses) {
	    remove$1(el._transitionClasses, cls);
	  }
	  removeClass(el, cls);
	}
	
	function whenTransitionEnds (
	  el,
	  expectedType,
	  cb
	) {
	  var ref = getTransitionInfo(el, expectedType);
	  var type = ref.type;
	  var timeout = ref.timeout;
	  var propCount = ref.propCount;
	  if (!type) { return cb() }
	  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
	  var ended = 0;
	  var end = function () {
	    el.removeEventListener(event, onEnd);
	    cb();
	  };
	  var onEnd = function (e) {
	    if (e.target === el) {
	      if (++ended >= propCount) {
	        end();
	      }
	    }
	  };
	  setTimeout(function () {
	    if (ended < propCount) {
	      end();
	    }
	  }, timeout + 1);
	  el.addEventListener(event, onEnd);
	}
	
	var transformRE = /\b(transform|all)(,|$)/;
	
	function getTransitionInfo (el, expectedType) {
	  var styles = window.getComputedStyle(el);
	  var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
	  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
	  var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
	  var animationDelays = styles[animationProp + 'Delay'].split(', ');
	  var animationDurations = styles[animationProp + 'Duration'].split(', ');
	  var animationTimeout = getTimeout(animationDelays, animationDurations);
	
	  var type;
	  var timeout = 0;
	  var propCount = 0;
	  /* istanbul ignore if */
	  if (expectedType === TRANSITION) {
	    if (transitionTimeout > 0) {
	      type = TRANSITION;
	      timeout = transitionTimeout;
	      propCount = transitionDurations.length;
	    }
	  } else if (expectedType === ANIMATION) {
	    if (animationTimeout > 0) {
	      type = ANIMATION;
	      timeout = animationTimeout;
	      propCount = animationDurations.length;
	    }
	  } else {
	    timeout = Math.max(transitionTimeout, animationTimeout);
	    type = timeout > 0
	      ? transitionTimeout > animationTimeout
	        ? TRANSITION
	        : ANIMATION
	      : null;
	    propCount = type
	      ? type === TRANSITION
	        ? transitionDurations.length
	        : animationDurations.length
	      : 0;
	  }
	  var hasTransform =
	    type === TRANSITION &&
	    transformRE.test(styles[transitionProp + 'Property']);
	  return {
	    type: type,
	    timeout: timeout,
	    propCount: propCount,
	    hasTransform: hasTransform
	  }
	}
	
	function getTimeout (delays, durations) {
	  return Math.max.apply(null, durations.map(function (d, i) {
	    return toMs(d) + toMs(delays[i])
	  }))
	}
	
	function toMs (s) {
	  return Number(s.slice(0, -1)) * 1000
	}
	
	/*  */
	
	function enter (vnode) {
	  var el = vnode.elm;
	
	  // call leave callback now
	  if (el._leaveCb) {
	    el._leaveCb.cancelled = true;
	    el._leaveCb();
	  }
	
	  var data = resolveTransition(vnode.data.transition);
	  if (!data) {
	    return
	  }
	
	  /* istanbul ignore if */
	  if (el._enterCb || el.nodeType !== 1) {
	    return
	  }
	
	  var css = data.css;
	  var type = data.type;
	  var enterClass = data.enterClass;
	  var enterActiveClass = data.enterActiveClass;
	  var appearClass = data.appearClass;
	  var appearActiveClass = data.appearActiveClass;
	  var beforeEnter = data.beforeEnter;
	  var enter = data.enter;
	  var afterEnter = data.afterEnter;
	  var enterCancelled = data.enterCancelled;
	  var beforeAppear = data.beforeAppear;
	  var appear = data.appear;
	  var afterAppear = data.afterAppear;
	  var appearCancelled = data.appearCancelled;
	
	  // activeInstance will always be the <transition> component managing this
	  // transition. One edge case to check is when the <transition> is placed
	  // as the root node of a child component. In that case we need to check
	  // <transition>'s parent for appear check.
	  var transitionNode = activeInstance.$vnode;
	  var context = transitionNode && transitionNode.parent
	    ? transitionNode.parent.context
	    : activeInstance;
	
	  var isAppear = !context._isMounted || !vnode.isRootInsert;
	
	  if (isAppear && !appear && appear !== '') {
	    return
	  }
	
	  var startClass = isAppear ? appearClass : enterClass;
	  var activeClass = isAppear ? appearActiveClass : enterActiveClass;
	  var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
	  var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
	  var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
	  var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;
	
	  var expectsCSS = css !== false && !isIE9;
	  var userWantsControl =
	    enterHook &&
	    // enterHook may be a bound method which exposes
	    // the length of original fn as _length
	    (enterHook._length || enterHook.length) > 1;
	
	  var cb = el._enterCb = once(function () {
	    if (expectsCSS) {
	      removeTransitionClass(el, activeClass);
	    }
	    if (cb.cancelled) {
	      if (expectsCSS) {
	        removeTransitionClass(el, startClass);
	      }
	      enterCancelledHook && enterCancelledHook(el);
	    } else {
	      afterEnterHook && afterEnterHook(el);
	    }
	    el._enterCb = null;
	  });
	
	  if (!vnode.data.show) {
	    // remove pending leave element on enter by injecting an insert hook
	    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
	      var parent = el.parentNode;
	      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
	      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
	        pendingNode.elm._leaveCb();
	      }
	      enterHook && enterHook(el, cb);
	    }, 'transition-insert');
	  }
	
	  // start enter transition
	  beforeEnterHook && beforeEnterHook(el);
	  if (expectsCSS) {
	    addTransitionClass(el, startClass);
	    addTransitionClass(el, activeClass);
	    nextFrame(function () {
	      removeTransitionClass(el, startClass);
	      if (!cb.cancelled && !userWantsControl) {
	        whenTransitionEnds(el, type, cb);
	      }
	    });
	  }
	
	  if (vnode.data.show) {
	    enterHook && enterHook(el, cb);
	  }
	
	  if (!expectsCSS && !userWantsControl) {
	    cb();
	  }
	}
	
	function leave (vnode, rm) {
	  var el = vnode.elm;
	
	  // call enter callback now
	  if (el._enterCb) {
	    el._enterCb.cancelled = true;
	    el._enterCb();
	  }
	
	  var data = resolveTransition(vnode.data.transition);
	  if (!data) {
	    return rm()
	  }
	
	  /* istanbul ignore if */
	  if (el._leaveCb || el.nodeType !== 1) {
	    return
	  }
	
	  var css = data.css;
	  var type = data.type;
	  var leaveClass = data.leaveClass;
	  var leaveActiveClass = data.leaveActiveClass;
	  var beforeLeave = data.beforeLeave;
	  var leave = data.leave;
	  var afterLeave = data.afterLeave;
	  var leaveCancelled = data.leaveCancelled;
	  var delayLeave = data.delayLeave;
	
	  var expectsCSS = css !== false && !isIE9;
	  var userWantsControl =
	    leave &&
	    // leave hook may be a bound method which exposes
	    // the length of original fn as _length
	    (leave._length || leave.length) > 1;
	
	  var cb = el._leaveCb = once(function () {
	    if (el.parentNode && el.parentNode._pending) {
	      el.parentNode._pending[vnode.key] = null;
	    }
	    if (expectsCSS) {
	      removeTransitionClass(el, leaveActiveClass);
	    }
	    if (cb.cancelled) {
	      if (expectsCSS) {
	        removeTransitionClass(el, leaveClass);
	      }
	      leaveCancelled && leaveCancelled(el);
	    } else {
	      rm();
	      afterLeave && afterLeave(el);
	    }
	    el._leaveCb = null;
	  });
	
	  if (delayLeave) {
	    delayLeave(performLeave);
	  } else {
	    performLeave();
	  }
	
	  function performLeave () {
	    // the delayed leave may have already been cancelled
	    if (cb.cancelled) {
	      return
	    }
	    // record leaving element
	    if (!vnode.data.show) {
	      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
	    }
	    beforeLeave && beforeLeave(el);
	    if (expectsCSS) {
	      addTransitionClass(el, leaveClass);
	      addTransitionClass(el, leaveActiveClass);
	      nextFrame(function () {
	        removeTransitionClass(el, leaveClass);
	        if (!cb.cancelled && !userWantsControl) {
	          whenTransitionEnds(el, type, cb);
	        }
	      });
	    }
	    leave && leave(el, cb);
	    if (!expectsCSS && !userWantsControl) {
	      cb();
	    }
	  }
	}
	
	function resolveTransition (def$$1) {
	  if (!def$$1) {
	    return
	  }
	  /* istanbul ignore else */
	  if (typeof def$$1 === 'object') {
	    var res = {};
	    if (def$$1.css !== false) {
	      extend(res, autoCssTransition(def$$1.name || 'v'));
	    }
	    extend(res, def$$1);
	    return res
	  } else if (typeof def$$1 === 'string') {
	    return autoCssTransition(def$$1)
	  }
	}
	
	var autoCssTransition = cached(function (name) {
	  return {
	    enterClass: (name + "-enter"),
	    leaveClass: (name + "-leave"),
	    appearClass: (name + "-enter"),
	    enterActiveClass: (name + "-enter-active"),
	    leaveActiveClass: (name + "-leave-active"),
	    appearActiveClass: (name + "-enter-active")
	  }
	});
	
	function once (fn) {
	  var called = false;
	  return function () {
	    if (!called) {
	      called = true;
	      fn();
	    }
	  }
	}
	
	var transition = inBrowser ? {
	  create: function create (_, vnode) {
	    if (!vnode.data.show) {
	      enter(vnode);
	    }
	  },
	  remove: function remove (vnode, rm) {
	    /* istanbul ignore else */
	    if (!vnode.data.show) {
	      leave(vnode, rm);
	    } else {
	      rm();
	    }
	  }
	} : {};
	
	var platformModules = [
	  attrs,
	  klass,
	  events,
	  domProps,
	  style,
	  transition
	];
	
	/*  */
	
	// the directive module should be applied last, after all
	// built-in modules have been applied.
	var modules = platformModules.concat(baseModules);
	
	var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });
	
	/**
	 * Not type checking this file because flow doesn't like attaching
	 * properties to Elements.
	 */
	
	var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_\-]*)?$/;
	
	/* istanbul ignore if */
	if (isIE9) {
	  // http://www.matts411.com/post/internet-explorer-9-oninput/
	  document.addEventListener('selectionchange', function () {
	    var el = document.activeElement;
	    if (el && el.vmodel) {
	      trigger(el, 'input');
	    }
	  });
	}
	
	var model = {
	  inserted: function inserted (el, binding, vnode) {
	    {
	      if (!modelableTagRE.test(vnode.tag)) {
	        warn(
	          "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
	          'If you are working with contenteditable, it\'s recommended to ' +
	          'wrap a library dedicated for that purpose inside a custom component.',
	          vnode.context
	        );
	      }
	    }
	    if (vnode.tag === 'select') {
	      var cb = function () {
	        setSelected(el, binding, vnode.context);
	      };
	      cb();
	      /* istanbul ignore if */
	      if (isIE || isEdge) {
	        setTimeout(cb, 0);
	      }
	    } else if (
	      (vnode.tag === 'textarea' || el.type === 'text') &&
	      !binding.modifiers.lazy
	    ) {
	      if (!isAndroid) {
	        el.addEventListener('compositionstart', onCompositionStart);
	        el.addEventListener('compositionend', onCompositionEnd);
	      }
	      /* istanbul ignore if */
	      if (isIE9) {
	        el.vmodel = true;
	      }
	    }
	  },
	  componentUpdated: function componentUpdated (el, binding, vnode) {
	    if (vnode.tag === 'select') {
	      setSelected(el, binding, vnode.context);
	      // in case the options rendered by v-for have changed,
	      // it's possible that the value is out-of-sync with the rendered options.
	      // detect such cases and filter out values that no longer has a matchig
	      // option in the DOM.
	      var needReset = el.multiple
	        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
	        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
	      if (needReset) {
	        trigger(el, 'change');
	      }
	    }
	  }
	};
	
	function setSelected (el, binding, vm) {
	  var value = binding.value;
	  var isMultiple = el.multiple;
	  if (isMultiple && !Array.isArray(value)) {
	    "development" !== 'production' && warn(
	      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
	      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
	      vm
	    );
	    return
	  }
	  var selected, option;
	  for (var i = 0, l = el.options.length; i < l; i++) {
	    option = el.options[i];
	    if (isMultiple) {
	      selected = looseIndexOf(value, getValue(option)) > -1;
	      if (option.selected !== selected) {
	        option.selected = selected;
	      }
	    } else {
	      if (looseEqual(getValue(option), value)) {
	        if (el.selectedIndex !== i) {
	          el.selectedIndex = i;
	        }
	        return
	      }
	    }
	  }
	  if (!isMultiple) {
	    el.selectedIndex = -1;
	  }
	}
	
	function hasNoMatchingOption (value, options) {
	  for (var i = 0, l = options.length; i < l; i++) {
	    if (looseEqual(getValue(options[i]), value)) {
	      return false
	    }
	  }
	  return true
	}
	
	function getValue (option) {
	  return '_value' in option
	    ? option._value
	    : option.value
	}
	
	function onCompositionStart (e) {
	  e.target.composing = true;
	}
	
	function onCompositionEnd (e) {
	  e.target.composing = false;
	  trigger(e.target, 'input');
	}
	
	function trigger (el, type) {
	  var e = document.createEvent('HTMLEvents');
	  e.initEvent(type, true, true);
	  el.dispatchEvent(e);
	}
	
	/*  */
	
	// recursively search for possible transition defined inside the component root
	function locateNode (vnode) {
	  return vnode.child && (!vnode.data || !vnode.data.transition)
	    ? locateNode(vnode.child._vnode)
	    : vnode
	}
	
	var show = {
	  bind: function bind (el, ref, vnode) {
	    var value = ref.value;
	
	    vnode = locateNode(vnode);
	    var transition = vnode.data && vnode.data.transition;
	    if (value && transition && !isIE9) {
	      enter(vnode);
	    }
	    var originalDisplay = el.style.display === 'none' ? '' : el.style.display;
	    el.style.display = value ? originalDisplay : 'none';
	    el.__vOriginalDisplay = originalDisplay;
	  },
	  update: function update (el, ref, vnode) {
	    var value = ref.value;
	    var oldValue = ref.oldValue;
	
	    /* istanbul ignore if */
	    if (value === oldValue) { return }
	    vnode = locateNode(vnode);
	    var transition = vnode.data && vnode.data.transition;
	    if (transition && !isIE9) {
	      if (value) {
	        enter(vnode);
	        el.style.display = el.__vOriginalDisplay;
	      } else {
	        leave(vnode, function () {
	          el.style.display = 'none';
	        });
	      }
	    } else {
	      el.style.display = value ? el.__vOriginalDisplay : 'none';
	    }
	  }
	};
	
	var platformDirectives = {
	  model: model,
	  show: show
	};
	
	/*  */
	
	// Provides transition support for a single element/component.
	// supports transition mode (out-in / in-out)
	
	var transitionProps = {
	  name: String,
	  appear: Boolean,
	  css: Boolean,
	  mode: String,
	  type: String,
	  enterClass: String,
	  leaveClass: String,
	  enterActiveClass: String,
	  leaveActiveClass: String,
	  appearClass: String,
	  appearActiveClass: String
	};
	
	// in case the child is also an abstract component, e.g. <keep-alive>
	// we want to recrusively retrieve the real component to be rendered
	function getRealChild (vnode) {
	  var compOptions = vnode && vnode.componentOptions;
	  if (compOptions && compOptions.Ctor.options.abstract) {
	    return getRealChild(getFirstComponentChild(compOptions.children))
	  } else {
	    return vnode
	  }
	}
	
	function extractTransitionData (comp) {
	  var data = {};
	  var options = comp.$options;
	  // props
	  for (var key in options.propsData) {
	    data[key] = comp[key];
	  }
	  // events.
	  // extract listeners and pass them directly to the transition methods
	  var listeners = options._parentListeners;
	  for (var key$1 in listeners) {
	    data[camelize(key$1)] = listeners[key$1].fn;
	  }
	  return data
	}
	
	function placeholder (h, rawChild) {
	  return /\d-keep-alive$/.test(rawChild.tag)
	    ? h('keep-alive')
	    : null
	}
	
	function hasParentTransition (vnode) {
	  while ((vnode = vnode.parent)) {
	    if (vnode.data.transition) {
	      return true
	    }
	  }
	}
	
	var Transition = {
	  name: 'transition',
	  props: transitionProps,
	  abstract: true,
	  render: function render (h) {
	    var this$1 = this;
	
	    var children = this.$slots.default;
	    if (!children) {
	      return
	    }
	
	    // filter out text nodes (possible whitespaces)
	    children = children.filter(function (c) { return c.tag; });
	    /* istanbul ignore if */
	    if (!children.length) {
	      return
	    }
	
	    // warn multiple elements
	    if ("development" !== 'production' && children.length > 1) {
	      warn(
	        '<transition> can only be used on a single element. Use ' +
	        '<transition-group> for lists.',
	        this.$parent
	      );
	    }
	
	    var mode = this.mode;
	
	    // warn invalid mode
	    if ("development" !== 'production' &&
	        mode && mode !== 'in-out' && mode !== 'out-in') {
	      warn(
	        'invalid <transition> mode: ' + mode,
	        this.$parent
	      );
	    }
	
	    var rawChild = children[0];
	
	    // if this is a component root node and the component's
	    // parent container node also has transition, skip.
	    if (hasParentTransition(this.$vnode)) {
	      return rawChild
	    }
	
	    // apply transition data to child
	    // use getRealChild() to ignore abstract components e.g. keep-alive
	    var child = getRealChild(rawChild);
	    /* istanbul ignore if */
	    if (!child) {
	      return rawChild
	    }
	
	    if (this._leaving) {
	      return placeholder(h, rawChild)
	    }
	
	    var key = child.key = child.key == null || child.isStatic
	      ? ("__v" + (child.tag + this._uid) + "__")
	      : child.key;
	    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
	    var oldRawChild = this._vnode;
	    var oldChild = getRealChild(oldRawChild);
	
	    // mark v-show
	    // so that the transition module can hand over the control to the directive
	    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
	      child.data.show = true;
	    }
	
	    if (oldChild && oldChild.data && oldChild.key !== key) {
	      // replace old child transition data with fresh one
	      // important for dynamic transitions!
	      var oldData = oldChild.data.transition = extend({}, data);
	
	      // handle transition mode
	      if (mode === 'out-in') {
	        // return placeholder node and queue update when leave finishes
	        this._leaving = true;
	        mergeVNodeHook(oldData, 'afterLeave', function () {
	          this$1._leaving = false;
	          this$1.$forceUpdate();
	        }, key);
	        return placeholder(h, rawChild)
	      } else if (mode === 'in-out') {
	        var delayedLeave;
	        var performLeave = function () { delayedLeave(); };
	        mergeVNodeHook(data, 'afterEnter', performLeave, key);
	        mergeVNodeHook(data, 'enterCancelled', performLeave, key);
	        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
	          delayedLeave = leave;
	        }, key);
	      }
	    }
	
	    return rawChild
	  }
	};
	
	/*  */
	
	// Provides transition support for list items.
	// supports move transitions using the FLIP technique.
	
	// Because the vdom's children update algorithm is "unstable" - i.e.
	// it doesn't guarantee the relative positioning of removed elements,
	// we force transition-group to update its children into two passes:
	// in the first pass, we remove all nodes that need to be removed,
	// triggering their leaving transition; in the second pass, we insert/move
	// into the final disired state. This way in the second pass removed
	// nodes will remain where they should be.
	
	var props = extend({
	  tag: String,
	  moveClass: String
	}, transitionProps);
	
	delete props.mode;
	
	var TransitionGroup = {
	  props: props,
	
	  render: function render (h) {
	    var tag = this.tag || this.$vnode.data.tag || 'span';
	    var map = Object.create(null);
	    var prevChildren = this.prevChildren = this.children;
	    var rawChildren = this.$slots.default || [];
	    var children = this.children = [];
	    var transitionData = extractTransitionData(this);
	
	    for (var i = 0; i < rawChildren.length; i++) {
	      var c = rawChildren[i];
	      if (c.tag) {
	        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
	          children.push(c);
	          map[c.key] = c
	          ;(c.data || (c.data = {})).transition = transitionData;
	        } else {
	          var opts = c.componentOptions;
	          var name = opts
	            ? (opts.Ctor.options.name || opts.tag)
	            : c.tag;
	          warn(("<transition-group> children must be keyed: <" + name + ">"));
	        }
	      }
	    }
	
	    if (prevChildren) {
	      var kept = [];
	      var removed = [];
	      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
	        var c$1 = prevChildren[i$1];
	        c$1.data.transition = transitionData;
	        c$1.data.pos = c$1.elm.getBoundingClientRect();
	        if (map[c$1.key]) {
	          kept.push(c$1);
	        } else {
	          removed.push(c$1);
	        }
	      }
	      this.kept = h(tag, null, kept);
	      this.removed = removed;
	    }
	
	    return h(tag, null, children)
	  },
	
	  beforeUpdate: function beforeUpdate () {
	    // force removing pass
	    this.__patch__(
	      this._vnode,
	      this.kept,
	      false, // hydrating
	      true // removeOnly (!important, avoids unnecessary moves)
	    );
	    this._vnode = this.kept;
	  },
	
	  updated: function updated () {
	    var children = this.prevChildren;
	    var moveClass = this.moveClass || (this.name + '-move');
	    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
	      return
	    }
	
	    // we divide the work into three loops to avoid mixing DOM reads and writes
	    // in each iteration - which helps prevent layout thrashing.
	    children.forEach(callPendingCbs);
	    children.forEach(recordPosition);
	    children.forEach(applyTranslation);
	
	    // force reflow to put everything in position
	    var f = document.body.offsetHeight; // eslint-disable-line
	
	    children.forEach(function (c) {
	      if (c.data.moved) {
	        var el = c.elm;
	        var s = el.style;
	        addTransitionClass(el, moveClass);
	        s.transform = s.WebkitTransform = s.transitionDuration = '';
	        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
	          if (!e || /transform$/.test(e.propertyName)) {
	            el.removeEventListener(transitionEndEvent, cb);
	            el._moveCb = null;
	            removeTransitionClass(el, moveClass);
	          }
	        });
	      }
	    });
	  },
	
	  methods: {
	    hasMove: function hasMove (el, moveClass) {
	      /* istanbul ignore if */
	      if (!hasTransition) {
	        return false
	      }
	      if (this._hasMove != null) {
	        return this._hasMove
	      }
	      addTransitionClass(el, moveClass);
	      var info = getTransitionInfo(el);
	      removeTransitionClass(el, moveClass);
	      return (this._hasMove = info.hasTransform)
	    }
	  }
	};
	
	function callPendingCbs (c) {
	  /* istanbul ignore if */
	  if (c.elm._moveCb) {
	    c.elm._moveCb();
	  }
	  /* istanbul ignore if */
	  if (c.elm._enterCb) {
	    c.elm._enterCb();
	  }
	}
	
	function recordPosition (c) {
	  c.data.newPos = c.elm.getBoundingClientRect();
	}
	
	function applyTranslation (c) {
	  var oldPos = c.data.pos;
	  var newPos = c.data.newPos;
	  var dx = oldPos.left - newPos.left;
	  var dy = oldPos.top - newPos.top;
	  if (dx || dy) {
	    c.data.moved = true;
	    var s = c.elm.style;
	    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
	    s.transitionDuration = '0s';
	  }
	}
	
	var platformComponents = {
	  Transition: Transition,
	  TransitionGroup: TransitionGroup
	};
	
	/*  */
	
	// install platform specific utils
	Vue$3.config.isUnknownElement = isUnknownElement;
	Vue$3.config.isReservedTag = isReservedTag;
	Vue$3.config.getTagNamespace = getTagNamespace;
	Vue$3.config.mustUseProp = mustUseProp;
	
	// install platform runtime directives & components
	extend(Vue$3.options.directives, platformDirectives);
	extend(Vue$3.options.components, platformComponents);
	
	// install platform patch function
	Vue$3.prototype.__patch__ = config._isServer ? noop : patch$1;
	
	// wrap mount
	Vue$3.prototype.$mount = function (
	  el,
	  hydrating
	) {
	  el = el && !config._isServer ? query(el) : undefined;
	  return this._mount(el, hydrating)
	};
	
	// devtools global hook
	/* istanbul ignore next */
	setTimeout(function () {
	  if (config.devtools) {
	    if (devtools) {
	      devtools.emit('init', Vue$3);
	    } else if (
	      "development" !== 'production' &&
	      inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
	    ) {
	      console.log(
	        'Download the Vue Devtools for a better development experience:\n' +
	        'https://github.com/vuejs/vue-devtools'
	      );
	    }
	  }
	}, 0);
	
	/*  */
	
	// check whether current browser encodes a char inside attribute values
	function shouldDecode (content, encoded) {
	  var div = document.createElement('div');
	  div.innerHTML = "<div a=\"" + content + "\">";
	  return div.innerHTML.indexOf(encoded) > 0
	}
	
	// #3663
	// IE encodes newlines inside attribute values while other browsers don't
	var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;
	
	/*  */
	
	var decoder = document.createElement('div');
	
	function decode (html) {
	  decoder.innerHTML = html;
	  return decoder.textContent
	}
	
	/**
	 * Not type-checking this file because it's mostly vendor code.
	 */
	
	/*!
	 * HTML Parser By John Resig (ejohn.org)
	 * Modified by Juriy "kangax" Zaytsev
	 * Original code by Erik Arvidsson, Mozilla Public License
	 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
	 */
	
	// Regular Expressions for parsing tags and attributes
	var singleAttrIdentifier = /([^\s"'<>\/=]+)/;
	var singleAttrAssign = /(?:=)/;
	var singleAttrValues = [
	  // attr value double quotes
	  /"([^"]*)"+/.source,
	  // attr value, single quotes
	  /'([^']*)'+/.source,
	  // attr value, no quotes
	  /([^\s"'=<>`]+)/.source
	];
	var attribute = new RegExp(
	  '^\\s*' + singleAttrIdentifier.source +
	  '(?:\\s*(' + singleAttrAssign.source + ')' +
	  '\\s*(?:' + singleAttrValues.join('|') + '))?'
	);
	
	// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
	// but for Vue templates we can enforce a simple charset
	var ncname = '[a-zA-Z_][\\w\\-\\.]*';
	var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
	var startTagOpen = new RegExp('^<' + qnameCapture);
	var startTagClose = /^\s*(\/?)>/;
	var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
	var doctype = /^<!DOCTYPE [^>]+>/i;
	
	var IS_REGEX_CAPTURING_BROKEN = false;
	'x'.replace(/x(.)?/g, function (m, g) {
	  IS_REGEX_CAPTURING_BROKEN = g === '';
	});
	
	// Special Elements (can contain anything)
	var isSpecialTag = makeMap('script,style', true);
	
	var reCache = {};
	
	var ltRE = /&lt;/g;
	var gtRE = /&gt;/g;
	var nlRE = /&#10;/g;
	var ampRE = /&amp;/g;
	var quoteRE = /&quot;/g;
	
	function decodeAttr (value, shouldDecodeNewlines) {
	  if (shouldDecodeNewlines) {
	    value = value.replace(nlRE, '\n');
	  }
	  return value
	    .replace(ltRE, '<')
	    .replace(gtRE, '>')
	    .replace(ampRE, '&')
	    .replace(quoteRE, '"')
	}
	
	function parseHTML (html, options) {
	  var stack = [];
	  var expectHTML = options.expectHTML;
	  var isUnaryTag$$1 = options.isUnaryTag || no;
	  var index = 0;
	  var last, lastTag;
	  while (html) {
	    last = html;
	    // Make sure we're not in a script or style element
	    if (!lastTag || !isSpecialTag(lastTag)) {
	      var textEnd = html.indexOf('<');
	      if (textEnd === 0) {
	        // Comment:
	        if (/^<!--/.test(html)) {
	          var commentEnd = html.indexOf('-->');
	
	          if (commentEnd >= 0) {
	            advance(commentEnd + 3);
	            continue
	          }
	        }
	
	        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
	        if (/^<!\[/.test(html)) {
	          var conditionalEnd = html.indexOf(']>');
	
	          if (conditionalEnd >= 0) {
	            advance(conditionalEnd + 2);
	            continue
	          }
	        }
	
	        // Doctype:
	        var doctypeMatch = html.match(doctype);
	        if (doctypeMatch) {
	          advance(doctypeMatch[0].length);
	          continue
	        }
	
	        // End tag:
	        var endTagMatch = html.match(endTag);
	        if (endTagMatch) {
	          var curIndex = index;
	          advance(endTagMatch[0].length);
	          parseEndTag(endTagMatch[0], endTagMatch[1], curIndex, index);
	          continue
	        }
	
	        // Start tag:
	        var startTagMatch = parseStartTag();
	        if (startTagMatch) {
	          handleStartTag(startTagMatch);
	          continue
	        }
	      }
	
	      var text = void 0;
	      if (textEnd >= 0) {
	        text = html.substring(0, textEnd);
	        advance(textEnd);
	      } else {
	        text = html;
	        html = '';
	      }
	
	      if (options.chars) {
	        options.chars(text);
	      }
	    } else {
	      var stackedTag = lastTag.toLowerCase();
	      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
	      var endTagLength = 0;
	      var rest = html.replace(reStackedTag, function (all, text, endTag) {
	        endTagLength = endTag.length;
	        if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
	          text = text
	            .replace(/<!--([\s\S]*?)-->/g, '$1')
	            .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
	        }
	        if (options.chars) {
	          options.chars(text);
	        }
	        return ''
	      });
	      index += html.length - rest.length;
	      html = rest;
	      parseEndTag('</' + stackedTag + '>', stackedTag, index - endTagLength, index);
	    }
	
	    if (html === last) {
	      throw new Error('Error parsing template:\n\n' + html)
	    }
	  }
	
	  // Clean up any remaining tags
	  parseEndTag();
	
	  function advance (n) {
	    index += n;
	    html = html.substring(n);
	  }
	
	  function parseStartTag () {
	    var start = html.match(startTagOpen);
	    if (start) {
	      var match = {
	        tagName: start[1],
	        attrs: [],
	        start: index
	      };
	      advance(start[0].length);
	      var end, attr;
	      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
	        advance(attr[0].length);
	        match.attrs.push(attr);
	      }
	      if (end) {
	        match.unarySlash = end[1];
	        advance(end[0].length);
	        match.end = index;
	        return match
	      }
	    }
	  }
	
	  function handleStartTag (match) {
	    var tagName = match.tagName;
	    var unarySlash = match.unarySlash;
	
	    if (expectHTML) {
	      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
	        parseEndTag('', lastTag);
	      }
	      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
	        parseEndTag('', tagName);
	      }
	    }
	
	    var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;
	
	    var l = match.attrs.length;
	    var attrs = new Array(l);
	    for (var i = 0; i < l; i++) {
	      var args = match.attrs[i];
	      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
	      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
	        if (args[3] === '') { delete args[3]; }
	        if (args[4] === '') { delete args[4]; }
	        if (args[5] === '') { delete args[5]; }
	      }
	      var value = args[3] || args[4] || args[5] || '';
	      attrs[i] = {
	        name: args[1],
	        value: decodeAttr(
	          value,
	          options.shouldDecodeNewlines
	        )
	      };
	    }
	
	    if (!unary) {
	      stack.push({ tag: tagName, attrs: attrs });
	      lastTag = tagName;
	      unarySlash = '';
	    }
	
	    if (options.start) {
	      options.start(tagName, attrs, unary, match.start, match.end);
	    }
	  }
	
	  function parseEndTag (tag, tagName, start, end) {
	    var pos;
	    if (start == null) { start = index; }
	    if (end == null) { end = index; }
	
	    // Find the closest opened tag of the same type
	    if (tagName) {
	      var needle = tagName.toLowerCase();
	      for (pos = stack.length - 1; pos >= 0; pos--) {
	        if (stack[pos].tag.toLowerCase() === needle) {
	          break
	        }
	      }
	    } else {
	      // If no tag name is provided, clean shop
	      pos = 0;
	    }
	
	    if (pos >= 0) {
	      // Close all the open elements, up the stack
	      for (var i = stack.length - 1; i >= pos; i--) {
	        if (options.end) {
	          options.end(stack[i].tag, start, end);
	        }
	      }
	
	      // Remove the open elements from the stack
	      stack.length = pos;
	      lastTag = pos && stack[pos - 1].tag;
	    } else if (tagName.toLowerCase() === 'br') {
	      if (options.start) {
	        options.start(tagName, [], true, start, end);
	      }
	    } else if (tagName.toLowerCase() === 'p') {
	      if (options.start) {
	        options.start(tagName, [], false, start, end);
	      }
	      if (options.end) {
	        options.end(tagName, start, end);
	      }
	    }
	  }
	}
	
	/*  */
	
	function parseFilters (exp) {
	  var inSingle = false;
	  var inDouble = false;
	  var curly = 0;
	  var square = 0;
	  var paren = 0;
	  var lastFilterIndex = 0;
	  var c, prev, i, expression, filters;
	
	  for (i = 0; i < exp.length; i++) {
	    prev = c;
	    c = exp.charCodeAt(i);
	    if (inSingle) {
	      // check single quote
	      if (c === 0x27 && prev !== 0x5C) { inSingle = !inSingle; }
	    } else if (inDouble) {
	      // check double quote
	      if (c === 0x22 && prev !== 0x5C) { inDouble = !inDouble; }
	    } else if (
	      c === 0x7C && // pipe
	      exp.charCodeAt(i + 1) !== 0x7C &&
	      exp.charCodeAt(i - 1) !== 0x7C &&
	      !curly && !square && !paren
	    ) {
	      if (expression === undefined) {
	        // first filter, end of expression
	        lastFilterIndex = i + 1;
	        expression = exp.slice(0, i).trim();
	      } else {
	        pushFilter();
	      }
	    } else {
	      switch (c) {
	        case 0x22: inDouble = true; break // "
	        case 0x27: inSingle = true; break // '
	        case 0x28: paren++; break         // (
	        case 0x29: paren--; break         // )
	        case 0x5B: square++; break        // [
	        case 0x5D: square--; break        // ]
	        case 0x7B: curly++; break         // {
	        case 0x7D: curly--; break         // }
	      }
	    }
	  }
	
	  if (expression === undefined) {
	    expression = exp.slice(0, i).trim();
	  } else if (lastFilterIndex !== 0) {
	    pushFilter();
	  }
	
	  function pushFilter () {
	    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
	    lastFilterIndex = i + 1;
	  }
	
	  if (filters) {
	    for (i = 0; i < filters.length; i++) {
	      expression = wrapFilter(expression, filters[i]);
	    }
	  }
	
	  return expression
	}
	
	function wrapFilter (exp, filter) {
	  var i = filter.indexOf('(');
	  if (i < 0) {
	    // _f: resolveFilter
	    return ("_f(\"" + filter + "\")(" + exp + ")")
	  } else {
	    var name = filter.slice(0, i);
	    var args = filter.slice(i + 1);
	    return ("_f(\"" + name + "\")(" + exp + "," + args)
	  }
	}
	
	/*  */
	
	var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
	var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
	
	var buildRegex = cached(function (delimiters) {
	  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
	  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
	  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
	});
	
	function parseText (
	  text,
	  delimiters
	) {
	  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
	  if (!tagRE.test(text)) {
	    return
	  }
	  var tokens = [];
	  var lastIndex = tagRE.lastIndex = 0;
	  var match, index;
	  while ((match = tagRE.exec(text))) {
	    index = match.index;
	    // push text token
	    if (index > lastIndex) {
	      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
	    }
	    // tag token
	    var exp = parseFilters(match[1].trim());
	    tokens.push(("_s(" + exp + ")"));
	    lastIndex = index + match[0].length;
	  }
	  if (lastIndex < text.length) {
	    tokens.push(JSON.stringify(text.slice(lastIndex)));
	  }
	  return tokens.join('+')
	}
	
	/*  */
	
	function baseWarn (msg) {
	  console.error(("[Vue parser]: " + msg));
	}
	
	function pluckModuleFunction (
	  modules,
	  key
	) {
	  return modules
	    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
	    : []
	}
	
	function addProp (el, name, value) {
	  (el.props || (el.props = [])).push({ name: name, value: value });
	}
	
	function addAttr (el, name, value) {
	  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
	}
	
	function addDirective (
	  el,
	  name,
	  rawName,
	  value,
	  arg,
	  modifiers
	) {
	  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
	}
	
	function addHandler (
	  el,
	  name,
	  value,
	  modifiers,
	  important
	) {
	  // check capture modifier
	  if (modifiers && modifiers.capture) {
	    delete modifiers.capture;
	    name = '!' + name; // mark the event as captured
	  }
	  var events;
	  if (modifiers && modifiers.native) {
	    delete modifiers.native;
	    events = el.nativeEvents || (el.nativeEvents = {});
	  } else {
	    events = el.events || (el.events = {});
	  }
	  var newHandler = { value: value, modifiers: modifiers };
	  var handlers = events[name];
	  /* istanbul ignore if */
	  if (Array.isArray(handlers)) {
	    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
	  } else if (handlers) {
	    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
	  } else {
	    events[name] = newHandler;
	  }
	}
	
	function getBindingAttr (
	  el,
	  name,
	  getStatic
	) {
	  var dynamicValue =
	    getAndRemoveAttr(el, ':' + name) ||
	    getAndRemoveAttr(el, 'v-bind:' + name);
	  if (dynamicValue != null) {
	    return dynamicValue
	  } else if (getStatic !== false) {
	    var staticValue = getAndRemoveAttr(el, name);
	    if (staticValue != null) {
	      return JSON.stringify(staticValue)
	    }
	  }
	}
	
	function getAndRemoveAttr (el, name) {
	  var val;
	  if ((val = el.attrsMap[name]) != null) {
	    var list = el.attrsList;
	    for (var i = 0, l = list.length; i < l; i++) {
	      if (list[i].name === name) {
	        list.splice(i, 1);
	        break
	      }
	    }
	  }
	  return val
	}
	
	/*  */
	
	var dirRE = /^v-|^@|^:/;
	var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
	var forIteratorRE = /\(([^,]*),([^,]*)(?:,([^,]*))?\)/;
	var bindRE = /^:|^v-bind:/;
	var onRE = /^@|^v-on:/;
	var argRE = /:(.*)$/;
	var modifierRE = /\.[^\.]+/g;
	var specialNewlineRE = /\u2028|\u2029/g;
	
	var decodeHTMLCached = cached(decode);
	
	// configurable state
	var warn$1;
	var platformGetTagNamespace;
	var platformMustUseProp;
	var platformIsPreTag;
	var preTransforms;
	var transforms;
	var postTransforms;
	var delimiters;
	
	/**
	 * Convert HTML string to AST.
	 */
	function parse (
	  template,
	  options
	) {
	  warn$1 = options.warn || baseWarn;
	  platformGetTagNamespace = options.getTagNamespace || no;
	  platformMustUseProp = options.mustUseProp || no;
	  platformIsPreTag = options.isPreTag || no;
	  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
	  transforms = pluckModuleFunction(options.modules, 'transformNode');
	  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
	  delimiters = options.delimiters;
	  var stack = [];
	  var preserveWhitespace = options.preserveWhitespace !== false;
	  var root;
	  var currentParent;
	  var inVPre = false;
	  var inPre = false;
	  var warned = false;
	  parseHTML(template, {
	    expectHTML: options.expectHTML,
	    isUnaryTag: options.isUnaryTag,
	    shouldDecodeNewlines: options.shouldDecodeNewlines,
	    start: function start (tag, attrs, unary) {
	      // check namespace.
	      // inherit parent ns if there is one
	      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);
	
	      // handle IE svg bug
	      /* istanbul ignore if */
	      if (options.isIE && ns === 'svg') {
	        attrs = guardIESVGBug(attrs);
	      }
	
	      var element = {
	        type: 1,
	        tag: tag,
	        attrsList: attrs,
	        attrsMap: makeAttrsMap(attrs, options.isIE),
	        parent: currentParent,
	        children: []
	      };
	      if (ns) {
	        element.ns = ns;
	      }
	
	      if ("client" !== 'server' && isForbiddenTag(element)) {
	        element.forbidden = true;
	        "development" !== 'production' && warn$1(
	          'Templates should only be responsible for mapping the state to the ' +
	          'UI. Avoid placing tags with side-effects in your templates, such as ' +
	          "<" + tag + ">."
	        );
	      }
	
	      // apply pre-transforms
	      for (var i = 0; i < preTransforms.length; i++) {
	        preTransforms[i](element, options);
	      }
	
	      if (!inVPre) {
	        processPre(element);
	        if (element.pre) {
	          inVPre = true;
	        }
	      }
	      if (platformIsPreTag(element.tag)) {
	        inPre = true;
	      }
	      if (inVPre) {
	        processRawAttrs(element);
	      } else {
	        processFor(element);
	        processIf(element);
	        processOnce(element);
	        processKey(element);
	
	        // determine whether this is a plain element after
	        // removing structural attributes
	        element.plain = !element.key && !attrs.length;
	
	        processRef(element);
	        processSlot(element);
	        processComponent(element);
	        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
	          transforms[i$1](element, options);
	        }
	        processAttrs(element);
	      }
	
	      function checkRootConstraints (el) {
	        {
	          if (el.tag === 'slot' || el.tag === 'template') {
	            warn$1(
	              "Cannot use <" + (el.tag) + "> as component root element because it may " +
	              'contain multiple nodes:\n' + template
	            );
	          }
	          if (el.attrsMap.hasOwnProperty('v-for')) {
	            warn$1(
	              'Cannot use v-for on stateful component root element because ' +
	              'it renders multiple elements:\n' + template
	            );
	          }
	        }
	      }
	
	      // tree management
	      if (!root) {
	        root = element;
	        checkRootConstraints(root);
	      } else if ("development" !== 'production' && !stack.length && !warned) {
	        // allow 2 root elements with v-if and v-else
	        if (root.if && element.else) {
	          checkRootConstraints(element);
	          root.elseBlock = element;
	        } else {
	          warned = true;
	          warn$1(
	            ("Component template should contain exactly one root element:\n\n" + template)
	          );
	        }
	      }
	      if (currentParent && !element.forbidden) {
	        if (element.else) {
	          processElse(element, currentParent);
	        } else {
	          currentParent.children.push(element);
	          element.parent = currentParent;
	        }
	      }
	      if (!unary) {
	        currentParent = element;
	        stack.push(element);
	      }
	      // apply post-transforms
	      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
	        postTransforms[i$2](element, options);
	      }
	    },
	
	    end: function end () {
	      // remove trailing whitespace
	      var element = stack[stack.length - 1];
	      var lastNode = element.children[element.children.length - 1];
	      if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
	        element.children.pop();
	      }
	      // pop stack
	      stack.length -= 1;
	      currentParent = stack[stack.length - 1];
	      // check pre state
	      if (element.pre) {
	        inVPre = false;
	      }
	      if (platformIsPreTag(element.tag)) {
	        inPre = false;
	      }
	    },
	
	    chars: function chars (text) {
	      if (!currentParent) {
	        if ("development" !== 'production' && !warned && text === template) {
	          warned = true;
	          warn$1(
	            'Component template requires a root element, rather than just text:\n\n' + template
	          );
	        }
	        return
	      }
	      text = inPre || text.trim()
	        ? decodeHTMLCached(text)
	        // only preserve whitespace if its not right after a starting tag
	        : preserveWhitespace && currentParent.children.length ? ' ' : '';
	      if (text) {
	        var expression;
	        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
	          currentParent.children.push({
	            type: 2,
	            expression: expression,
	            text: text
	          });
	        } else {
	          // #3895 special character
	          text = text.replace(specialNewlineRE, '');
	          currentParent.children.push({
	            type: 3,
	            text: text
	          });
	        }
	      }
	    }
	  });
	  return root
	}
	
	function processPre (el) {
	  if (getAndRemoveAttr(el, 'v-pre') != null) {
	    el.pre = true;
	  }
	}
	
	function processRawAttrs (el) {
	  var l = el.attrsList.length;
	  if (l) {
	    var attrs = el.attrs = new Array(l);
	    for (var i = 0; i < l; i++) {
	      attrs[i] = {
	        name: el.attrsList[i].name,
	        value: JSON.stringify(el.attrsList[i].value)
	      };
	    }
	  } else if (!el.pre) {
	    // non root node in pre blocks with no attributes
	    el.plain = true;
	  }
	}
	
	function processKey (el) {
	  var exp = getBindingAttr(el, 'key');
	  if (exp) {
	    if ("development" !== 'production' && el.tag === 'template') {
	      warn$1("<template> cannot be keyed. Place the key on real elements instead.");
	    }
	    el.key = exp;
	  }
	}
	
	function processRef (el) {
	  var ref = getBindingAttr(el, 'ref');
	  if (ref) {
	    el.ref = ref;
	    el.refInFor = checkInFor(el);
	  }
	}
	
	function processFor (el) {
	  var exp;
	  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
	    var inMatch = exp.match(forAliasRE);
	    if (!inMatch) {
	      "development" !== 'production' && warn$1(
	        ("Invalid v-for expression: " + exp)
	      );
	      return
	    }
	    el.for = inMatch[2].trim();
	    var alias = inMatch[1].trim();
	    var iteratorMatch = alias.match(forIteratorRE);
	    if (iteratorMatch) {
	      el.alias = iteratorMatch[1].trim();
	      el.iterator1 = iteratorMatch[2].trim();
	      if (iteratorMatch[3]) {
	        el.iterator2 = iteratorMatch[3].trim();
	      }
	    } else {
	      el.alias = alias;
	    }
	  }
	}
	
	function processIf (el) {
	  var exp = getAndRemoveAttr(el, 'v-if');
	  if (exp) {
	    el.if = exp;
	  }
	  if (getAndRemoveAttr(el, 'v-else') != null) {
	    el.else = true;
	  }
	}
	
	function processElse (el, parent) {
	  var prev = findPrevElement(parent.children);
	  if (prev && prev.if) {
	    prev.elseBlock = el;
	  } else {
	    warn$1(
	      ("v-else used on element <" + (el.tag) + "> without corresponding v-if.")
	    );
	  }
	}
	
	function processOnce (el) {
	  var once = getAndRemoveAttr(el, 'v-once');
	  if (once != null) {
	    el.once = true;
	  }
	}
	
	function processSlot (el) {
	  if (el.tag === 'slot') {
	    el.slotName = getBindingAttr(el, 'name');
	  } else {
	    var slotTarget = getBindingAttr(el, 'slot');
	    if (slotTarget) {
	      el.slotTarget = slotTarget;
	    }
	  }
	}
	
	function processComponent (el) {
	  var binding;
	  if ((binding = getBindingAttr(el, 'is'))) {
	    el.component = binding;
	  }
	  if (getAndRemoveAttr(el, 'inline-template') != null) {
	    el.inlineTemplate = true;
	  }
	}
	
	function processAttrs (el) {
	  var list = el.attrsList;
	  var i, l, name, rawName, value, arg, modifiers, isProp;
	  for (i = 0, l = list.length; i < l; i++) {
	    name = rawName = list[i].name;
	    value = list[i].value;
	    if (dirRE.test(name)) {
	      // mark element as dynamic
	      el.hasBindings = true;
	      // modifiers
	      modifiers = parseModifiers(name);
	      if (modifiers) {
	        name = name.replace(modifierRE, '');
	      }
	      if (bindRE.test(name)) { // v-bind
	        name = name.replace(bindRE, '');
	        if (modifiers && modifiers.prop) {
	          isProp = true;
	          name = camelize(name);
	          if (name === 'innerHtml') { name = 'innerHTML'; }
	        }
	        if (isProp || platformMustUseProp(name)) {
	          addProp(el, name, value);
	        } else {
	          addAttr(el, name, value);
	        }
	      } else if (onRE.test(name)) { // v-on
	        name = name.replace(onRE, '');
	        addHandler(el, name, value, modifiers);
	      } else { // normal directives
	        name = name.replace(dirRE, '');
	        // parse arg
	        var argMatch = name.match(argRE);
	        if (argMatch && (arg = argMatch[1])) {
	          name = name.slice(0, -(arg.length + 1));
	        }
	        addDirective(el, name, rawName, value, arg, modifiers);
	        if ("development" !== 'production' && name === 'model') {
	          checkForAliasModel(el, value);
	        }
	      }
	    } else {
	      // literal attribute
	      {
	        var expression = parseText(value, delimiters);
	        if (expression) {
	          warn$1(
	            name + "=\"" + value + "\": " +
	            'Interpolation inside attributes has been deprecated. ' +
	            'Use v-bind or the colon shorthand instead.'
	          );
	        }
	      }
	      addAttr(el, name, JSON.stringify(value));
	    }
	  }
	}
	
	function checkInFor (el) {
	  var parent = el;
	  while (parent) {
	    if (parent.for !== undefined) {
	      return true
	    }
	    parent = parent.parent;
	  }
	  return false
	}
	
	function parseModifiers (name) {
	  var match = name.match(modifierRE);
	  if (match) {
	    var ret = {};
	    match.forEach(function (m) { ret[m.slice(1)] = true; });
	    return ret
	  }
	}
	
	function makeAttrsMap (attrs, isIE) {
	  var map = {};
	  for (var i = 0, l = attrs.length; i < l; i++) {
	    if ("development" !== 'production' && map[attrs[i].name] && !isIE) {
	      warn$1('duplicate attribute: ' + attrs[i].name);
	    }
	    map[attrs[i].name] = attrs[i].value;
	  }
	  return map
	}
	
	function findPrevElement (children) {
	  var i = children.length;
	  while (i--) {
	    if (children[i].tag) { return children[i] }
	  }
	}
	
	function isForbiddenTag (el) {
	  return (
	    el.tag === 'style' ||
	    (el.tag === 'script' && (
	      !el.attrsMap.type ||
	      el.attrsMap.type === 'text/javascript'
	    ))
	  )
	}
	
	var ieNSBug = /^xmlns:NS\d+/;
	var ieNSPrefix = /^NS\d+:/;
	
	/* istanbul ignore next */
	function guardIESVGBug (attrs) {
	  var res = [];
	  for (var i = 0; i < attrs.length; i++) {
	    var attr = attrs[i];
	    if (!ieNSBug.test(attr.name)) {
	      attr.name = attr.name.replace(ieNSPrefix, '');
	      res.push(attr);
	    }
	  }
	  return res
	}
	
	function checkForAliasModel (el, value) {
	  var _el = el;
	  while (_el) {
	    if (_el.for && _el.alias === value) {
	      warn$1(
	        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
	        "You are binding v-model directly to a v-for iteration alias. " +
	        "This will not be able to modify the v-for source array because " +
	        "writing to the alias is like modifying a function local variable. " +
	        "Consider using an array of objects and use v-model on an object property instead."
	      );
	    }
	    _el = _el.parent;
	  }
	}
	
	/*  */
	
	var isStaticKey;
	var isPlatformReservedTag;
	
	var genStaticKeysCached = cached(genStaticKeys$1);
	
	/**
	 * Goal of the optimizier: walk the generated template AST tree
	 * and detect sub-trees that are purely static, i.e. parts of
	 * the DOM that never needs to change.
	 *
	 * Once we detect these sub-trees, we can:
	 *
	 * 1. Hoist them into constants, so that we no longer need to
	 *    create fresh nodes for them on each re-render;
	 * 2. Completely skip them in the patching process.
	 */
	function optimize (root, options) {
	  if (!root) { return }
	  isStaticKey = genStaticKeysCached(options.staticKeys || '');
	  isPlatformReservedTag = options.isReservedTag || (function () { return false; });
	  // first pass: mark all non-static nodes.
	  markStatic(root);
	  // second pass: mark static roots.
	  markStaticRoots(root, false);
	}
	
	function genStaticKeys$1 (keys) {
	  return makeMap(
	    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
	    (keys ? ',' + keys : '')
	  )
	}
	
	function markStatic (node) {
	  node.static = isStatic(node);
	  if (node.type === 1) {
	    for (var i = 0, l = node.children.length; i < l; i++) {
	      var child = node.children[i];
	      markStatic(child);
	      if (!child.static) {
	        node.static = false;
	      }
	    }
	  }
	}
	
	function markStaticRoots (node, isInFor) {
	  if (node.type === 1) {
	    if (node.once || node.static) {
	      node.staticRoot = true;
	      node.staticInFor = isInFor;
	      return
	    }
	    if (node.children) {
	      for (var i = 0, l = node.children.length; i < l; i++) {
	        markStaticRoots(node.children[i], isInFor || !!node.for);
	      }
	    }
	  }
	}
	
	function isStatic (node) {
	  if (node.type === 2) { // expression
	    return false
	  }
	  if (node.type === 3) { // text
	    return true
	  }
	  return !!(node.pre || (
	    !node.hasBindings && // no dynamic bindings
	    !node.if && !node.for && // not v-if or v-for or v-else
	    !isBuiltInTag(node.tag) && // not a built-in
	    isPlatformReservedTag(node.tag) && // not a component
	    !isDirectChildOfTemplateFor(node) &&
	    Object.keys(node).every(isStaticKey)
	  ))
	}
	
	function isDirectChildOfTemplateFor (node) {
	  while (node.parent) {
	    node = node.parent;
	    if (node.tag !== 'template') {
	      return false
	    }
	    if (node.for) {
	      return true
	    }
	  }
	  return false
	}
	
	/*  */
	
	var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*\s*$/;
	
	// keyCode aliases
	var keyCodes = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  space: 32,
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40,
	  'delete': [8, 46]
	};
	
	var modifierCode = {
	  stop: '$event.stopPropagation();',
	  prevent: '$event.preventDefault();',
	  self: 'if($event.target !== $event.currentTarget)return;'
	};
	
	function genHandlers (events, native) {
	  var res = native ? 'nativeOn:{' : 'on:{';
	  for (var name in events) {
	    res += "\"" + name + "\":" + (genHandler(events[name])) + ",";
	  }
	  return res.slice(0, -1) + '}'
	}
	
	function genHandler (
	  handler
	) {
	  if (!handler) {
	    return 'function(){}'
	  } else if (Array.isArray(handler)) {
	    return ("[" + (handler.map(genHandler).join(',')) + "]")
	  } else if (!handler.modifiers) {
	    return simplePathRE.test(handler.value)
	      ? handler.value
	      : ("function($event){" + (handler.value) + "}")
	  } else {
	    var code = '';
	    var keys = [];
	    for (var key in handler.modifiers) {
	      if (modifierCode[key]) {
	        code += modifierCode[key];
	      } else {
	        keys.push(key);
	      }
	    }
	    if (keys.length) {
	      code = genKeyFilter(keys) + code;
	    }
	    var handlerCode = simplePathRE.test(handler.value)
	      ? handler.value + '($event)'
	      : handler.value;
	    return 'function($event){' + code + handlerCode + '}'
	  }
	}
	
	function genKeyFilter (keys) {
	  var code = keys.length === 1
	    ? normalizeKeyCode(keys[0])
	    : Array.prototype.concat.apply([], keys.map(normalizeKeyCode));
	  if (Array.isArray(code)) {
	    return ("if(" + (code.map(function (c) { return ("$event.keyCode!==" + c); }).join('&&')) + ")return;")
	  } else {
	    return ("if($event.keyCode!==" + code + ")return;")
	  }
	}
	
	function normalizeKeyCode (key) {
	  return (
	    parseInt(key, 10) || // number keyCode
	    keyCodes[key] || // built-in alias
	    ("_k(" + (JSON.stringify(key)) + ")") // custom alias
	  )
	}
	
	/*  */
	
	function bind$2 (el, dir) {
	  el.wrapData = function (code) {
	    return ("_b(" + code + "," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
	  };
	}
	
	var baseDirectives = {
	  bind: bind$2,
	  cloak: noop
	};
	
	/*  */
	
	// configurable state
	var warn$2;
	var transforms$1;
	var dataGenFns;
	var platformDirectives$1;
	var staticRenderFns;
	var currentOptions;
	
	function generate (
	  ast,
	  options
	) {
	  // save previous staticRenderFns so generate calls can be nested
	  var prevStaticRenderFns = staticRenderFns;
	  var currentStaticRenderFns = staticRenderFns = [];
	  currentOptions = options;
	  warn$2 = options.warn || baseWarn;
	  transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
	  dataGenFns = pluckModuleFunction(options.modules, 'genData');
	  platformDirectives$1 = options.directives || {};
	  var code = ast ? genElement(ast) : '_h("div")';
	  staticRenderFns = prevStaticRenderFns;
	  return {
	    render: ("with(this){return " + code + "}"),
	    staticRenderFns: currentStaticRenderFns
	  }
	}
	
	function genElement (el) {
	  if (el.staticRoot && !el.staticProcessed) {
	    // hoist static sub-trees out
	    el.staticProcessed = true;
	    staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
	    return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
	  } else if (el.for && !el.forProcessed) {
	    return genFor(el)
	  } else if (el.if && !el.ifProcessed) {
	    return genIf(el)
	  } else if (el.tag === 'template' && !el.slotTarget) {
	    return genChildren(el) || 'void 0'
	  } else if (el.tag === 'slot') {
	    return genSlot(el)
	  } else {
	    // component or element
	    var code;
	    if (el.component) {
	      code = genComponent(el);
	    } else {
	      var data = genData(el);
	      var children = el.inlineTemplate ? null : genChildren(el);
	      code = "_h('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
	    }
	    // module transforms
	    for (var i = 0; i < transforms$1.length; i++) {
	      code = transforms$1[i](el, code);
	    }
	    return code
	  }
	}
	
	function genIf (el) {
	  var exp = el.if;
	  el.ifProcessed = true; // avoid recursion
	  return ("(" + exp + ")?" + (genElement(el)) + ":" + (genElse(el)))
	}
	
	function genElse (el) {
	  return el.elseBlock
	    ? genElement(el.elseBlock)
	    : '_e()'
	}
	
	function genFor (el) {
	  var exp = el.for;
	  var alias = el.alias;
	  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
	  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
	  el.forProcessed = true; // avoid recursion
	  return "_l((" + exp + ")," +
	    "function(" + alias + iterator1 + iterator2 + "){" +
	      "return " + (genElement(el)) +
	    '})'
	}
	
	function genData (el) {
	  if (el.plain) {
	    return
	  }
	
	  var data = '{';
	
	  // directives first.
	  // directives may mutate the el's other properties before they are generated.
	  var dirs = genDirectives(el);
	  if (dirs) { data += dirs + ','; }
	
	  // key
	  if (el.key) {
	    data += "key:" + (el.key) + ",";
	  }
	  // ref
	  if (el.ref) {
	    data += "ref:" + (el.ref) + ",";
	  }
	  if (el.refInFor) {
	    data += "refInFor:true,";
	  }
	  // record original tag name for components using "is" attribute
	  if (el.component) {
	    data += "tag:\"" + (el.tag) + "\",";
	  }
	  // slot target
	  if (el.slotTarget) {
	    data += "slot:" + (el.slotTarget) + ",";
	  }
	  // module data generation functions
	  for (var i = 0; i < dataGenFns.length; i++) {
	    data += dataGenFns[i](el);
	  }
	  // attributes
	  if (el.attrs) {
	    data += "attrs:{" + (genProps(el.attrs)) + "},";
	  }
	  // DOM props
	  if (el.props) {
	    data += "domProps:{" + (genProps(el.props)) + "},";
	  }
	  // event handlers
	  if (el.events) {
	    data += (genHandlers(el.events)) + ",";
	  }
	  if (el.nativeEvents) {
	    data += (genHandlers(el.nativeEvents, true)) + ",";
	  }
	  // inline-template
	  if (el.inlineTemplate) {
	    var ast = el.children[0];
	    if ("development" !== 'production' && (
	      el.children.length > 1 || ast.type !== 1
	    )) {
	      warn$2('Inline-template components must have exactly one child element.');
	    }
	    if (ast.type === 1) {
	      var inlineRenderFns = generate(ast, currentOptions);
	      data += "inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}";
	    }
	  }
	  data = data.replace(/,$/, '') + '}';
	  // v-bind data wrap
	  if (el.wrapData) {
	    data = el.wrapData(data);
	  }
	  return data
	}
	
	function genDirectives (el) {
	  var dirs = el.directives;
	  if (!dirs) { return }
	  var res = 'directives:[';
	  var hasRuntime = false;
	  var i, l, dir, needRuntime;
	  for (i = 0, l = dirs.length; i < l; i++) {
	    dir = dirs[i];
	    needRuntime = true;
	    var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
	    if (gen) {
	      // compile-time directive that manipulates AST.
	      // returns true if it also needs a runtime counterpart.
	      needRuntime = !!gen(el, dir, warn$2);
	    }
	    if (needRuntime) {
	      hasRuntime = true;
	      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
	    }
	  }
	  if (hasRuntime) {
	    return res.slice(0, -1) + ']'
	  }
	}
	
	function genChildren (el) {
	  if (el.children.length) {
	    return '[' + el.children.map(genNode).join(',') + ']'
	  }
	}
	
	function genNode (node) {
	  if (node.type === 1) {
	    return genElement(node)
	  } else {
	    return genText(node)
	  }
	}
	
	function genText (text) {
	  return text.type === 2
	    ? text.expression // no need for () because already wrapped in _s()
	    : JSON.stringify(text.text)
	}
	
	function genSlot (el) {
	  var slotName = el.slotName || '"default"';
	  var children = genChildren(el);
	  return children
	    ? ("_t(" + slotName + "," + children + ")")
	    : ("_t(" + slotName + ")")
	}
	
	function genComponent (el) {
	  var children = el.inlineTemplate ? null : genChildren(el);
	  return ("_h(" + (el.component) + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
	}
	
	function genProps (props) {
	  var res = '';
	  for (var i = 0; i < props.length; i++) {
	    var prop = props[i];
	    res += "\"" + (prop.name) + "\":" + (prop.value) + ",";
	  }
	  return res.slice(0, -1)
	}
	
	/*  */
	
	/**
	 * Compile a template.
	 */
	function compile$1 (
	  template,
	  options
	) {
	  var ast = parse(template.trim(), options);
	  optimize(ast, options);
	  var code = generate(ast, options);
	  return {
	    ast: ast,
	    render: code.render,
	    staticRenderFns: code.staticRenderFns
	  }
	}
	
	/*  */
	
	// operators like typeof, instanceof and in are allowed
	var prohibitedKeywordRE = new RegExp('\\b' + (
	  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
	  'super,throw,while,yield,delete,export,import,return,switch,default,' +
	  'extends,finally,continue,debugger,function,arguments'
	).split(',').join('\\b|\\b') + '\\b');
	// check valid identifier for v-for
	var identRE = /[A-Za-z_$][\w$]*/;
	// strip strings in expressions
	var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
	
	// detect problematic expressions in a template
	function detectErrors (ast) {
	  var errors = [];
	  if (ast) {
	    checkNode(ast, errors);
	  }
	  return errors
	}
	
	function checkNode (node, errors) {
	  if (node.type === 1) {
	    for (var name in node.attrsMap) {
	      if (dirRE.test(name)) {
	        var value = node.attrsMap[name];
	        if (value) {
	          if (name === 'v-for') {
	            checkFor(node, ("v-for=\"" + value + "\""), errors);
	          } else {
	            checkExpression(value, (name + "=\"" + value + "\""), errors);
	          }
	        }
	      }
	    }
	    if (node.children) {
	      for (var i = 0; i < node.children.length; i++) {
	        checkNode(node.children[i], errors);
	      }
	    }
	  } else if (node.type === 2) {
	    checkExpression(node.expression, node.text, errors);
	  }
	}
	
	function checkFor (node, text, errors) {
	  checkExpression(node.for || '', text, errors);
	  checkIdentifier(node.alias, 'v-for alias', text, errors);
	  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
	  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
	}
	
	function checkIdentifier (ident, type, text, errors) {
	  if (typeof ident === 'string' && !identRE.test(ident)) {
	    errors.push(("- invalid " + type + " \"" + ident + "\" in expression: " + text));
	  }
	}
	
	function checkExpression (exp, text, errors) {
	  try {
	    new Function(("return " + exp));
	  } catch (e) {
	    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
	    if (keywordMatch) {
	      errors.push(
	        "- avoid using JavaScript keyword as property name: " +
	        "\"" + (keywordMatch[0]) + "\" in expression " + text
	      );
	    } else {
	      errors.push(("- invalid expression: " + text));
	    }
	  }
	}
	
	/*  */
	
	function transformNode (el, options) {
	  var warn = options.warn || baseWarn;
	  var staticClass = getAndRemoveAttr(el, 'class');
	  if ("development" !== 'production' && staticClass) {
	    var expression = parseText(staticClass, options.delimiters);
	    if (expression) {
	      warn(
	        "class=\"" + staticClass + "\": " +
	        'Interpolation inside attributes has been deprecated. ' +
	        'Use v-bind or the colon shorthand instead.'
	      );
	    }
	  }
	  if (staticClass) {
	    el.staticClass = JSON.stringify(staticClass);
	  }
	  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
	  if (classBinding) {
	    el.classBinding = classBinding;
	  }
	}
	
	function genData$1 (el) {
	  var data = '';
	  if (el.staticClass) {
	    data += "staticClass:" + (el.staticClass) + ",";
	  }
	  if (el.classBinding) {
	    data += "class:" + (el.classBinding) + ",";
	  }
	  return data
	}
	
	var klass$1 = {
	  staticKeys: ['staticClass'],
	  transformNode: transformNode,
	  genData: genData$1
	};
	
	/*  */
	
	function transformNode$1 (el) {
	  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
	  if (styleBinding) {
	    el.styleBinding = styleBinding;
	  }
	}
	
	function genData$2 (el) {
	  return el.styleBinding
	    ? ("style:(" + (el.styleBinding) + "),")
	    : ''
	}
	
	var style$1 = {
	  transformNode: transformNode$1,
	  genData: genData$2
	};
	
	var modules$1 = [
	  klass$1,
	  style$1
	];
	
	/*  */
	
	var warn$3;
	
	function model$1 (
	  el,
	  dir,
	  _warn
	) {
	  warn$3 = _warn;
	  var value = dir.value;
	  var modifiers = dir.modifiers;
	  var tag = el.tag;
	  var type = el.attrsMap.type;
	  {
	    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
	    if (tag === 'input' && dynamicType) {
	      warn$3(
	        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
	        "v-model does not support dynamic input types. Use v-if branches instead."
	      );
	    }
	  }
	  if (tag === 'select') {
	    genSelect(el, value);
	  } else if (tag === 'input' && type === 'checkbox') {
	    genCheckboxModel(el, value);
	  } else if (tag === 'input' && type === 'radio') {
	    genRadioModel(el, value);
	  } else {
	    genDefaultModel(el, value, modifiers);
	  }
	  // ensure runtime directive metadata
	  return true
	}
	
	function genCheckboxModel (el, value) {
	  if ("development" !== 'production' &&
	    el.attrsMap.checked != null) {
	    warn$3(
	      "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
	      "inline checked attributes will be ignored when using v-model. " +
	      'Declare initial values in the component\'s data option instead.'
	    );
	  }
	  var valueBinding = getBindingAttr(el, 'value') || 'null';
	  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
	  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
	  addProp(el, 'checked',
	    "Array.isArray(" + value + ")" +
	      "?_i(" + value + "," + valueBinding + ")>-1" +
	      ":_q(" + value + "," + trueValueBinding + ")"
	  );
	  addHandler(el, 'change',
	    "var $$a=" + value + "," +
	        '$$el=$event.target,' +
	        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
	    'if(Array.isArray($$a)){' +
	      "var $$v=" + valueBinding + "," +
	          '$$i=_i($$a,$$v);' +
	      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
	      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
	    "}else{" + value + "=$$c}",
	    null, true
	  );
	}
	
	function genRadioModel (el, value) {
	  if ("development" !== 'production' &&
	    el.attrsMap.checked != null) {
	    warn$3(
	      "<" + (el.tag) + " v-model=\"" + value + "\" checked>:\n" +
	      "inline checked attributes will be ignored when using v-model. " +
	      'Declare initial values in the component\'s data option instead.'
	    );
	  }
	  var valueBinding = getBindingAttr(el, 'value') || 'null';
	  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
	  addHandler(el, 'change', (value + "=" + valueBinding), null, true);
	}
	
	function genDefaultModel (
	  el,
	  value,
	  modifiers
	) {
	  {
	    if (el.tag === 'input' && el.attrsMap.value) {
	      warn$3(
	        "<" + (el.tag) + " v-model=\"" + value + "\" value=\"" + (el.attrsMap.value) + "\">:\n" +
	        'inline value attributes will be ignored when using v-model. ' +
	        'Declare initial values in the component\'s data option instead.'
	      );
	    }
	    if (el.tag === 'textarea' && el.children.length) {
	      warn$3(
	        "<textarea v-model=\"" + value + "\">:\n" +
	        'inline content inside <textarea> will be ignored when using v-model. ' +
	        'Declare initial values in the component\'s data option instead.'
	      );
	    }
	  }
	
	  var type = el.attrsMap.type;
	  var ref = modifiers || {};
	  var lazy = ref.lazy;
	  var number = ref.number;
	  var trim = ref.trim;
	  var event = lazy || (isIE && type === 'range') ? 'change' : 'input';
	  var needCompositionGuard = !lazy && type !== 'range';
	  var isNative = el.tag === 'input' || el.tag === 'textarea';
	
	  var valueExpression = isNative
	    ? ("$event.target.value" + (trim ? '.trim()' : ''))
	    : "$event";
	  var code = number || type === 'number'
	    ? (value + "=_n(" + valueExpression + ")")
	    : (value + "=" + valueExpression);
	  if (isNative && needCompositionGuard) {
	    code = "if($event.target.composing)return;" + code;
	  }
	  // inputs with type="file" are read only and setting the input's
	  // value will throw an error.
	  if ("development" !== 'production' &&
	      type === 'file') {
	    warn$3(
	      "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
	      "File inputs are read only. Use a v-on:change listener instead."
	    );
	  }
	  addProp(el, 'value', isNative ? ("_s(" + value + ")") : ("(" + value + ")"));
	  addHandler(el, event, code, null, true);
	}
	
	function genSelect (el, value) {
	  {
	    el.children.some(checkOptionWarning);
	  }
	  var code = value + "=Array.prototype.filter" +
	    ".call($event.target.options,function(o){return o.selected})" +
	    ".map(function(o){return \"_value\" in o ? o._value : o.value})" +
	    (el.attrsMap.multiple == null ? '[0]' : '');
	  addHandler(el, 'change', code, null, true);
	}
	
	function checkOptionWarning (option) {
	  if (option.type === 1 &&
	    option.tag === 'option' &&
	    option.attrsMap.selected != null) {
	    warn$3(
	      "<select v-model=\"" + (option.parent.attrsMap['v-model']) + "\">:\n" +
	      'inline selected attributes on <option> will be ignored when using v-model. ' +
	      'Declare initial values in the component\'s data option instead.'
	    );
	    return true
	  }
	  return false
	}
	
	/*  */
	
	function text (el, dir) {
	  if (dir.value) {
	    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
	  }
	}
	
	/*  */
	
	function html (el, dir) {
	  if (dir.value) {
	    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
	  }
	}
	
	var directives$1 = {
	  model: model$1,
	  text: text,
	  html: html
	};
	
	/*  */
	
	var cache = Object.create(null);
	
	var baseOptions = {
	  isIE: isIE,
	  expectHTML: true,
	  modules: modules$1,
	  staticKeys: genStaticKeys(modules$1),
	  directives: directives$1,
	  isReservedTag: isReservedTag,
	  isUnaryTag: isUnaryTag,
	  mustUseProp: mustUseProp,
	  getTagNamespace: getTagNamespace,
	  isPreTag: isPreTag
	};
	
	function compile$$1 (
	  template,
	  options
	) {
	  options = options
	    ? extend(extend({}, baseOptions), options)
	    : baseOptions;
	  return compile$1(template, options)
	}
	
	function compileToFunctions (
	  template,
	  options,
	  vm
	) {
	  var _warn = (options && options.warn) || warn;
	  // detect possible CSP restriction
	  /* istanbul ignore if */
	  {
	    try {
	      new Function('return 1');
	    } catch (e) {
	      if (e.toString().match(/unsafe-eval|CSP/)) {
	        _warn(
	          'It seems you are using the standalone build of Vue.js in an ' +
	          'environment with Content Security Policy that prohibits unsafe-eval. ' +
	          'The template compiler cannot work in this environment. Consider ' +
	          'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
	          'templates into render functions.'
	        );
	      }
	    }
	  }
	  var key = options && options.delimiters
	    ? String(options.delimiters) + template
	    : template;
	  if (cache[key]) {
	    return cache[key]
	  }
	  var res = {};
	  var compiled = compile$$1(template, options);
	  res.render = makeFunction(compiled.render);
	  var l = compiled.staticRenderFns.length;
	  res.staticRenderFns = new Array(l);
	  for (var i = 0; i < l; i++) {
	    res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i]);
	  }
	  {
	    if (res.render === noop || res.staticRenderFns.some(function (fn) { return fn === noop; })) {
	      _warn(
	        "failed to compile template:\n\n" + template + "\n\n" +
	        detectErrors(compiled.ast).join('\n') +
	        '\n\n',
	        vm
	      );
	    }
	  }
	  return (cache[key] = res)
	}
	
	function makeFunction (code) {
	  try {
	    return new Function(code)
	  } catch (e) {
	    return noop
	  }
	}
	
	/*  */
	
	var idToTemplate = cached(function (id) {
	  var el = query(id);
	  return el && el.innerHTML
	});
	
	var mount = Vue$3.prototype.$mount;
	Vue$3.prototype.$mount = function (
	  el,
	  hydrating
	) {
	  el = el && query(el);
	
	  /* istanbul ignore if */
	  if (el === document.body || el === document.documentElement) {
	    "development" !== 'production' && warn(
	      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
	    );
	    return this
	  }
	
	  var options = this.$options;
	  // resolve template/el and convert to render function
	  if (!options.render) {
	    var template = options.template;
	    if (template) {
	      if (typeof template === 'string') {
	        if (template.charAt(0) === '#') {
	          template = idToTemplate(template);
	        }
	      } else if (template.nodeType) {
	        template = template.innerHTML;
	      } else {
	        {
	          warn('invalid template option:' + template, this);
	        }
	        return this
	      }
	    } else if (el) {
	      template = getOuterHTML(el);
	    }
	    if (template) {
	      var ref = compileToFunctions(template, {
	        warn: warn,
	        shouldDecodeNewlines: shouldDecodeNewlines,
	        delimiters: options.delimiters
	      }, this);
	      var render = ref.render;
	      var staticRenderFns = ref.staticRenderFns;
	      options.render = render;
	      options.staticRenderFns = staticRenderFns;
	    }
	  }
	  return mount.call(this, el, hydrating)
	};
	
	/**
	 * Get outerHTML of elements, taking care
	 * of SVG elements in IE as well.
	 */
	function getOuterHTML (el) {
	  if (el.outerHTML) {
	    return el.outerHTML
	  } else {
	    var container = document.createElement('div');
	    container.appendChild(el.cloneNode(true));
	    return container.innerHTML
	  }
	}
	
	Vue$3.compile = compileToFunctions;
	
	return Vue$3;
	
	})));


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	!function (t) {
	  function e(r) {
	    if (n[r]) return n[r].exports;var o = n[r] = { exports: {}, id: r, loaded: !1 };return t[r].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports;
	  }var n = {};return e.m = t, e.c = n, e.p = "", e(0);
	}({ 0: function _(t, e, n) {
	    t.exports = n(1075);
	  }, 4: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }e.__esModule = !0, e.compose = e.applyMiddleware = e.bindActionCreators = e.combineReducers = e.createStore = void 0;var o = n(5),
	        i = r(o),
	        a = n(12),
	        u = r(a),
	        c = n(14),
	        s = r(c),
	        f = n(15),
	        d = r(f),
	        l = n(16),
	        p = r(l),
	        v = n(13);r(v);e.createStore = i["default"], e.combineReducers = u["default"], e.bindActionCreators = s["default"], e.applyMiddleware = d["default"], e.compose = p["default"];
	  }, 5: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e, n) {
	      function r() {
	        g === h && (g = h.slice());
	      }function i() {
	        return y;
	      }function u(t) {
	        if ("function" != typeof t) throw new Error("Expected listener to be a function.");var e = !0;return r(), g.push(t), function () {
	          if (e) {
	            e = !1, r();var n = g.indexOf(t);g.splice(n, 1);
	          }
	        };
	      }function f(t) {
	        if (!(0, a["default"])(t)) throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if ("undefined" == typeof t.type) throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if (_) throw new Error("Reducers may not dispatch actions.");try {
	          _ = !0, y = v(y, t);
	        } finally {
	          _ = !1;
	        }for (var e = h = g, n = 0; n < e.length; n++) {
	          e[n]();
	        }return t;
	      }function d(t) {
	        if ("function" != typeof t) throw new Error("Expected the nextReducer to be a function.");v = t, f({ type: s.INIT });
	      }function l() {
	        var t,
	            e = u;return t = { subscribe: function subscribe(t) {
	            function n() {
	              t.next && t.next(i());
	            }if ("object" != (typeof t === "undefined" ? "undefined" : _typeof(t))) throw new TypeError("Expected the observer to be an object.");n();var r = e(n);return { unsubscribe: r };
	          } }, t[c["default"]] = function () {
	          return this;
	        }, t;
	      }var p;if ("function" == typeof e && "undefined" == typeof n && (n = e, e = void 0), "undefined" != typeof n) {
	        if ("function" != typeof n) throw new Error("Expected the enhancer to be a function.");return n(o)(t, e);
	      }if ("function" != typeof t) throw new Error("Expected the reducer to be a function.");var v = t,
	          y = e,
	          h = [],
	          g = h,
	          _ = !1;return f({ type: s.INIT }), p = { dispatch: f, subscribe: u, getState: i, replaceReducer: d }, p[c["default"]] = l, p;
	    }e.__esModule = !0, e.ActionTypes = void 0, e["default"] = o;var i = n(6),
	        a = r(i),
	        u = n(10),
	        c = r(u),
	        s = e.ActionTypes = { INIT: "@@redux/INIT" };
	  }, 6: function _(t, e, n) {
	    function r(t) {
	      if (!a(t) || l.call(t) != u || i(t)) return !1;var e = o(t);if (null === e) return !0;var n = f.call(e, "constructor") && e.constructor;return "function" == typeof n && n instanceof n && s.call(n) == d;
	    }var o = n(7),
	        i = n(8),
	        a = n(9),
	        u = "[object Object]",
	        c = Object.prototype,
	        s = Function.prototype.toString,
	        f = c.hasOwnProperty,
	        d = s.call(Object),
	        l = c.toString;t.exports = r;
	  }, 7: function _(t, e) {
	    function n(t) {
	      return r(Object(t));
	    }var r = Object.getPrototypeOf;t.exports = n;
	  }, 8: function _(t, e) {
	    function n(t) {
	      var e = !1;if (null != t && "function" != typeof t.toString) try {
	        e = !!(t + "");
	      } catch (n) {}return e;
	    }t.exports = n;
	  }, 9: function _(t, e) {
	    function n(t) {
	      return !!t && "object" == (typeof t === "undefined" ? "undefined" : _typeof(t));
	    }t.exports = n;
	  }, 10: function _(t, e, n) {
	    (function (e) {
	      "use strict";
	      t.exports = n(11)(e || window || this);
	    }).call(e, function () {
	      return this;
	    }());
	  }, 11: function _(t, e) {
	    "use strict";
	    t.exports = function (t) {
	      var e,
	          n = t.Symbol;return "function" == typeof n ? n.observable ? e = n.observable : (e = n("observable"), n.observable = e) : e = "@@observable", e;
	    };
	  }, 12: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e) {
	      var n = e && e.type,
	          r = n && '"' + n.toString() + '"' || "an action";return "Given action " + r + ', reducer "' + t + '" returned undefined. To ignore an action, you must explicitly return the previous state.';
	    }function i(t) {
	      Object.keys(t).forEach(function (e) {
	        var n = t[e],
	            r = n(void 0, { type: u.ActionTypes.INIT });if ("undefined" == typeof r) throw new Error('Reducer "' + e + '" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined.');var o = "@@redux/PROBE_UNKNOWN_ACTION_" + Math.random().toString(36).substring(7).split("").join(".");if ("undefined" == typeof n(void 0, { type: o })) throw new Error('Reducer "' + e + '" returned undefined when probed with a random type. ' + ("Don't try to handle " + u.ActionTypes.INIT + ' or other actions in "redux/*" ') + "namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined.");
	      });
	    }function a(t) {
	      for (var e = Object.keys(t), n = {}, r = 0; r < e.length; r++) {
	        var a = e[r];"function" == typeof t[a] && (n[a] = t[a]);
	      }var u,
	          c = Object.keys(n);try {
	        i(n);
	      } catch (s) {
	        u = s;
	      }return function () {
	        var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
	            e = arguments[1];if (u) throw u;for (var r = !1, i = {}, a = 0; a < c.length; a++) {
	          var s = c[a],
	              f = n[s],
	              d = t[s],
	              l = f(d, e);if ("undefined" == typeof l) {
	            var p = o(s, e);throw new Error(p);
	          }i[s] = l, r = r || l !== d;
	        }return r ? i : t;
	      };
	    }e.__esModule = !0, e["default"] = a;var u = n(5),
	        c = n(6),
	        s = (r(c), n(13));r(s);
	  }, 13: function _(t, e) {
	    "use strict";
	    function n(t) {
	      "undefined" != typeof console && "function" == typeof console.error && console.error(t);try {
	        throw new Error(t);
	      } catch (e) {}
	    }e.__esModule = !0, e["default"] = n;
	  }, 14: function _(t, e) {
	    "use strict";
	    function n(t, e) {
	      return function () {
	        return e(t.apply(void 0, arguments));
	      };
	    }function r(t, e) {
	      if ("function" == typeof t) return n(t, e);if ("object" != (typeof t === "undefined" ? "undefined" : _typeof(t)) || null === t) throw new Error("bindActionCreators expected an object or a function, instead received " + (null === t ? "null" : typeof t === "undefined" ? "undefined" : _typeof(t)) + '. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for (var r = Object.keys(t), o = {}, i = 0; i < r.length; i++) {
	        var a = r[i],
	            u = t[a];"function" == typeof u && (o[a] = n(u, e));
	      }return o;
	    }e.__esModule = !0, e["default"] = r;
	  }, 15: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o() {
	      for (var t = arguments.length, e = Array(t), n = 0; t > n; n++) {
	        e[n] = arguments[n];
	      }return function (t) {
	        return function (n, r, o) {
	          var a = t(n, r, o),
	              c = a.dispatch,
	              s = [],
	              f = { getState: a.getState, dispatch: function dispatch(t) {
	              return c(t);
	            } };return s = e.map(function (t) {
	            return t(f);
	          }), c = u["default"].apply(void 0, s)(a.dispatch), i({}, a, { dispatch: c });
	        };
	      };
	    }e.__esModule = !0;var i = Object.assign || function (t) {
	      for (var e = 1; e < arguments.length; e++) {
	        var n = arguments[e];for (var r in n) {
	          Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
	        }
	      }return t;
	    };e["default"] = o;var a = n(16),
	        u = r(a);
	  }, 16: function _(t, e) {
	    "use strict";
	    function n() {
	      for (var t = arguments.length, e = Array(t), n = 0; t > n; n++) {
	        e[n] = arguments[n];
	      }if (0 === e.length) return function (t) {
	        return t;
	      };var r = function () {
	        var t = e[e.length - 1],
	            n = e.slice(0, -1);return { v: function v() {
	            return n.reduceRight(function (t, e) {
	              return e(t);
	            }, t.apply(void 0, arguments));
	          } };
	      }();return "object" == (typeof r === "undefined" ? "undefined" : _typeof(r)) ? r.v : void 0;
	    }e.__esModule = !0, e["default"] = n;
	  }, 47: function _(t, e, n) {
	    t.exports = n(48);
	  }, 48: function _(t, e, n) {
	    var r = n(49);e.stringify = function (t, e, n, o) {
	      if (arguments.length < 4) try {
	        return 1 === arguments.length ? JSON.stringify(t) : JSON.stringify.apply(JSON, arguments);
	      } catch (i) {}var a = o || !1;"boolean" == typeof a && (a = { date: a, "function": a, regex: a, undefined: a, error: a });var u = r.decycle(t, a, e);return 1 === arguments.length ? JSON.stringify(u) : JSON.stringify(u, e, n);
	    }, e.parse = function (t, e) {
	      var n,
	          o = /"\$jsan"/.test(t);return n = 1 === arguments.length ? JSON.parse(t) : JSON.parse(t, e), o && (n = r.retrocycle(n)), n;
	    };
	  }, 49: function _(t, e, n) {
	    var r = (n(50), n(51));e.decycle = function (t, e, n) {
	      "use strict";
	      var o = [],
	          i = [];return function a(t, u, c) {
	        var s,
	            f,
	            d,
	            l = n ? n(c || "", t) : t;if (e.date && l instanceof Date) return { $jsan: "d" + l.getTime() };if (e.regex && l instanceof RegExp) return { $jsan: "r" + r.getRegexFlags(l) + "," + l.source };if (e["function"] && "function" == typeof l) return { $jsan: "f" + r.stringifyFunction(l, e["function"]) };if (e.undefined && void 0 === l) return { $jsan: "u" };if (e.error && l instanceof Error) return { $jsan: "e" + l.message };if (l && "function" == typeof l.toJSON && (l = l.toJSON()), !("object" != (typeof l === "undefined" ? "undefined" : _typeof(l)) || null === l || l instanceof Boolean || l instanceof Date || l instanceof Number || l instanceof RegExp || l instanceof String || l instanceof Error)) {
	          for (s = 0; s < o.length; s += 1) {
	            if (o[s] === l) return { $jsan: i[s] };
	          }if (o.push(l), i.push(u), "[object Array]" === Object.prototype.toString.apply(l)) for (d = [], s = 0; s < l.length; s += 1) {
	            d[s] = a(l[s], u + "[" + s + "]", s);
	          } else {
	            d = {};for (f in l) {
	              if (Object.prototype.hasOwnProperty.call(l, f)) {
	                var p = /^\w+$/.test(f) ? "." + f : "[" + JSON.stringify(f) + "]";d[f] = "$jsan" === f ? [a(l[f], u + p)] : a(l[f], u + p, f);
	              }
	            }
	          }return d;
	        }return l;
	      }(t, "$");
	    }, e.retrocycle = function (t) {
	      "use strict";
	      return function e(n) {
	        var o, i, a;if (n && "object" == (typeof n === "undefined" ? "undefined" : _typeof(n))) if ("[object Array]" === Object.prototype.toString.apply(n)) for (o = 0; o < n.length; o += 1) {
	          i = n[o], i && "object" == (typeof i === "undefined" ? "undefined" : _typeof(i)) && (i.$jsan ? n[o] = r.restore(i.$jsan, t) : e(i));
	        } else for (a in n) {
	          "$jsan" === a && (n[a] = n[a][0]), "object" == _typeof(n[a]) && (i = n[a], i && "object" == (typeof i === "undefined" ? "undefined" : _typeof(i)) && (i.$jsan ? n[a] = r.restore(i.$jsan, t) : e(i)));
	        }
	      }(t), t;
	    };
	  }, 50: function _(t, e) {
	    function n(t, e) {
	      if ("$" !== e) for (var n = r(e), o = 0; o < n.length; o++) {
	        e = n[o].toString().replace(/\\"/g, '"'), t = t[e];
	      }return t;
	    }function r(t) {
	      for (var e, n = /(?:\.(\w+))|(?:\[(\d+)\])|(?:\["((?:[^\\"]|\\.)*)"\])/g, r = []; e = n.exec(t);) {
	        r.push(e[1] || e[2] || e[3]);
	      }return r;
	    }t.exports = n;
	  }, 51: function _(t, e, n) {
	    var r = n(50);e.getRegexFlags = function (t) {
	      var e = "";return t.ignoreCase && (e += "i"), t.global && (e += "g"), t.multiline && (e += "m"), e;
	    }, e.stringifyFunction = function (t, e) {
	      if ("function" == typeof e) return e(t);var n = t.toString(),
	          r = n.match(/^[^{]*{|^[^=]*=>/),
	          o = r ? r[0] : "<function> ",
	          i = "}" === n[n.length - 1] ? "}" : "";return o.replace(/\r\n|\n/g, " ").replace(/\s+/g, " ") + " /* ... */ " + i;
	    }, e.restore = function (t, e) {
	      var n = t[0],
	          o = t.slice(1);switch (n) {case "$":
	          return r(e, t);case "r":
	          var i = o.indexOf(","),
	              a = o.slice(0, i),
	              u = o.slice(i + 1);return RegExp(u, a);case "d":
	          return new Date(+o);case "f":
	          var c = function c() {
	            throw new Error("can't run jsan parsed function");
	          };return c.toString = function () {
	            return o;
	          }, c;case "u":
	          return;case "e":
	          var s = new Error(o);return s.stack = "Stack is unavailable for jsan parsed errors", s;default:
	          return console.warn("unknown type", t), t;}
	    };
	  }, 56: function _(t, e, n) {
	    var r = n(57),
	        o = n(102),
	        i = n(106),
	        a = n(112),
	        u = a(function (t, e) {
	      return i(t) ? r(t, o(e, 1, i, !0)) : [];
	    });t.exports = u;
	  }, 57: function _(t, e, n) {
	    function r(t, e, n, r) {
	      var d = -1,
	          l = i,
	          p = !0,
	          v = t.length,
	          y = [],
	          h = e.length;if (!v) return y;n && (e = u(e, c(n))), r ? (l = a, p = !1) : e.length >= f && (l = s, p = !1, e = new o(e));t: for (; ++d < v;) {
	        var g = t[d],
	            _ = n ? n(g) : g;if (g = r || 0 !== g ? g : 0, p && _ === _) {
	          for (var b = h; b--;) {
	            if (e[b] === _) continue t;
	          }y.push(g);
	        } else l(e, _, r) || y.push(g);
	      }return y;
	    }var o = n(58),
	        i = n(95),
	        a = n(98),
	        u = n(99),
	        c = n(100),
	        s = n(101),
	        f = 200;t.exports = r;
	  }, 58: function _(t, e, n) {
	    function r(t) {
	      var e = -1,
	          n = t ? t.length : 0;for (this.__data__ = new o(); ++e < n;) {
	        this.add(t[e]);
	      }
	    }var o = n(59),
	        i = n(93),
	        a = n(94);r.prototype.add = r.prototype.push = i, r.prototype.has = a, t.exports = r;
	  }, 59: function _(t, e, n) {
	    function r(t) {
	      var e = -1,
	          n = t ? t.length : 0;for (this.clear(); ++e < n;) {
	        var r = t[e];this.set(r[0], r[1]);
	      }
	    }var o = n(60),
	        i = n(87),
	        a = n(90),
	        u = n(91),
	        c = n(92);r.prototype.clear = o, r.prototype["delete"] = i, r.prototype.get = a, r.prototype.has = u, r.prototype.set = c, t.exports = r;
	  }, 60: function _(t, e, n) {
	    function r() {
	      this.__data__ = { hash: new o(), map: new (a || i)(), string: new o() };
	    }var o = n(61),
	        i = n(78),
	        a = n(86);t.exports = r;
	  }, 61: function _(t, e, n) {
	    function r(t) {
	      var e = -1,
	          n = t ? t.length : 0;for (this.clear(); ++e < n;) {
	        var r = t[e];this.set(r[0], r[1]);
	      }
	    }var o = n(62),
	        i = n(74),
	        a = n(75),
	        u = n(76),
	        c = n(77);r.prototype.clear = o, r.prototype["delete"] = i, r.prototype.get = a, r.prototype.has = u, r.prototype.set = c, t.exports = r;
	  }, 62: function _(t, e, n) {
	    function r() {
	      this.__data__ = o ? o(null) : {};
	    }var o = n(63);t.exports = r;
	  }, 63: function _(t, e, n) {
	    var r = n(64),
	        o = r(Object, "create");t.exports = o;
	  }, 64: function _(t, e, n) {
	    function r(t, e) {
	      var n = i(t, e);return o(n) ? n : void 0;
	    }var o = n(65),
	        i = n(73);t.exports = r;
	  }, 65: function _(t, e, n) {
	    function r(t) {
	      if (!u(t) || a(t)) return !1;var e = o(t) || i(t) ? v : f;return e.test(c(t));
	    }var o = n(66),
	        i = n(8),
	        a = n(68),
	        u = n(67),
	        c = n(72),
	        s = /[\\^$.*+?()[\]{}|]/g,
	        f = /^\[object .+?Constructor\]$/,
	        d = Object.prototype,
	        l = Function.prototype.toString,
	        p = d.hasOwnProperty,
	        v = RegExp("^" + l.call(p).replace(s, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");t.exports = r;
	  }, 66: function _(t, e, n) {
	    function r(t) {
	      var e = o(t) ? c.call(t) : "";return e == i || e == a;
	    }var o = n(67),
	        i = "[object Function]",
	        a = "[object GeneratorFunction]",
	        u = Object.prototype,
	        c = u.toString;t.exports = r;
	  }, 67: function _(t, e) {
	    function n(t) {
	      var e = typeof t === "undefined" ? "undefined" : _typeof(t);return !!t && ("object" == e || "function" == e);
	    }t.exports = n;
	  }, 68: function _(t, e, n) {
	    function r(t) {
	      return !!i && i in t;
	    }var o = n(69),
	        i = function () {
	      var t = /[^.]+$/.exec(o && o.keys && o.keys.IE_PROTO || "");return t ? "Symbol(src)_1." + t : "";
	    }();t.exports = r;
	  }, 69: function _(t, e, n) {
	    var r = n(70),
	        o = r["__core-js_shared__"];t.exports = o;
	  }, 70: function _(t, e, n) {
	    (function (e) {
	      var r = n(71),
	          o = r("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e),
	          i = r("object" == (typeof self === "undefined" ? "undefined" : _typeof(self)) && self),
	          a = r("object" == _typeof(this) && this),
	          u = o || i || a || Function("return this")();t.exports = u;
	    }).call(e, function () {
	      return this;
	    }());
	  }, 71: function _(t, e) {
	    function n(t) {
	      return t && t.Object === Object ? t : null;
	    }t.exports = n;
	  }, 72: function _(t, e) {
	    function n(t) {
	      if (null != t) {
	        try {
	          return r.call(t);
	        } catch (e) {}try {
	          return t + "";
	        } catch (e) {}
	      }return "";
	    }var r = Function.prototype.toString;t.exports = n;
	  }, 73: function _(t, e) {
	    function n(t, e) {
	      return null == t ? void 0 : t[e];
	    }t.exports = n;
	  }, 74: function _(t, e) {
	    function n(t) {
	      return this.has(t) && delete this.__data__[t];
	    }t.exports = n;
	  }, 75: function _(t, e, n) {
	    function r(t) {
	      var e = this.__data__;if (o) {
	        var n = e[t];return n === i ? void 0 : n;
	      }return u.call(e, t) ? e[t] : void 0;
	    }var o = n(63),
	        i = "__lodash_hash_undefined__",
	        a = Object.prototype,
	        u = a.hasOwnProperty;t.exports = r;
	  }, 76: function _(t, e, n) {
	    function r(t) {
	      var e = this.__data__;return o ? void 0 !== e[t] : a.call(e, t);
	    }var o = n(63),
	        i = Object.prototype,
	        a = i.hasOwnProperty;t.exports = r;
	  }, 77: function _(t, e, n) {
	    function r(t, e) {
	      var n = this.__data__;return n[t] = o && void 0 === e ? i : e, this;
	    }var o = n(63),
	        i = "__lodash_hash_undefined__";t.exports = r;
	  }, 78: function _(t, e, n) {
	    function r(t) {
	      var e = -1,
	          n = t ? t.length : 0;for (this.clear(); ++e < n;) {
	        var r = t[e];this.set(r[0], r[1]);
	      }
	    }var o = n(79),
	        i = n(80),
	        a = n(83),
	        u = n(84),
	        c = n(85);r.prototype.clear = o, r.prototype["delete"] = i, r.prototype.get = a, r.prototype.has = u, r.prototype.set = c, t.exports = r;
	  }, 79: function _(t, e) {
	    function n() {
	      this.__data__ = [];
	    }t.exports = n;
	  }, 80: function _(t, e, n) {
	    function r(t) {
	      var e = this.__data__,
	          n = o(e, t);if (0 > n) return !1;var r = e.length - 1;return n == r ? e.pop() : a.call(e, n, 1), !0;
	    }var o = n(81),
	        i = Array.prototype,
	        a = i.splice;t.exports = r;
	  }, 81: function _(t, e, n) {
	    function r(t, e) {
	      for (var n = t.length; n--;) {
	        if (o(t[n][0], e)) return n;
	      }return -1;
	    }var o = n(82);t.exports = r;
	  }, 82: function _(t, e) {
	    function n(t, e) {
	      return t === e || t !== t && e !== e;
	    }t.exports = n;
	  }, 83: function _(t, e, n) {
	    function r(t) {
	      var e = this.__data__,
	          n = o(e, t);return 0 > n ? void 0 : e[n][1];
	    }var o = n(81);t.exports = r;
	  }, 84: function _(t, e, n) {
	    function r(t) {
	      return o(this.__data__, t) > -1;
	    }var o = n(81);t.exports = r;
	  }, 85: function _(t, e, n) {
	    function r(t, e) {
	      var n = this.__data__,
	          r = o(n, t);return 0 > r ? n.push([t, e]) : n[r][1] = e, this;
	    }var o = n(81);t.exports = r;
	  }, 86: function _(t, e, n) {
	    var r = n(64),
	        o = n(70),
	        i = r(o, "Map");t.exports = i;
	  }, 87: function _(t, e, n) {
	    function r(t) {
	      return o(this, t)["delete"](t);
	    }var o = n(88);t.exports = r;
	  }, 88: function _(t, e, n) {
	    function r(t, e) {
	      var n = t.__data__;return o(e) ? n["string" == typeof e ? "string" : "hash"] : n.map;
	    }var o = n(89);t.exports = r;
	  }, 89: function _(t, e) {
	    function n(t) {
	      var e = typeof t === "undefined" ? "undefined" : _typeof(t);return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t;
	    }t.exports = n;
	  }, 90: function _(t, e, n) {
	    function r(t) {
	      return o(this, t).get(t);
	    }var o = n(88);t.exports = r;
	  }, 91: function _(t, e, n) {
	    function r(t) {
	      return o(this, t).has(t);
	    }var o = n(88);t.exports = r;
	  }, 92: function _(t, e, n) {
	    function r(t, e) {
	      return o(this, t).set(t, e), this;
	    }var o = n(88);t.exports = r;
	  }, 93: function _(t, e) {
	    function n(t) {
	      return this.__data__.set(t, r), this;
	    }var r = "__lodash_hash_undefined__";t.exports = n;
	  }, 94: function _(t, e) {
	    function n(t) {
	      return this.__data__.has(t);
	    }t.exports = n;
	  }, 95: function _(t, e, n) {
	    function r(t, e) {
	      var n = t ? t.length : 0;return !!n && o(t, e, 0) > -1;
	    }var o = n(96);t.exports = r;
	  }, 96: function _(t, e, n) {
	    function r(t, e, n) {
	      if (e !== e) return o(t, n);for (var r = n - 1, i = t.length; ++r < i;) {
	        if (t[r] === e) return r;
	      }return -1;
	    }var o = n(97);t.exports = r;
	  }, 97: function _(t, e) {
	    function n(t, e, n) {
	      for (var r = t.length, o = e + (n ? 1 : -1); n ? o-- : ++o < r;) {
	        var i = t[o];if (i !== i) return o;
	      }return -1;
	    }t.exports = n;
	  }, 98: function _(t, e) {
	    function n(t, e, n) {
	      for (var r = -1, o = t ? t.length : 0; ++r < o;) {
	        if (n(e, t[r])) return !0;
	      }return !1;
	    }t.exports = n;
	  }, 99: function _(t, e) {
	    function n(t, e) {
	      for (var n = -1, r = t ? t.length : 0, o = Array(r); ++n < r;) {
	        o[n] = e(t[n], n, t);
	      }return o;
	    }t.exports = n;
	  }, 100: function _(t, e) {
	    function n(t) {
	      return function (e) {
	        return t(e);
	      };
	    }t.exports = n;
	  }, 101: function _(t, e) {
	    function n(t, e) {
	      return t.has(e);
	    }t.exports = n;
	  }, 102: function _(t, e, n) {
	    function r(t, e, n, a, u) {
	      var c = -1,
	          s = t.length;for (n || (n = i), u || (u = []); ++c < s;) {
	        var f = t[c];e > 0 && n(f) ? e > 1 ? r(f, e - 1, n, a, u) : o(u, f) : a || (u[u.length] = f);
	      }return u;
	    }var o = n(103),
	        i = n(104);t.exports = r;
	  }, 103: function _(t, e) {
	    function n(t, e) {
	      for (var n = -1, r = e.length, o = t.length; ++n < r;) {
	        t[o + n] = e[n];
	      }return t;
	    }t.exports = n;
	  }, 104: function _(t, e, n) {
	    function r(t) {
	      return i(t) || o(t);
	    }var o = n(105),
	        i = n(111);t.exports = r;
	  }, 105: function _(t, e, n) {
	    function r(t) {
	      return o(t) && u.call(t, "callee") && (!s.call(t, "callee") || c.call(t) == i);
	    }var o = n(106),
	        i = "[object Arguments]",
	        a = Object.prototype,
	        u = a.hasOwnProperty,
	        c = a.toString,
	        s = a.propertyIsEnumerable;t.exports = r;
	  }, 106: function _(t, e, n) {
	    function r(t) {
	      return i(t) && o(t);
	    }var o = n(107),
	        i = n(9);t.exports = r;
	  }, 107: function _(t, e, n) {
	    function r(t) {
	      return null != t && a(o(t)) && !i(t);
	    }var o = n(108),
	        i = n(66),
	        a = n(110);t.exports = r;
	  }, 108: function _(t, e, n) {
	    var r = n(109),
	        o = r("length");t.exports = o;
	  }, 109: function _(t, e) {
	    function n(t) {
	      return function (e) {
	        return null == e ? void 0 : e[t];
	      };
	    }t.exports = n;
	  }, 110: function _(t, e) {
	    function n(t) {
	      return "number" == typeof t && t > -1 && t % 1 == 0 && r >= t;
	    }var r = 9007199254740991;t.exports = n;
	  }, 111: function _(t, e) {
	    var n = Array.isArray;t.exports = n;
	  }, 112: function _(t, e, n) {
	    function r(t, e) {
	      if ("function" != typeof t) throw new TypeError(a);return e = u(void 0 === e ? t.length - 1 : i(e), 0), function () {
	        for (var n = arguments, r = -1, i = u(n.length - e, 0), a = Array(i); ++r < i;) {
	          a[r] = n[e + r];
	        }switch (e) {case 0:
	            return t.call(this, a);case 1:
	            return t.call(this, n[0], a);case 2:
	            return t.call(this, n[0], n[1], a);}var c = Array(e + 1);for (r = -1; ++r < e;) {
	          c[r] = n[r];
	        }return c[e] = a, o(t, this, c);
	      };
	    }var o = n(113),
	        i = n(114),
	        a = "Expected a function",
	        u = Math.max;t.exports = r;
	  }, 113: function _(t, e) {
	    function n(t, e, n) {
	      var r = n.length;switch (r) {case 0:
	          return t.call(e);case 1:
	          return t.call(e, n[0]);case 2:
	          return t.call(e, n[0], n[1]);case 3:
	          return t.call(e, n[0], n[1], n[2]);}return t.apply(e, n);
	    }t.exports = n;
	  }, 114: function _(t, e, n) {
	    function r(t) {
	      var e = o(t),
	          n = e % 1;return e === e ? n ? e - n : e : 0;
	    }var o = n(115);t.exports = r;
	  }, 115: function _(t, e, n) {
	    function r(t) {
	      if (!t) return 0 === t ? t : 0;if (t = o(t), t === i || t === -i) {
	        var e = 0 > t ? -1 : 1;return e * a;
	      }return t === t ? t : 0;
	    }var o = n(116),
	        i = 1 / 0,
	        a = 1.7976931348623157e308;t.exports = r;
	  }, 116: function _(t, e, n) {
	    function r(t) {
	      if ("number" == typeof t) return t;if (a(t)) return u;if (i(t)) {
	        var e = o(t.valueOf) ? t.valueOf() : t;t = i(e) ? e + "" : e;
	      }if ("string" != typeof t) return 0 === t ? t : +t;t = t.replace(c, "");var n = f.test(t);return n || d.test(t) ? l(t.slice(2), n ? 2 : 8) : s.test(t) ? u : +t;
	    }var o = n(66),
	        i = n(67),
	        a = n(117),
	        u = NaN,
	        c = /^\s+|\s+$/g,
	        s = /^[-+]0x[0-9a-f]+$/i,
	        f = /^0b[01]+$/i,
	        d = /^0o[0-7]+$/i,
	        l = parseInt;t.exports = r;
	  }, 117: function _(t, e, n) {
	    function r(t) {
	      return "symbol" == (typeof t === "undefined" ? "undefined" : _typeof(t)) || o(t) && u.call(t) == i;
	    }var o = n(9),
	        i = "[object Symbol]",
	        a = Object.prototype,
	        u = a.toString;t.exports = r;
	  }, 130: function _(t, e, n) {
	    function r(t) {
	      var e = t ? t.length : void 0;return u(e) && (a(t) || c(t) || i(t)) ? o(e, String) : null;
	    }var o = n(131),
	        i = n(105),
	        a = n(111),
	        u = n(110),
	        c = n(132);t.exports = r;
	  }, 131: function _(t, e) {
	    function n(t, e) {
	      for (var n = -1, r = Array(t); ++n < t;) {
	        r[n] = e(n);
	      }return r;
	    }t.exports = n;
	  }, 132: function _(t, e, n) {
	    function r(t) {
	      return "string" == typeof t || !o(t) && i(t) && c.call(t) == a;
	    }var o = n(111),
	        i = n(9),
	        a = "[object String]",
	        u = Object.prototype,
	        c = u.toString;t.exports = r;
	  }, 133: function _(t, e) {
	    function n(t, e) {
	      return e = null == e ? r : e, !!e && ("number" == typeof t || o.test(t)) && t > -1 && t % 1 == 0 && e > t;
	    }var r = 9007199254740991,
	        o = /^(?:0|[1-9]\d*)$/;t.exports = n;
	  }, 134: function _(t, e) {
	    function n(t) {
	      var e = t && t.constructor,
	          n = "function" == typeof e && e.prototype || r;return t === n;
	    }var r = Object.prototype;t.exports = n;
	  }, 135: function _(t, e, n) {
	    function r(t) {
	      if ("string" == typeof t || o(t)) return t;var e = t + "";return "0" == e && 1 / t == -i ? "-0" : e;
	    }var o = n(117),
	        i = 1 / 0;t.exports = r;
	  }, 136: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && !i && s(function () {}), { save: u(t), get: s, subscribe: f };
	    }Object.defineProperty(e, "__esModule", { value: !0 }), e.isAllowed = e.getOptionsFromBg = e.injectOptions = void 0, e["default"] = r;var o = n(137),
	        i = void 0,
	        a = [],
	        u = function u(t) {
	      return function (e, n) {
	        var r = {};r[e] = n, chrome.storage.sync.set(r), i[e] = n, t({ options: i }), a.forEach(function (t) {
	          return t(i);
	        });
	      };
	    },
	        c = function c(t) {
	      var e = Object.assign({}, t);return "boolean" == typeof t.filter && (t.filter && t.whitelist.length > 0 ? e.filter = o.FilterState.WHITELIST_SPECIFIC : t.filter ? e.filter = o.FilterState.BLACKLIST_SPECIFIC : e.filter = o.FilterState.DO_NOT_FILTER), e;
	    },
	        s = function s(t) {
	      i ? t(i) : chrome.storage.sync.get({ maxAge: 50, filter: o.FilterState.DO_NOT_FILTER, whitelist: "", blacklist: "", shouldCatchErrors: !1, inject: !0, urls: "^https?://localhost|0\\.0\\.0\\.0:\\d+\n^https?://.+\\.github\\.io" }, function (e) {
	        i = c(e), t(i);
	      });
	    },
	        f = function f(t) {
	      a = a.concat(t);
	    },
	        d = function d(t) {
	      return "" !== t ? t.split("\n").filter(Boolean).join("|") : null;
	    },
	        l = e.injectOptions = function (t) {
	      if (t) {
	        t.filter !== o.FilterState.DO_NOT_FILTER && (t.whitelist = d(t.whitelist), t.blacklist = d(t.blacklist)), i = t;var e = document.createElement("script");e.type = "text/javascript", e.appendChild(document.createTextNode("window.devToolsOptions = Object.assign(window.devToolsOptions||{}," + JSON.stringify(i) + ");")), (document.head || document.documentElement).appendChild(e), e.parentNode.removeChild(e);
	      }
	    };e.getOptionsFromBg = function () {
	      chrome.runtime.sendMessage({ type: "GET_OPTIONS" }, function (t) {
	        t && t.options && l(t.options);
	      });
	    }, e.isAllowed = function () {
	      var t = arguments.length <= 0 || void 0 === arguments[0] ? i : arguments[0];return !t || t.inject || !t.urls || location.href.match(d(t.urls));
	    };
	  }, 137: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t) {
	      return t.actionsBlacklist || t.actionsWhitelist ? { whitelist: t.actionsWhitelist && t.actionsWhitelist.join("|"), blacklist: t.actionsBlacklist && t.actionsBlacklist.join("|") } : void 0;
	    }function i(t, e) {
	      if (!e && window.devToolsOptions.filter === p.DO_NOT_FILTER) return !1;var n = e || window.devToolsOptions,
	          r = n.whitelist,
	          o = n.blacklist;return r && !t.type.match(r) || o && t.type.match(o);
	    }function a(t, e) {
	      return e ? (0, l["default"])(t, function (t, n) {
	        return f({}, t, { action: e(t.action, n) });
	      }) : t;
	    }function u(t, e) {
	      return e ? t.map(function (t, n) {
	        return f({}, t, { state: e(t.state, n) });
	      }) : t;
	    }function c(t, e, n, r, o, c, d) {
	      if ("ACTION" === e) return r ? r(t, c - 1) : t;if ("STATE" !== e) return t;if (d || n || window.devToolsOptions.filter !== p.DO_NOT_FILTER) {
	        var l = function () {
	          var e = [],
	              a = [],
	              u = o && {},
	              c = t.actionsById,
	              s = t.computedStates;return t.stagedActionIds.forEach(function (t, l) {
	            var p = c[t],
	                v = p.action,
	                y = s[l],
	                h = y.state;if (l) {
	              if (d && !d(h, v)) return;if (i(v, n)) return;
	            }e.push(t), a.push(r ? f({}, y, { state: r(h, l) }) : y), o && (u[t] = f({}, p, { action: o(v, t) }));
	          }), { v: f({}, t, { actionsById: u || c, stagedActionIds: e, computedStates: a }) };
	        }();if ("object" === ("undefined" == typeof l ? "undefined" : s(l))) return l.v;
	      }return r || o ? f({}, t, { actionsById: a(t.actionsById, o), computedStates: u(t.computedStates, r) }) : t;
	    }Object.defineProperty(e, "__esModule", { value: !0 }), e.FilterState = void 0;var s = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
	      return typeof t === "undefined" ? "undefined" : _typeof(t);
	    } : function (t) {
	      return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
	    },
	        f = Object.assign || function (t) {
	      for (var e = 1; e < arguments.length; e++) {
	        var n = arguments[e];for (var r in n) {
	          Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
	        }
	      }return t;
	    };e.getLocalFilter = o, e.isFiltered = i, e.filterState = c;var d = n(138),
	        l = r(d),
	        p = e.FilterState = { DO_NOT_FILTER: "DO_NOT_FILTER", BLACKLIST_SPECIFIC: "BLACKLIST_SPECIFIC", WHITELIST_SPECIFIC: "WHITELIST_SPECIFIC" };
	  }, 138: function _(t, e, n) {
	    function r(t, e) {
	      var n = {};return e = i(e, 3), o(t, function (t, r, o) {
	        n[r] = e(t, r, o);
	      }), n;
	    }var o = n(139),
	        i = n(145);t.exports = r;
	  }, 139: function _(t, e, n) {
	    function r(t, e) {
	      return t && o(t, e, i);
	    }var o = n(140),
	        i = n(142);t.exports = r;
	  }, 140: function _(t, e, n) {
	    var r = n(141),
	        o = r();t.exports = o;
	  }, 141: function _(t, e) {
	    function n(t) {
	      return function (e, n, r) {
	        for (var o = -1, i = Object(e), a = r(e), u = a.length; u--;) {
	          var c = a[t ? u : ++o];if (n(i[c], c, i) === !1) break;
	        }return e;
	      };
	    }t.exports = n;
	  }, 142: function _(t, e, n) {
	    function r(t) {
	      var e = s(t);if (!e && !u(t)) return i(t);var n = a(t),
	          r = !!n,
	          f = n || [],
	          d = f.length;for (var l in t) {
	        !o(t, l) || r && ("length" == l || c(l, d)) || e && "constructor" == l || f.push(l);
	      }return f;
	    }var o = n(143),
	        i = n(144),
	        a = n(130),
	        u = n(107),
	        c = n(133),
	        s = n(134);t.exports = r;
	  }, 143: function _(t, e, n) {
	    function r(t, e) {
	      return null != t && (a.call(t, e) || "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && e in t && null === o(t));
	    }var o = n(7),
	        i = Object.prototype,
	        a = i.hasOwnProperty;t.exports = r;
	  }, 144: function _(t, e) {
	    function n(t) {
	      return r(Object(t));
	    }var r = Object.keys;t.exports = n;
	  }, 145: function _(t, e, n) {
	    function r(t) {
	      return "function" == typeof t ? t : null == t ? a : "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) ? u(t) ? i(t[0], t[1]) : o(t) : c(t);
	    }var o = n(146),
	        i = n(173),
	        a = n(185),
	        u = n(111),
	        c = n(186);t.exports = r;
	  }, 146: function _(t, e, n) {
	    function r(t) {
	      var e = i(t);return 1 == e.length && e[0][2] ? a(e[0][0], e[0][1]) : function (n) {
	        return n === t || o(n, t, e);
	      };
	    }var o = n(147),
	        i = n(170),
	        a = n(172);t.exports = r;
	  }, 147: function _(t, e, n) {
	    function r(t, e, n, r) {
	      var c = n.length,
	          s = c,
	          f = !r;if (null == t) return !s;for (t = Object(t); c--;) {
	        var d = n[c];if (f && d[2] ? d[1] !== t[d[0]] : !(d[0] in t)) return !1;
	      }for (; ++c < s;) {
	        d = n[c];var l = d[0],
	            p = t[l],
	            v = d[1];if (f && d[2]) {
	          if (void 0 === p && !(l in t)) return !1;
	        } else {
	          var y = new o();if (r) var h = r(p, v, l, t, e, y);if (!(void 0 === h ? i(v, p, r, a | u, y) : h)) return !1;
	        }
	      }return !0;
	    }var o = n(148),
	        i = n(154),
	        a = 1,
	        u = 2;t.exports = r;
	  }, 148: function _(t, e, n) {
	    function r(t) {
	      this.__data__ = new o(t);
	    }var o = n(78),
	        i = n(149),
	        a = n(150),
	        u = n(151),
	        c = n(152),
	        s = n(153);r.prototype.clear = i, r.prototype["delete"] = a, r.prototype.get = u, r.prototype.has = c, r.prototype.set = s, t.exports = r;
	  }, 149: function _(t, e, n) {
	    function r() {
	      this.__data__ = new o();
	    }var o = n(78);t.exports = r;
	  }, 150: function _(t, e) {
	    function n(t) {
	      return this.__data__["delete"](t);
	    }t.exports = n;
	  }, 151: function _(t, e) {
	    function n(t) {
	      return this.__data__.get(t);
	    }t.exports = n;
	  }, 152: function _(t, e) {
	    function n(t) {
	      return this.__data__.has(t);
	    }t.exports = n;
	  }, 153: function _(t, e, n) {
	    function r(t, e) {
	      var n = this.__data__;return n instanceof o && n.__data__.length == a && (n = this.__data__ = new i(n.__data__)), n.set(t, e), this;
	    }var o = n(78),
	        i = n(59),
	        a = 200;t.exports = r;
	  }, 154: function _(t, e, n) {
	    function r(t, e, n, u, c) {
	      return t === e ? !0 : null == t || null == e || !i(t) && !a(e) ? t !== t && e !== e : o(t, e, r, n, u, c);
	    }var o = n(155),
	        i = n(67),
	        a = n(9);t.exports = r;
	  }, 155: function _(t, e, n) {
	    function r(t, e, n, r, h, _) {
	      var b = s(t),
	          m = s(e),
	          S = v,
	          w = v;b || (S = c(t), S = S == p ? y : S), m || (w = c(e), w = w == p ? y : w);var x = S == y && !f(t),
	          O = w == y && !f(e),
	          E = S == w;if (E && !x) return _ || (_ = new o()), b || d(t) ? i(t, e, n, r, h, _) : a(t, e, S, n, r, h, _);if (!(h & l)) {
	        var T = x && g.call(t, "__wrapped__"),
	            I = O && g.call(e, "__wrapped__");if (T || I) {
	          var A = T ? t.value() : t,
	              j = I ? e.value() : e;return _ || (_ = new o()), n(A, j, r, h, _);
	        }
	      }return E ? (_ || (_ = new o()), u(t, e, n, r, h, _)) : !1;
	    }var o = n(148),
	        i = n(156),
	        a = n(158),
	        u = n(163),
	        c = n(164),
	        s = n(111),
	        f = n(8),
	        d = n(169),
	        l = 2,
	        p = "[object Arguments]",
	        v = "[object Array]",
	        y = "[object Object]",
	        h = Object.prototype,
	        g = h.hasOwnProperty;t.exports = r;
	  }, 156: function _(t, e, n) {
	    function r(t, e, n, r, c, s) {
	      var f = c & u,
	          d = t.length,
	          l = e.length;if (d != l && !(f && l > d)) return !1;var p = s.get(t);if (p) return p == e;var v = -1,
	          y = !0,
	          h = c & a ? new o() : void 0;for (s.set(t, e); ++v < d;) {
	        var g = t[v],
	            _ = e[v];if (r) var b = f ? r(_, g, v, e, t, s) : r(g, _, v, t, e, s);if (void 0 !== b) {
	          if (b) continue;y = !1;break;
	        }if (h) {
	          if (!i(e, function (t, e) {
	            return h.has(e) || g !== t && !n(g, t, r, c, s) ? void 0 : h.add(e);
	          })) {
	            y = !1;break;
	          }
	        } else if (g !== _ && !n(g, _, r, c, s)) {
	          y = !1;break;
	        }
	      }return s["delete"](t), y;
	    }var o = n(58),
	        i = n(157),
	        a = 1,
	        u = 2;t.exports = r;
	  }, 157: function _(t, e) {
	    function n(t, e) {
	      for (var n = -1, r = t ? t.length : 0; ++n < r;) {
	        if (e(t[n], n, t)) return !0;
	      }return !1;
	    }t.exports = n;
	  }, 158: function _(t, e, n) {
	    function r(t, e, n, r, o, w, O) {
	      switch (n) {case S:
	          if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1;t = t.buffer, e = e.buffer;case m:
	          return !(t.byteLength != e.byteLength || !r(new i(t), new i(e)));case d:case l:
	          return +t == +e;case p:
	          return t.name == e.name && t.message == e.message;case y:
	          return t != +t ? e != +e : t == +e;case h:case _:
	          return t == e + "";case v:
	          var E = u;case g:
	          var T = w & f;if (E || (E = c), t.size != e.size && !T) return !1;var I = O.get(t);return I ? I == e : (w |= s, O.set(t, e), a(E(t), E(e), r, o, w, O));case b:
	          if (x) return x.call(t) == x.call(e);}return !1;
	    }var o = n(159),
	        i = n(160),
	        a = n(156),
	        u = n(161),
	        c = n(162),
	        s = 1,
	        f = 2,
	        d = "[object Boolean]",
	        l = "[object Date]",
	        p = "[object Error]",
	        v = "[object Map]",
	        y = "[object Number]",
	        h = "[object RegExp]",
	        g = "[object Set]",
	        _ = "[object String]",
	        b = "[object Symbol]",
	        m = "[object ArrayBuffer]",
	        S = "[object DataView]",
	        w = o ? o.prototype : void 0,
	        x = w ? w.valueOf : void 0;t.exports = r;
	  }, 159: function _(t, e, n) {
	    var r = n(70),
	        o = r.Symbol;t.exports = o;
	  }, 160: function _(t, e, n) {
	    var r = n(70),
	        o = r.Uint8Array;t.exports = o;
	  }, 161: function _(t, e) {
	    function n(t) {
	      var e = -1,
	          n = Array(t.size);return t.forEach(function (t, r) {
	        n[++e] = [r, t];
	      }), n;
	    }t.exports = n;
	  }, 162: function _(t, e) {
	    function n(t) {
	      var e = -1,
	          n = Array(t.size);return t.forEach(function (t) {
	        n[++e] = t;
	      }), n;
	    }t.exports = n;
	  }, 163: function _(t, e, n) {
	    function r(t, e, n, r, u, c) {
	      var s = u & a,
	          f = i(t),
	          d = f.length,
	          l = i(e),
	          p = l.length;if (d != p && !s) return !1;for (var v = d; v--;) {
	        var y = f[v];if (!(s ? y in e : o(e, y))) return !1;
	      }var h = c.get(t);if (h) return h == e;var g = !0;c.set(t, e);for (var _ = s; ++v < d;) {
	        y = f[v];var b = t[y],
	            m = e[y];if (r) var S = s ? r(m, b, y, e, t, c) : r(b, m, y, t, e, c);if (!(void 0 === S ? b === m || n(b, m, r, u, c) : S)) {
	          g = !1;break;
	        }_ || (_ = "constructor" == y);
	      }if (g && !_) {
	        var w = t.constructor,
	            x = e.constructor;w != x && "constructor" in t && "constructor" in e && !("function" == typeof w && w instanceof w && "function" == typeof x && x instanceof x) && (g = !1);
	      }return c["delete"](t), g;
	    }var o = n(143),
	        i = n(142),
	        a = 2;t.exports = r;
	  }, 164: function _(t, e, n) {
	    function r(t) {
	      return g.call(t);
	    }var o = n(165),
	        i = n(86),
	        a = n(166),
	        u = n(167),
	        c = n(168),
	        s = n(72),
	        f = "[object Map]",
	        d = "[object Object]",
	        l = "[object Promise]",
	        p = "[object Set]",
	        v = "[object WeakMap]",
	        y = "[object DataView]",
	        h = Object.prototype,
	        g = h.toString,
	        _ = s(o),
	        b = s(i),
	        m = s(a),
	        S = s(u),
	        w = s(c);(o && r(new o(new ArrayBuffer(1))) != y || i && r(new i()) != f || a && r(a.resolve()) != l || u && r(new u()) != p || c && r(new c()) != v) && (r = function r(t) {
	      var e = g.call(t),
	          n = e == d ? t.constructor : void 0,
	          r = n ? s(n) : void 0;if (r) switch (r) {case _:
	          return y;case b:
	          return f;case m:
	          return l;case S:
	          return p;case w:
	          return v;}return e;
	    }), t.exports = r;
	  }, 165: function _(t, e, n) {
	    var r = n(64),
	        o = n(70),
	        i = r(o, "DataView");t.exports = i;
	  }, 166: function _(t, e, n) {
	    var r = n(64),
	        o = n(70),
	        i = r(o, "Promise");t.exports = i;
	  }, 167: function _(t, e, n) {
	    var r = n(64),
	        o = n(70),
	        i = r(o, "Set");t.exports = i;
	  }, 168: function _(t, e, n) {
	    var r = n(64),
	        o = n(70),
	        i = r(o, "WeakMap");t.exports = i;
	  }, 169: function _(t, e, n) {
	    function r(t) {
	      return i(t) && o(t.length) && !!C[R.call(t)];
	    }var o = n(110),
	        i = n(9),
	        a = "[object Arguments]",
	        u = "[object Array]",
	        c = "[object Boolean]",
	        s = "[object Date]",
	        f = "[object Error]",
	        d = "[object Function]",
	        l = "[object Map]",
	        p = "[object Number]",
	        v = "[object Object]",
	        y = "[object RegExp]",
	        h = "[object Set]",
	        g = "[object String]",
	        _ = "[object WeakMap]",
	        b = "[object ArrayBuffer]",
	        m = "[object DataView]",
	        S = "[object Float32Array]",
	        w = "[object Float64Array]",
	        x = "[object Int8Array]",
	        O = "[object Int16Array]",
	        E = "[object Int32Array]",
	        T = "[object Uint8Array]",
	        I = "[object Uint8ClampedArray]",
	        A = "[object Uint16Array]",
	        j = "[object Uint32Array]",
	        C = {};C[S] = C[w] = C[x] = C[O] = C[E] = C[T] = C[I] = C[A] = C[j] = !0, C[a] = C[u] = C[b] = C[c] = C[m] = C[s] = C[f] = C[d] = C[l] = C[p] = C[v] = C[y] = C[h] = C[g] = C[_] = !1;var N = Object.prototype,
	        R = N.toString;t.exports = r;
	  }, 170: function _(t, e, n) {
	    function r(t) {
	      for (var e = i(t), n = e.length; n--;) {
	        var r = e[n],
	            a = t[r];e[n] = [r, a, o(a)];
	      }return e;
	    }var o = n(171),
	        i = n(142);t.exports = r;
	  }, 171: function _(t, e, n) {
	    function r(t) {
	      return t === t && !o(t);
	    }var o = n(67);t.exports = r;
	  }, 172: function _(t, e) {
	    function n(t, e) {
	      return function (n) {
	        return null == n ? !1 : n[t] === e && (void 0 !== e || t in Object(n));
	      };
	    }t.exports = n;
	  }, 173: function _(t, e, n) {
	    function r(t, e) {
	      return u(t) && c(e) ? s(f(t), e) : function (n) {
	        var r = i(n, t);return void 0 === r && r === e ? a(n, t) : o(e, r, void 0, d | l);
	      };
	    }var o = n(154),
	        i = n(174),
	        a = n(182),
	        u = n(181),
	        c = n(171),
	        s = n(172),
	        f = n(135),
	        d = 1,
	        l = 2;t.exports = r;
	  }, 174: function _(t, e, n) {
	    function r(t, e, n) {
	      var r = null == t ? void 0 : o(t, e);return void 0 === r ? n : r;
	    }var o = n(175);t.exports = r;
	  }, 175: function _(t, e, n) {
	    function r(t, e) {
	      e = i(e, t) ? [e] : o(e);for (var n = 0, r = e.length; null != t && r > n;) {
	        t = t[a(e[n++])];
	      }return n && n == r ? t : void 0;
	    }var o = n(176),
	        i = n(181),
	        a = n(135);t.exports = r;
	  }, 176: function _(t, e, n) {
	    function r(t) {
	      return o(t) ? t : i(t);
	    }var o = n(111),
	        i = n(177);t.exports = r;
	  }, 177: function _(t, e, n) {
	    var r = n(178),
	        o = n(179),
	        i = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g,
	        a = /\\(\\)?/g,
	        u = r(function (t) {
	      var e = [];return o(t).replace(i, function (t, n, r, o) {
	        e.push(r ? o.replace(a, "$1") : n || t);
	      }), e;
	    });t.exports = u;
	  }, 178: function _(t, e, n) {
	    function r(t, e) {
	      if ("function" != typeof t || e && "function" != typeof e) throw new TypeError(i);var n = function n() {
	        var r = arguments,
	            o = e ? e.apply(this, r) : r[0],
	            i = n.cache;if (i.has(o)) return i.get(o);
	        var a = t.apply(this, r);return n.cache = i.set(o, a), a;
	      };return n.cache = new (r.Cache || o)(), n;
	    }var o = n(59),
	        i = "Expected a function";r.Cache = o, t.exports = r;
	  }, 179: function _(t, e, n) {
	    function r(t) {
	      return null == t ? "" : o(t);
	    }var o = n(180);t.exports = r;
	  }, 180: function _(t, e, n) {
	    function r(t) {
	      if ("string" == typeof t) return t;if (i(t)) return c ? c.call(t) : "";var e = t + "";return "0" == e && 1 / t == -a ? "-0" : e;
	    }var o = n(159),
	        i = n(117),
	        a = 1 / 0,
	        u = o ? o.prototype : void 0,
	        c = u ? u.toString : void 0;t.exports = r;
	  }, 181: function _(t, e, n) {
	    function r(t, e) {
	      if (o(t)) return !1;var n = typeof t === "undefined" ? "undefined" : _typeof(t);return "number" == n || "symbol" == n || "boolean" == n || null == t || i(t) ? !0 : u.test(t) || !a.test(t) || null != e && t in Object(e);
	    }var o = n(111),
	        i = n(117),
	        a = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	        u = /^\w*$/;t.exports = r;
	  }, 182: function _(t, e, n) {
	    function r(t, e) {
	      return null != t && i(t, e, o);
	    }var o = n(183),
	        i = n(184);t.exports = r;
	  }, 183: function _(t, e) {
	    function n(t, e) {
	      return null != t && e in Object(t);
	    }t.exports = n;
	  }, 184: function _(t, e, n) {
	    function r(t, e, n) {
	      e = c(e, t) ? [e] : o(e);for (var r, l = -1, p = e.length; ++l < p;) {
	        var v = d(e[l]);if (!(r = null != t && n(t, v))) break;t = t[v];
	      }if (r) return r;var p = t ? t.length : 0;return !!p && s(p) && u(v, p) && (a(t) || f(t) || i(t));
	    }var o = n(176),
	        i = n(105),
	        a = n(111),
	        u = n(133),
	        c = n(181),
	        s = n(110),
	        f = n(132),
	        d = n(135);t.exports = r;
	  }, 185: function _(t, e) {
	    function n(t) {
	      return t;
	    }t.exports = n;
	  }, 186: function _(t, e, n) {
	    function r(t) {
	      return a(t) ? o(u(t)) : i(t);
	    }var o = n(109),
	        i = n(187),
	        a = n(181),
	        u = n(135);t.exports = r;
	  }, 187: function _(t, e, n) {
	    function r(t) {
	      return function (e) {
	        return o(e, t);
	      };
	    }var o = n(175);t.exports = r;
	  }, 191: function _(t, e, n) {
	    "use strict";
	    function r() {
	      d = !0;var t = "tab";l = window.devToolsExtensionID ? chrome.runtime.connect(window.devToolsExtensionID, { name: t }) : chrome.runtime.connect({ name: t }), l.onMessage.addListener(function (t) {
	        t.action ? window.postMessage({ type: t.type, payload: t.action, state: t.state, id: t.id, source: f }, "*") : t.options ? (0, s.injectOptions)(t.options) : window.postMessage({ type: t.type, state: t.state, id: t.id, source: f }, "*");
	      }), l.onDisconnect.addListener(o);
	    }function o() {
	      window.removeEventListener("message", u), window.postMessage({ type: "STOP", failed: !0, source: f }, "*"), l = void 0;
	    }function i(t, e) {
	      try {
	        return t(e);
	      } catch (n) {
	        o();
	      }
	    }function a(t) {
	      d || r(), "INIT_INSTANCE" === t.type ? l.postMessage({ name: "INIT_INSTANCE" }) : l.postMessage({ name: "RELAY", message: t });
	    }function u(t) {
	      if ((0, s.isAllowed)() && t && t.source === window && "object" === c(t.data)) {
	        var e = t.data;if ("@devtools-page" === e.source) return "DISCONNECT" === e.type ? void (l && l.disconnect()) : void i(a, e);
	      }
	    }var c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
	      return typeof t === "undefined" ? "undefined" : _typeof(t);
	    } : function (t) {
	      return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
	    },
	        s = n(136),
	        f = "@devtools-extension",
	        d = !1,
	        l = void 0;window.devToolsOptions || (0, s.getOptionsFromBg)(), window.addEventListener("message", u, !1);
	  }, 598: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e, n) {
	      var r = n,
	          o = void 0;try {
	        r = t(n, e);
	      } catch (i) {
	        o = i.toString(), "object" === ("undefined" == typeof window ? "undefined" : p(window)) && ("undefined" != typeof window.chrome || "undefined" != typeof window.process && "renderer" === window.process.type) ? setTimeout(function () {
	          throw i;
	        }) : console.error(i);
	      }return { state: r, error: o };
	    }function i(t, e, n, r) {
	      return r ? o(t, e, n) : { state: t(n, e) };
	    }function a(t, e, n, r, o, a, u, c) {
	      if (!t || -1 === e || e >= t.length && t.length === a.length) return t;for (var s = t.slice(0, e), f = e; f < a.length; f++) {
	        var d = a[f],
	            l = o[d].action,
	            p = s[f - 1],
	            v = p ? p.state : r,
	            y = u.indexOf(d) > -1,
	            h = void 0;h = y ? p : c && p && p.error ? { state: v, error: "Interrupted by an error up the chain" } : i(n, l, v, c), s.push(h);
	      }return s;
	    }function u(t) {
	      return x.performAction(t);
	    }function c(t, e, n, r) {
	      var o = { monitorState: n(void 0, {}), nextActionId: 1, actionsById: { 0: u(O) }, stagedActionIds: [0], skippedActionIds: [], committedState: e, currentStateIndex: 0, computedStates: [], isLocked: r.shouldStartLocked === !0, isPaused: r.shouldRecordChanges === !1 };return function (c, s) {
	        function f(t) {
	          for (var e = t, n = b.slice(1, e + 1), r = 0; r < n.length; r++) {
	            if (E[r + 1].error) {
	              e = r, n = b.slice(1, e + 1);break;
	            }delete h[n[r]];
	          }m = m.filter(function (t) {
	            return -1 === n.indexOf(t);
	          }), b = [0].concat(b.slice(e + 1)), S = E[e].state, E = E.slice(e), x = x > e ? x - e : 0;
	        }function d(e) {
	          var o,
	              a = void 0;return e ? (a = E[x], v = n(v, s)) : a = i(t, s.action, E[x].state, !1), r.pauseActionType && 1 !== _ ? (e && (x === b.length - 1 && x++, b = [].concat(b, [_]), _++), { monitorState: v, actionsById: l({}, h, (o = {}, o[_ - 1] = u({ type: r.pauseActionType }), o)), nextActionId: _, stagedActionIds: b, skippedActionIds: m, committedState: S, currentStateIndex: x, computedStates: [].concat(E.slice(0, b.length - 1), [a]), isLocked: T, isPaused: !0 }) : { monitorState: v, actionsById: { 0: u(O) }, nextActionId: 1, stagedActionIds: [0], skippedActionIds: [], committedState: a.state, currentStateIndex: 0, computedStates: [a], isLocked: T, isPaused: !0 };
	        }var p = c || o,
	            v = p.monitorState,
	            h = p.actionsById,
	            _ = p.nextActionId,
	            b = p.stagedActionIds,
	            m = p.skippedActionIds,
	            S = p.committedState,
	            x = p.currentStateIndex,
	            E = p.computedStates,
	            T = p.isLocked,
	            I = p.isPaused;c || (h = l({}, h));var A = 0;switch (s.type) {case w.PERFORM_ACTION:
	            if (T) return c || o;if (I) return d();r.maxAge && b.length === r.maxAge && f(1), x === b.length - 1 && x++;var j = _++;h[j] = s, b = [].concat(b, [j]), A = b.length - 1;break;case w.RESET:
	            h = { 0: u(O) }, _ = 1, b = [0], m = [], S = e, x = 0, E = [];break;case w.COMMIT:
	            h = { 0: u(O) }, _ = 1, b = [0], m = [], S = E[x].state, x = 0, E = [];break;case w.ROLLBACK:
	            h = { 0: u(O) }, _ = 1, b = [0], m = [], x = 0, E = [];break;case w.TOGGLE_ACTION:
	            var C = function () {
	              var t = s.id,
	                  e = m.indexOf(t);return m = -1 === e ? [t].concat(m) : m.filter(function (e) {
	                return e !== t;
	              }), A = b.indexOf(t), "break";
	            }();if ("break" === C) break;case w.SET_ACTIONS_ACTIVE:
	            for (var N = s.start, R = s.end, M = s.active, P = [], L = N; R > L; L++) {
	              P.push(L);
	            }m = M ? (0, y["default"])(m, P) : (0, g["default"])(m, P), A = b.indexOf(N);break;case w.JUMP_TO_STATE:
	            x = s.index, A = 1 / 0;break;case w.SWEEP:
	            b = (0, y["default"])(b, m), m = [], x = Math.min(x, b.length - 1);break;case w.IMPORT_STATE:
	            if (Array.isArray(s.nextLiftedState)) h = { 0: u(O) }, _ = 1, b = [0], m = [], x = s.nextLiftedState.length, E = [], S = s.preloadedState, A = 0, s.nextLiftedState.forEach(function (t) {
	              h[_] = u(t), b.push(_), _++;
	            });else {
	              var k = s.nextLiftedState;v = k.monitorState, h = k.actionsById, _ = k.nextActionId, b = k.stagedActionIds, m = k.skippedActionIds, S = k.committedState, x = k.currentStateIndex, E = k.computedStates, s.noRecompute && (A = 1 / 0);
	            }break;case w.LOCK_CHANGES:
	            T = s.status, A = 1 / 0;break;case w.PAUSE_RECORDING:
	            if (I = s.status) return d(!0);A = 1 / 0;break;case "@@redux/INIT":
	            if (r.shouldHotReload === !1 && c) return c;A = 0, r.maxAge && b.length > r.maxAge && (E = a(E, A, t, S, h, b, m, r.shouldCatchErrors), f(b.length - r.maxAge), A = 1 / 0);break;default:
	            A = 1 / 0;}return E = a(E, A, t, S, h, b, m, r.shouldCatchErrors), v = n(v, s), { monitorState: v, actionsById: h, nextActionId: _, stagedActionIds: b, skippedActionIds: m, committedState: S, currentStateIndex: x, computedStates: E, isLocked: T, isPaused: I };
	      };
	    }function s(t) {
	      var e = t.computedStates,
	          n = t.currentStateIndex,
	          r = e[n].state;return r;
	    }function f(t, e) {
	      function n() {
	        var e = s(t.getState());return void 0 !== e && (o = e), o;
	      }var r,
	          o = void 0;return l({}, t, (r = { liftedStore: t, dispatch: function dispatch(e) {
	          return t.dispatch(u(e)), e;
	        }, getState: n, replaceReducer: function replaceReducer(n) {
	          t.replaceReducer(e(n));
	        } }, r[S["default"]] = function () {
	        return l({}, t[S["default"]](), { subscribe: function subscribe(e) {
	            function r() {
	              e.next && e.next(n());
	            }if ("object" !== ("undefined" == typeof e ? "undefined" : p(e))) throw new TypeError("Expected the observer to be an object.");r();var o = t.subscribe(r);return { unsubscribe: o };
	          } });
	      }, r));
	    }function d() {
	      var t = arguments.length <= 0 || void 0 === arguments[0] ? function () {
	        return null;
	      } : arguments[0],
	          e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1];if (null != e.maxAge && e.maxAge < 2) throw new Error("DevTools.instrument({ maxAge }) option, if specified, may not be less than 2.");return function (n) {
	        return function (r, o, i) {
	          function a(n) {
	            if ("function" != typeof n) {
	              if (n && "function" == typeof n["default"]) throw new Error('Expected the reducer to be a function. Instead got an object with a "default" field. Did you pass a module instead of the default export? Try passing require(...).default instead.');throw new Error("Expected the reducer to be a function.");
	            }return c(n, o, t, e);
	          }var u = n(a(r), i);if (u.liftedStore) throw new Error("DevTools instrumentation should not be applied more than once. Check your store configuration.");return f(u, a);
	        };
	      };
	    }e.__esModule = !0, e.INIT_ACTION = e.ActionCreators = e.ActionTypes = void 0;var l = Object.assign || function (t) {
	      for (var e = 1; e < arguments.length; e++) {
	        var n = arguments[e];for (var r in n) {
	          Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
	        }
	      }return t;
	    },
	        p = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
	      return typeof t === "undefined" ? "undefined" : _typeof(t);
	    } : function (t) {
	      return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
	    };e.liftAction = u, e.liftReducerWith = c, e.unliftState = s, e.unliftStore = f, e["default"] = d;var v = n(56),
	        y = r(v),
	        h = n(599),
	        g = r(h),
	        _ = n(6),
	        b = r(_),
	        m = n(10),
	        S = r(m),
	        w = e.ActionTypes = { PERFORM_ACTION: "PERFORM_ACTION", RESET: "RESET", ROLLBACK: "ROLLBACK", COMMIT: "COMMIT", SWEEP: "SWEEP", TOGGLE_ACTION: "TOGGLE_ACTION", SET_ACTIONS_ACTIVE: "SET_ACTIONS_ACTIVE", JUMP_TO_STATE: "JUMP_TO_STATE", IMPORT_STATE: "IMPORT_STATE", LOCK_CHANGES: "LOCK_CHANGES", PAUSE_RECORDING: "PAUSE_RECORDING" },
	        x = e.ActionCreators = { performAction: function performAction(t) {
	        if (!(0, b["default"])(t)) throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if ("undefined" == typeof t.type) throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');return { type: w.PERFORM_ACTION, action: t, timestamp: Date.now() };
	      }, reset: function reset() {
	        return { type: w.RESET, timestamp: Date.now() };
	      }, rollback: function rollback() {
	        return { type: w.ROLLBACK, timestamp: Date.now() };
	      }, commit: function commit() {
	        return { type: w.COMMIT, timestamp: Date.now() };
	      }, sweep: function sweep() {
	        return { type: w.SWEEP };
	      }, toggleAction: function toggleAction(t) {
	        return { type: w.TOGGLE_ACTION, id: t };
	      }, setActionsActive: function setActionsActive(t, e) {
	        var n = arguments.length <= 2 || void 0 === arguments[2] ? !0 : arguments[2];return { type: w.SET_ACTIONS_ACTIVE, start: t, end: e, active: n };
	      }, jumpToState: function jumpToState(t) {
	        return { type: w.JUMP_TO_STATE, index: t };
	      }, importState: function importState(t, e) {
	        return { type: w.IMPORT_STATE, nextLiftedState: t, noRecompute: e };
	      }, lockChanges: function lockChanges(t) {
	        return { type: w.LOCK_CHANGES, status: t };
	      }, pauseRecording: function pauseRecording(t) {
	        return { type: w.PAUSE_RECORDING, status: t };
	      } },
	        O = e.INIT_ACTION = { type: "@@INIT" };
	  }, 599: function _(t, e, n) {
	    var r = n(102),
	        o = n(600),
	        i = n(106),
	        a = n(112),
	        u = a(function (t) {
	      return o(r(t, 1, i, !0));
	    });t.exports = u;
	  }, 600: function _(t, e, n) {
	    function r(t, e, n) {
	      var r = -1,
	          d = i,
	          l = t.length,
	          p = !0,
	          v = [],
	          y = v;if (n) p = !1, d = a;else if (l >= f) {
	        var h = e ? null : c(t);if (h) return s(h);p = !1, d = u, y = new o();
	      } else y = e ? [] : v;t: for (; ++r < l;) {
	        var g = t[r],
	            _ = e ? e(g) : g;if (g = n || 0 !== g ? g : 0, p && _ === _) {
	          for (var b = y.length; b--;) {
	            if (y[b] === _) continue t;
	          }e && y.push(_), v.push(g);
	        } else d(y, _, n) || (y !== v && y.push(_), v.push(g));
	      }return v;
	    }var o = n(58),
	        i = n(95),
	        a = n(98),
	        u = n(101),
	        c = n(601),
	        s = n(162),
	        f = 200;t.exports = r;
	  }, 601: function _(t, e, n) {
	    var r = n(167),
	        o = n(602),
	        i = n(162),
	        a = 1 / 0,
	        u = r && 1 / i(new r([, -0]))[1] == a ? function (t) {
	      return new r(t);
	    } : o;t.exports = u;
	  }, 602: function _(t, e) {
	    function n() {}t.exports = n;
	  }, 603: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t) {
	      function e(t) {
	        return i({}, t, { actionsById: (0, u["default"])(t.actionsById, function (t) {
	            return i({}, t, { action: r(t.action) });
	          }), committedState: n(t.committedState), computedStates: t.computedStates.map(function (t) {
	            return i({}, t, { state: n(t.state) });
	          }) });
	      }var n = arguments.length <= 1 || void 0 === arguments[1] ? s["default"] : arguments[1],
	          r = arguments.length <= 2 || void 0 === arguments[2] ? s["default"] : arguments[2];return t ? function (n) {
	        return function (r, o, a) {
	          var u = "redux-dev-session-" + t,
	              c = void 0;try {
	            var s = localStorage.getItem(u);s && (c = e(JSON.parse(s)) || o, n(r, o));
	          } catch (f) {
	            console.warn("Could not read debug session from localStorage:", f);try {
	              localStorage.removeItem(u);
	            } finally {
	              c = void 0;
	            }
	          }var d = n(r, c, a);return i({}, d, { dispatch: function dispatch(t) {
	              d.dispatch(t);try {
	                localStorage.setItem(u, JSON.stringify(d.getState()));
	              } catch (e) {
	                console.warn("Could not write debug session to localStorage:", e);
	              }return t;
	            } });
	        };
	      } : function (t) {
	        return function () {
	          return t.apply(void 0, arguments);
	        };
	      };
	    }e.__esModule = !0;var i = Object.assign || function (t) {
	      for (var e = 1; e < arguments.length; e++) {
	        var n = arguments[e];for (var r in n) {
	          Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
	        }
	      }return t;
	    };e["default"] = o;var a = n(138),
	        u = r(a),
	        c = n(185),
	        s = r(c);
	  }, 1075: function _(t, e, n) {
	    "use strict";
	    window.devToolsExtensionID = "lmhkpmbekcpmknklioeibfkpmmfibljd", n(191), n(1076), chrome.runtime.sendMessage(window.devToolsExtensionID, { type: "GET_OPTIONS" }, function (t) {
	      if (!t.options.inject) {
	        var e = t.options.urls.split("\n").filter(Boolean).join("|");if (!location.href.match(new RegExp(e))) return;
	      }window.devToolsOptions = t.options, window.devToolsExtension.notifyErrors();
	    });
	  }, 1076: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e) {
	      console.warn(t + " parameter is deprecated, use " + e + " instead: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md");
	    }var i = Object.assign || function (t) {
	      for (var e = 1; e < arguments.length; e++) {
	        var n = arguments[e];for (var r in n) {
	          Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
	        }
	      }return t;
	    },
	        a = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
	      return typeof t === "undefined" ? "undefined" : _typeof(t);
	    } : function (t) {
	      return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
	    },
	        u = n(1077),
	        c = n(1079),
	        s = r(c),
	        f = n(1080),
	        d = r(f),
	        l = n(136),
	        p = n(1081),
	        v = r(p),
	        y = n(137),
	        h = n(1082),
	        g = r(h),
	        _ = n(1083),
	        b = r(_),
	        m = n(1084),
	        S = r(m),
	        w = n(1085),
	        x = {},
	        O = void 0,
	        E = function E(t, e, n) {
	      function r(t, e, r, o, i) {
	        var a = { type: t, payload: (0, y.filterState)(e, t, P, F, B, o, $), source: "@devtools-page", instanceId: M };"ACTION" === t ? (a.action = B ? B(r.action, o - 1) : r, a.isExcess = A, a.nextActionId = o) : i && (a.action = r, a.name = n.name || document.title), (0, w.toContentScript)(a, N, R, C);
	      }function c(t, e) {
	        r("STATE", E.liftedStore.getState(), t, void 0, e);
	      }function p(t) {
	        try {
	          var e = (0, u.evalAction)(t, j);E.dispatch(e);
	        } catch (n) {
	          r("ERROR", n.message);
	        }
	      }function h(t) {
	        switch (t.type) {case "DISPATCH":
	            return void E.liftedStore.dispatch(t.payload);case "ACTION":
	            return void p(t.payload);case "IMPORT":
	            var e = (0, b["default"])(t.state, n);if (!e) return;return E.liftedStore.dispatch(i({ type: "IMPORT_STATE" }, e)), void c();case "UPDATE":
	            return void c();case "START":
	            return U.start(!0), !j && n.actionCreators && (j = (0, u.getActionsArray)(n.actionCreators)), c(JSON.stringify(j), !0), void (O && (r("GET_REPORT", O), O = null));case "STOP":
	            U.stop(), t.failed || r("STOP");}
	      }function _() {
	        I = n.maxAge || window.devToolsOptions.maxAge || 50, (0, w.setListener)(h, M), (0, g["default"])(function () {
	          T = !0;var t = E.liftedStore.getState();return t.computedStates[t.currentStateIndex].error && r("STATE", t), !0;
	        }), r("INIT_INSTANCE"), E.subscribe(m), "undefined" == typeof O && (O = (0, f.getUrlParam)("remotedev_report"), O && (0, S["default"])());
	      }function m() {
	        if (U.active) if (T || U.isMonitorAction()) {
	          if (U.isPaused() || U.isLocked() || U.isTimeTraveling()) return;var t = E.liftedStore.getState();T && !t.computedStates[t.currentStateIndex].error && (T = !1), r("STATE", t);
	        } else {
	          var e = E.liftedStore.getState(),
	              n = e.nextActionId,
	              o = n - 1,
	              i = e.actionsById[o],
	              a = i.action;if ((0, y.isFiltered)(a, P)) return;var u = e.stagedActionIds.length,
	              c = e.computedStates[u - 1].state;if ($ && !$(c, a)) return;r("ACTION", c, i, n), !A && I && (A = u >= I);
	        }
	      }"object" === ("undefined" == typeof t ? "undefined" : a(t)) ? (n = t, t = void 0) : "object" !== ("undefined" == typeof n ? "undefined" : a(n)) && (n = {}), window.devToolsOptions || (window.devToolsOptions = {});var E = void 0,
	          T = !1,
	          I = void 0,
	          A = void 0,
	          j = void 0,
	          C = void 0,
	          N = void 0,
	          R = void 0,
	          M = (0, w.generateId)(n.instanceId),
	          P = (0, y.getLocalFilter)(n),
	          L = n,
	          k = L.statesFilter,
	          D = L.actionsFilter,
	          F = L.stateSanitizer,
	          B = L.actionSanitizer,
	          $ = L.predicate;k && (o("statesFilter", "stateSanitizer"), F = k), D && (o("actionsFilter", "actionSanitizer"), B = D), n.serializeState && (N = n.serializeState, "function" == typeof N ? N = { replacer: N } : C = !0), n.serializeAction && (R = n.serializeAction, "function" == typeof R ? R = { replacer: R } : C = !0);var U = new v["default"](c);n.getMonitor && n.getMonitor(U);var G = function G() {
	        return function (t) {
	          return function (e, r, o) {
	            return (0, l.isAllowed)(window.devToolsOptions) ? (E = x[M] = (0, d["default"])(t, U.reducer, n)(e, r, o), (0, w.isInIframe)() ? setTimeout(_, 3e3) : _(), E) : t(e, r, o);
	          };
	        };
	      };return t ? (0, s["default"])(t, e, G) : G();
	    };window.devToolsExtension = E, window.devToolsExtension.open = S["default"], window.devToolsExtension.updateStore = (0, w.updateStore)(x), window.devToolsExtension.notifyErrors = g["default"], window.devToolsExtension.send = w.sendMessage, window.devToolsExtension.listen = w.setListener, window.devToolsExtension.connect = w.connect, window.devToolsExtension.disconnect = w.disconnect, window.__REDUX_DEVTOOLS_EXTENSION__ = window.devToolsExtension;var T = function T(t) {
	      return function (e) {
	        return function (n, r, o) {
	          var a = e(n, r, o);return x[t] && (x[t].dispatch = a.dispatch, x[t].liftedStore = a.liftedStore, x[t].getState = a.getState), i({}, a, { dispatch: function dispatch(t) {
	              return window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ ? t : a.dispatch(t);
	            } });
	        };
	      };
	    },
	        I = function I(t) {
	      return function () {
	        for (var e = arguments.length, n = Array(e), r = 0; e > r; r++) {
	          n[r] = arguments[r];
	        }return function () {
	          var e = (0, w.generateId)(t.instanceId);return [T(e)].concat(n).reduceRight(function (t, e) {
	            return e(t);
	          }, E(i({}, t, { instanceId: e })).apply(void 0, arguments));
	        };
	      };
	    };window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = function () {
	      return 0 === arguments.length ? E() : 1 === arguments.length && "object" === a(arguments.length <= 0 ? void 0 : arguments[0]) ? I(arguments.length <= 0 ? void 0 : arguments[0]) : I({}).apply(void 0, arguments);
	    };
	  }, 1077: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t) {
	      var e = arguments.length <= 1 || void 0 === arguments[1] ? "" : arguments[1],
	          n = [];return Object.keys(t).forEach(function (r) {
	        var i = t[r];"function" == typeof i ? n.push({ name: e + (r || i.name || "anonymous"), func: i, args: (0, l["default"])(i) }) : "object" === ("undefined" == typeof i ? "undefined" : f(i)) && (n = n.concat(o(i, e + r + ".")));
	      }), n;
	    }function i(t) {
	      if ("object" === ("undefined" == typeof t ? "undefined" : f(t))) {
	        var e = void 0,
	            n = void 0;return t.__proto__ && (n = t.__proto__.__proto__), n || (n = t), Object.getOwnPropertyNames(n).forEach(function (t) {
	          var r = n[t];"function" == typeof r && "constructor" !== t && (e || (e = []), e.push({ name: t || r.name || "anonymous", args: (0, l["default"])(r) }));
	        }), e;
	      }
	    }function a(t) {
	      return Array.isArray(t) ? t : o(t);
	    }function u(t, e) {
	      var n = t.map(p);if (!e) return n;var r = p(e);if (Array.isArray(r)) return n.concat.apply(n, r);throw new Error("rest must be an array");
	    }function c(t, e) {
	      if ("string" == typeof t) return new Function("return " + t)();var n = e[t.selected].func,
	          r = u(t.args, t.rest);return n.apply(void 0, r);
	    }function s(t, e) {
	      if ("string" == typeof t) return new Function("obj", "return obj." + t)(e);var n = u(t.args, t.rest);return new Function("obj", "args", "return obj." + t.name + ".apply(obj,args)")(e, n);
	    }e.__esModule = !0;var f = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
	      return typeof t === "undefined" ? "undefined" : _typeof(t);
	    } : function (t) {
	      return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
	    };e.getMethods = i, e.getActionsArray = a, e.evalAction = c, e.evalMethod = s;var d = n(1078),
	        l = r(d),
	        p = function p(t) {
	      return new Function("return " + t)();
	    };
	  }, 1078: function _(t, e) {
	    var n = function n(t) {
	      "use strict";
	      if ("function" != typeof t) return [];var e = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
	          n = /([^\s,]+)/g,
	          r = t.toString().replace(e, ""),
	          o = r.slice(r.indexOf("(") + 1, r.indexOf(")")).match(n);return null === o ? [] : o;
	    };"undefined" != typeof t && "undefined" != typeof t.exports && (t.exports = n), "undefined" != typeof window && (window.GetParams = n);
	  }, 1079: function _(t, e, n) {
	    "use strict";
	    function r(t, e, n) {
	      return (0, o.createStore)(t, e, n());
	    }Object.defineProperty(e, "__esModule", { value: !0 }), e["default"] = r;var o = n(4);t.exports = e["default"];
	  }, 1080: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t) {
	      var e = window.location.href.match(new RegExp("[?&]" + t + "=([^&#]+)\\b"));return e && e.length > 0 ? e[1] : null;
	    }function i(t, e, n) {
	      return (0, a.compose)((0, c["default"])(e, { maxAge: n.maxAge || window.devToolsOptions.maxAge || 50, shouldCatchErrors: n.shouldCatchErrors || window.shouldCatchErrors, shouldHotReload: n.shouldHotReload, shouldRecordChanges: n.shouldRecordChanges, shouldStartLocked: n.shouldStartLocked, pauseActionType: n.pauseActionType || "@@PAUSED" }), (0, f["default"])(o("debug_session"), n.deserializeState, n.deserializeAction))(t);
	    }Object.defineProperty(e, "__esModule", { value: !0 }), e.getUrlParam = o, e["default"] = i;var a = n(4),
	        u = n(598),
	        c = r(u),
	        s = n(603),
	        f = r(s);
	  }, 1081: function _(t, e) {
	    "use strict";
	    function n(t, e) {
	      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
	    }Object.defineProperty(e, "__esModule", { value: !0 });var r = function o(t) {
	      var e = this;n(this, o), this.reducer = function () {
	        var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
	            n = arguments[1];return e.active ? (e.lastAction = n.type, "LOCK_CHANGES" === n.type ? window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ = n.status : "PAUSE_RECORDING" === n.type ? e.paused = n.status : e.isHotReloaded() && setTimeout(e.update, 0), t) : t;
	      }, this.start = function (t) {
	        e.active = !0, t || e.update();
	      }, this.stop = function () {
	        e.active = !1, clearTimeout(e.waitingTimeout);
	      }, this.isHotReloaded = function () {
	        return "@@redux/INIT" === e.lastAction;
	      }, this.isMonitorAction = function () {
	        return e.lastAction && "PERFORM_ACTION" !== e.lastAction;
	      }, this.isTimeTraveling = function () {
	        return "JUMP_TO_STATE" === e.lastAction;
	      }, this.isPaused = function () {
	        return e.paused ? "BLOCKED" !== e.lastAction ? (window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ || (e.lastAction = "BLOCKED"), !1) : !0 : !1;
	      }, this.isLocked = function () {
	        return window.__REDUX_DEVTOOLS_EXTENSION_LOCKED__ ? "BLOCKED" !== e.lastAction ? (e.lastAction = "BLOCKED", !1) : !0 : !1;
	      }, this.update = t;
	    };e["default"] = r, t.exports = e["default"];
	  }, 1082: function _(t, e) {
	    "use strict";
	    function n(t) {
	      var e = 1;return function (n) {
	        if (n) return e = 1, 0;var r = Math.pow(2, e - 1);return 5 > e && (e += 1), r * t;
	      };
	    }function r(t) {
	      a && !a() || window.postMessage({ source: "@devtools-page", type: "ERROR", message: t }, "*");
	    }function o(t) {
	      window.devToolsOptions && !window.devToolsOptions.shouldCatchErrors || t.timeStamp - u < c() || (u = t.timeStamp, c(!0), r(t.message));
	    }function i(t) {
	      a = t, window.addEventListener("error", o, !1);
	    }Object.defineProperty(e, "__esModule", { value: !0 }), e["default"] = i;var a = void 0,
	        u = 0,
	        c = n(5e3);t.exports = e["default"];
	  }, 1083: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e) {
	      var n = e.deserializeState,
	          r = e.deserializeAction;if (t) {
	        var o = void 0,
	            a = (0, c.parse)(t);return a.payload && (a.preloadedState && (o = (0, c.parse)(a.preloadedState)), a = (0, c.parse)(a.payload)), n && (a.computedStates = a.computedStates.map(function (t) {
	          return i({}, t, { state: n(t.state) });
	        }), "undefined" != typeof a.committedState && (a.committedState = n(a.committedState))), r && (a.actionsById = (0, u["default"])(a.actionsById, function (t) {
	          return i({}, t, { action: r(t.action) });
	        })), { nextLiftedState: a, preloadedState: o };
	      }
	    }Object.defineProperty(e, "__esModule", { value: !0 });var i = Object.assign || function (t) {
	      for (var e = 1; e < arguments.length; e++) {
	        var n = arguments[e];for (var r in n) {
	          Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
	        }
	      }return t;
	    };e["default"] = o;var a = n(138),
	        u = r(a),
	        c = n(47);t.exports = e["default"];
	  }, 1084: function _(t, e) {
	    "use strict";
	    function n(t) {
	      console.warn("Redux DevTools Extension's window was opened as `window.devToolsExtension.open()` was called. Remove this command from your code for better experience."), window.postMessage({ source: "@devtools-page", type: "OPEN", position: t || "right" }, "*");
	    }Object.defineProperty(e, "__esModule", { value: !0 }), e["default"] = n, t.exports = e["default"];
	  }, 1085: function _(t, e, n) {
	    "use strict";
	    function r(t) {
	      return t && t.__esModule ? t : { "default": t };
	    }function o(t, e) {
	      var n = {};for (var r in t) {
	        e.indexOf(r) >= 0 || Object.prototype.hasOwnProperty.call(t, r) && (n[r] = t[r]);
	      }return n;
	    }function i(t, e) {
	      return "undefined" == typeof e ? _["default"].stringify(t) : e === !0 ? _["default"].stringify(t, function (t, e) {
	        return "object" === ("undefined" == typeof e ? "undefined" : h(e)) && e.toJS ? e.toJS() : "symbol" === ("undefined" == typeof e ? "undefined" : h(e)) ? String(e) : e;
	      }, null, !0) : _["default"].stringify(t, e.replacer, null, e.options);
	    }function a(t) {
	      return t || Math.random().toString(36).substr(2);
	    }function u(t) {
	      window.postMessage(t, "*");
	    }function c(t, e, n, r) {
	      if ("ACTION" === t.type) t.action = i(t.action, n), t.payload = i(t.payload, e);else if ("STATE" === t.type) if (e === !1) t.payload = _["default"].stringify(t.payload, null, null, !1);else {
	        var a = t.payload,
	            c = a.actionsById,
	            s = a.computedStates,
	            f = a.committedState,
	            d = o(a, ["actionsById", "computedStates", "committedState"]);t.payload = d, t.actionsById = i(c, n), t.computedStates = i(s, e), t.committedState = i(f, e);
	      }t.serialize = r, u(t);
	    }function s(t, e, n, r) {
	      var o = { payload: e, source: m, name: r || "", instanceId: n };t ? (o.type = "ACTION", o.action = t.action ? t : { action: "object" === ("undefined" == typeof t ? "undefined" : h(t)) ? t : { type: t } }) : o.type = "STATE", c(o);
	    }function f(t) {
	      if ("test" === { NODE_ENV: "production" }.BABEL_ENV || t && t.source === window) {
	        var e = t.data;e && "@devtools-extension" === e.source && Object.keys(b).forEach(function (t) {
	          e.id && t !== e.id || ("function" == typeof b[t] ? b[t](e) : b[t].forEach(function (t) {
	            t(e);
	          }));
	        });
	      }
	    }function d(t, e) {
	      b[e] = t, window.addEventListener("message", f, !1);
	    }function l() {
	      window.removeEventListener("message", f), c({ type: "DISCONNECT", source: m });
	    }function p() {
	      var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
	          e = a(t.instanceId),
	          n = t.name || document.title || e,
	          r = function r(t) {
	        return t ? (b[e] || (b[e] = []), b[e].push(t), function () {
	          var n = b.indexOf(t);b[e].splice(n, 1);
	        }) : void 0;
	      },
	          o = function o(t) {
	        delete b[t];
	      },
	          i = function i(t, r) {
	        s(t, r, e, n);
	      },
	          d = function d(t, r) {
	        c({ type: "INIT", payload: t, action: r || {}, instanceId: e, name: n, source: m });
	      },
	          l = function l(t) {
	        u({ type: "ERROR", payload: t, id: e, source: m });
	      };return window.addEventListener("message", f, !1), c({ type: "INIT_INSTANCE", instanceId: e, source: m }), { init: d, subscribe: r, unsubscribe: o, send: i, error: l };
	    }function v(t) {
	      return function (e, n) {
	        console.warn("`devToolsExtension.updateStore` is deprecated, remove it and just use `__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` instead of the extension's store enhancer: https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup");var r = t[n || Object.keys(t)[0]];r.liftedStore = e.liftedStore, r.getState = e.getState, r.dispatch = e.dispatch;
	      };
	    }function y() {
	      try {
	        return window.self !== window.top;
	      } catch (t) {
	        return !0;
	      }
	    }Object.defineProperty(e, "__esModule", { value: !0 }), e.source = void 0;var h = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
	      return typeof t === "undefined" ? "undefined" : _typeof(t);
	    } : function (t) {
	      return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
	    };e.generateId = a, e.toContentScript = c, e.sendMessage = s, e.setListener = d, e.disconnect = l, e.connect = p, e.updateStore = v, e.isInIframe = y;var g = n(47),
	        _ = r(g),
	        b = {},
	        m = e.source = "@devtools-page";
	  } });

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(1);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	__webpack_require__(4);
	
	__webpack_require__(49);
	
	__webpack_require__(53);
	
	__webpack_require__(56);
	
	__webpack_require__(61);
	
	__webpack_require__(57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var appEl = document.createElement('div');
	appEl.id = 'audius';
	appEl.innerHTML = '<extension-app></extension-app>';
	var bodyEl = document.querySelector('body');
	bodyEl.insertBefore(appEl, bodyEl.firstChild);
	
	if (!document.querySelectorAll('#audius-website').length) {
		var app = new _vue2.default({
			el: '#audius'
		});
	} else {
		console.log('is Audius website!');
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(1);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _store = __webpack_require__(5);
	
	var _store2 = _interopRequireDefault(_store);
	
	var _actions = __webpack_require__(40);
	
	var _actions2 = _interopRequireDefault(_actions);
	
	var _utils = __webpack_require__(36);
	
	__webpack_require__(45);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.component('extension-app', {
		data: function data() {
			return {
				extension: _store2.default.getState().extension,
				store: _store2.default,
				Actions: _actions2.default
			};
		},
		created: function created() {
			var _this = this;
	
			this.unsubscribe = _store2.default.subscribe(function () {
				_this.extension = _store2.default.getState().extension;
			});
		},
		mounted: function mounted() {
			(0, _utils.findVideos)();
		},
		beforeDestroy: function beforeDestroy() {
			this.unsubscribe();
		},
	
		methods: {
			playPauseVideos: function playPauseVideos() {
				if (this.extension.isPlaying) _store2.default.dispatch(_actions2.default.pause());else if (this.extension.playList.length) _store2.default.dispatch(_actions2.default.play());
			},
			previousVideo: function previousVideo() {
				_store2.default.dispatch(_actions2.default.previousVideo());
			},
			nextVideo: function nextVideo() {
				_store2.default.dispatch(_actions2.default.nextVideo());
			},
			togglePlayList: function togglePlayList() {
				_store2.default.dispatch(_actions2.default.togglePlayList());
			},
			toggleShuffle: function toggleShuffle() {
				_store2.default.dispatch(_actions2.default.toggleShuffle());
			}
		},
		template: '\n<div class="audius">\n\t<div class="audius__controls">\n\t\t<div class="audius__play-list-controls" :disabled="!extension.playList.length">\n\t\t\t<span class="wmp-icon-previous" v-on:click="previousVideo"></span>\n\t\t\t<div class="audius__play-pause" v-on:click="playPauseVideos">\n\t\t\t\t<span class="wmp-icon-pause" v-if="extension.isPlaying"></span>\n\t\t\t\t<span class="wmp-icon-play" v-else></span>\n\t\t\t</div>\n\t\t\t<span class="wmp-icon-next" v-on:click="nextVideo"></span>\n\t\t</div>\n\t\t<div class="spacer"></div>\n\t\t<div v-on:click="store.dispatch(Actions.toggleMute())">\n\t\t\t<span class="wmp-icon-volume_up" v-if="!extension.mute"></span>\n\t\t\t<span class="wmp-icon-volume_off" v-else></span>\n\t\t</div>\n\t\t<span\n\t\t\tclass="audius__shuffle wmp-icon-shuffle"\n\t\t\tv-on:click="toggleShuffle"\n\t\t\tv-bind:class="{ active: extension.shuffle }"></span>\n\t\t<div class="spacer"></div>\n\t\t<span\n\t\t\tclass="audius__show-play-list wmp-icon-format_list_bulleted"\n\t\t\tv-on:click="togglePlayList"\n\t\t\tv-bind:class="{ active: extension.showPlayList }"></span>\n\t\t<span class="wmp-icon-close"></span>\n\t</div>\n\t<div v-if="!extension.playList.length && extension.showPlayList">\n\t\t... no YouTube videos found\n\t</div>\n\t<div class="audius__media-list-wrapper" v-if="extension.showPlayList">\n\t\t<ul class="media-list">\n\t\t\t<video-item\n\t\t\t\tv-for="id in extension.playList"\n\t\t\t\t:video="extension.entities[id]"\n\t\t\t\t:isExtension="true"></video-item>\n\t\t</ul>\n\t</div>\n</div>\n\t'
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _redux = __webpack_require__(7);
	
	var _reducers = __webpack_require__(28);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var store = void 0;
	if (process && process.env.NODE_ENV === 'production') {
		store = (0, _redux.createStore)(_reducers2.default);
	} else {
		store = (0, _redux.createStore)(_reducers2.default, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
	}
	exports.default = store;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;
	
	var _createStore = __webpack_require__(8);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _combineReducers = __webpack_require__(23);
	
	var _combineReducers2 = _interopRequireDefault(_combineReducers);
	
	var _bindActionCreators = __webpack_require__(25);
	
	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);
	
	var _applyMiddleware = __webpack_require__(26);
	
	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
	
	var _compose = __webpack_require__(27);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	var _warning = __webpack_require__(24);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}
	
	if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}
	
	exports.createStore = _createStore2['default'];
	exports.combineReducers = _combineReducers2['default'];
	exports.bindActionCreators = _bindActionCreators2['default'];
	exports.applyMiddleware = _applyMiddleware2['default'];
	exports.compose = _compose2['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports['default'] = createStore;
	
	var _isPlainObject = __webpack_require__(9);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _symbolObservable = __webpack_require__(19);
	
	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};
	
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [preloadedState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;
	
	  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = preloadedState;
	    preloadedState = undefined;
	  }
	
	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }
	
	    return enhancer(createStore)(reducer, preloadedState);
	  }
	
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }
	
	  var currentReducer = reducer;
	  var currentState = preloadedState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;
	
	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }
	
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }
	
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }
	
	    var isSubscribed = true;
	
	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);
	
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }
	
	      isSubscribed = false;
	
	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }
	
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!(0, _isPlainObject2['default'])(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }
	
	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }
	
	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }
	
	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }
	
	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }
	
	    return action;
	  }
	
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }
	
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }
	
	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
	   */
	  function observable() {
	    var _ref;
	
	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }
	
	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }
	
	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[_symbolObservable2['default']] = function () {
	      return this;
	    }, _ref;
	  }
	
	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });
	
	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    getPrototype = __webpack_require__(16),
	    isObjectLike = __webpack_require__(18);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}
	
	module.exports = isPlainObject;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(11),
	    getRawTag = __webpack_require__(14),
	    objectToString = __webpack_require__(15);
	
	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  value = Object(value);
	  return (symToStringTag && symToStringTag in value)
	    ? getRawTag(value)
	    : objectToString(value);
	}
	
	module.exports = baseGetTag;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(12);
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	module.exports = Symbol;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(13);
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	module.exports = root;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	module.exports = freeGlobal;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(11);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];
	
	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}
	
	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}
	
	module.exports = getRawTag;


/***/ },
/* 15 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}
	
	module.exports = objectToString;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(17);
	
	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);
	
	module.exports = getPrototype;


/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(20);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ponyfill = __webpack_require__(22);
	
	var _ponyfill2 = _interopRequireDefault(_ponyfill);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var root; /* global window */
	
	
	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (true) {
	  root = module;
	} else {
	  root = Function('return this')();
	}
	
	var result = (0, _ponyfill2['default'])(root);
	exports['default'] = result;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(21)(module)))

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;
	
		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}
	
		return result;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports['default'] = combineReducers;
	
	var _createStore = __webpack_require__(8);
	
	var _isPlainObject = __webpack_require__(9);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _warning = __webpack_require__(24);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
	
	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}
	
	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';
	
	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }
	
	  if (!(0, _isPlainObject2['default'])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }
	
	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
	  });
	
	  unexpectedKeys.forEach(function (key) {
	    unexpectedKeyCache[key] = true;
	  });
	
	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}
	
	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });
	
	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }
	
	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}
	
	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];
	
	    if (process.env.NODE_ENV !== 'production') {
	      if (typeof reducers[key] === 'undefined') {
	        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
	      }
	    }
	
	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);
	
	  if (process.env.NODE_ENV !== 'production') {
	    var unexpectedKeyCache = {};
	  }
	
	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }
	
	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];
	
	    if (sanityError) {
	      throw sanityError;
	    }
	
	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
	      if (warningMessage) {
	        (0, _warning2['default'])(warningMessage);
	      }
	    }
	
	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}
	
	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }
	
	  if (typeof actionCreators !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }
	
	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = applyMiddleware;
	
	var _compose = __webpack_require__(27);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (createStore) {
	    return function (reducer, preloadedState, enhancer) {
	      var store = createStore(reducer, preloadedState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];
	
	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);
	
	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = compose;
	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */
	
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }
	
	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  }
	
	  if (funcs.length === 1) {
	    return funcs[0];
	  }
	
	  var last = funcs[funcs.length - 1];
	  var rest = funcs.slice(0, -1);
	  return function () {
	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _redux = __webpack_require__(7);
	
	var _mediaPlayer = __webpack_require__(29);
	
	var _mediaPlayer2 = _interopRequireDefault(_mediaPlayer);
	
	var _config = __webpack_require__(32);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _youtube = __webpack_require__(33);
	
	var _youtube2 = _interopRequireDefault(_youtube);
	
	var _website = __webpack_require__(34);
	
	var _website2 = _interopRequireDefault(_website);
	
	var _extension = __webpack_require__(35);
	
	var _extension2 = _interopRequireDefault(_extension);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _redux.combineReducers)({
	  mediaPlayer: _mediaPlayer2.default,
	  config: _config2.default,
	  youtube: _youtube2.default,
	  website: _website2.default,
	  extension: _extension2.default
	});

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _timeConverter = __webpack_require__(30);
	
	var _video = __webpack_require__(31);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var initialState = {
		db: undefined,
		errorMessages: '',
		entities: {},
		mediaId: '',
		playList: [],
		queue: [],
		isPlaying: false,
		shuffle: false,
		repeat1: false,
		repeatAll: false,
		showSearch: false,
		filterQuery: '',
		currentTime: 0,
		skipToTime: 0,
		mute: false
	};
	
	function next(state) {
		var idx = state.playList.indexOf(state.mediaId);
		var mediaId = void 0;
		if (state.queue.length) {
			// Play next song from queue.
			var queue = [].concat(_toConsumableArray(state.queue));
			mediaId = queue.shift();
			return Object.assign({}, state, {
				mediaId: mediaId,
				queue: [].concat(_toConsumableArray(queue)),
				isPlaying: true
			});
		} else if (state.shuffle) {
			// Play a random song.
			return Object.assign({}, state, {
				mediaId: state.playList[Math.floor(Math.random() * state.playList.length)],
				isPlaying: true
			});
		} else if (idx === state.playList.length - 1) {
			// If last song on play list, stop playing.
			return Object.assign({}, state, {
				isPlaying: false
			});
		} else if (idx < state.playList.length - 1) {
			// Play the next song.
			mediaId = state.playList[idx + 1];
			return Object.assign({}, state, {
				mediaId: mediaId,
				isPlaying: true
			});
		}
		return state;
	}
	
	var mediaPlayer = function mediaPlayer() {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];
	
		var idx = void 0;
		var mediaId = void 0;
		var entities = void 0;
		var queue = void 0;
		var newEntity;
	
		var _ret = function () {
			switch (action.type) {
				case 'ERROR':
					return {
						v: Object.assign({}, state, {
							errorMessages: [].concat(_toConsumableArray(state.errorMessages), [action.message])
						})
					};
				case 'DB_INIT_SUCCESS':
					return {
						v: Object.assign({}, state, { db: action.db })
					};
				case 'DB_SET_SUCCESS':
					entities = Object.assign({}, state.entities);
					entities[action.data.id].saved = true;
					return {
						v: Object.assign({}, state, {
							entities: entities
						})
					};
				case 'DB_GETALL_SUCCESS':
					return {
						v: Object.assign({}, state, {
							entities: Object.assign({}, state.entities, action.entities)
						})
					};
				case 'DB_GET_PLAYLIST_SUCCESS':
					return {
						v: Object.assign({}, state, {
							playList: action.playList
						})
					};
				case 'VIDEO_ERROR':
					state.entities[action.id] = Object.assign({}, state.entities[action.id], {
						errorMessage: action.message,
						hasError: true
					});
					return {
						v: Object.assign({}, next(state), {
							entities: state.entities
						})
					};
				case 'ADD_VIDEOS':
					entities = Object.assign({}, state.entities);
					action.videos.forEach(function (v) {
						entities[v.id] = Object.assign({}, _video.videoBaseObject, {
							title: v.snippet.title,
							duration: (0, _timeConverter.duration)(v.contentDetails.duration),
							id: v.id
						});
					});
					return {
						v: Object.assign({}, state, {
							playList: [].concat(_toConsumableArray(state.playList), _toConsumableArray(action.videos.map(function (v) {
								return v.id;
							}).filter(function (id) {
								return !state.playList.includes(id);
							}))),
							entities: entities
						})
					};
				case 'DEDUPE_PLAYLIST':
					var seen = {};
					var filteredPlaylist = [];
					state.playList.forEach(function (id) {
						if (!seen[id] && state.entities[id]) {
							seen[id] = true;
							filteredPlaylist.push(id);
						} else {
							console.log('Filterd dupe or missing: ', id);
						}
					});
					return {
						v: Object.assign({}, state, {
							playList: [].concat(filteredPlaylist)
						})
					};
				case 'IMPORT_PLAYLIST':
					return {
						v: Object.assign({}, state, {
							playList: [].concat(_toConsumableArray(state.playList), _toConsumableArray(action.data.playList.filter(function (id) {
								return !state.playList.includes(id);
							}))),
							entities: Object.assign({}, state.entities, action.data.entities)
						})
					};
				case 'REMOVE_VIDEO':
					entities = Object.assign({}, state.entities);
					entities[action.id].deleted = true;
					return {
						v: Object.assign({}, state, {
							playList: state.playList.filter(function (id) {
								return id !== action.id;
							}),
							entities: entities
						})
					};
				case 'ADD_SEARCH_RESULT':
					entities = Object.assign({}, state.entities);
					entities[action.video.id] = action.video;
					if (state.playList.includes(action.video.id)) return {
							v: state
						};
					return {
						v: Object.assign({}, state, {
							playList: [].concat(_toConsumableArray(state.playList), [action.video.id]),
							entities: entities
						})
					};
				case 'PAUSE':
					return {
						v: Object.assign({}, state, {
							isPlaying: false,
							entities: state.entities
						})
					};
				case 'PLAY':
					if (action.mediaId) mediaId = action.mediaId;else mediaId = !state.mediaId ? state.playList[0] : state.mediaId;
					var currentMedia = {};
					if (action.currentMedia) {
						newEntity = {};
	
						newEntity[mediaId] = action.currentMedia;
						entities = Object.assign({}, state.entities, newEntity);
						currentMedia = action.currentMedia;
					} else {
						currentMedia = {};
						entities = state.entities;
					}
					return {
						v: Object.assign({}, state, {
							isPlaying: !!(currentMedia || state.playList.length),
							mediaId: mediaId,
							currentMedia: currentMedia,
							entities: entities
						})
					};
				case 'TOGGLE_SHUFFLE':
					return {
						v: Object.assign({}, state, {
							shuffle: !state.shuffle
						})
					};
				case 'TOGGLE_MUTE':
					return {
						v: Object.assign({}, state, {
							mute: !state.mute
						})
					};
				case 'NEXT_VIDEO':
					return {
						v: next(state)
					};
				case 'PREV_VIDEO':
					idx = state.playList.indexOf(state.mediaId);
					if (idx > 0) {
						mediaId = state.playList[idx - 1];
						return {
							v: Object.assign({}, state, {
								mediaId: state.playList[idx - 1],
								isPlaying: true
							})
						};
					}
					return {
						v: state
					};
				case 'QUEUE_MEDIA':
					return {
						v: Object.assign({}, state, {
							queue: [].concat(_toConsumableArray(state.queue), [action.id])
						})
					};
				case 'QUEUE_PLAY_INDEX':
					queue = [].concat(_toConsumableArray(state.queue));
					mediaId = queue.splice(action.idx, 1);
					return {
						v: Object.assign({}, state, {
							queue: [].concat(_toConsumableArray(queue)),
							mediaId: mediaId[0],
							isPlaying: true
						})
					};
				case 'QUEUE_REMOVE_INDEX':
					queue = [].concat(_toConsumableArray(state.queue));
					queue.splice(action.idx, 1);
					return {
						v: Object.assign({}, state, {
							queue: [].concat(_toConsumableArray(queue))
						})
					};
				case 'FILTER_PLAYLIST':
					return {
						v: Object.assign({}, state, {
							filterQuery: action.query
						})
					};
				case 'SET_CURRENT_TIME':
					return {
						v: Object.assign({}, state, {
							currentTime: action.time
						})
					};
				case 'SKIP_TO_TIME':
					return {
						v: Object.assign({}, state, {
							skipToTime: action.s
						})
					};
				case 'MOVE_PLAYLIST_MEDIA':
					var playList = state.playList.filter(function (id) {
						return id !== action.mediaId;
					});
					playList.splice(playList.indexOf(action.beforeThisMediaId), 0, action.mediaId);
					return {
						v: Object.assign({}, state, {
							playList: playList
						})
					};
				default:
					return {
						v: state
					};
			}
		}();
	
		if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	};
	
	exports.default = mediaPlayer;

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.s2time = s2time;
	exports.time2s = time2s;
	exports.duration = duration;
	/**
	 * ##zeroPad
	 * Zero pad a number and return the zero padded string.
	 * @param {Integer} num number that should be padded
	 * @param {Integer} size number of digits
	 * @return {String}
	 */
	function zeroPad(num, size) {
		var s = "000000000" + num;
		return s.substr(s.length - size);
	}
	
	/**
	 * Convert milliseconds to hours minutes seconds and milliseconds.
	 * @param  {float} sms seconds float
	 * @return {Object} `{h, m, s, ms}`
	 */
	function s2time(sms) {
		var h = void 0;
		var m = void 0;
		var s = void 0;
		// s = Math.floor(ms / 1000);
		s = Math.floor(sms);
		var ms = sms % 1;
		m = Math.floor(s / 60);
		s %= 60;
		h = Math.floor(m / 60);
		m %= 60;
		var d = Math.floor(h / 24);
		h %= 24;
		return { d: d, h: h, m: m, s: zeroPad(s, 2), ms: ms };
	}
	/**
	 * Convert hours, minutes, seconds to seconds.
	 * @return {integer} seconds
	 */
	function time2s(duration) {
		duration.s = parseInt(duration.s);
		var t = Object.assign({ h: 0, m: 0, s: 0 }, duration);
		return (t.h * 60 + t.m) * 60 + t.s;
	}
	
	function duration(durationString) {
		var durationMatch = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
		return {
			h: parseInt(durationMatch[1], 10) || 0,
			m: parseInt(durationMatch[2], 10) || 0,
			s: zeroPad(parseInt(durationMatch[3], 10) || 0, 2)
		};
	}

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var videoBaseObject = exports.videoBaseObject = {
		title: '',
		duration: {},
		durationS: 0,
		isPlaying: false,
		id: '',
		deleted: false,
		hasError: false
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var initialState = {
		youtubeApiKey: 'AIzaSyCHVgsa5owudn4G79IX9pcRcrVNOmgKHuM'
	};
	var config = function config() {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];
	
		switch (action.type) {
			case 'SET_YOUTUBE_API_KEY':
				return {
					youtubeApiKey: action.youtubeApiKey
				};
			default:
				return state;
		}
	};
	
	exports.default = config;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _timeConverter = __webpack_require__(30);
	
	var _video = __webpack_require__(31);
	
	var initialState = {
		query: '',
		isSearching: false,
		results: []
	};
	var config = function config() {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];
	
		switch (action.type) {
			case 'YOUTUBE_SEARCH_REQUEST':
				return Object.assign({}, state, {
					query: action.query,
					isSearching: true
				});
			case 'YOUTUBE_SEARCH_ERROR':
				return Object.assign({}, state, {
					isSearching: false
				});
			case 'YOUTUBE_SEARCH_SUCCESS':
				return Object.assign({}, state, {
					isSearching: false,
					results: action.results.map(function (v) {
						return Object.assign({}, _video.videoBaseObject, {
							title: v.snippet.title,
							duration: (0, _timeConverter.duration)(v.contentDetails.duration),
							isPlaying: false,
							id: v.id.videoId,
							deleted: false
						});
					})
				});
			default:
				return state;
		}
	};
	
	exports.default = config;

/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var initialState = {
		showSearch: false,
		showJump: false,
		mainRightTab: 'about'
	};
	
	var website = function website() {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];
	
		switch (action.type) {
			case 'TOGGLE_SEARCH':
				return Object.assign({}, state, {
					showSearch: action.state !== undefined ? action.state : !state.showSearch
				});
			case 'TOGGLE_JUMP':
				return Object.assign({}, state, {
					showJump: action.state !== undefined ? action.state : !state.showJump
				});
			case 'SET_MAINRIGHT_TAB':
				return Object.assign({}, state, {
					mainRightTab: action.id === state.mainRightTab ? '' : action.id
				});
			case 'YOUTUBE_SEARCH_SUCCESS':
				return Object.assign({}, state, {
					mainRightTab: 'search'
				});
			case 'QUEUE_MEDIA':
				return Object.assign({}, state, {
					mainRightTab: 'queue'
				});
			default:
				return state;
		}
	};
	
	exports.default = website;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = extension;
	
	var _timeConverter = __webpack_require__(30);
	
	var _video = __webpack_require__(31);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var initialState = {
		errorMessages: '',
		entities: {},
		mediaId: '',
		playList: [],
		isPlaying: false,
		showPlayList: true,
		shuffle: false,
		mute: false,
		currentMedia: {}
	};
	
	function extension() {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];
	
		var idx = void 0;
		var mediaId = void 0;
		var entities = void 0;
		var queue = void 0;
		switch (action.type) {
			case 'ERROR':
				return Object.assign({}, state, {
					errorMessages: [].concat(_toConsumableArray(state.errorMessages), [action.message])
				});
			case 'EXTENSION_ADD_VIDEOS':
				entities = Object.assign({}, state.entities);
				action.videos.forEach(function (v) {
					entities[v.id] = Object.assign({}, _video.videoBaseObject, {
						title: v.snippet.title,
						duration: (0, _timeConverter.duration)(v.contentDetails.duration),
						durationS: (0, _timeConverter.time2s)((0, _timeConverter.duration)(v.contentDetails.duration)),
						id: v.id
					});
				});
				return Object.assign({}, state, {
					playList: [].concat(_toConsumableArray(state.playList), _toConsumableArray(action.videos.map(function (v) {
						return v.id;
					}).filter(function (id) {
						return !state.playList.includes(id);
					}))),
					entities: entities
				});
			case 'TOGGLE_PLAYLIST':
				return Object.assign({}, state, {
					showPlayList: !state.showPlayList
				});
			case 'TOGGLE_MUTE':
				return Object.assign({}, state, {
					mute: !state.mute
				});
			case 'TOGGLE_SHUFFLE':
				return Object.assign({}, state, {
					shuffle: !state.shuffle
				});
			case 'PLAY':
				if (state.playList.length) {
					if (action.mediaId) mediaId = action.mediaId;else mediaId = !state.mediaId ? state.playList[0] : state.mediaId;
					return Object.assign({}, state, {
						isPlaying: true,
						mediaId: mediaId,
						currentMedia: state.entities[mediaId]
					});
				}
				return state;
			default:
				return state;
		}
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.findVideos = exports.debounce = exports.ajax = undefined;
	
	var _ajax = __webpack_require__(37);
	
	var _debounce = __webpack_require__(38);
	
	var _findVideos = __webpack_require__(39);
	
	var _findVideos2 = _interopRequireDefault(_findVideos);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.ajax = _ajax.ajax;
	exports.debounce = _debounce.debounce;
	exports.findVideos = _findVideos2.default;

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = ajax;
	function ajax(url, callback) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) callback(JSON.parse(xmlhttp.responseText));else console.warn('error loading ' + url);
			}
		};
		xmlhttp.open('GET', url, true);
		xmlhttp.send();
	}

/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.debounceImmediate = debounceImmediate;
	exports.debounce = debounce;
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
	function debounceImmediate(func, wait) {
	  // we need to save these in the closure
	  var timeout,
	      args,
	      context,
	      timestamp,
	      call_count = 0;
	  return function () {
	    // save details of latest call
	    context = this;
	    args = [].slice.call(arguments, 0);
	    timestamp = new Date();
	    // immediately fire on the first call
	    if (call_count == 0) {
	      func.apply(context, args);
	    }
	    ++call_count;
	    // this is where the magic happens
	    var later = function later() {
	      // how long ago was the last call
	      var last = new Date() - timestamp;
	      // if the latest call was less that the wait period ago
	      // then we reset the timeout to wait for the difference
	      if (last < wait) {
	        timeout = setTimeout(later, wait - last);
	        // or if not we can null out the timer and run the latest
	      } else {
	        timeout = null;
	        // only fire if this was not the first call (index 0), first call aready fired
	        if (call_count > 1) {
	          func.apply(context, args);
	        }
	        call_count = 0; // time is over reset the counter
	      }
	    };
	    // we only need to set the timer now if one isn't already running
	    if (!timeout) {
	      timeout = setTimeout(later, wait);
	    }
	  };
	}
	
	function debounce(func, wait) {
	  // we need to save these in the closure
	  var timeout, args, context, timestamp;
	
	  return function () {
	
	    // save details of latest call
	    context = this;
	    args = [].slice.call(arguments, 0);
	    timestamp = new Date();
	
	    // this is where the magic happens
	    var later = function later() {
	
	      // how long ago was the last call
	      var last = new Date() - timestamp;
	
	      // if the latest call was less that the wait period ago
	      // then we reset the timeout to wait for the difference
	      if (last < wait) {
	        timeout = setTimeout(later, wait - last);
	
	        // or if not we can null out the timer and run the latest
	      } else {
	        timeout = null;
	        func.apply(context, args);
	      }
	    };
	
	    // we only need to set the timer now if one isn't already running
	    if (!timeout) {
	      timeout = setTimeout(later, wait);
	    }
	  };
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function () {
		var youtubeUrls = Array.from(document.querySelectorAll('a')).map(function (el) {
			return el.href.match(youtubeRegEx) ? el.href : null;
		}).filter(function (link) {
			return link;
		});
		var ids = [].concat(_toConsumableArray(youtubeUrls.map(function (link) {
			var match = link.match(youtubeExtract1);
			return match ? match[1] : undefined;
		})), _toConsumableArray(youtubeUrls.map(function (link) {
			var match = link.match(youtubeExtract2);
			return match ? match[1] : undefined;
		})));
		var entities = _store2.default.getState().mediaPlayer.entities;
		ids = ids.filter(function (id) {
			return id;
		}) // filter empty
		.filter(function (item, pos, self) {
			return self.indexOf(item) === pos;
		}) // filter dublicates
		.filter(function (id) {
			return !entities[id];
		}); // filter one already in store
		var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=' + ids.join(',') + '&key=' + YOUTUBE_API_KEY;
		console.log('found videeoooo!', ids.length);
		(0, _ajax2.default)(url, function (data) {
			_store2.default.dispatch(_actions2.default.extensionAddVideos(data.items));
		});
	};
	
	var _store = __webpack_require__(5);
	
	var _store2 = _interopRequireDefault(_store);
	
	var _actions = __webpack_require__(40);
	
	var _actions2 = _interopRequireDefault(_actions);
	
	var _ajax = __webpack_require__(37);
	
	var _ajax2 = _interopRequireDefault(_ajax);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var YOUTUBE_API_KEY = _store2.default.getState().config.youtubeApiKey;
	
	var youtubeRegEx = /(youtube.com)|(youtu.be)/;
	var youtubeExtract1 = /youtu.be\/([\w-]+)/;
	var youtubeExtract2 = /youtube.com\/watch\?v=([\w-]+)/;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _youtube = __webpack_require__(41);
	
	var youtube = _interopRequireWildcard(_youtube);
	
	var _mediaPlayer = __webpack_require__(42);
	
	var mediaPlayer = _interopRequireWildcard(_mediaPlayer);
	
	var _website = __webpack_require__(43);
	
	var website = _interopRequireWildcard(_website);
	
	var _extension = __webpack_require__(44);
	
	var extension = _interopRequireWildcard(_extension);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var actions = Object.assign({}, youtube, mediaPlayer, website, extension);
	
	exports.default = actions;

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var searchYoutube = exports.searchYoutube = function searchYoutube() {
		var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		return {
			type: 'YOUTUBE_SEARCH_REQUEST',
			query: query
		};
	};
	
	var searchYoutubeError = exports.searchYoutubeError = function searchYoutubeError() {
		var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		return {
			type: 'YOUTUBE_SEARCH_ERROR',
			reason: reason
		};
	};
	
	var searchYoutubeSuccess = exports.searchYoutubeSuccess = function searchYoutubeSuccess() {
		var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		return {
			type: 'YOUTUBE_SEARCH_SUCCESS',
			results: results
		};
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var initDbSuccess = exports.initDbSuccess = function initDbSuccess(db) {
		return {
			type: 'DB_INIT_SUCCESS',
			db: db
		};
	};
	var videoError = exports.videoError = function videoError(id, message) {
		return {
			type: 'VIDEO_ERROR',
			id: id,
			message: message
		};
	};
	
	var error = exports.error = function error(message) {
		return {
			type: 'ERROR',
			message: message
		};
	};
	var setDbSuccess = exports.setDbSuccess = function setDbSuccess(data) {
		return {
			type: 'DB_SET_SUCCESS',
			data: data
		};
	};
	var getDbSuccess = exports.getDbSuccess = function getDbSuccess(data) {
		return {
			type: 'DB_GET_SUCCESS',
			data: data
	
		};
	};
	var getAllDbSuccess = exports.getAllDbSuccess = function getAllDbSuccess(entities) {
		return {
			type: 'DB_GETALL_SUCCESS',
			entities: entities
		};
	};
	
	var getDbPlayListSuccess = exports.getDbPlayListSuccess = function getDbPlayListSuccess(playList) {
		return {
			type: 'DB_GET_PLAYLIST_SUCCESS',
			playList: playList
		};
	};
	
	var setCurrentTime = exports.setCurrentTime = function setCurrentTime(time) {
		return {
			type: 'SET_CURRENT_TIME',
			time: time
		};
	};
	
	var skipToTime = exports.skipToTime = function skipToTime(s) {
		return {
			type: 'SKIP_TO_TIME',
			s: s
		};
	};
	
	var addVideos = exports.addVideos = function addVideos() {
		var videos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		return {
			type: 'ADD_VIDEOS',
			videos: videos
		};
	};
	
	var importPlayList = exports.importPlayList = function importPlayList(data) {
		return {
			type: 'IMPORT_PLAYLIST',
			data: data
		};
	};
	
	var dedupePlayList = exports.dedupePlayList = function dedupePlayList() {
		return {
			type: 'DEDUPE_PLAYLIST'
		};
	};
	
	var removeVideo = exports.removeVideo = function removeVideo(id) {
		return {
			type: 'REMOVE_VIDEO',
			id: id
		};
	};
	
	var addSearchResult = exports.addSearchResult = function addSearchResult() {
		var video = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		return {
			type: 'ADD_SEARCH_RESULT',
			video: video
		};
	};
	
	var menuVideo = exports.menuVideo = function menuVideo(id) {
		return {
			type: 'MENU_VIDEO',
			id: id
		};
	};
	
	var playVideo = exports.playVideo = function playVideo(id) {
		return {
			type: 'PLAY_VIDEO',
			id: id
		};
	};
	
	var play = exports.play = function play(mediaId) {
		return {
			type: 'PLAY',
			mediaId: mediaId
		};
	};
	
	var pause = exports.pause = function pause() {
		return {
			type: 'PAUSE'
		};
	};
	
	var nextVideo = exports.nextVideo = function nextVideo() {
		return {
			type: 'NEXT_VIDEO'
		};
	};
	
	var previousVideo = exports.previousVideo = function previousVideo() {
		return {
			type: 'PREV_VIDEO'
		};
	};
	
	var togglePlayList = exports.togglePlayList = function togglePlayList() {
		return {
			type: 'TOGGLE_PLAYLIST'
		};
	};
	
	var toggleShuffle = exports.toggleShuffle = function toggleShuffle() {
		return {
			type: 'TOGGLE_SHUFFLE'
		};
	};
	
	var toggleRepeat = exports.toggleRepeat = function toggleRepeat() {
		return {
			type: 'TOGGLE_REPEAT'
		};
	};
	
	var changeVolume = exports.changeVolume = function changeVolume(volume) {
		return {
			type: 'CHANGE_VOLUME',
			volume: volume
		};
	};
	
	var toggleMute = exports.toggleMute = function toggleMute() {
		return {
			type: 'TOGGLE_MUTE'
		};
	};
	
	var queueMedia = exports.queueMedia = function queueMedia(id) {
		return {
			type: 'QUEUE_MEDIA',
			id: id
		};
	};
	
	var queuePlayIndex = exports.queuePlayIndex = function queuePlayIndex(idx) {
		return {
			type: 'QUEUE_PLAY_INDEX',
			idx: idx
		};
	};
	
	var queueRemoveIndex = exports.queueRemoveIndex = function queueRemoveIndex(idx) {
		return {
			type: 'QUEUE_REMOVE_INDEX',
			idx: idx
		};
	};
	
	var filterPlayList = exports.filterPlayList = function filterPlayList(query) {
		return {
			type: 'FILTER_PLAYLIST',
			query: query
		};
	};
	
	var movePlayListMedia = exports.movePlayListMedia = function movePlayListMedia(mediaId, beforeThisMediaId) {
		return {
			type: 'MOVE_PLAYLIST_MEDIA',
			mediaId: mediaId,
			beforeThisMediaId: beforeThisMediaId
		};
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var toggleSearch = exports.toggleSearch = function toggleSearch(state) {
		return {
			type: 'TOGGLE_SEARCH',
			state: state
		};
	};
	
	var toggleJump = exports.toggleJump = function toggleJump(state) {
		return {
			type: 'TOGGLE_JUMP',
			state: state
		};
	};
	
	var setMainRightTab = exports.setMainRightTab = function setMainRightTab() {
		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'about';
		return {
			type: 'SET_MAINRIGHT_TAB',
			id: id
		};
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var extensionAddVideos = exports.extensionAddVideos = function extensionAddVideos(videos) {
		return {
			type: 'EXTENSION_ADD_VIDEOS',
			videos: videos
		};
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(46);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(48)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./extension-app.component.sass", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./extension-app.component.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(47)();
	// imports
	
	
	// module
	exports.push([module.id, "ul.media-list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  overflow-x: hidden; }\n  ul.media-list li {\n    height: 55px;\n    padding: 0 7px;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-transition: all 250ms;\n    transition: all 250ms; }\n    ul.media-list li:hover {\n      background: #EFF1F7; }\n      ul.media-list li:hover .media-list__controls {\n        display: -webkit-box;\n        display: -ms-flexbox;\n        display: flex;\n        -webkit-box-align: center;\n            -ms-flex-align: center;\n                align-items: center; }\n    ul.media-list li.active {\n      background: #2DA7EF;\n      color: #fff; }\n      ul.media-list li.active a,\n      ul.media-list li.active span:hover {\n        color: #fff; }\n\n.media-list__thumbnail {\n  cursor: move;\n  width: 49px;\n  height: 49px;\n  background-size: cover;\n  background-position: center;\n  border-radius: 50%;\n  margin-right: 7px; }\n\n.media-list li.error .media-list__body {\n  text-decoration: line-through; }\n\n.media-list__body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  overflow-x: hidden;\n  height: 100%; }\n  .media-list__body .media-list__name {\n    line-height: 1.2em;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n  .media-list__body .media-list__duration {\n    color: #A8ADB7; }\n\n.media-list__controls {\n  display: none; }\n  .media-list__controls span {\n    cursor: pointer;\n    -webkit-transition: all 250ms;\n    transition: all 250ms; }\n    .media-list__controls span:hover {\n      color: #2DA7EF; }\n\n.audius {\n  background: rgba(255, 255, 255, 0.9);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  max-height: 394px;\n  overflow: hidden;\n  position: absolute;\n  top: 0;\n  right: 0; }\n  .audius ::-webkit-scrollbar {\n    width: 5px; }\n    .audius ::-webkit-scrollbar:hover {\n      width: 10px; }\n  .audius ::-webkit-scrollbar-track {\n    background: #EFF1F7; }\n  .audius ::-webkit-scrollbar-thumb {\n    background: #A8ADB7; }\n\n.audius__media-list-wrapper {\n  width: 33em;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  overflow-y: auto; }\n\n.audius__shuffle,\n.audius__repeat,\n.audius__show-play-list {\n  color: #E2E4E9; }\n  .audius__shuffle.active,\n  .audius__repeat.active,\n  .audius__show-play-list.active {\n    color: #2DA7EF; }\n\n.audius__controls {\n  width: 100%;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  min-height: 49px; }\n  .audius__controls span {\n    cursor: pointer; }\n  .audius__controls .spacer {\n    width: 14px; }\n  .audius__controls .audius__play-pause {\n    height: 49px; }\n    .audius__controls .audius__play-pause span:before {\n      font-size: 2.5em; }\n\n.audius__play-list-controls {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row; }\n  .audius__play-list-controls[disabled] span {\n    color: #E2E4E9;\n    pointer-events: none; }\n\n.audius__youtube-player {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n", ""]);
	
	// exports


/***/ },
/* 47 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(1);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _store = __webpack_require__(5);
	
	var _store2 = _interopRequireDefault(_store);
	
	var _actions = __webpack_require__(40);
	
	var _actions2 = _interopRequireDefault(_actions);
	
	var _indexDB = __webpack_require__(50);
	
	var db = _interopRequireWildcard(_indexDB);
	
	__webpack_require__(51);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.component('video-item', {
		props: ['video', 'isPlaying', 'isQueue', 'queueIndex', 'isExtension'],
		data: function data() {
			return {
				copyActive: false
			};
		},
	
		methods: {
			play: function play() {
				if (this.isQueue) _store2.default.dispatch(_actions2.default.queuePlayIndex(this.queueIndex));else _store2.default.dispatch(_actions2.default.play(this.video.id));
			},
			pause: function pause() {
				_store2.default.dispatch(_actions2.default.pause());
			},
			menu: function menu() {
				_store2.default.dispatch(_actions2.default.menuVideo(this.video.id));
			},
			remove: function remove() {
				if (this.isQueue) {
					_store2.default.dispatch(_actions2.default.queueRemoveIndex(this.queueIndex));
				} else {
					_store2.default.dispatch(_actions2.default.removeVideo(this.video.id));
					db.setMediaEntity(this.video);
				}
			},
			addToPlaylist: function addToPlaylist() {
				_store2.default.dispatch(_actions2.default.addSearchResult(this.video));
			},
			copyToClip: function copyToClip() {
				var _this = this;
	
				window.getSelection().removeAllRanges();
				var tmpEl = document.createElement('div');
				tmpEl.innerHTML = this.video.title + ' https://youtu.be/' + this.video.id;
				document.body.appendChild(tmpEl);
	
				var range = document.createRange();
				range.selectNode(tmpEl);
				window.getSelection().addRange(range);
	
				try {
					var successful = document.execCommand('copy');
					this.copyActive = true;
					setTimeout(function () {
						_this.copyActive = false;
					}, 800);
				} catch (err) {
					console.log('execCommand Error', err);
				}
				window.getSelection().removeAllRanges();
				tmpEl.parentNode.removeChild(tmpEl);
			},
			queue: function queue() {
				_store2.default.dispatch(_actions2.default.queueMedia(this.video.id));
			}
		},
		template: '\n\t<li v-bind:class="{ active: isPlaying, error: video.hasError }" v-on:dblclick="play" v-bind:data-id="video.id">\n\t\t<div class="media-list__thumbnail" v-bind:style="{ backgroundImage: \'url(https://i.ytimg.com/vi/\' + video.id + \'/default.jpg)\' }"></div>\n\t\t<div class="media-list__body">\n\t\t\t<div class="media-list__name">{{video.title}}</div>\n\t\t\t<div class="media-list__duration" v-if="video.duration">{{video.duration.m}}:{{video.duration.s}}</div>\n\t\t</div>\n\t\t<div class="media-list__controls">\n\t\t\t<div v-if="!video.hasError">\n\t\t\t\t<span class="wmp-icon-pause" v-if="isPlaying" v-on:click="pause" title="Pause"></span>\n\t\t\t\t<span class="wmp-icon-play" v-else v-on:click="play" title="Play"></span>\n\t\t\t\t<span\n\t\t\t\t\tclass="wmp-icon-queue2 icon--small"\n\t\t\t\t\tv-on:click="queue"\n\t\t\t\t\tv-if="!isQueue"\n\t\t\t\t\ttitle="Add to queue"></span>\n\t\t\t</div>\n\t\t\t<span class="wmp-icon-search" v-else title="Search alternative"></span>\n\t\t\t<span class="copy wmp-icon-copy icon--small" v-on:click="copyToClip" v-bind:class="{ active: copyActive }" title="Copy name and URL"></span>\n\t\t\t<a v-bind:href="\'https://youtu.be/\'+video.id" title="Watch on YouTube" target="_blank">\n\t\t\t\t<span class="wmp-icon-youtube icon--small"></span>\n\t\t\t</a>\n\t\t\t<span\n\t\t\t\tclass="wmp-icon-close"\n\t\t\t\tv-if="!isExtension"\n\t\t\t\tv-on:click="remove"\n\t\t\t\ttitle="Remove"></span>\n\t\t\t<span\n\t\t\t\tclass="wmp-icon-add"\n\t\t\t\tv-if="isExtension"\n\t\t\t\tv-on:click="addToPlaylist"\n\t\t\t\ttitle="Add to playlist"></span>\n\t\t</div>\n\t</li>\n\t'
	});

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getPlayList = getPlayList;
	exports.setPlayList = setPlayList;
	exports.setMediaEntity = setMediaEntity;
	exports.getMediaEntity = getMediaEntity;
	exports.storageStats = storageStats;
	
	var _actions = __webpack_require__(40);
	
	var _actions2 = _interopRequireDefault(_actions);
	
	var _store = __webpack_require__(5);
	
	var _store2 = _interopRequireDefault(_store);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function getAllMediaEntities(db, callback) {
		var request = db.transaction('mediaEntities', 'readonly').objectStore('mediaEntities').openCursor();
		request.onerror = function () {
			return _store2.default.dispatch(_actions2.default.error('DB Error can not get entities from DB'));
		};
		var entities = {};
		request.onsuccess = function (event) {
			var cursor = event.target.result;
			if (cursor) {
				entities[cursor.value.id] = cursor.value;
				cursor.continue();
			} else {
				_store2.default.dispatch(_actions2.default.getAllDbSuccess(entities));
				callback();
			}
		};
	}
	function exists(storeName, id, callback) {
		var request = _store2.default.getState().mediaPlayer.db.transaction(['playLists'], 'readonly').objectStore('playLists').get('default');
		request.onerror = function (event) {
			return _store2.default.dispatch(_actions2.default.error('DB Error ' + event.target.error.name));
		};
		request.onsuccess = callback;
	}
	
	function getPlayList(db) {
		var request = db.transaction(['playLists'], 'readonly').objectStore('playLists').get('default');
		request.onsuccess = function (event) {
			return _store2.default.dispatch(_actions2.default.getDbPlayListSuccess(event.target.result.playList));
		};
		request.onerror = function (event) {
			return _store2.default.dispatch(_actions2.default.error('DB Error ' + event.target.error.name));
		};
	}
	
	if (!('indexedDB' in window)) {
		_store2.default.dispatch(_actions2.default.error('Error: indexDB missing.'));
	} else {
		var openRequest = indexedDB.open('audius_0.02', 1);
		openRequest.onupgradeneeded = function (event) {
			var thisDB = event.target.result;
			if (!thisDB.objectStoreNames.contains('mediaEntities')) {
				thisDB.createObjectStore('mediaEntities', { keyPath: 'id' });
			}
			if (!thisDB.objectStoreNames.contains('playLists')) {
				thisDB.createObjectStore('playLists', { keyPath: 'id' });
			}
		};
		openRequest.onsuccess = function (event) {
			getAllMediaEntities(event.target.result, function () {
				return getPlayList(event.target.result);
			});
			_store2.default.dispatch(_actions2.default.initDbSuccess(event.target.result));
		};
		openRequest.onerror = function () {
			return _store2.default.dispatch(_actions2.default.error('Error: could not connect to indexDB.'));
		};
	}
	
	function setPlayList() {
		exists('playList', 'default', function (event) {
			var dbStore = _store2.default.getState().mediaPlayer.db.transaction(['playLists'], 'readwrite').objectStore('playLists');
			var action = event.target.result ? 'put' : 'add';
			var request = dbStore[action]({ id: 'default', playList: _store2.default.getState().mediaPlayer.playList });
			request.onerror = function (event2) {
				return _store2.default.dispatch(_actions2.default.error('DB Error ' + event2.target.error.name));
			};
		});
	}
	
	function setMediaEntity(data) {
		exists('mediaEntities', 'default', function (event) {
			var dbStore = _store2.default.getState().mediaPlayer.db.transaction(['mediaEntities'], 'readwrite').objectStore('mediaEntities');
			var action = event.target.result ? 'put' : 'add';
			var request = dbStore[action](data);
			request.onsuccess = function () {
				return _store2.default.dispatch(_actions2.default.setDbSuccess(data));
			};
			request.onerror = function (event2) {
				return _store2.default.dispatch(_actions2.default.error('DB Error ' + event2.target.error.name));
			};
			setPlayList();
		});
	}
	
	// -----------------
	function getMediaEntity(id) {
		var request = _store2.default.getState().mediaPlayer.db.transaction(['mediaEntities'], 'readonly').objectStore('mediaEntities').get(id);
		request.onsuccess = function (event) {
			return _store2.default.dispatch(_actions2.default.getDbSuccess(event.target.result));
		};
		request.onerror = function (event) {
			return _store2.default.dispatch(_actions2.default.error('DB Error ' + event.target.error.name));
		};
	}
	
	// Request storage usage and capacity left
	function storageStats() {
		navigator.webkitTemporaryStorage.queryUsageAndQuota(function (used, granted) {
			console.log('granted: ', granted);
			var percent = 100 * used / granted;
			if (percent === 100) gui.warn('IndexDB full!');
			console.log('## ' + percent.toPrecision(2) + '% storage used');
		}, function (error) {
			console.log('Error', error);
		});
	}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(52);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(48)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./video-item.component.sass", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./video-item.component.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(47)();
	// imports
	
	
	// module
	exports.push([module.id, ".copy {\n  -webkit-transition: all 250ms;\n  transition: all 250ms; }\n  .copy.active, .copy.active:hover {\n    background: #a1c616;\n    color: #fff; }\n\n.au--highlight {\n  -webkit-transition: background 1000ms;\n  transition: background 1000ms;\n  background: #2176A8;\n  color: #fff; }\n", ""]);
	
	// exports


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(1);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _store = __webpack_require__(5);
	
	var _store2 = _interopRequireDefault(_store);
	
	var _actions = __webpack_require__(40);
	
	var _actions2 = _interopRequireDefault(_actions);
	
	var _indexDB = __webpack_require__(50);
	
	var db = _interopRequireWildcard(_indexDB);
	
	__webpack_require__(54);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import youtubeApi from '../utils/youtube-iframe-api';
	_vue2.default.component('youtube-player', {
		data: function data() {
			return {
				player: undefined,
				timeInterval: undefined,
				duration: 0,
				skipToTime: 0
			};
		},
		created: function created() {
			var _this = this;
	
			this.unsubscribe = _store2.default.subscribe(function () {
				var mediaPlayer = _store2.default.getState().mediaPlayer;
				if (mediaPlayer.mediaId && _this.player.getVideoData() && _this.player.getVideoData().video_id !== mediaPlayer.mediaId) {
					_this.duration = _this.player.getDuration();
					_this.player.loadVideoById({
						videoId: mediaPlayer.mediaId,
						suggestedQuality: 'large'
					});
				}
				if (_this.player && _this.player.isMuted && _this.player.isMuted() != mediaPlayer.mute) {
					mediaPlayer.mute ? _this.player.mute() : _this.player.unMute();
				}
				if (_this.skipToTime !== mediaPlayer.skipToTime) {
					// bad hack, this sould be some middleware doing it better
					_this.skipToTime = mediaPlayer.skipToTime;
					_this.player.seekTo(mediaPlayer.skipToTime, true);
				}
				if (mediaPlayer.isPlaying) {
					if (_this.player.getPlayerState() !== 1) _this.player.playVideo();
				} else {
					if (_this.player && _this.player.getPlayerState) {
						if (![0, 2].includes(_this.player.getPlayerState())) _this.player.pauseVideo();
					}
				}
			});
		},
		beforeDestroy: function beforeDestroy() {
			this.unsubscribe();
		},
		mounted: function mounted() {
			var _this2 = this;
	
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			document.head.appendChild(tag);
			var initialVideos = ['Es22YN2stg8', 'strzXKsfRMs', 'qMvLkpQcCKQ', 'KwoVARYA8jw', 'nzwrwfNHn5A'];
			window.onYouTubeIframeAPIReady = function () {
				_this2.player = new YT.Player('youtube-iframe', {
					height: '100%',
					width: '100%',
					videoId: initialVideos[Math.floor(Math.random() * initialVideos.length)],
					events: {
						onStateChange: _this2.onPlayerStateChange,
						onError: _this2.onPlayerError
					}
				});
			};
			// youtubeApi();
		},
	
		methods: {
			onPlayerError: function onPlayerError(event) {
				var mediaId = _store2.default.getState().mediaPlayer.mediaId;
				_store2.default.dispatch(_actions2.default.videoError(_store2.default.getState().mediaPlayer.mediaId, event.data));
				db.setMediaEntity(_store2.default.getState().mediaPlayer.entities[mediaId]);
			},
			onPlayerStateChange: function onPlayerStateChange(event) {
				var _this3 = this;
	
				var playerState = this.player.getPlayerState();
				var isPlaying = _store2.default.getState().mediaPlayer.isPlaying;
				if (playerState === 2) {
					clearInterval(this.timeInterval);
					this.timeInterval = undefined;
					if (isPlaying) _store2.default.dispatch(_actions2.default.pause());
				} else if (playerState === 1) {
					if (!this.timeInterval) {
						this.timeInterval = setInterval(function () {
							_store2.default.dispatch(_actions2.default.setCurrentTime(_this3.player.getCurrentTime()));
						}, 1000);
					}
					if (!isPlaying) _store2.default.dispatch(_actions2.default.play());
				} else if (playerState === 0) {
					_store2.default.dispatch(_actions2.default.nextVideo());
				}
			}
		},
		template: '\n\t<div class="youtube-player">\n\t\t<div id="youtube-iframe"></div>\n\t</div>\n\t'
	});

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(55);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(48)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./youtube-player.component.sass", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./youtube-player.component.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(47)();
	// imports
	
	
	// module
	exports.push([module.id, ".youtube-player {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: #A8ADB7; }\n", ""]);
	
	// exports


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _findVideos = __webpack_require__(39);
	
	var _findVideos2 = _interopRequireDefault(_findVideos);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	if (!document.querySelectorAll('#audius-website').length) {
		// Watch if the DOM changes, rescan the DOM for new links to music
		var observer = new MutationObserver(function (mutations) {
			(0, _findVideos2.default)();
		});
	
		observer.observe(document.querySelector('body'), {
			subtree: true,
			childList: true,
			characterData: true
		});
		// later, you can stop observing
		// observer.disconnect();
	}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(58);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(48)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./app.sass", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./app.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(47)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Nobile);", ""]);
	
	// module
	exports.push([module.id, "@charset \"UTF-8\";\n.audius button,\n.audius .button,\n#audius-website button,\n#audius-website .button {\n  font-family: 'Nobile', sans-serif;\n  font-size: 1em;\n  padding: 0 7px;\n  height: 35px;\n  border: 1px solid #C8CCD5;\n  color: #C8CCD5;\n  background: transparent;\n  text-transform: uppercase;\n  border-radius: 2px;\n  -webkit-transition: all 250ms;\n  transition: all 250ms;\n  outline: 0;\n  cursor: pointer; }\n  .audius button.btn--blue,\n  .audius .button.btn--blue,\n  #audius-website button.btn--blue,\n  #audius-website .button.btn--blue {\n    border-color: #2DA7EF;\n    background: #2DA7EF;\n    color: #fff; }\n\n.audius a.button,\n#audius-website a.button {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  text-decoration: none; }\n\n@font-face {\n  font-family: 'WampIcons';\n  src: url(" + __webpack_require__(59) + ");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^=\"wmp-icon-\"], [class*=\" wmp-icon-\"] {\n  text-align: center;\n  position: relative;\n  width: 49px;\n  height: 49px;\n  display: inline-block; }\n  [class^=\"wmp-icon-\"]:before, [class*=\" wmp-icon-\"]:before {\n    /* use !important to prevent issues with browser extensions that change fonts */\n    speak: none;\n    font-style: normal;\n    font-weight: normal;\n    font-variant: normal;\n    text-transform: none;\n    line-height: 1;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    font-family: 'WampIcons' !important;\n    position: absolute;\n    font-size: 1.7em;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    width: 100%;\n    height: 100%; }\n\n.icon--small:before {\n  font-size: 1.2em; }\n\n.wmp-icon-local_offer2:before {\n  content: \"\\E54F\"; }\n\n.wmp-icon-format_list_bulleted:before {\n  content: \"\\E242\"; }\n\n.wmp-icon-dehaze:before {\n  content: \"\\E3C7\"; }\n\n.wmp-icon-reorder:before {\n  content: \"\\E8FE\"; }\n\n.wmp-icon-more_vert:before {\n  content: \"\\E5D4\"; }\n\n.wmp-icon-unfold_more:before {\n  content: \"\\E5D7\"; }\n\n.wmp-icon-arrow_drop_down:before {\n  content: \"\\E5C5\"; }\n\n.wmp-icon-arrow_drop_up:before {\n  content: \"\\E5C7\"; }\n\n.wmp-icon-previous:before {\n  content: \"\\E045\"; }\n\n.wmp-icon-play:before {\n  content: \"\\E037\"; }\n\n.wmp-icon-pause:before {\n  content: \"\\E034\"; }\n\n.wmp-icon-next:before {\n  content: \"\\E044\"; }\n\n.wmp-icon-shuffle:before {\n  content: \"\\E043\"; }\n\n.wmp-icon-repeat:before {\n  content: \"\\E040\"; }\n\n.wmp-icon-repeat_one:before {\n  content: \"\\E041\"; }\n\n.wmp-icon-volume_off:before {\n  content: \"\\E04F\"; }\n\n.wmp-icon-volume_up:before {\n  content: \"\\E050\"; }\n\n.wmp-icon-search:before {\n  content: \"\\E8B6\"; }\n\n.wmp-icon-close:before {\n  content: \"\\E5CD\"; }\n\n.wmp-icon-add:before {\n  content: \"\\E900\"; }\n\n.wmp-icon-queue2:before {\n  content: \"\\E03D\"; }\n\n.wmp-icon-copy:before {\n  content: \"\\E14D\"; }\n\n.wmp-icon-local_offer22:before {\n  content: \"\\E550\"; }\n\n.wmp-icon-link:before {\n  content: \"\\E157\"; }\n\n.wmp-icon-delete:before {\n  content: \"\\E872\"; }\n\n.wmp-icon-cloud_upload:before {\n  content: \"\\E2C3\"; }\n\n.wmp-icon-youtube:before {\n  content: \"\\E906\"; }\n\n#audius {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 99999;\n  font-family: 'Nobile', sans-serif;\n  font-size: 2vmin;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  color: #303641;\n  margin: 0; }\n  #audius a {\n    color: #303641; }\n    #audius a:visited {\n      color: #303641; }\n  #audius input:focus {\n    outline: 0; }\n", ""]);
	
	// exports


/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = "data:application/x-font-ttf;base64,AAEAAAALAIAAAwAwT1MvMg8SBh4AAAC8AAAAYGNtYXDRds1vAAABHAAAAPxnYXNwAAAAEAAAAhgAAAAIZ2x5Zuvos1kAAAIgAAAJSGhlYWQLrysXAAALaAAAADZoaGVhB8ID4AAAC6AAAAAkaG10eHIAEioAAAvEAAAAfGxvY2Ee1iFsAAAMQAAAAEBtYXhwACYAQgAADIAAAAAgbmFtZVkpPFoAAAygAAABwnBvc3QAAwAAAAAOZAAAACAAAwPuAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpBgPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQA4AAAADQAIAAEABQAAQAg4DTgN+A94EHgReBQ4U3hV+JC4sPjx+VQ5cXlx+XN5dTl1+hy6Lbo/ukA6Qb//f//AAAAAAAg4DTgN+A94EDgQ+BP4U3hV+JC4sPjx+VP5cXlx+XN5dTl1+hy6Lbo/ukA6Qb//f//AAH/4x/QH84fyR/HH8YfvR7BHrgdzh1OHEsaxBpQGk8aShpEGkIXqBdlFx4XHRcYAAMAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAACAQAAgQMAAtUAAwAHAAABMxEjIREzEQJWqqr+qqoC1f2sAlT9rAAAAQFWAIEDKgLVAAIAAAkCAVYB1P4sAtX+1v7WAAMAVgABA6oDVQALABsAJAAAATUjNSMVIxUzFTM1EzIWFREUBiMhIiY1ETQ2MwcRIRUhIiY1EQMqqlaqqlbWIjIxI/4AIjQzI6wCVv2qIjIB1VaqqlaqqgGAMiL+ACMzMyMCACIyqv2qVDEjAlYAAAACAIAAAQOAA1UACAARAAAlNTMRIRUnNxURFSMRITUXBzUC1lT+AKqqVAIAqqrVrP8AgKqqgAGsrAEAgKqqgAAAAwCAAAEDgANVAAYADwAYAAABIzUjNTczEzUzESEVJzcVERUjESE1Fwc1AipAQFYqrFT+AKqqVAIAqqoBK6osKv6qrP8AgKqqgAGsrAEAgKqqgAAAAwCqAFUDVgMBAAYADQARAAABFzcVIzcnEzMVJwEnAQ8BJzcCeIZY7FiGLuxY/eg8Ahj+PN48AW+GWOxYhgHO7Fj96DwCGIY83jwAAAIBAACrAwACqwADAAYAAAEzESMhEQECqlZW/lYBagKr/gACAP8AAAACAQAAqwMAAqsAAgAGAAAJAREBMxEjAZYBav4AVlYBqwEA/gACAP4AAAAAAAQAgAArA4ADKwACABQAJgAuAAABFScnAQcnDgEHNT4BNycRJyMRMycBNC4CJzUeAxUUBgcnPgEnHAEHJzUeAQIAWvACyjZYIk4sGzAVttaqysoCqh85TS9Abk8tFxVACgxqAmgwOgMBtFqE/TY2WBspClgHGhG2/uDWAQDK/rYzXEs2DlgPRWN7RDBbJ0IZOR4IDAZoXhhbAAAAAAMAgAA1A4ADIQAVABwAIgAAAR4DFRQOAgc1PgM1NC4CJxMUBgcRHgElMzcRJyMCVkBuTy0tT21BLk45Hx85TS9qOjAwOv3AqtbWqgMhD0Vje0RFe2NFDlgNN0tcMzNcSzYO/uI5WxgBWBhbR9b9VNYAAAAAAwBW/9UDgAOBAAMAEwAcAAAlESERATIWFREUBiMhIiY1ETQ2MyUVIREjETQ2MwMq/iwB1CI0MyP+LCI0MyMBVP4AVDEjKwJW/aoCqjIi/aojMzMjAlYiMqxW/aoCViI0AAAAAAMAVgDVA6oCgQAVABkALwAAATIeAhUUDgIrATUzMjY1NCYrATUDNSEVJRQWOwEVIyIuAjU0PgI7ARUjIgYC1ixOOSEhOU4srKw2Tk42rNQBVP38TjasrCxOOSEhOU4srKw2TgKBIjpOLC1OOiFSTjY2TlL/AFRUKjZOUiE6Ti0sTjoiUk4AAAAGAGoAawOAAusAAwAHAAsAFwAjAC8AAAEhFSERNSEVATUhFSUyFhUUBiMiJjU0NhMyFhUUBiMiJjU0NhMyFhUUBiMiJjU0NgEqAlb9qgJW/aoCVv0qGyUmGhknJRsbJSUbGyUlGxslJRsbJSUC1VT/AFRU/wBUVGonGRomJhoZJwIAJRsbJSUbGyX/ACUbGyUlGxslAAAAAAIAAABVBAADAQAGACUAAAEzJwczFTMTHgMVFA4CIyEiLgI1ND4CNz4DMzIeAgJWgNbWgKzkKUg2HyI6Tiz91jVeRSgjPlMwFDtJVS86aVM5AYHU1KwBKgMkOUoqLU46IShFXTYxWEQrBiZALhonRV8AAAAAAwBWAMEDqgLBAAMABwALAAATIRUhFSEVIRUhFSFWA1T8rANU/KwDVPysAsFWgFaAVAAAAAIAVgABA6oDVQALACUAABMyNjU0JiMiBhUUFgUeARUUBgcBDgEjIiYnAS4BNRE0NjMhMhYX6hslJRsbJSUCwwwMDAz+1AweEhIeDP6ADAwxIwEsEh4MAoElGxslJRsbJcQMHhISHgz+1AwMDAwBgAweEgEsIjIMDAAAAAACAFYAAQOqA1UACwAlAAATMjY1NCYjIgYVFBYFHgEVFAYHAQ4BIyImJwEuATURNDYzITIWF+obJSUbGyUlAsMMDAwM/tQMHhISHgz+gAwMMSMBLBIeDAKBJRsbJSUbGyXEDB4SEh4M/tQMDAwMAYAMHhIBLCIyDAwAAAAAAQEqASsC1gIBAAIAAAEhBwEqAazWAgHWAAAAAAEBKgFVAtYCKwACAAABNxcBKtbWAVXW1gAAAAABANYAgQMqAtUACwAAAQcXBycHJzcnNxc3Ayru7jzu7jzu7jzu7gKZ7u487u487u487u4AAwGqAFUCVgMBAAsAFwAjAAABMhYVFAYjIiY1NDYTMhYVFAYjIiY1NDY3IiY1NDYzMhYVFAYCACI0MyMiNDMjIjQzIyI0MyMiNDMjIjQzAQE0IiMzMyMiNAEANCIjMzMjIjRUMyMiNDQiIzMAAgE8ACsCxAMrAAUACwAAJTcXByc3EwcnNxcHAgCIPMTEPIiIPMTEPKOIPMTEPAGIiDzExDwAAAACANYAKwMqAysABwARAAABFSE1MzczFwERIREUBiMhIiYDKv2slCzULP5qAgAzI/6sIjQDAVZWKir9gAIA/gAjMzMAAAIAgABBA2oDKwALACcAAAEyNjU0JiMiBhUUFiEXByc1Jw4BIyIuAjU0PgIzMh4CFRQGBxcBlk9xcFBPcXABUNRA1AwkXTM6ZUssLEtlOjpkSysiIAwBVXBQT3FxT1Bw1EDUIgwgIitKZTo5ZkssLEtmOTNdJAwAAAQAgACBA4AC1QADAAcACwAPAAATIRUhFTUhFQE1IRUlNSEVgAMA/QADAP0AAwD9AAMAAtVUrFZW/qxUVKpWVgABANYAgQMqAtUACwAAASERIxEhNSERMxEhAyr/AFT/AAEAVAEAAYH/AAEAVAEA/wAAAAAAAgAAAFgEAAMoADsAPwAAATAmJy4BJy4CIjkBMCIOAQcOAQcOATEwBh0BFBYxMBYXHgEXHgMxMDI+ATc+ATc+ATEwNj0BNCYxARENAQP2EhcdOw81fmtISGt+NQ87HRcSCgoSFx1DER90c1ZIa342DzodFxIKCv2gARX+6wKNThcfCwIEBAICBAQCCx8XTmg+Tj5nTxcfCgMDBAIBAwQEAQsfF09nPk4+aP6uASCQkAABAAAAAQAAqh+DCV8PPPUACwQAAAAAANRH82IAAAAA1EfzYgAA/9UEAAOBAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAQAAAEAAAAAAAAAAAAAAAAAAAAfBAAAAAAAAAAAAAAAAgAAAAQAAQAEAAFWBAAAVgQAAIAEAACABAAAqgQAAQAEAAEABAAAgAQAAIAEAABWBAAAVgQAAGoEAAAABAAAVgQAAFYEAABWBAABKgQAASoEAADWBAABqgQAATwEAADWBAAAgAQAAIAEAADWBAAAAAAAAAAACgAUAB4AMgBAAHgAmADCAOgA/AESAWABmgHMAhACXAKWArAC7gMsAzoDSANiA5gDtAPWBBIEMgRMBKQAAQAAAB8AQAAGAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAwAAAABAAAAAAACAAcAjQABAAAAAAADAAwARQABAAAAAAAEAAwAogABAAAAAAAFAAsAJAABAAAAAAAGAAwAaQABAAAAAAAKABoAxgADAAEECQABABgADAADAAEECQACAA4AlAADAAEECQADABgAUQADAAEECQAEABgArgADAAEECQAFABYALwADAAEECQAGABgAdQADAAEECQAKADQA4G1lZGlhLXBsYXllcgBtAGUAZABpAGEALQBwAGwAYQB5AGUAclZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMG1lZGlhLXBsYXllcgBtAGUAZABpAGEALQBwAGwAYQB5AGUAcm1lZGlhLXBsYXllcgBtAGUAZABpAGEALQBwAGwAYQB5AGUAclJlZ3VsYXIAUgBlAGcAdQBsAGEAcm1lZGlhLXBsYXllcgBtAGUAZABpAGEALQBwAGwAYQB5AGUAckZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="

/***/ },
/* 60 */,
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _store = __webpack_require__(5);
	
	var _store2 = _interopRequireDefault(_store);
	
	var _actions = __webpack_require__(40);
	
	var _actions2 = _interopRequireDefault(_actions);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mediaId = '';
	_store2.default.subscribe(function () {
		var extension = _store2.default.getState().extension;
		if (extension.mediaId !== mediaId) {
			mediaId = extension.mediaId;
			console.log('extension play ', extension.entities[mediaId].title);
			// Send message to background script.
			chrome.runtime.sendMessage({
				audius: true,
				action: {
					type: 'PLAY',
					mediaId: mediaId,
					currentMedia: extension.entities[mediaId]
				}
			});
		}
	});
	
	if (document.querySelectorAll('#audius-website').length) {
		// Listen to messages from background script if we are on a audius player page.
		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			if (request.audius) {
				window.dispatchEvent(new CustomEvent('audius', { detail: request.action }));
				sendResponse('revieved message!');
			}
		});
	}

/***/ }
/******/ ]);
//# sourceMappingURL=content-script.js.map