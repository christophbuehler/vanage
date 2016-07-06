'use strict';

const uuid = require('./src/utils/uuid');
const Service = require('./src/Service');
const Cache = require('./src/Cache');
const Error = require('./src/Error');

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
