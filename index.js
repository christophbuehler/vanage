'use strict';

const uuid = require('./src/utils/uuid');
const Service = require('./src/Service');
const Cache = require('./src/Cache');

module.exports = (function(undefined) {
    return {
        Cache: Cache,
        Service: Service,
        create: settings => {
            settings = settings || {
                debug: false
            };

            return new Service(settings);
        },
        generateId: uuid
    }
})();
