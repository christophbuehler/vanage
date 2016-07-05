'use strict';

const equals = require('./utils/equal');
const uuid = require('./utils/uuid');

class Pattern {
    constructor(identifier) {
        this.base = identifier;
        this.id = uuid();
    }

    match(foreign) {
        return equals(this.base, foreign);
    }

    keys() {
        return Object.keys(this.base);
    }

    signature() {
        const length = this.keys().length;

        let index = 0;
        let id = '';

        for(let key in this.base) {
            id += index === 0 ? '' : '&'; 
            id += `${key}=${this.base[key]}`;
            index++;
        }

        id += `@${this.id.replace(/-/g, '')}#${length}`;
        return id;
    }
}

module.exports = Pattern;