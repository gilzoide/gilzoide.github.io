const beautify_html = require('js-beautify').html

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksFilter("datestr", function(date) {
    return date.toISOString().split('T')[0]
  })

  eleventyConfig.addTransform("processHTML", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return beautify_html(content, {
        indent_size: 2,
        editorconfig: true,
      })
    }
    return content
  })
  eleventyConfig.addPassthroughCopy("src/lib")
  eleventyConfig.addPassthroughCopy("src/css")
  eleventyConfig.addPassthroughCopy("src/images")
};
