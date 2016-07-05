var expect = require('chai').expect;
var assert = require('chai').assert;

var DelegationError = require('../../src/utils/errors').DelegationError;

describe('Service', function() {
    describe('Errors', function() {
        describe('DelegationError', function() {
            it('should be a customized throwable error', function() {
                expect(function () {
                    throw new DelegationError('Error occured');
                }).to.throw(DelegationError);
            });

            it('should have the right properties', function() {
                var message = 'Action error mistake something';
                var error = new DelegationError(message);

                expect(error.message).to.equal(message);
                expect(error.name).to.equal('DelegationError');
            });
        });
    });
});