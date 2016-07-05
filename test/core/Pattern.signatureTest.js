var expect = require('chai').expect;
var assert = require('chai').assert;

var Pattern = require('../../src/Pattern');

describe('Service', function() {
    describe('Pattern', function() {
        it('should create a unique signature', function() {
            var patt = new Pattern({
                role: 'user',
                action: 'create'
            });

            function generateSignature(pattern) {
                var length = Object.keys(pattern.base).length;

                var index = 0;
                var id = '';

                for(var key in pattern.base) {
                    id += index === 0 ? '' : '&'; 
                    id += `${key}=${pattern.base[key]}`;
                    index++;
                }

                id += `@${pattern.id.replace(/-/g, '')}#${length}`;
                return id;
            }

            expect(patt.signature()).to.be.a('string');
            expect(patt.signature()).to.equal(generateSignature(patt));
        });
    });
});