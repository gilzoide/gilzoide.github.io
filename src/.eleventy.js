const beautify_html = require('js-beautify').html
const mdIt = require('markdown-it')
const mdItAnchor = require('markdown-it-anchor')

function haveAnyCommonValues(arr, values) {
  if (!arr || !values) {
    return false
  }
  for (let v1 of arr) {
    for (let v2 of values) {
      if (v1 == v2) {
        return true
      }
    }
  }
  return false
}

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

function setupAdditionalCollections(eleventyConfig) {
  eleventyConfig.addCollection("news", function(collectionApi) {
    let tags = ["article", "project"]
    return collectionApi.getSortedByDate().filter(item => {
      return haveAnyCommonValues(item.data.tags, tags)
    })
  });
}

module.exports = function(eleventyConfig) {
  setupNunjucksFilters(eleventyConfig)
  setupMarkdownIt(eleventyConfig)
  setupHtmlBeautifier(eleventyConfig)
  setupPassthroughFolders(eleventyConfig)
  setupAdditionalCollections(eleventyConfig)
}
