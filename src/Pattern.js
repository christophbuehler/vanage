'use strict';

const Signature = require('./Signature');
const equals = require('./utils/equal');
const uuid = require('./utils/uuid');

class Pattern {
    constructor(identifier) {
        this.name = 'Vanage.Pattern';
        this.base = identifier;
        this.id = uuid();
        this.signature = new Signature(this.id, this.base).value;
    }

    get keys() {
        return Object.keys(this.base);
    }

    match(foreign) {
        return equals(this.base, foreign);
    }
}

module.exports = Pattern;