var expect = require('chai').expect;
var assert = require('chai').assert;

var ServiceError = require('../../src/Error').ServiceError;
var ExtendableServiceError = require('../../src/Error').ExtendableServiceError;

describe('Vanage', function() {
    describe('Errors', function() {
        describe('ServiceError', function() {
            it('should be a base error which inherits from ExtendableServiceError', function() {
                var err = new ServiceError('a simple message');
                expect(err).to.be.an.instanceof(ExtendableServiceError);
            });

            it('should have a message property with the error content', function() {
                var err = new ServiceError('just a simple error');

                expect(err).to.have.property('message');
                expect(err.message).to.equal('just a simple error');
            });

            it('should be able to set the callee of the error', function() {
                var err = new ServiceError('another simple error message');
                err.setCallee('MochaTestSuite');

                expect(err).to.have.property('callee');
                expect(err.callee).to.equal('MochaTestSuite');
            });
        });
    });
});