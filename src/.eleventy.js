const { EleventyI18nPlugin } = require("@11ty/eleventy")
const i18n = require('eleventy-plugin-i18n')
const beautify_html = require('js-beautify').html
const mdIt = require('markdown-it')
const mdItAnchor = require('markdown-it-anchor')
const translations = require('./_data/i18n')

const htmlCommentRegex = /<!--.*?-->/s

// helper functions
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

function removeHtmlComments(text) {
  return text.replace(htmlCommentRegex, "")
}

// setup functions
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
      content = removeHtmlComments(content)
      return beautify_html(content, {
        indent_size: 2,
        editorconfig: true,
      })
    }
    return content
  })
}

function setupFilters(eleventyConfig) {
  eleventyConfig.addFilter("datestr", function(date) {
    return date.toISOString().split('T')[0]
  })
  eleventyConfig.addFilter("exclude", function(arr, ...args) {
    let exclude_values = args[0] instanceof Array ? args[0] : args
    return exclude_values ? arr.filter(item => !exclude_values.includes(item)) : arr
  })
}

function setupPassthroughFolders(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css")
  eleventyConfig.addPassthroughCopy("src/images")
  eleventyConfig.addPassthroughCopy("src/js")
  eleventyConfig.addPassthroughCopy("src/lib")
}

function setupAdditionalCollections(eleventyConfig) {
  eleventyConfig.addCollection("news", function(collectionApi) {
    let tags = ["article", "project"]
    return collectionApi.getSortedByDate().filter(item => {
      return haveAnyCommonValues(item.data.tags, tags)
    })
  })
}

function setupI18n(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "en",
  })
  eleventyConfig.addFilter("all_locale_links", function(page) {
    let links = [
      {
        url: page.url,
        lang: page.lang,
        label: translations.LanguageName[page.lang],
        active: true,
      },
      ...eleventyConfig.javascriptFunctions["locale_links"](page.url)
    ]
    links.sort((a, b) => a.lang.localeCompare(b.lang))
    return links
  })
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en'
    }
  })
}

module.exports = function(eleventyConfig) {
  setupFilters(eleventyConfig)
  setupMarkdownIt(eleventyConfig)
  setupHtmlBeautifier(eleventyConfig)
  setupPassthroughFolders(eleventyConfig)
  setupAdditionalCollections(eleventyConfig)
  setupI18n(eleventyConfig)

  return {
    dir: {
      output: "docs",
    }
  }
}
