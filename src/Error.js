'use strict';

class InternalBaseError extends Error {
     constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;
        this.stamp = Date.now();

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = new Error(message).stack; 
        }
    }

    set callee(callee) {
        if(typeof callee === 'string') {
            this.callee = callee;
        }
    }

    get callee() {
        return 'Callee::' + this.callee;
    }
}

class VanageError extends InternalBaseError {
    constructor(message) {
        super(message);
    }

    toString() {
        return `[${this.name}#${this.callee || '<unknown>'}] ${this.message} @ ${this.stamp}`;
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
exports.ServiceError = VanageError;
exports.DelegationError = DelegationError;
exports.ActError = ActError;
exports.RegisterError = RegisterError;