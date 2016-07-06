'use strict';

class InternalBaseError extends Error {
     constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;
        this.stamp = Date.now();
        this.callee = '<unknown>';

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = new Error(message).stack; 
        }
    }

    toString() {
        return `[${this.name}#${this.callee}] ${this.message} @ ${this.stamp}`;
    }
}

class VanageError extends InternalBaseError {
    constructor(message) {
        super(message);
    }
}


class DelegationError extends InternalBaseError {
    constructor(message) {
        super(message);

        this.name = 'DelegationError';
        this.callee = 'Service.delegate';
    }
}

class ActError extends InternalBaseError {
    constructor(message) {
        super(message);

        this.name = 'ActError';
        this.callee = 'Service.act';
    }
}

class RegisterError extends InternalBaseError {
    constructor(message) {
        super(message);

        this.name = 'RegisterError';
        this.callee = 'Service.register';
    }
}

exports.InternalBaseError = InternalBaseError;
exports.VanageError = VanageError;
exports.DelegationError = DelegationError;
exports.ActError = ActError;
exports.RegisterError = RegisterError;