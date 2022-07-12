/**
 * @typedef {import('hast').Root} Root
 */
import { hasProperty } from 'hast-util-has-property'
import { headingRank } from 'hast-util-heading-rank'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { findAndReplace } from 'hast-util-find-and-replace'
import { h } from 'hastscript'

const defaults = {
	matcher: /\[\[toc\]\]/gi,
	toc(headings) {
		return h('details.toc#table-of-contents', [
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

		findAndReplace(tree, [
			[
				options.matcher, function () {
					return options.toc(headings)
				}
			]
		])
	}
}
