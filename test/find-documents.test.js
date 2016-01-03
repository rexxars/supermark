'use strict';

var mocha = require('mocha');
var path = require('path');
var chai = require('chai');
var supermark = require('..');

var findDocuments = supermark.findDocuments;
var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

var allFixtures = path.join(__dirname, 'fixtures', '*.md');
var dupeFixtures = path.join(__dirname, 'fixtures', 'dupes', '*.md');

var noop = function() {};
var logger = { error: noop };

describe('findDocuments()', function() {
    it('finds documents and extracts correct props', function(done) {
        findDocuments(path.join(__dirname, 'fixtures', '{basic,full}.md'), function(err, docs) {
            expect(err).to.not.exist;
            expect(docs).to.have.length(2);

            expect(docs[0].title).to.equal('Why Espen shouldn\'t be allowed to stay up late');
            expect(docs[0].visibility).to.equal('Public');

            expect(docs[1].title).to.equal('Full document: The real test.');
            expect(docs[1].visibility).to.equal('Private');

            done();
        });
    });

    it('allows passing `skip` as error mode, skipping docs with errors', function(done) {
        var opts = { errorMode: 'skip', logger: logger };
        findDocuments(allFixtures, opts, function(err, docs) {
            expect(err).to.not.exist;

            expect(docs.filter(function(doc) {
                return doc.errors.length > 0;
            })).to.have.length(0);

            done();
        });
    });

    it('allows passing `silent` option, silencing logging of errors', function(done) {
        var logHandler = {
            error: function shouldNotBeCalled() {
                throw new Error('Error log handler should not be called if `silent` is true');
            }
        };

        var opts = { errorMode: 'skip', silent: true, logger: logHandler };
        findDocuments(allFixtures, opts, function(err) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('returns all errors - fatals and otherwise - by default', function(done) {
        var opts = { logger: logger };
        findDocuments(allFixtures, opts, function(err) {
            expect(err).to.exist;
            expect(err.message).to.include('contained errors:');
            done();
        });
    });

    describe('can be configured to only error on fatals', function() {
        it('does not return error on warnings', function(done) {
            var opts = { logger: logger, errorLevel: 'fatal' };
            findDocuments(path.join(__dirname, 'fixtures', 'invalid-header-prop.md'), opts, function(err, docs) {
                expect(err).to.not.exist;

                expect(docs).to.have.length(1);
                expect(docs[0].title).to.equal('Some other title');
                done();
            });
        });

        it('returns error on warnings', function(done) {
            var opts = { logger: logger, errorLevel: 'fatal' };
            findDocuments(path.join(__dirname, 'fixtures', 'no-title.md'), opts, function(err) {
                expect(err).to.exist;
                expect(err.message).to.contain('Title');
                done();
            });
        });
    });

    it('does not by default allow duplicate slugs to exist', function(done) {
        var opts = { logger: logger };
        findDocuments(dupeFixtures, opts, function(err) {
            expect(err).to.exist;
            expect(err.message).to.include('same slug');
            expect(err.message).to.include('foobar');
            done();
        });
    });

    it('can be configured to allow duplicate slugs', function(done) {
        var opts = { logger: logger, allowDuplicateSlugs: true };
        findDocuments(dupeFixtures, opts, function(err, docs) {
            expect(err).to.not.exist;
            expect(docs).to.have.length(2);
            done();
        });
    });

    it('normalized author', function(done) {
        findDocuments(path.join(__dirname, 'fixtures', '{full,basic}.md'), function(err, docs) {
            expect(err).to.not.exist;

            expect(docs[0].title).to.equal('Why Espen shouldn\'t be allowed to stay up late');
            expect(docs[0].author.name).to.equal('Espen Hovlandsdal');
            expect(docs[0].author.email).to.be.undefined;

            expect(docs[1].title).to.equal('Full document: The real test.');
            expect(docs[1].author.name).to.equal('Espen Hovlandsdal');
            expect(docs[1].author.email).to.equal('espen@hovlandsdal.com');

            done();
        });
    });
});
