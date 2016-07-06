'use strict';

const noop = require('./noop');
const console = require('./console')();

module.exports = enabled => {
    if(enabled) {
        if(typeof console.debug === 'function') {
            return console.debug.bind(console);
        } else if (typeof console.log === 'function') {
            return console.log.bind(console);
        } else if (process && typeof process.stdout.write === 'function') {
            return process.stdout.write.bind(process);
        }
    }
    
    return noop; 
};