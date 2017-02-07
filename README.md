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

## Supermark standard

The standard is simple. It's just a markdown file with an additional header of properties.
This header **must** include at least the `Title` property and a horizontal rule separating the header from the document. Example:

```markdown
Title: Some awesome blog post
Slug: awesome-blog-post
-----------------------------
# The content of this awesome post

Should follow here, as usual.
```

Allow properties:
- `Title` - **Required**. Title of the document, kind of obvious, right?
- `Slug` - A string that can be used as an identifier for the document. Should contain no spaces or special characters. Will be inferred from the title if not specified.
- `Excerpt` - An excerpt of the document, as a string.
- `Date` - An ISO-8601 date for when the document should be/was published.
- `Status` - Either `Published` or `Draft`. `Draft` usually means the document won't be available to outside readers.
- `Visibility` - Either `Public` or `Private`. `Private` usually means the document can be viewed with the right link, but does not show up in lists.
- `Author` - Name and optionally email of the author, in "Name &lt;email&gt;" format
- `Tags` - A (markdown) list of tags for this document
- `Categories` - A (markdown) list of categories this document belongs to

## Usage

Check out [supermark-blog](https://github.com/rexxars/supermark-blog) for a super-simple, naive blog implemented on top of Supermark.

## Random thoughts for the future

* Some basic options to fetch posts by tag/category etc, most can be implemented in userland
* Function to render markdown to HTML [react-markdown](https://github.com/rexxars/react-markdown)
* Possible editor like [markdown-editor](https://github.com/rexxars/markdown-editor) that can save to files from browser, + extraction of header?
* Add some kind of internal link standard + renderer support? eg: \[tag:whatevs\], \[post:slug\] etc?

## License

MIT-licensed. See LICENSE.
