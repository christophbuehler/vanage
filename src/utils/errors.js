'use strict';

const ExtendableServiceError = require('../Error').ExtendableServiceError;

class DelegationError extends ExtendableServiceError {
    constructor(message) {
        super(message);

        this.name = 'DelegationError';
        this.callee = 'Service.delegate';
    }
}

class ActError extends ExtendableServiceError {
    constructor(message) {
        super(message);

        this.name = 'ActError';
        this.callee = 'Service.act';
    }
}

class RegisterError extends ExtendableServiceError {
    constructor(message) {
        super(message);

        this.name = 'RegisterError';
        this.callee = 'Service.register';
    }
}

exports.DelegationError = DelegationError;
exports.ActError = ActError;
exports.RegisterError = RegisterError;