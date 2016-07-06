var expect = require('chai').expect;
var assert = require('chai').assert;

var Cache = require('../../src/Cache');
var cache = null;

describe('Vanage', function() {
    describe('Cache', function() {
        beforeEach(function() {
            cache = new Cache();
        });

        it('should create an empty cache', function() {
            expect(cache.size).to.equal(0);
            expect(cache.entries.length).to.equal(0);
        });

        it('should have a set method which adds new entries', function() {
            cache.set('key', 'value');
            cache.set('test', [0, 1, undefined, { a: 'b' }]);

            expect(cache.size).to.equal(2);
            expect(cache.entries).to.deep.equal(['key', 'test']);
        });

        it('should have a flush method to remove all entries', function() {
            cache.set(0, 22);
            cache.set('test', ['any', 'key', null]);
            expect(cache.size).to.equal(2);

            cache.flush();
            expect(cache.size).to.equal(0);
            expect(cache.entries).to.deep.equal([]);
        });

        it('should know when the cache is dirty and changes happened', function() {
            expect(cache.isDirty()).to.equal(false);

            cache.set('hey there!', 29123);
            expect(cache.isDirty()).to.equal(true);
        });

        it('should be dirty when the cache has been flushed to emit changes', function() {
            expect(cache.isDirty()).to.equal(false);

            cache.set('yo, wassup?', 'nothing');
            cache.flush();
            expect(cache.isDirty()).to.equal(true);
        });

        it('should have the ability to dump the whole cache object', function() {
            cache.set(123, 456789);
            cache.set('key', { any: 'value' });
            expect(cache.dump()).to.deep.equal({
                123: 456789,
                key: { any: 'value' }
            });
        });
    });
});