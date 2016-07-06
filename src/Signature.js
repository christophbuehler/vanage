'use strict';

const uuid = require('./utils/uuid');
const equals = require('./utils/equal');

class Signature {
    constructor(id, factory) {
        this.identifier = factory || {};
        this.unique = id || uuid();
    }

    get value() {
        const length = this.identifierKeys.length;

        let id = this._stringifyObjectLike(this.identifier);
        id += `@${this.unique.replace(/-/g, '')}#${length}`;

        return id;
    }

    get identifierKeys() {
        return Object.keys(this.identifier) || [];
    }

    match(signature) {
        // we only compare signature instances here
        if(!(signature instanceof Signature)) {
            return false;
        }

        // skip if they dont have the same amount of factory keys
        if(signature.identifierKeys.length !== this.identifierKeys.length) {
            return false;
        }

        // check if the general hash is the same as string comparison
        if(signature.value !== this.value) {
            return false;
        }

        // factory based deep equality check
        return equals(signature.identifier, this.identifier);
    }

    _stringifyObjectLike(obj) {
        const self = this;

        if(Array.isArray(obj)) {
            return obj.join(',');
        } else if (typeof obj === 'string') {
            return obj;
        } else if (typeof obj === 'object') {
            let id = '';
            let index = 0;

            for(let key in obj) {
                if(!Array.isArray(obj[key]) && typeof obj[key] === 'object') {
                    id += self._stringifyObjectLike(obj[key]);
                }

                id += index === 0 ? '' : '&'; 
                id += `${key}:${obj[key]}`;
                index++;
            }

            return id;
        }

        return JSON.stringify(obj);
    }
}

module.exports = Signature;