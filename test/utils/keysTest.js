var expect = require('chai').expect;
var assert = require('chai').assert;

var keys = require('../../src/utils/keys');

describe('Vanage', function() {
    describe('Utility', function() {
        describe('keys', function() {
            it('should get the keys from an object', function() {
                var obj = { a: 1, b: 2, c: 3 };

                expect(keys(obj)).to.deep.equal(['a', 'b', 'c']);
                expect(keys(obj).length).to.equal(3);
            });

            it('should get the keys from an array', function() {
                var arr = [1, 2, 3, 4];

                expect(keys(arr)).to.deep.equal(['0', '1', '2', '3']); // indexes 
                expect(keys(arr).length).to.equal(4);
            });
        });
    });
});