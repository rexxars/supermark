# supermark

<img align="right" width="270" height="270" src="assets/supermark.png" alt="Supermark">

Flat-file markdown content (read: "blog") system

## Important disclaimer

This is a fun project, but I have yet to really figure out what I think belongs as "core functionality" and what should be left for the user to implement. I wouldn't say I'm very proud of the API or code yet, either. So basically, I wouldn't really use this in production if I were you, but I'd definitely appreciate any help and feedback on features and API etc.

## Rough API outline

```js
var supermark = require('supermark');

supermark.findDocuments('/path/to/dir/**/*.md', {
    allowDuplicates: false, // Produce error if multiple documents has the same slug
    glob: { /* see https://github.com/isaacs/node-glob for options */ }
}, function onDocsFound(err, docs) {
    // docs being an array of objects returned from supermark-extract
});

supermark.findBySlug('some-slug', '/path/to/dir/**/*.md', function onDocFound(err, doc) {
    // woo, found it
});
```

## Random thoughts for the future

* Some basic options to fetch posts by tag/category etc, most can be implemented in userland
* Function to render markdown to HTML [react-markdown](https://github.com/rexxars/react-markdown)
* Possible editor like [markdown-editor](https://github.com/rexxars/markdown-editor) that can save to files from browser, + extraction of header?
* Add some kind of internal link standard + renderer support? eg: \[tag:whatevs\], \[post:slug\] etc?

## License

MIT-licensed. See LICENSE.
