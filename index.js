'use strict';

const uuid = require('./src/utils/uuid');
const Service = require('./src/Service');
const globalIdentifier = uuid();
const semanticGlobalIdentifier = globalIdentifier.replace(/-/g, '');

module.exports = (function(undefined) {
    function createInitialService() {
        return new Service({
            identifier: globalIdentifier,
            debug: false
        });
    }

    if(typeof window !== undefined) {
        // Special security setup for browser usage which 
        // saves the global instance to a guid in the window object
        window[semanticGlobalIdentifier] = createInitialService();
        return window[semanticGlobalIdentifier];
    } else {
        // Server uses a plain Service instance
        return createInitialService();
    }
})();
