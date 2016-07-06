'use strict';

class Cache {
    constructor() {
        this.name = 'Vanage.Cache';
        this.internals = {};
        this.dirty = false;
    }

    get size() {
        return this.entries.length;
    }

    get entries() {
        return Object.keys(this.internals);
    }

    set(key, value) {
        this.internals[key] = value;
        this.dirty = true;
    }

    get(key) {
        return this.internals[key];
    }

    flush() {
        this.internals = {};
    }

    dump() {
        return this.internals;
    }

    isDirty() {
        return this.dirty;
    }
}

module.exports = Cache;