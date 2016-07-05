'use strict';

const uuid = require('./utils/uuid');
const noop = require('./utils/noop');
const debug = require('./utils/debug');
const str = require('./utils/stringify');
const Errors = require('./utils/errors');
const Cache = require('./Cache');
const Pattern = require('./Pattern');

class Service {
    constructor(options) {
        this.options = options || {};
        this.id = options.identifier || uuid();
        this.debug = noop;

        this._internalId = Math.random().toString(36).slice(-12);
        this._history = new Cache();
        this._cache = new Cache();
        this._delegates = [];
        this._handlers = [];
    }

    configure(options) {
        if(typeof options === 'object') {
            for(let key in options) {
                this.options[key] = options[key];
            }
        }

        this._postConfigHook();
    }

    set(key, value) {
        this.options[key] = value;
        this._postConfigHook();
    }

    register(ressource, handler) {
        const self = this;
        this.debug('Registring new handler for %s', str(ressource));

        if(typeof ressource !== 'object') {
            throw new Errors.RegisterError(`Endpoint target must be an object and not type ${typeof ressource}`);
        }

        const index = this._handlers.push({
            pattern: new Pattern(ressource),
            handler: handler,
            service: self._internalId
        });

        const registry = this._handlers[index - 1];
        this._cache.set(registry.pattern.signature(), registry);
    }

    act(target, data, resolver) {
        const self = this;

        data = data || {};
        resolver = typeof resolver === 'function' ? resolver : noop;

        if(!target) {
            throw new Errors.ActError('No target defined to act event on');
        }

        this.debug('%s for %s with data %s', data.__delegate__ ? 'Delegating Action' : 'Acting', str(target), str(data));
        this._history.set(new Pattern(target).signature(), {
            data: data,
            stamp: Date.now(),
            target: target,
            resolver: resolver
        });

        this._delegates.forEach(delegation => {
            if(delegation.pattern.match(target)) {
                self.debug('Found delegation for %s', str(target));
                delegation.delegate.apply(null, [(bubbler, delegationData) => {
                    if(typeof delegationData !== 'object') {
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

        this._handlers.forEach(factory => {
            if(factory.pattern.match(target)) {
                factory.handler.apply(null, [data, (Errors, result) => {
                    self.debug('Handling factory %s with data %s', str(target), str(data));
                    return resolver.apply(null, [Errors, result, (delegate, delegationData) => {
                        if(typeof delegationData !== 'object') {
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

    delegate(ressource, delegation) {
        const self = this;
        this.debug('Registering delegate for %s', str(ressource));

        if(typeof ressource !== 'object') {
            throw new Errors.DelegationError(`Delegation ressource must be an object and not ${typeof ressource}`);
        }

        if(typeof delegation !== 'function') {
            throw new Errors.DelegationError(`Delegators need a function to delegate, received ${typeof delegation}`);
        }

        const index = this._delegates.push({
            pattern: new Pattern(ressource),
            delegate: delegation,
            service: self._internalId
        });

        const registry = this._delegates[index - 1];
        this._cache.set(registry.pattern.signature(), registry);
    }

    _postConfigHook() {
        this.debug = debug(this.options.debug);
    }
}

module.exports = Service;