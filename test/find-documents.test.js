'use strict';

var mocha = require('mocha');
var path = require('path');
var chai = require('chai');
var supermark = require('..');

var findDocuments = supermark.findDocuments;
var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe('findDocuments()', function() {
    it('finds single document and extracts correct props', function(done) {
        findDocuments(path.join(__dirname, 'fixtures', '{basic,full}.md'), function(err, res) {
            expect(err).to.not.exist;
            done();
        });
    });
});
