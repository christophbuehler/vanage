'use strict';

module.exports = function deepEqual(o, p, loose) {
    let i;
    
    const lkeys = Object.keys(o).sort();
    const rkeys = Object.keys(p).sort();

    loose = loose === true ? true : false;

    if (lkeys.length !== rkeys.length) {
        return false; // not the same nr of keys
    }

    if (lkeys.join('') !== rkeys.join('')) {
        return false; // different keys
    }

    for (i = 0; i < lkeys.length; ++i) {
        if (o[lkeys[i]] instanceof Array) {
            if (!(p[lkeys[i]] instanceof Array)) {
                return false;
            }

            // if (compareObjects(o[lkeys[i]], p[lkeys[i]] === false) return false
            // would work, too, and perhaps is a better fit, still, this is easy, too
            if (p[lkeys[i]].sort().join('') !== o[lkeys[i]].sort().join('')) {
                return false;
            }
        } else if (o[lkeys[i]] instanceof Date) {
            if (!(p[lkeys[i]] instanceof Date)) {
                return false;
            }

            if ((''+o[lkeys[i]]) !== (''+p[lkeys[i]])) {
                return false;
            }
        } else if (o[lkeys[i]] instanceof Function) {
            if (!(p[lkeys[i]] instanceof Function)) {
                return false;
            }
            // ignore functions, or check them regardless?
        } else if (o[lkeys[i]] instanceof Object) {
            if (!(p[lkeys[i]] instanceof Object)) {
                return false;
            }

            if (o[lkeys[i]] === o) { // self reference?
                if (p[lkeys[i]] !== p) {
                    return false;
                }
            } else if (compareObjects(o[lkeys[i]], p[lkeys[i]]) === false) {
                return false; // WARNING: does not deal with circular refs other than
            }
        }

        if(loose) {
            if (o[lkeys[i]] != p[lkeys[i]]) {
                return false;
            }
        } else {
            if (o[lkeys[i]] !== p[lkeys[i]]) {
                return false; // not the same value
            }
        }
    }

    return true;
}