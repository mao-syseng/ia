export default function(eleventyConfig) {
  // Copy the public folder to _site
  eleventyConfig.addPassthroughCopy("public");

  // Ignore files
  eleventyConfig.ignores.add("readme.md");
  eleventyConfig.ignores.add("unicode.html");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
