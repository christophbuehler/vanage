var expect = require('chai').expect;
var assert = require('chai').assert;

var RegisterError = require('../../src/utils/errors').RegisterError;

describe('Service', function() {
    describe('Errors', function() {
        describe('RegisterError', function() {
            it('should be a customized throwable error', function() {
                expect(function () {
                    throw new RegisterError('Error occured');
                }).to.throw(RegisterError);
            });

            it('should have the right properties', function() {
                var message = 'Action error mistake something';
                var error = new RegisterError(message);

                expect(error.message).to.equal(message);
                expect(error.name).to.equal('RegisterError');
            });
        });
    });
});