'use strict';

const equals = require('../equal');
const uuid = require('../uuid');

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
}

module.exports = Pattern;