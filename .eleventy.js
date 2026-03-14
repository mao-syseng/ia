export default function(eleventyConfig) {
  // Copy the public folder to _site
  eleventyConfig.addPassthroughCopy("public");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
