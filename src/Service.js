'use strict';

const uuid = require('./utils/uuid');
const noop = require('./utils/noop');
const str = require('./utils/stringify');
const ERR = require('./utils/errors');
const Cache = require('./Cache');
const Pattern = require('./Pattern');

class Service {
    constructor(options) {
        this.options = options || {};
        this.id = options.identifier || uuid();

        this._internalId = Math.random().toString(36).slice(-12);
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
    }

    register(ressource, handler) {
        const self = this;
        console.debug('Registring new handler for %s', str(ressource));

        if(typeof ressource !== 'object') {
            throw new ERR.RegisterError('Endpoint target must be an object and not %s', typeof ressource);
        }

        let index = this._handlers.push({
            pattern: new Pattern(ressource),
            handler: handler,
            service: self._internalId
        });

        index -= 1;
        this._cache.set(this._handlers[index].pattern.id, this._handlers[index]);
    }

    act(target, data, resolver) {
        const self = this;

        data = data || {};
        resolver = typeof resolver === 'function' ? resolver : noop;

        if(!target) {
            throw new ERR.ActError('No target defined to act event');
        }

        console.debug('%s for %s with data %s', data.__delegate__ ? 'Delegating Action' : 'Acting', str(target), str(data));

        this._delegates.forEach(delegation => {
            if(delegation.pattern.match(target)) {
                console.debug('Found delegation for %s', str(target));
                delegation.delegate.apply(null, [(bubbler, delegationData) => {
                    if(typeof delegationData !== 'object') {
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

        this._handlers.forEach(factory => {
            if(factory.pattern.match(target)) {
                factory.handler.apply(null, [data, (err, result) => {
                    return resolver.apply(null, [err, result, (delegate, delegationData) => {
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
        console.debug('Registering delegate for %s', str(ressource));

        if(typeof ressource !== 'object') {
            throw new ERR.DelegationError('Delegation ressource must be an object and not %s', typeof ressource);
        }

        if(typeof delegation !== 'function') {
            throw new ERR.DelegationError('Delegators need a function to delegate, received %s', typeof delegation);
        }

        let index = this._delegates.push({
            pattern: new Pattern(ressource),
            delegate: delegation,
            service: self._internalId
        });

        index -= 1;
        this._cache.set(this._delegates[index].pattern.id, this._delegates[index]);
    }
}

module.exports = Service;