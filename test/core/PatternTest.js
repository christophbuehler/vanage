var expect = require('chai').expect;
var assert = require('chai').assert;

var Pattern = require('../../src/Pattern');

function generateSignature(pattern) {
    var length = pattern.keys.length;

    var index = 0;
    var id = '';

    for(var key in pattern.base) {
        id += index === 0 ? '' : '&'; 
        id += `${key}:${pattern.base[key]}`;
        index++;
    }

    id += `@${pattern.id.replace(/-/g, '')}#${length}`;
    return id;
}

describe('Vanage', function() {
    describe('Pattern', function() {
        it('should create a unique signature', function() {
            var patt = new Pattern({
                role: 'user',
                action: 'create'
            });

            expect(patt.signature).to.be.a('string');
            expect(patt.signature).to.equal(generateSignature(patt));
        });

        it('should have a method to get the base target keys', function() {
            var patt = new Pattern({
                destination: 'home',
                action: 'create:dir'
            });

            expect(patt.keys).to.deep.equal(['destination', 'action']);
        });

        it('should match another vanage target as object', function() {
            var patt = new Pattern({
                target: 'base',
                event: 'test:mocha',
                role: 'admin'
            });

            var result = patt.match({
                target: 'base',
                event: 'test:mocha',
                role: 'admin'
            });

            expect(result).to.equal(true);
        });
    });
});