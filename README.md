# supermark

<img align="right" width="270" height="270" src="assets/supermark.png" alt="Supermark">

Flat-file markdown content (read: "blog") system

## Rough API outline

```js
var supermark = require('supermark');

supermark.findDocuments('/path/to/dir/**/*.md', {
    allowDuplicates: false, // Produce error if multiple documents has the same slug
    glob: { /* see https://github.com/isaacs/node-glob for options */ }
}, function onDocsFound(err, docs) {
    // docs being an array of objects returned from supermark-extract
});

supermark.findBySlug('some-slug', /path/to/dir/**/*.md', function onDocFound(err, doc) {
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
