'use strict';

const uuid = require('./src/utils/uuid');
const Service = require('./src/Service');
const globalIdentifier = uuid();
const semanticGlobalIdentifier = globalIdentifier.replace(/-/g, '');

module.exports = (function() {
    window[semanticGlobalIdentifier] = new Service({
        identifier: globalIdentifier,
        debug: false
    });
    
    return window[semanticGlobalIdentifier];
})();
