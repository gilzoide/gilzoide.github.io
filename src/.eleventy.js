const beautify_html = require('js-beautify').html
const mdIt = require('markdown-it')
const mdItAnchor = require('markdown-it-anchor')

function setupMarkdownIt(eleventyConfig) {
  let md = mdIt({
    html: true,
    linkify: true,
  }).use(mdItAnchor, {
    permalink: mdItAnchor.permalink.headerLink(),
  })
  eleventyConfig.setLibrary("md", md)
}

function setupHtmlBeautifier(eleventyConfig) {
  eleventyConfig.addTransform("processHTML", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return beautify_html(content, {
        indent_size: 2,
        editorconfig: true,
      })
    }
    return content
  })
}

function setupNunjucksFilters(eleventyConfig) {
  eleventyConfig.addNunjucksFilter("datestr", function(date) {
    return date.toISOString().split('T')[0]
  })
}

function setupPassthroughFolders(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/lib")
  eleventyConfig.addPassthroughCopy("src/css")
  eleventyConfig.addPassthroughCopy("src/images")
}

module.exports = function(eleventyConfig) {
  setupNunjucksFilters(eleventyConfig)

  setupMarkdownIt(eleventyConfig)

  setupHtmlBeautifier(eleventyConfig)

  setupPassthroughFolders(eleventyConfig)
}
