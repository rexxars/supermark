'use strict';

var mocha = require('mocha');

var describe = mocha.describe;
var it = mocha.it;

describe('foo', function() {
    it('should something', function(done) {
        setImmediate(done);
    });
});
