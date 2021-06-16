const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier)
  eleventyConfig.addPassthroughCopy("src/css")
  eleventyConfig.addPassthroughCopy("src/images")
};
