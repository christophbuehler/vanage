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

        it('should match only the 100% same signature and not a copy osw.', function() {
            var id = uuid();

            var s1 = new Signature(id, { key: 'test' });
            var s2 = new Signature(id, { key: 'test' });
            var s3 = new Signature(uuid(), { key: 'test' });
            var cs1 = JSON.parse(JSON.stringify(s1));

            expect(s1.match(s2)).to.equal(true);
            expect(s1.match(s3)).to.equal(false);
            expect(s2.match(s3)).to.equal(false);
            expect(s1.match(cs1)).to.equal(false); // copy matching
        });
    });
});