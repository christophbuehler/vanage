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
        g.Service = f()
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
            var globalIdentifier = uuid();
            var semanticGlobalIdentifier = globalIdentifier.replace(/-/g, '');

            module.exports = function() {
                window[semanticGlobalIdentifier] = new Service({
                    identifier: globalIdentifier,
                    debug: false
                });

                return window[semanticGlobalIdentifier];
            }();

        }, {
            "./src/Service": 5,
            "./src/utils/uuid": 10
        }],
        2: [function(require, module, exports) {
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

                    this.data = {};
                }

                _createClass(Cache, [{
                    key: 'set',
                    value: function set(key, value) {
                        this.data[key] = value;
                    }
                }, {
                    key: 'get',
                    value: function get(key) {
                        return this.data[key];
                    }
                }]);

                return Cache;
            }();

            module.exports = Cache;

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
                }]);

                return Pattern;
            }();

            module.exports = Pattern;

        }, {
            "./utils/equal": 6,
            "./utils/uuid": 10
        }],
        5: [function(require, module, exports) {
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
            var str = require('./utils/stringify');
            var ERR = require('./utils/errors');
            var Cache = require('./Cache');
            var Pattern = require('./Pattern');

            var Service = function() {
                function Service(options) {
                    _classCallCheck(this, Service);

                    this.options = options || {};
                    this.id = options.identifier || uuid();

                    this._internalId = Math.random().toString(36).slice(-12);
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
                    }
                }, {
                    key: 'register',
                    value: function register(ressource, handler) {
                        var self = this;
                        console.debug('Registring new handler for %s', str(ressource));

                        if ((typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource)) !== 'object') {
                            throw new ERR.RegisterError('Endpoint target must be an object and not %s', typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource));
                        }

                        var index = this._handlers.push({
                            pattern: new Pattern(ressource),
                            handler: handler,
                            service: self._internalId
                        });

                        index -= 1;
                        this._cache.set(this._handlers[index].pattern.id, this._handlers[index]);
                    }
                }, {
                    key: 'act',
                    value: function act(target, data, resolver) {
                        var self = this;

                        data = data || {};
                        resolver = typeof resolver === 'function' ? resolver : noop;

                        if (!target) {
                            throw new ERR.ActError('No target defined to act event');
                        }

                        console.debug('%s for %s with data %s', data.__delegate__ ? 'Delegating Action' : 'Acting', str(target), str(data));

                        this._delegates.forEach(function(delegation) {
                            if (delegation.pattern.match(target)) {
                                console.debug('Found delegation for %s', str(target));
                                delegation.delegate.apply(null, [function(bubbler, delegationData) {
                                    if ((typeof delegationData === 'undefined' ? 'undefined' : _typeof(delegationData)) !== 'object') {
                                        delegationData = data;
                                    } else {
                                        delegationData.origin = data;
                                    }

                                    console.debug('Delegate target %s to %s', str(target), str(bubbler));
                                    delegationData.__delegate__ = target;
                                    self.act(bubbler, delegationData, resolver);
                                }]);
                            }
                        });

                        this._handlers.forEach(function(factory) {
                            if (factory.pattern.match(target)) {
                                factory.handler.apply(null, [data, function(err, result) {
                                    return resolver.apply(null, [err, result, function(delegate, delegationData) {
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
                        console.debug('Registering delegate for %s', str(ressource));

                        if ((typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource)) !== 'object') {
                            throw new ERR.DelegationError('Delegation ressource must be an object and not %s', typeof ressource === 'undefined' ? 'undefined' : _typeof(ressource));
                        }

                        if (typeof delegation !== 'function') {
                            throw new ERR.DelegationError('Delegators need a function to delegate, received %s', typeof delegation === 'undefined' ? 'undefined' : _typeof(delegation));
                        }

                        var index = this._delegates.push({
                            pattern: new Pattern(ressource),
                            delegate: delegation,
                            service: self._internalId
                        });

                        index -= 1;
                        this._cache.set(this._delegates[index].pattern.id, this._delegates[index]);
                    }
                }]);

                return Service;
            }();

            module.exports = Service;

        }, {
            "./Cache": 2,
            "./Pattern": 4,
            "./utils/errors": 7,
            "./utils/noop": 8,
            "./utils/stringify": 9,
            "./utils/uuid": 10
        }],
        6: [function(require, module, exports) {
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
        7: [function(require, module, exports) {
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

                    _this.setCallee('Service.delegate');
                    return _this;
                }

                return DelegationError;
            }(ExtendableServiceError);

            var ActError = function(_ExtendableServiceErr2) {
                _inherits(ActError, _ExtendableServiceErr2);

                function ActError(message) {
                    _classCallCheck(this, ActError);

                    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ActError).call(this, message));

                    _this2.setCallee('Service.act');
                    return _this2;
                }

                return ActError;
            }(ExtendableServiceError);

            var RegisterError = function(_ExtendableServiceErr3) {
                _inherits(RegisterError, _ExtendableServiceErr3);

                function RegisterError(message) {
                    _classCallCheck(this, RegisterError);

                    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(RegisterError).call(this, message));

                    _this3.setCallee('Service.register');
                    return _this3;
                }

                return RegisterError;
            }(ExtendableServiceError);

            exports.DelegationError = DelegationError;
            exports.ActError = ActError;
            exports.RegisterError = RegisterError;

        }, {
            "../Error": 3
        }],
        8: [function(require, module, exports) {
            "use strict";

            module.exports = function() { /* non operational method */ };

        }, {}],
        9: [function(require, module, exports) {
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
        10: [function(require, module, exports) {
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
//# sourceMappingURL=service.js.map
