var expect = require('chai').expect;
var assert = require('chai').assert;

var equals = require('../../src/utils/equal');

describe('Vanage', function() {
    describe('Utility', function() {
        describe('equal', function() {
            it('should check equality of two objects in the first level', function() {
                var obj1 = { amount: 10, currency: 'chf' };
                var obj2 = { amount: 10, currency: 'chf' };

                expect(equals(obj1, obj2)).to.equal(true);
            });

            it('should check deep equality of two objects', function() {
                var obj1 = { 
                    amount: 10,
                    exchange: [
                        {
                            from: 'chf',
                            to: 'eur',
                            factor: 1.2
                        }
                    ],
                    currency: {
                        short: 'chf',
                        local: 'Schweizer Franken',
                        allowed: ['eur', 'chf', 'dollar']
                    }
                };

                var obj2 = { 
                    amount: 10,
                    exchange: [
                        {
                            from: 'chf',
                            to: 'eur',
                            factor: 1.2
                        }
                    ],
                    currency: {
                        short: 'chf',
                        local: 'Schweizer Franken',
                        allowed: ['eur', 'chf', 'dollar']
                    }
                };

                expect(equals(obj1, obj2, { strict: false })).to.equal(true);
            });
        });
    });
});