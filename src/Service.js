'use strict';

const uuid = require('./utils/uuid');
const noop = require('./utils/noop');
const debug = require('./utils/debug');
const str = require('./utils/stringify');
const output = require('./utils/console');

const Error = require('./Error');
const Cache = require('./Cache');
const Pattern = require('./Pattern');
const Signature = require('./Signature');

class Service {
    constructor(options) {
        this.name = 'Vanage.Service';
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

    find(factory) {
        let tuple = {
            delegates: [],
            handlers: []
        };

        this._handlers.forEach(handler => {
            if(handler.pattern.match(factory)) {
                tuple.handlers.push(handler);
            }
        });

        this._delegates.forEach(delegate => {
            if(delegate.pattern.match(factory)) {
                tuple.delegates.push(delegate);
            }
        });

        return tuple;
    }

    queue(actions, callback) {
        let errors = [];
        let results = [];

        callback = callback || noop;

        if(!Array.isArray(actions)) {
            return this.fail(new TypeError(`Queue needs an array with actions and not typeof ${typeof actions}`));
        }

        actions.forEach((action, index) => {
            results.push((err, result) => {
                if(err) {
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

    unregister(signature) {
        const self = this;
        let successfull = false;

        if(!(signature instanceof Signature)) {
            return this.fail(new TypeError(`Cannot unregister by ${typeof signature}, signature needed`));
        }

        this._handlers.forEach((handler, index) => {
            if(handler.pattern.id.match(signature)) {
                debug(`Found handler to unregister with sign ${handler.pattern.signature}`);
                self._handlers.splice(index, 1);
                return successfull = true;
            }
        });

        this._delegates.forEach((delegate, index) => {
            if(delegate.pattern.id.match(signature)) {
                debug(`Found delegate to unregister with sign ${delegate.pattern.signature}`);
                self._delegates.splice(index, 1);
                return successfull = true;
            }
        });

        return successfull;
    }

    register(ressource, handler) {
        const self = this;
        this.debug('Registring new handler for %s', str(ressource));

        if(typeof ressource !== 'object') {
            return this.fail(new TypeError(`Endpoint target must be an object and not type ${typeof ressource}`));
        }

        const factory = {
            pattern: new Pattern(ressource),
            handler: handler,
            rootService: self._internalId
        };

        const index = this._handlers.push(factory);
        const registry = this._handlers[index - 1];
        this._cache.set(registry.pattern.signature, registry);

        return factory.pattern.id;
    }

    delegate(ressource, delegation) {
        const self = this;
        this.debug('Registering delegate for %s', str(ressource));

        if(typeof ressource !== 'object') {
            return this.fail(new TypeError(`Delegation ressource must be an object and not ${typeof ressource}`));
        }

        if(typeof delegation !== 'function') {
            return this.fail(new TypeError(`Delegators need a function to delegate, received ${typeof delegation}`));
        }

        const factory = {
            pattern: new Pattern(ressource),
            delegate: delegation,
            rootService: self._internalId
        };

        const index = this._delegates.push(factory);
        const registry = this._delegates[index - 1];
        this._cache.set(registry.pattern.signature, registry);

        return factory.pattern.id;
    }

    act(target, data, resolver) {
        const self = this;

        data = data || {};
        resolver = typeof resolver === 'function' ? resolver : noop;

        if(!target) {
            return this.fail(new Error.ActError('No target defined to act event on'));
        }

        this.debug('%s for %s with data %s', data.__delegate__ ? 'Delegating Action' : 'Acting', str(target), str(data));
        this._history.set(new Pattern(target).signature, {
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
                        delegationData = {};
                    }
                    
                    // TODO: Ev. Mixin with previous origin via Object.assign?
                    delegationData.origin = data;

                    self.debug('Delegate target %s to %s', str(target), str(bubbler));
                    delegationData.__delegate__ = target;
                    self.act(bubbler, delegationData, resolver);
                }]);
            }
        });

        this._handlers.forEach(factory => {
            if(factory.pattern.match(target)) {
                factory.handler.apply(null, [data, (error, result) => {
                    self.debug('Handling factory %s with data %s', str(target), str(data));
                    return resolver.apply(null, [error, result, (delegate, delegationData) => {
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

    fail(err) {
        let message = '';
        message += `[${err.name}#${err.callee || 'Callee::<unknown>'}]`;
        message += `${err.message} ${err.stamp ? `@ ${err.stamp}` : ''}`;

        if(typeof output.error === 'function') {
            output.error.apply(output, message);
        } else if (typeof output.log === 'function') {
            output.log.apply(output, message);
        } else if (typeof output.write === 'function') {
            output.write.apply(process, message + '\n');
        }

        return err;
    }

    _postConfigHook() {
        this.debug = debug(this.options.debug);
    }
}

module.exports = Service;