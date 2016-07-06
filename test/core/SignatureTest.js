var expect = require('chai').expect;
var assert = require('chai').assert;

var uuid = require('../../src/utils/uuid');
var Signature = require('../../src/Signature');

describe('Vanage', function() {
    describe('Signature', function() {
        it('should be a string signature value', function() {
            var sign = new Signature(uuid(), {});
            expect(sign.value).to.be.a('string');
        });

        it('should generate a combination of value, length and id', function() {
            var id = uuid();
            var target = { key: 'value' };
            var sign = new Signature(id, target);

            expect(sign.value).to.be.a('string');
            expect(sign.value).to.equal('key:value@' + id.replace(/-/g, '') + '#' + Object.keys(target).length);
        });
    });
});