'use strict';

var findDocuments = require('./find-documents');

function findBySlug(slug, match, options, callback) {
    if (!callback && typeof options === 'function') {
        callback = options;
        options = {};
    }

    findDocuments(match, options, function onDocumentsFound(err, docs) {
        if (err) {
            return callback(err);
        }

        var i = docs.length;
        while (i--) {
            if (docs[i].slug === slug) {
                return callback(null, docs[i]);
            }
        }

        callback(new Error('Document with slug `' + slug + '` not found'));
    });
}

module.exports = findBySlug;
