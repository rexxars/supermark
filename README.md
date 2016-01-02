# supermark

<img align="right" width="270" height="270" src="assets/supermark.png" alt="Supermark">

Flat-file markdown content (read: "blog") system

## Random thoughts

* Specify a short, simple header standard for documents that is valid Markdown. Horizontal rule to separate header from content.
  - **Document title**
  - Excerpt - none by default
  - Slug - default: `slug(docTitle)`
  - Publish date (with support for future dates) - default: document creation timestamp
  - Status (draft/published) - default: published
  - Visibility (public/private - up to the implementer to do whatever with this) - default: visible
  - Tags - none by default
  - Categories (primary category on top) - none by default
* Create simple linter/extractor for header standard
* Function to get all documents from dir (recursive option?)
* Function to look up document based on slug
* Some basic options to fetch posts by tag/category etc, most can be implemented in userland
* Built-in support for cache with TTL
* Function to render markdown to HTML [react-markdown](https://github.com/rexxars/react-markdown)
* Possible editor like [markdown-editor](https://github.com/rexxars/markdown-editor) that can save to files from browser, + extraction of header?
* Add some kind of internal link standard + renderer support? eg: \[tag:whatevs\], \[post:slug\] etc?

## License

MIT-licensed. See LICENSE.
