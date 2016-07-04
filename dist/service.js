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

            var uuid = require('./src/uuid');
            var Service = require('./src/common/Service');

            module.exports = new Service();

        }, {
            "./src/common/Service": 4,
            "./src/uuid": 6
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

            var equals = require('../equal');
            var uuid = require('../uuid');

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
            "../equal": 5,
            "../uuid": 6
        }],
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

            var uuid = require('../uuid');
            var Cache = require('./Cache');
            var Pattern = require('./Pattern');

            var Service = function() {
                function Service(options) {
                    _classCallCheck(this, Service);

                    this.options = options || {};
                    this.id = uuid();

                    this._cache = new Cache();
                    this._delegates = [];
                    this._handlers = [];
                }

                _createClass(Service, [{
                    key: 'register',
                    value: function register(ressource, handler) {
                        var index = this._handlers.push({
                            pattern: new Pattern(ressource),
                            handler: handler
                        });

                        this._cache.set(this._handlers[index].pattern.id, this._handlers[index]);
                    }
                }, {
                    key: 'act',
                    value: function act(target, data, resolver) {
                        this._delegates.forEach(function(delegate) {
                            if (delegate.pattern.match(target)) {
                                delegate.handler.apply(null, data, function() {
                                    /* delegate callback fn */
                                });
                            }
                        });

                        this._handlers.forEach(function(delegate) {
                            if (delegate.pattern.match(target)) {
                                delegate.handler.apply(null, data, function() {
                                    /* callback fn */
                                });
                            }
                        });
                    }
                }, {
                    key: 'delegate',
                    value: function delegate(ressource, delegation) {
                        var index = this._delegates.push({
                            pattern: new Pattern(ressource),
                            delegate: delegation
                        });

                        this._cache.set(this._delegates[index].pattern.id, this._delegates[index]);
                    }
                }]);

                return Service;
            }();

            module.exports = Service;

        }, {
            "../uuid": 6,
            "./Cache": 2,
            "./Pattern": 3
        }],
        5: [function(require, module, exports) {
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
        6: [function(require, module, exports) {
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
