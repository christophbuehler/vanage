(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.Vanage = f()
    }
})(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function(require, module, exports) {
            'use strict';

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            var uuid = require('./src/utils/uuid');
            var Service = require('./src/Service');
            var globalIdentifier = uuid();
            var semanticGlobalIdentifier = globalIdentifier.replace(/-/g, '');

            module.exports = function(undefined) {
                function createInitialService() {
                    return new Service({
                        identifier: globalIdentifier,
                        debug: false
                    });
                }

                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefined) {
                    // Special security setup for browser usage which
                    // saves the global instance to a guid in the window object
                    window[semanticGlobalIdentifier] = createInitialService();
                    return window[semanticGlobalIdentifier];
                } else {
                    // Server uses a plain Service instance
                    return createInitialService();
                }
            }();

        }, {
            "./src/Service": 6,
            "./src/utils/uuid": 12
        }],
        2: [function(require, module, exports) {
            // shim for using process in browser

            var process = module.exports = {};

            // cached from whatever global is present so that test runners that stub it
            // don't break things.  But we need to wrap it in a try catch in case it is
            // wrapped in strict mode code which doesn't define any globals.  It's inside a
            // function because try/catches deoptimize in certain engines.

            var cachedSetTimeout;
            var cachedClearTimeout;

            (function() {
                try {
                    cachedSetTimeout = setTimeout;
                } catch (e) {
                    cachedSetTimeout = function() {
                        throw new Error('setTimeout is not defined');
                    }
                }
                try {
                    cachedClearTimeout = clearTimeout;
                } catch (e) {
                    cachedClearTimeout = function() {
                        throw new Error('clearTimeout is not defined');
                    }
                }
            }())
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
                var timeout = cachedSetTimeout(cleanUpNextTick);
                draining = true;

                var len = queue.length;
                while (len) {
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
                cachedClearTimeout(timeout);
            }

            process.nextTick = function(fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    cachedSetTimeout(drainQueue, 0);
                }
            };

            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function() {
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

            process.binding = function(name) {
                throw new Error('process.binding is not supported');
            };

            process.cwd = function() {
                return '/'
            };
            process.chdir = function(dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function() {
                return 0;
            };

        }, {}],
        3: [function(require, module, exports) {
            'use strict';

            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var Cache = function() {
                function Cache() {
                    _classCallCheck(this, Cache);

                    this.internals = {};
                    this.dirty = false;
                }

                _createClass(Cache, [{
                    key: 'set',
                    value: function set(key, value) {
                        this.internals[key] = value;
                        this.dirty = true;
                    }
                }, {
                    key: 'get',
                    value: function get(key) {
                        return this.internals[key];
                    }
                }, {
                    key: 'flush',
                    value: function flush() {
                        this.internals = {};
                    }
                }, {
                    key: 'dump',
                    value: function dump() {
                        return this.internals;
                    }
                }, {
                    key: 'isDirty',
                    value: function isDirty() {
                        return this.dirty;
                    }
                }, {
                    key: 'size',
                    get: function get() {
                        return this.entries().length;
                    }
                }, {
                    key: 'entries',
                    get: function get() {
                        return Object.keys(this.internals);
                    }
                }]);

                return Cache;
            }();

            module.exports = Cache;

        }, {}],
        4: [function(require, module, exports) {
            'use strict';

            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return call && (typeof call === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var ExtendableServiceError = function(_Error) {
                _inherits(ExtendableServiceError, _Error);

                function ExtendableServiceError(message) {
                    _classCallCheck(this, ExtendableServiceError);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExtendableServiceError).call(this, message));

                    _this.name = _this.constructor.name;
                    _this.message = message;

                    if (typeof Error.captureStackTrace === 'function') {
                        Error.captureStackTrace(_this, _this.constructor);
                    } else {
                        _this.stack = new Error(message).stack;
                    }
                    return _this;
                }

                _createClass(ExtendableServiceError, [{
                    key: 'setCallee',
                    value: function setCallee(callee) {
                        this.callee = callee;
                    }
                }]);

                return ExtendableServiceError;
            }(Error);

            var ServiceError = function(_ExtendableServiceErr) {
                _inherits(ServiceError, _ExtendableServiceErr);

                function ServiceError(message) {
                    _classCallCheck(this, ServiceError);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(ServiceError).call(this, message));
                }

                return ServiceError;
            }(ExtendableServiceError);

            exports.ExtendableServiceError = ExtendableServiceError;
            exports.ServiceError = ServiceError;

        }, {}],
        5: [function(require, module, exports) {
            'use strict';

            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var equals = require('./utils/equal');
            var uuid = require('./utils/uuid');

            var Pattern = function() {
                function Pattern(identifier) {
                    _classCallCheck(this, Pattern);

                    this.base = identifier;
                    this.id = uuid();
                }

                _createClass(Pattern, [{
                    key: 'match',
                    value: function match(foreign) {
                        return equals(this.base, foreign);
                    }
                }, {
                    key: 'keys',
                    value: function keys() {
                        return Object.keys(this.base);
                    }
                }, {
                    key: 'signature',
                    value: function signature() {
                        var length = this.keys().length;

                        var index = 0;
                        var id = '';

                        for (var key in this.base) {
                            id += index === 0 ? '' : '&';
                            id += key + '=' + this.base[key];
                            index++;
                        }

                        id += '@' + this.id.replace(/-/g, '') + '#' + length;
                        return id;
                    }
                }]);

                return Pattern;
            }();

            module.exports = Pattern;

        }, {
            "./utils/equal": 8,
            "./utils/uuid": 12
        }],
        6: [function(require, module, exports) {
            'use strict';

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var uuid = require('./utils/uuid');
            var noop = require('./utils/noop');
            var debug = require('./utils/debug');
            var str = require('./utils/stringify');
            var Errors = require('./utils/errors');
            var Cache = require('./Cache');
            var Pattern = require('./Pattern');

            var Service = function() {
                function Service(options) {
                    _classCallCheck(this, Service);

                    this.options = options || {};
                    this.id = options.identifier || uuid();
                    this.debug = noop;

                    this._internalId = Math.random().toString(36).slice(-12);
                    this._history = new Cache();
                    this._cache = new Cache();
                    this._delegates = [];
                    this._handlers = [];
                }

                _createClass(Service, [{
                    key: 'configure',
                    value: function configure(options) {
                        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                            for (var key in options) {
                                this.options[key] = options[key];
                            }
                        }

                        this._postConfigHook();
                    }
                }, {
                    key: 'set',
                    value: function set(key, value) {
                        this.options[key] = value;
                        this._postConfigHook();
                    }
                }, {
                    key: 'register',
                    value: function register(ressource, handler) {
                        var self = this;
                        this.debug('Registring new handler for %s', str(ressource));

                        if ((typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource)) !== 'object') {
                            throw new Errors.RegisterError('Endpoint target must be an object and not type ' + (typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource)));
                        }

                        var index = this._handlers.push({
                            pattern: new Pattern(ressource),
                            handler: handler,
                            service: self._internalId
                        });

                        var registry = this._handlers[index - 1];
                        this._cache.set(registry.pattern.signature(), registry);
                    }
                }, {
                    key: 'act',
                    value: function act(target, data, resolver) {
                        var self = this;

                        data = data || {};
                        resolver = typeof resolver === 'function' ? resolver : noop;

                        if (!target) {
                            throw new Errors.ActError('No target defined to act event on');
                        }

                        this.debug('%s for %s with data %s', data.__delegate__ ? 'Delegating Action' : 'Acting', str(target), str(data));
                        this._history.set(new Pattern(target).signature(), {
                            data: data,
                            stamp: Date.now(),
                            target: target,
                            resolver: resolver
                        });

                        this._delegates.forEach(function(delegation) {
                            if (delegation.pattern.match(target)) {
                                self.debug('Found delegation for %s', str(target));
                                delegation.delegate.apply(null, [function(bubbler, delegationData) {
                                    if ((typeof delegationData === 'undefined' ? 'undefined' : _typeof(delegationData)) !== 'object') {
                                        delegationData = data;
                                    } else {
                                        delegationData.origin = data;
                                    }

                                    self.debug('Delegate target %s to %s', str(target), str(bubbler));
                                    delegationData.__delegate__ = target;
                                    self.act(bubbler, delegationData, resolver);
                                }]);
                            }
                        });

                        this._handlers.forEach(function(factory) {
                            if (factory.pattern.match(target)) {
                                factory.handler.apply(null, [data, function(Errors, result) {
                                    self.debug('Handling factory %s with data %s', str(target), str(data));
                                    return resolver.apply(null, [Errors, result, function(delegate, delegationData) {
                                        if ((typeof delegationData === 'undefined' ? 'undefined' : _typeof(delegationData)) !== 'object') {
                                            delegationData = {};
                                        }

                                        delegationData.__delegate__ = target;
                                        delegationData.origin = data;
                                        self.act(delegate, delegationData);
                                    }]);
                                }]);
                            }
                        });
                    }
                }, {
                    key: 'delegate',
                    value: function delegate(ressource, delegation) {
                        var self = this;
                        this.debug('Registering delegate for %s', str(ressource));

                        if ((typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource)) !== 'object') {
                            throw new Errors.DelegationError('Delegation ressource must be an object and not ' + (typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource)));
                        }

                        if (typeof delegation !== 'function') {
                            throw new Errors.DelegationError('Delegators need a function to delegate, received ' + (typeof delegation === 'undefined' ? 'undefined' : _typeof(delegation)));
                        }

                        var index = this._delegates.push({
                            pattern: new Pattern(ressource),
                            delegate: delegation,
                            service: self._internalId
                        });

                        var registry = this._delegates[index - 1];
                        this._cache.set(registry.pattern.signature(), registry);
                    }
                }, {
                    key: '_postConfigHook',
                    value: function _postConfigHook() {
                        this.debug = debug(this.options.debug);
                    }
                }]);

                return Service;
            }();

            module.exports = Service;

        }, {
            "./Cache": 3,
            "./Pattern": 5,
            "./utils/debug": 7,
            "./utils/errors": 9,
            "./utils/noop": 10,
            "./utils/stringify": 11,
            "./utils/uuid": 12
        }],
        7: [function(require, module, exports) {
            (function(process) {
                'use strict';

                var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
                };

                var noop = require('./noop');

                module.exports = function(enabled) {
                    if (enabled) {
                        if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== undefined) {
                            if (typeof console.debug === 'function') {
                                return console.debug.bind(console);
                            } else if (typeof console.log === 'function') {
                                return console.log.bind(console);
                            } else if (process && typeof process.stdout.write === 'function') {
                                return process.stdout.write.bind(process);
                            }
                        }
                    }

                    return noop;
                };

            }).call(this, require('_process'))
        }, {
            "./noop": 10,
            "_process": 2
        }],
        8: [function(require, module, exports) {
            'use strict';

            module.exports = function deepEqual(o, p, loose) {
                var i = void 0;

                var lkeys = Object.keys(o).sort();
                var rkeys = Object.keys(p).sort();

                loose = loose === true ? true : false;

                if (lkeys.length !== rkeys.length) {
                    return false; // not the same nr of keys
                }

                if (lkeys.join('') !== rkeys.join('')) {
                    return false; // different keys
                }

                for (i = 0; i < lkeys.length; ++i) {
                    if (o[lkeys[i]] instanceof Array) {
                        if (!(p[lkeys[i]] instanceof Array)) {
                            return false;
                        }

                        // if (compareObjects(o[lkeys[i]], p[lkeys[i]] === false) return false
                        // would work, too, and perhaps is a better fit, still, this is easy, too
                        if (p[lkeys[i]].sort().join('') !== o[lkeys[i]].sort().join('')) {
                            return false;
                        }
                    } else if (o[lkeys[i]] instanceof Date) {
                        if (!(p[lkeys[i]] instanceof Date)) {
                            return false;
                        }

                        if ('' + o[lkeys[i]] !== '' + p[lkeys[i]]) {
                            return false;
                        }
                    } else if (o[lkeys[i]] instanceof Function) {
                        if (!(p[lkeys[i]] instanceof Function)) {
                            return false;
                        }
                        // ignore functions, or check them regardless?
                    } else if (o[lkeys[i]] instanceof Object) {
                        if (!(p[lkeys[i]] instanceof Object)) {
                            return false;
                        }

                        if (o[lkeys[i]] === o) {
                            // self reference?
                            if (p[lkeys[i]] !== p) {
                                return false;
                            }
                        } else if (compareObjects(o[lkeys[i]], p[lkeys[i]]) === false) {
                            return false; // WARNING: does not deal with circular refs other than
                        }
                    }

                    if (loose) {
                        if (o[lkeys[i]] != p[lkeys[i]]) {
                            return false;
                        }
                    } else {
                        if (o[lkeys[i]] !== p[lkeys[i]]) {
                            return false; // not the same value
                        }
                    }
                }

                return true;
            };

        }, {}],
        9: [function(require, module, exports) {
            'use strict';

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return call && (typeof call === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var ExtendableServiceError = require('../Error').ExtendableServiceError;

            var DelegationError = function(_ExtendableServiceErr) {
                _inherits(DelegationError, _ExtendableServiceErr);

                function DelegationError(message) {
                    _classCallCheck(this, DelegationError);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DelegationError).call(this, message));

                    _this.name = 'DelegationError';
                    _this.callee = 'Service.delegate';
                    return _this;
                }

                return DelegationError;
            }(ExtendableServiceError);

            var ActError = function(_ExtendableServiceErr2) {
                _inherits(ActError, _ExtendableServiceErr2);

                function ActError(message) {
                    _classCallCheck(this, ActError);

                    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ActError).call(this, message));

                    _this2.name = 'ActError';
                    _this2.callee = 'Service.act';
                    return _this2;
                }

                return ActError;
            }(ExtendableServiceError);

            var RegisterError = function(_ExtendableServiceErr3) {
                _inherits(RegisterError, _ExtendableServiceErr3);

                function RegisterError(message) {
                    _classCallCheck(this, RegisterError);

                    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(RegisterError).call(this, message));

                    _this3.name = 'RegisterError';
                    _this3.callee = 'Service.register';
                    return _this3;
                }

                return RegisterError;
            }(ExtendableServiceError);

            exports.DelegationError = DelegationError;
            exports.ActError = ActError;
            exports.RegisterError = RegisterError;

        }, {
            "../Error": 4
        }],
        10: [function(require, module, exports) {
            "use strict";

            module.exports = function() { /* non operational method */ };

        }, {}],
        11: [function(require, module, exports) {
            'use strict';

            module.exports = function(input) {
                if (typeof input === 'string') {
                    return input;
                } else if (Array.isArray(input)) {
                    return input.join(', ');
                } else if (input.toISOString !== undefined) {
                    return input.toISOString();
                }

                return JSON.stringify(input);
            };

        }, {}],
        12: [function(require, module, exports) {
            'use strict';

            var guidBlock = function guidBlock() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };

            module.exports = function guid() {
                return guidBlock() + guidBlock() + '-' + guidBlock() + '-' + guidBlock() + '-' + guidBlock() + '-' + guidBlock() + guidBlock() + guidBlock();
            };

        }, {}]
    }, {}, [1])(1)
});
//# sourceMappingURL=vanage.js.map