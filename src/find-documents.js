'use strict';

var fs = require('fs');
var glob = require('glob');
var async = require('async');
var partial = require('lodash.partial');
var extract = require('supermark-extract');
var normalizeDoc = require('./normalize');

var defaultOptions = {
    allowDuplicateSlugs: false,
    errorMode: 'return',
    errorLevel: 'warn',
    silent: false
};

var globOptions = {
    realpath: true
};

function findDocuments(match, options, callback) {
    if (typeof options === 'function' && !callback) {
        callback = options;
        options = {};
    }

    var opts = Object.assign({}, defaultOptions, options);
    var globOpts = Object.assign({}, options.glob || {}, globOptions);

    if (typeof globOpts.silent === 'undefined') {
        globOpts.silent = opts.silent;
    }

    glob(match, globOpts, function onDocsFound(err, files) {
        if (err) {
            return callback(err);
        }

        var processDoc = partial(processDocument, opts);
        async.mapLimit(
            files,
            opts.parallelLimit || 10,
            processDoc,
            function onDocsRead(readErr, docs) {
                if (readErr) {
                    return callback(readErr);
                }

                var normalized = normalizeDocs(docs);

                if (opts.allowDuplicateSlugs) {
                    return callback(null, normalized);
                }

                var slugs = [];
                for (var i = 0; i < normalized.length; i++) {
                    if (slugs.indexOf(normalized[i].slug) !== -1) {
                        return callback(new Error(
                            'Multiple documents found with same slug: ' +
                            '`' + normalized[i].slug + '`'
                        ));
                    }

                    slugs.push(normalized[i].slug);
                }

                callback(null, normalized);
            }
        );
    });
}

function processDocument(options, file, callback) {
    fs.stat(file, function onFileStat(statErr, stats) {
        if (statErr) {
            return callback(statErr);
        }

        readDocument(options, file, stats, callback);
    });
}

function readDocument(options, file, stats, callback) {
    fs.readFile(file, { encoding: 'utf8' }, function onFileRead(err, md) {
        if (err) {
            return callback(err);
        }

        var doc = extract(md);
        var hasErrors = doc.errors.length > 0;

        doc.filePath = file;
        doc.fileCreated = stats.ctime;

        if (!hasErrors) {
            return callback(null, doc);
        }

        // First, figure out if we should log
        if (!options.silent) {
            var composedErr = createError(file, doc.errors);
            if (options.logger) {
                options.logger.error(composedErr);
            } else {
                /* eslint-disable no-console */
                console.error(createError(file, doc.errors));
                /* eslint-enable no-console */
            }
        }

        // Should we simply skip this document?
        if (options.errorMode === 'skip') {
            // We'll filter documents by boolean value down the tree
            return callback();
        }

        // Default is to be strict, returning error on any type of error. If mode is set to
        // fatal, however, we need to see if there are actually any fatal errors in there
        var fatals = doc.errors.filter(isFatal);
        if (options.errorLevel === 'fatal') {
            if (fatals.length > 0) {
                // Just return the first fatal
                return callback(fatals[0]);
            }

            // If error level is set to fatal and we don't have any fatals, proceed as if
            // nothing is wrong, and assume the user has the `silent` option set to false,
            // or checks the `errors` property in user-space code
            return callback(null, doc);
        }

        // Default mode: Return error on any type of error from extractor
        return callback(createError(file, doc.errors));
    });
}

function createError(file, errs) {
    return new Error(
        'File `' + file + '` contained errors: ' + errs.reduce(reduceErrors, '\n')
    );
}

function isFatal(err) {
    return err instanceof TypeError;
}

function reduceErrors(allErrs, err) {
    return allErrs + ' - ' + err.message + '\n';
}

function sortByDate(a, b) {
    return b.date - a.date;
}

function normalizeDocs(documents) {
    return (documents
        // Remove invalid documents
        .filter(Boolean)
        // Normalize the documents, applying coercion and adding missing properties
        .map(normalizeDoc)
        // By default, we want the documents by date
        .sort(sortByDate)
    );
}

module.exports = findDocuments;
