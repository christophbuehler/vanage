'use strict';

const uuid = require('../uuid');
const Cache = require('./Cache');
const Pattern = require('./Pattern');

class Service {
    constructor(options) {
        this.options = options || {};
        this.id = uuid();

        this._cache = new Cache();
        this._delegates = [];
        this._handlers = [];
    }

    register(ressource, handler) {
        let index = this._handlers.push({
            pattern: new Pattern(ressource),
            handler: handler
        });

        this._cache.set(this._handlers[index].pattern.id, this._handlers[index]);
    }

    act(target, data, resolver) {
        this._delegates.forEach(delegate => {
            if(delegate.pattern.match(target)) {
                delegate.handler.apply(null, data, () => {
                    /* delegate callback fn */
                });
            }
        });

        this._handlers.forEach(delegate => {
            if(delegate.pattern.match(target)) {
                delegate.handler.apply(null, data, () => {
                    /* callback fn */
                });
            }
        });
    }

    delegate(ressource, delegation) {
        let index = this._delegates.push({
            pattern: new Pattern(ressource),
            delegate: delegation
        });

        this._cache.set(this._delegates[index].pattern.id, this._delegates[index]);
    }
}

module.exports = Service;