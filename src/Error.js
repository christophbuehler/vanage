'use strict';

class ExtendableServiceError extends Error {
     constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = new Error(message).stack; 
        }
    }

    setCallee(callee) {
        this.callee = callee;
    }
}

class ServiceError extends ExtendableServiceError {
    constructor(message) {
        super(message);
    }
}

exports.ExtendableServiceError = ExtendableServiceError;
exports.ServiceError = ServiceError;