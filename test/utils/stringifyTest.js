var expect = require('chai').expect;
var assert = require('chai').assert;

var toString = require('../../src/utils/stringify');

describe('Vanage', function() {
    describe('Utility', function() {
        describe('stringify', function() {
            it('should stringify an object to JSON', function() {
                var obj = { simple: 'object' };
                expect(toString(obj)).to.equal('{"simple":"object"}');
            });

            it('should stringify an array to a comma seperated list', function() {
                var arr = [ 1, 2, 3, 'd', 'e', 'f' ];
                expect(toString(arr)).to.equal('1, 2, 3, d, e, f');
            });

            it('should convert a number to a simple string', function() {
                expect(toString(10)).to.equal('10');
                expect(toString(1.234)).to.equal('1.234');
            });

            it('should convert a date to the correct ISO string', function() {
                var date = new Date();
                expect(toString(date)).to.equal(date.toISOString());
            });
        });
    });
});