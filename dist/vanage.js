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

            var uuid = require('./src/utils/uuid');
            var Service = require('./src/Service');
            var Cache = require('./src/Cache');
            var Error = require('./src/Error');

            module.exports = function(undefined) {
                return {
                    Cache: Cache,
                    Service: Service,
                    create: function create(settings) {
                        settings = settings || {
                            debug: false
                        };

                        return new Service(settings);
                    },
                    generateId: uuid
                };
            }();

        }, {
            "./src/Cache": 3,
            "./src/Error": 4,
            "./src/Service": 6,
            "./src/utils/uuid": 15
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

                    this.name = 'Vanage.Cache';
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
                    key: 'unset',
                    value: function unset(key) {
                        delete this.internals[key];
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
                        return this.entries.length;
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

            var InternalBaseError = function(_Error) {
                _inherits(InternalBaseError, _Error);

                function InternalBaseError(message) {
                    _classCallCheck(this, InternalBaseError);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InternalBaseError).call(this, message));

                    _this.name = _this.constructor.name;
                    _this.message = message;
                    _this.stamp = Date.now();
                    _this.callee = '<unknown>';

                    if (typeof Error.captureStackTrace === 'function') {
                        Error.captureStackTrace(_this, _this.constructor);
                    } else {
                        _this.stack = new Error(message).stack;
                    }
                    return _this;
                }

                _createClass(InternalBaseError, [{
                    key: 'toString',
                    value: function toString() {
                        return '[' + this.name + '#' + this.callee + '] ' + this.message + ' @ ' + this.stamp;
                    }
                }]);

                return InternalBaseError;
            }(Error);

            var VanageError = function(_InternalBaseError) {
                _inherits(VanageError, _InternalBaseError);

                function VanageError(message) {
                    _classCallCheck(this, VanageError);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(VanageError).call(this, message));
                }

                return VanageError;
            }(InternalBaseError);

            var DelegationError = function(_InternalBaseError2) {
                _inherits(DelegationError, _InternalBaseError2);

                function DelegationError(message) {
                    _classCallCheck(this, DelegationError);

                    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(DelegationError).call(this, message));

                    _this3.name = 'DelegationError';
                    _this3.callee = 'Service.delegate';
                    return _this3;
                }

                return DelegationError;
            }(InternalBaseError);

            var ActError = function(_InternalBaseError3) {
                _inherits(ActError, _InternalBaseError3);

                function ActError(message) {
                    _classCallCheck(this, ActError);

                    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(ActError).call(this, message));

                    _this4.name = 'ActError';
                    _this4.callee = 'Service.act';
                    return _this4;
                }

                return ActError;
            }(InternalBaseError);

            var RegisterError = function(_InternalBaseError4) {
                _inherits(RegisterError, _InternalBaseError4);

                function RegisterError(message) {
                    _classCallCheck(this, RegisterError);

                    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(RegisterError).call(this, message));

                    _this5.name = 'RegisterError';
                    _this5.callee = 'Service.register';
                    return _this5;
                }

                return RegisterError;
            }(InternalBaseError);

            exports.InternalBaseError = InternalBaseError;
            exports.VanageError = VanageError;
            exports.DelegationError = DelegationError;
            exports.ActError = ActError;
            exports.RegisterError = RegisterError;

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

            var Signature = require('./Signature');
            var equals = require('./utils/equal');
            var uuid = require('./utils/uuid');

            var Pattern = function() {
                function Pattern(factory) {
                    _classCallCheck(this, Pattern);

                    this.name = 'Vanage.Pattern';
                    this.base = factory;
                    this.unique = uuid();
                    this.id = new Signature(this.unique, this.base);
                }

                _createClass(Pattern, [{
                    key: 'match',
                    value: function match(foreign) {
                        return equals(this.base, foreign);
                    }
                }, {
                    key: 'signature',
                    get: function get() {
                        return this.id.value;
                    }
                }, {
                    key: 'keys',
                    get: function get() {
                        return Object.keys(this.base);
                    }
                }]);

                return Pattern;
            }();

            module.exports = Pattern;

        }, {
            "./Signature": 7,
            "./utils/equal": 10,
            "./utils/uuid": 15
        }],
        6: [function(require, module, exports) {
            (function(process) {
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
                var output = require('./utils/console');

                var Error = require('./Error');
                var Cache = require('./Cache');
                var Pattern = require('./Pattern');
                var Signature = require('./Signature');

                var Service = function() {
                    function Service(options) {
                        _classCallCheck(this, Service);

                        this.name = 'Vanage.Service';
                        this.options = options || {};
                        this.id = options.identifier || uuid();
                        this.debug = noop;

                        this._internalId = Math.random().toString(36).slice(-12);
                        this._history = new Cache();
                        this._cache = new Cache();
                        this._delegates = [];
                        this._handlers = [];

                        this._postConfigHook();
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
                        key: 'find',
                        value: function find(factory) {
                            var tuple = {
                                delegates: [],
                                handlers: []
                            };

                            this._handlers.forEach(function(handler) {
                                if (handler.pattern.match(factory)) {
                                    tuple.handlers.push(handler);
                                }
                            });

                            this._delegates.forEach(function(delegate) {
                                if (delegate.pattern.match(factory)) {
                                    tuple.delegates.push(delegate);
                                }
                            });

                            return tuple;
                        }
                    }, {
                        key: 'queue',
                        value: function queue(actions, callback) {
                            var errors = [];
                            var results = [];

                            callback = callback || noop;

                            if (!Array.isArray(actions)) {
                                return this.fail(new TypeError('[Service.queue] Queue needs an array with actions and not typeof ' + (typeof actions === 'undefined' ? 'undefined' : _typeof(actions))));
                            }

                            actions.forEach(function(action, index) {
                                results.push(function(err, result) {
                                    if (err) {
                                        errors.push(err);
                                    } else {
                                        results.push(result);
                                    }
                                });

                                action.apply(null, results);
                                results.splice(index, 1);
                            });

                            return callback(errors, results);
                        }
                    }, {
                        key: 'unregister',
                        value: function unregister(signature) {
                            var self = this;
                            var successfull = false;

                            if (!(signature instanceof Signature)) {
                                return this.fail(new TypeError('[Service.unregister] Cannot unregister by ' + (typeof signature === 'undefined' ? 'undefined' : _typeof(signature)) + ', signature needed'));
                            }

                            this._handlers.forEach(function(handler, index) {
                                if (handler.pattern.id.match(signature)) {
                                    debug('[Service.unregister] Found handler to unregister with sign ' + handler.pattern.signature);
                                    self._handlers.splice(index, 1);
                                    return successfull = true;
                                }
                            });

                            this._delegates.forEach(function(delegate, index) {
                                if (delegate.pattern.id.match(signature)) {
                                    debug('[Service.unregister] Found delegate to unregister with sign ' + delegate.pattern.signature);
                                    self._delegates.splice(index, 1);
                                    return successfull = true;
                                }
                            });

                            return successfull;
                        }
                    }, {
                        key: 'register',
                        value: function register(ressource, handler) {
                            var _this = this;

                            var self = this;
                            this.debug('[Service.register] Registring new handler for %s', str(ressource));

                            if ((typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource)) !== 'object') {
                                return this.fail(new TypeError('[Service.register] Endpoint target must be an object and not type ' + (typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource))));
                            }

                            var factory = {
                                pattern: new Pattern(ressource),
                                handler: handler,
                                rootService: self._internalId
                            };

                            this._history.entries.forEach(function(key) {
                                var history = _this._history.get(key);
                                if (factory.pattern.match(history.target)) {
                                    _this.debug('[Service.register] Found actOnce in history %s', str(ressource));
                                    _this._handle(factory, history.target, history.data);
                                    _this._history.unset(key);
                                    _this.debug('[Service.register] Removed actOnce from history %s', str(ressource));
                                }
                            });

                            var index = this._handlers.push(factory);
                            var registry = this._handlers[index - 1];
                            this._cache.set(registry.pattern.signature, registry);

                            return factory.pattern.id;
                        }
                    }, {
                        key: 'delegate',
                        value: function delegate(ressource, delegation) {
                            var self = this;
                            this.debug('[Service.delegate] Registering delegate for %s', str(ressource));

                            if ((typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource)) !== 'object') {
                                return this.fail(new TypeError('[Service.delegate] Delegation ressource must be an object and not ' + (typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource))));
                            }

                            if (typeof delegation !== 'function') {
                                return this.fail(new TypeError('[Service.delegate] Delegators need a function to delegate, received ' + (typeof delegation === 'undefined' ? 'undefined' : _typeof(delegation))));
                            }

                            var factory = {
                                pattern: new Pattern(ressource),
                                delegate: delegation,
                                rootService: self._internalId
                            };

                            var index = this._delegates.push(factory);
                            var registry = this._delegates[index - 1];
                            this._cache.set(registry.pattern.signature, registry);

                            return factory.pattern.id;
                        }
                    }, {
                        key: 'actOnce',
                        value: function actOnce(target, data, resolver) {
                            data = data || {};
                            this.debug('[Service.actOnce] %s once for %s with data %s', data.__delegate__ ? 'Delegating Action' : 'Acting', str(target), str(data));
                            if (this.act.apply(this, arguments)) return true;
                            this._history.set(new Pattern(target).signature, {
                                data: data,
                                stamp: Date.now(),
                                target: target,
                                resolver: resolver
                            });
                            return false;
                        }
                    }, {
                        key: 'act',
                        value: function act(target, data, resolver) {
                            var _this2 = this;

                            var didAct = false;
                            var self = this;

                            data = data || {};
                            resolver = typeof resolver === 'function' ? resolver : noop;

                            if (!target) {
                                return this.fail(new Error.ActError('[Service.act] No target defined to act event on'));
                            }

                            this.debug('[Service.act] %s for %s with data %s', data.__delegate__ ? 'Delegating Action' : 'Acting', str(target), str(data));

                            this._delegates.forEach(function(delegation) {
                                if (delegation.pattern.match(target)) {
                                    didAct = true;
                                    _this2._delegate(delegation, target, data);
                                }
                            });

                            this._handlers.forEach(function(factory) {
                                if (factory.pattern.match(target)) {
                                    didAct = true;
                                    _this2._handle(factory, target, data);
                                }
                            });

                            return didAct;
                        }
                    }, {
                        key: '_delegate',
                        value: function _delegate(delegation, target, data) {
                            self.debug('[Service.delegate] Found delegation for %s', str(target));
                            delegation.delegate.apply(null, [function(bubbler, delegationData) {
                                if ((typeof delegationData === 'undefined' ? 'undefined' : _typeof(delegationData)) !== 'object') {
                                    delegationData = {};
                                }

                                // TODO: Ev. Mixin with previous origin via Object.assign?
                                delegationData.origin = data;

                                self.debug('[Service.delegate] Delegate target %s to %s', str(target), str(bubbler));
                                delegationData.__delegate__ = target;
                                self.act(bubbler, delegationData, resolver);
                            }]);
                        }
                    }, {
                        key: '_handle',
                        value: function _handle(factory, target, data) {
                            factory.handler.apply(null, [data, function(error, result) {
                                // done handler implementation
                                self.debug('[Service.act] Handling factory %s with data %s', str(target), str(data));
                                return resolver.apply(null, [error, result, function(delegate, delegationData) {
                                    if ((typeof delegationData === 'undefined' ? 'undefined' : _typeof(delegationData)) !== 'object') {
                                        delegationData = {};
                                    }

                                    delegationData.__delegate__ = target;
                                    delegationData.origin = data;
                                    self.act(delegate, delegationData);
                                }]);
                            }, function(bubbler, delegationData, delegationHandler) {
                                // delegation handler implementation
                                if ((typeof delegationData === 'undefined' ? 'undefined' : _typeof(delegationData)) !== 'object') {
                                    delegationData = {};
                                }

                                // TODO: Ev. Mixin with previous origin via Object.assign?
                                delegationData.origin = data;

                                self.debug('[Service.register] Delegate target %s to %s', str(target), str(bubbler));
                                delegationData.__delegate__ = target;
                                self.act(bubbler, delegationData, delegationHandler || resolver);
                            }]);
                        }
                    }, {
                        key: 'fail',
                        value: function fail(err) {
                            var message = '';
                            message += '[' + err.name + '#' + (err.callee || 'Callee::<unknown>') + ']';
                            message += err.message + ' ' + (err.stamp ? '@ ' + err.stamp : '');

                            if (typeof output.error === 'function') {
                                output.error.apply(output, message);
                            } else if (typeof output.log === 'function') {
                                output.log.apply(output, message);
                            } else if (typeof output.write === 'function') {
                                output.write.apply(process, message + '\n');
                            }

                            return err;
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

            }).call(this, require('_process'))
        }, {
            "./Cache": 3,
            "./Error": 4,
            "./Pattern": 5,
            "./Signature": 7,
            "./utils/console": 8,
            "./utils/debug": 9,
            "./utils/noop": 13,
            "./utils/stringify": 14,
            "./utils/uuid": 15,
            "_process": 2
        }],
        7: [function(require, module, exports) {
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
            var equals = require('./utils/equal');

            var Signature = function() {
                function Signature(id, factory) {
                    _classCallCheck(this, Signature);

                    this.identifier = factory || {};
                    this.unique = id || uuid();
                }

                _createClass(Signature, [{
                    key: 'match',
                    value: function match(signature) {
                        // we only compare signature instances here
                        if (!(signature instanceof Signature)) {
                            return false;
                        }

                        // skip if they dont have the same amount of factory keys
                        if (signature.identifierKeys.length !== this.identifierKeys.length) {
                            return false;
                        }

                        // check if the general hash is the same as string comparison
                        if (signature.value !== this.value) {
                            return false;
                        }

                        // factory based deep equality check
                        return equals(signature.identifier, this.identifier);
                    }
                }, {
                    key: '_stringifyObjectLike',
                    value: function _stringifyObjectLike(obj) {
                        var self = this;

                        if (Array.isArray(obj)) {
                            return obj.join(',');
                        } else if (typeof obj === 'string') {
                            return obj;
                        } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
                            var id = '';
                            var index = 0;

                            for (var key in obj) {
                                if (!Array.isArray(obj[key]) && _typeof(obj[key]) === 'object') {
                                    id += self._stringifyObjectLike(obj[key]);
                                }

                                id += index === 0 ? '' : '&';
                                id += key + ':' + obj[key];
                                index++;
                            }

                            return id;
                        }

                        return JSON.stringify(obj);
                    }
                }, {
                    key: 'value',
                    get: function get() {
                        var length = this.identifierKeys.length;

                        var id = this._stringifyObjectLike(this.identifier);
                        id += '@' + this.unique.replace(/-/g, '') + '#' + length;

                        return id;
                    }
                }, {
                    key: 'identifierKeys',
                    get: function get() {
                        return Object.keys(this.identifier) || [];
                    }
                }]);

                return Signature;
            }();

            module.exports = Signature;

        }, {
            "./utils/equal": 10,
            "./utils/uuid": 15
        }],
        8: [function(require, module, exports) {
            (function(process) {
                'use strict';

                var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
                };

                module.exports = function() {
                    if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== undefined) {
                        return console;
                    } else if (process && typeof process.stdout.write === 'function') {
                        return process.stdout;
                    }
                };

            }).call(this, require('_process'))
        }, {
            "_process": 2
        }],
        9: [function(require, module, exports) {
            (function(process) {
                'use strict';

                var noop = require('./noop');
                var console = require('./console')();

                module.exports = function(enabled) {
                    if (enabled) {
                        if (typeof console.debug === 'function') {
                            return console.debug.bind(console);
                        } else if (typeof console.log === 'function') {
                            return console.log.bind(console);
                        } else if (process && typeof process.stdout.write === 'function') {
                            return process.stdout.write.bind(process);
                        }
                    }

                    return noop;
                };

            }).call(this, require('_process'))
        }, {
            "./console": 8,
            "./noop": 13,
            "_process": 2
        }],
        10: [function(require, module, exports) {
            'use strict';

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            var pSlice = Array.prototype.slice;
            var objectKeys = require('./keys');
            var isArguments = require('./isArguments');

            var deepEqual = module.exports = function(actual, expected, opts) {
                opts = opts || {};

                // 7.1. All identical values are equivalent, as determined by ===.
                if (actual === expected) {
                    return true;
                } else if (actual instanceof Date && expected instanceof Date) {
                    return actual.getTime() === expected.getTime();

                    // 7.3. Other pairs that do not both pass typeof value == 'object',
                    // equivalence is determined by ==.
                } else if (!actual || !expected || (typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) != 'object' && (typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) != 'object') {
                    return opts.strict ? actual === expected : actual == expected;

                    // 7.4. For all other Object pairs, including Array objects, equivalence is
                    // determined by having the same number of owned properties (as verified
                    // with Object.prototype.hasOwnProperty.call), the same set of keys
                    // (although not necessarily the same order), equivalent values for every
                    // corresponding key, and an identical 'prototype' property. Note: this
                    // accounts for both named and indexed properties on Arrays.
                } else {
                    return objEquiv(actual, expected, opts);
                }
            };

            function isUndefinedOrNull(value) {
                return value === null || value === undefined;
            }

            function isBuffer(x) {
                if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' || typeof x.length !== 'number') {
                    return false;
                }

                if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
                    return false;
                }

                if (x.length > 0 && typeof x[0] !== 'number') {
                    return false;
                }

                return true;
            }

            function objEquiv(a, b, opts) {
                var i = void 0,
                    key = void 0,
                    ka = void 0,
                    kb = void 0;

                if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
                    return false;
                }

                if (a.prototype !== b.prototype) {
                    return false;
                }

                if (isArguments(a)) {
                    if (!isArguments(b)) {
                        return false;
                    }

                    a = pSlice.call(a);
                    b = pSlice.call(b);

                    return deepEqual(a, b, opts);
                }
                if (isBuffer(a)) {
                    if (!isBuffer(b)) {
                        return false;
                    }

                    if (a.length !== b.length) {
                        return false;
                    }

                    for (i = 0; i < a.length; i++) {
                        if (a[i] !== b[i]) {
                            return false;
                        }
                    }

                    return true;
                }
                try {
                    ka = objectKeys(a);
                    kb = objectKeys(b);
                } catch (err) {
                    // happens when one is a string literal and the other isn't
                    return false;
                }
                // having the same number of owned properties (keys incorporates
                // hasOwnProperty)
                if (ka.length != kb.length) {
                    return false;
                }

                // the same set of keys (although not necessarily the same order),
                ka.sort();
                kb.sort();

                for (i = ka.length - 1; i >= 0; i--) {
                    if (ka[i] != kb[i]) {
                        return false;
                    }
                }

                // equivalent values for every corresponding key
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];

                    if (!deepEqual(a[key], b[key], opts)) {
                        return false;
                    }
                }

                return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === (typeof b === 'undefined' ? 'undefined' : _typeof(b));
            }

        }, {
            "./isArguments": 11,
            "./keys": 12
        }],
        11: [function(require, module, exports) {
            'use strict';

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            var supportsArgumentsClass = function(undefined) {
                return Object.prototype.toString.call(arguments);
            }() == '[object Arguments]';

            module.exports = supportsArgumentsClass ? supported : unsupported;

            exports.supported = supported;

            function supported(object) {
                return Object.prototype.toString.call(object) == '[object Arguments]';
            };

            exports.unsupported = unsupported;

            function unsupported(object) {
                return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
            };

        }, {}],
        12: [function(require, module, exports) {
            'use strict';

            exports = module.exports = function(undefined) {
                if (typeof Object.keys === 'function') {
                    return Object.keys;
                }

                return shim;
            }();

            exports.shim = shim;

            function shim(obj) {
                var keys = [];

                for (var key in obj) {
                    keys.push(key);
                }

                return keys;
            }

        }, {}],
        13: [function(require, module, exports) {
            "use strict";

            module.exports = function() { /* non operational method */ };

        }, {}],
        14: [function(require, module, exports) {
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
        15: [function(require, module, exports) {
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
