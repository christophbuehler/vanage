var expect = require('chai').expect;
var assert = require('chai').assert;

var uuid = require('../../src/utils/uuid');

describe('Vanage', function() {
    describe('Utility', function() {
        describe('uuid', function() {
            it('should create a new stringified ID', function() {
                expect(uuid()).to.be.a('string');
            });

            it('should create uniques while generating 5\'000 ID\'s', function() {
                var i = 0;
                var id = null;
                var ids = [];
                var areUnique = true;

                while(i < 5000) {
                    id = uuid();
                    if(ids.indexOf(id) > 0) {
                        areUnique = false;
                    }

                    i++;
                }

                expect(areUnique).to.equal(true);
            });
        });
    });
});