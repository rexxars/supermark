'use strict';

var getSlug = require('speakingurl');

var authorRegex = /^(.*?) <(.*?@.*?)>$/;

function normalize(doc) {
    if (!doc.slug) {
        doc.slug = getSlug(doc.title, {
            custom: { '\'': '' }
        });
    }

    if (!doc.date) {
        doc.date = doc.fileCreated;
    }

    if (!(doc.date instanceof Date)) {
        doc.date = new Date(doc.date);
    }

    var author = doc.author && doc.author.trim().match(authorRegex);
    if (author) {
        doc.author = {
            name: author[1],
            email: author[2]
        };
    }

    if (!doc.status) {
        doc.status = 'Published';
    }

    if (!doc.visibility) {
        doc.visibility = 'Public';
    }

    if (!doc.tags) {
        doc.tags = [];
    }

    if (!doc.categories) {
        doc.categories = [];
    }

    return doc;
}

module.exports = normalize;
