var expect = require('chai').expect;
var assert = require('chai').assert;

var VanageError = require('../../src/Error').VanageError;
var InternalBaseError = require('../../src/Error').InternalBaseError;

describe('Vanage', function() {
    describe('Errors', function() {
        describe('VanageError', function() {
            it('should be a base error which inherits from InternalBaseError', function() {
                var err = new VanageError('a simple message');
                expect(err).to.be.an.instanceof(InternalBaseError);
            });

            it('should have a message property with the error content', function() {
                var err = new VanageError('just a simple error');

                expect(err).to.have.property('message');
                expect(err.message).to.equal('just a simple error');
            });

            it('should be able to set the callee of the error', function() {
                var err = new VanageError('another simple error message');
                expect(err.callee).to.equal('<unknown>');

                err.callee = 'MochaTestSuite';
                expect(err).to.have.property('callee');
                expect(err.callee).to.equal('MochaTestSuite');
            });
        });
    });
});