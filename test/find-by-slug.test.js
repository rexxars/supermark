'use strict';

var mocha = require('mocha');
var path = require('path');
var chai = require('chai');
var supermark = require('..');

var findBySlug = supermark.findBySlug;
var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

var noop = function() {};
var logger = { error: noop };

describe('findBySlug()', function() {
    it('finds document and extracts correct props', function(done) {
        var slug = 'why-espen-shouldnt-be-allowed-to-stay-up-late';
        var opts = { errorMode: 'skip', logger: logger };

        findBySlug(slug, path.join(__dirname, 'fixtures', '*.md'), opts, function(err, doc) {
            expect(err).to.not.exist;

            expect(doc.title).to.equal('Why Espen shouldn\'t be allowed to stay up late');
            expect(doc.slug).to.equal('why-espen-shouldnt-be-allowed-to-stay-up-late');

            done();
        });
    });

    it('finds document with no options passed', function(done) {
        var slug = 'why-espen-shouldnt-be-allowed-to-stay-up-late';
        findBySlug(slug, path.join(__dirname, 'fixtures', 'basic.md'), function(err, doc) {
            expect(err).to.not.exist;

            expect(doc.title).to.equal('Why Espen shouldn\'t be allowed to stay up late');
            expect(doc.slug).to.equal('why-espen-shouldnt-be-allowed-to-stay-up-late');

            done();
        });
    });

    it('returns error if slug not found', function(done) {
        var slug = 'aint-no-document-with-this-title';
        findBySlug(slug, path.join(__dirname, '*.md'), function(err) {
            expect(err).to.exist;
            expect(err.message).to.equal('Document with slug `' + slug + '` not found');

            done();
        });
    });

    it('propagates errors from findDocument', function(done) {
        var slug = 'some-other-title';
        var opts = { silent: true };
        findBySlug(slug, path.join(__dirname, 'fixtures', 'invalid-header-prop.md'), opts, function(err) {
            expect(err).to.exist;
            expect(err.message).to.contain('contained errors');

            done();
        });
    });
});
