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
}

module.exports = Pattern;