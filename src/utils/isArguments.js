'use strict';

const supportsArgumentsClass = (function(undefined) {
    return Object.prototype.toString.call(arguments);
})() == '[object Arguments]';

module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
    return object &&
        typeof object == 'object' &&
        typeof object.length == 'number' &&
        Object.prototype.hasOwnProperty.call(object, 'callee') &&
        !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
};