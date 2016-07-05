'use strict';

const ExtendableServiceError = require('../Error').ExtendableServiceError;

class DelegationError extends ExtendableServiceError {
    constructor(message) {
        super(message);

        this.setCallee('Service.delegate');
    }
}

class ActError extends ExtendableServiceError {
    constructor(message) {
        super(message);

        this.setCallee('Service.act');
    }
}

class RegisterError extends ExtendableServiceError {
    constructor(message) {
        super(message);

        this.setCallee('Service.register');
    }
}

exports.DelegationError = DelegationError;
exports.ActError = ActError;
exports.RegisterError = RegisterError;