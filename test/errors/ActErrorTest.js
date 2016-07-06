var expect = require('chai').expect;
var assert = require('chai').assert;

var ActError = require('../../src/Error').ActError;

describe('Vanage', function() {
    describe('Errors', function() {
        describe('ActError', function() {
            it('should be a customized throwable error', function() {
                expect(function () {
                    throw new ActError('Error occured');
                }).to.throw(ActError);
            });

            it('should have the right properties', function() {
                var message = 'Action error mistake something';
                var error = new ActError(message);

                expect(error.message).to.equal(message);
                expect(error.name).to.equal('ActError');
            });
        });
    });
});