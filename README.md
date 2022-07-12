# rehype-toc

[![npm](https://img.shields.io/npm/v/@microflash/rehype-toc)](https://www.npmjs.com/package/@microflash/rehype-toc)
[![license](https://img.shields.io/npm/l/@microflash/rehype-toc)](./LICENSE.md)

[rehype](https://github.com/rehypejs/rehype) plugin to generate table of contents (TOC)

## Contents

- [Contents](#contents)
- [What's this?](#whats-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
	- [Options](#options)
- [Security](#security)
- [Related](#related)
- [License](#license)

## What's this?

This package is a [unified](https://github.com/unifiedjs/unified) ([rehype](https://github.com/rehypejs/rehype)) plugin to generate a table of contents for a markdown document.

## When should I use this?

This project is useful when authors are writing docs in markdown that are sometimes quite long and hence would benefit from automated overviews inside them. It is assumed that headings define the structure of documents and that they can be linked to. When this plugin is used, authors can add a certain heading (say, `## Contents`) to documents and this plugin will populate those sections with lists that link to all following sections.

GitHub and similar services automatically add IDs (and anchors that link-to-self) to headings. For this plugin to work, you'll have to do something similar by using [`@microflash/rehype-slugify`](https://github.com/Microflash/rehype-slugify) before this plugin. To add anchors that link to headings, you can use [`rehype-autolink-headings`](https://github.com/rehypejs/rehype-autolink-headings).

This plugin does not expose the generated table of contents to other plugins.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install @microflash/rehype-toc
```

In Deno, with [esm.sh](https://esm.sh/):

```js
import rehypeToc from 'https://esm.sh/@microflash/rehype-toc'
```

In browsers, with [esm.sh](https://esm.sh/):

```html
<script type="module">
  import rehypeToc from 'https://esm.sh/@microflash/rehype-toc?bundle'
</script>
```

## Use

Say we have the following file `example.md`:

```md
# Alpha

[[toc]]

## Bravo

### Charlie

## Delta
```

And our module `example.js` looks as follows:

```js
import Slugger from 'github-slugger'
import { read } from 'to-vfile'
import { rehype } from 'rehype'
import rehypeSlugify from '@microflash/rehype-slugify'
import rehypeToc from '@microflash/rehype-toc'
import rehypeRemoveEmptyParagraph from 'rehype-remove-empty-paragraph'

const slugger = new Slugger()

main()

async function main() {
  const file = await rehype()
    .data('settings', { fragment: true })
    .use(rehypeSlugify, {
      reset() {
        slugger.reset()
      },
      slugify(text) {
        return slugger.slug(text)
      }
    })
    .use(rehypeToc)
    .use(rehypeRemoveEmptyParagraph)
    .process(await read('example.md'))

  console.log(String(file))
}
```

Running that with `node example.js` yields:

```html
<h1 id="alpha">Alpha</h1>

<details id="table-of-contents" class="toc">
  <summary>Table of contents</summary>
  <ul class="toc-items">
    <li class="toc-item-1"><a href="#alpha">Alpha</a></li>
    <li class="toc-item-2"><a href="#bravo">Bravo</a></li>
    <li class="toc-item-3"><a href="#charlie">Charlie</a></li>
    <li class="toc-item-2"><a href="#delta">Delta</a></li>
  </ul>
</details>

<h2 id="bravo">Bravo</h2>

<h3 id="charlie">Charlie</h3>

<h2 id="delta">Delta</h2>
```

## API

The default export is `rehypeToc`.

### Options

The following options are available. All of them are optional.

- `matcher`: regex to match a node which can be replaced with table of contents. It can be any expression that [`hast-util-find-and-replace`](https://github.com/syntax-tree/hast-util-find-and-replace) can accept.
- `toc(headings)`: function that returns table of contents as HAST. `headings` array is available to customize the HAST the way you want. The default implementation generates a `<details>` element with the headings as a flat unordered list.

## Security

Use of `@microflash/rehype-toc` can open you up to a [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack as it uses `id` attributes on headings.

## Related

- [`remark-toc`](https://github.com/remarkjs/remark-toc) &mdash; opinionated plugin to generate a table of contents
- [`@microflash/rehype-slugify`](https://github.com/Microflash/rehype-slugify) &mdash; plugin to add `id`s to headings using a slugger of your choice
- [`rehype-autolink-headings`](https://github.com/rehypejs/rehype-autolink-headings) &mdash; add links to headings with IDs back to themselves

## License

[MIT](./LICENSE.md)
