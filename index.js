/**
 * @typedef {import('hast').Root} Root
 */
import { hasProperty } from 'hast-util-has-property'
import { headingRank } from 'hast-util-heading-rank'
import { toString } from 'hast-util-to-string'
import { visit, SKIP } from 'unist-util-visit'
import { findAndReplace } from 'hast-util-find-and-replace'
import { h } from 'hastscript'

const defaults = {
	matcher: /\[\[toc\]\]/gi,
	id: 'table-of-contents',
	toc(headings) {
		return h('details.toc', [
			h('summary', 'Table of contents'),
			h('ul.toc-items', [...headings.map(heading => h(`li.toc-item-${heading.depth}`, [
				h('a', {href: `#${heading.id}`}, heading.title)
			]))])
		])
	}
}

/**
 * Plugin to generate table of contents (TOC)
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeToc(userOptions) {
	const options = Object.assign({}, defaults, userOptions)

	return (tree) => {
		// collect all headings
		const headings = []
		visit(tree, 'element', (node) => {
			const rank = headingRank(node)
			if (rank && node.properties && hasProperty(node, 'id')) {
				headings.push({
					depth: rank,
					id: node.properties.id,
					title: toString(node)
				})
			}
		})

		const treeWithToc = findAndReplace(tree, [
			[
				options.matcher, function () {
					const el = headings.length ? options.toc(headings) : h('del')
					el.properties.id = options.id
					return el
				}
			]
		])

		// squeeze the toc node
		visit(treeWithToc, 'element', (node, index, parent) => {
			const { tagName, children } = node
			if (tagName === 'p' && children && children[0].properties && children[0].properties.id === options.id) {
				if (children[0].tagName === 'del') {
					parent.children.splice(index, 1)
				} else {
					parent.children.splice(index, 1, ...node.children)
				}

				return [SKIP, index]
			}
		})
	}
}
