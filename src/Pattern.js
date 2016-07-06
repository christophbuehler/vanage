'use strict';

const Signature = require('./Signature');
const equals = require('./utils/equal');
const uuid = require('./utils/uuid');

class Pattern {
    constructor(factory) {
        this.name = 'Vanage.Pattern';
        this.base = factory;
        this.unique = uuid();
        this.id = new Signature(this.unique, this.base);
    }

    get signature() {
        return this.id.value;
    }

    get keys() {
        return Object.keys(this.base);
    }

    match(foreign) {
        return equals(this.base, foreign);
    }
}

module.exports = Pattern;