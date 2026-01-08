const { Type } = require("@google/genai");

const blogTools = {
  function_declarations: [
    {
      name: "searchPublishedBlogs",
      description: "Search for published environmental blogs by category or specific tags.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "The blog category (e.g., 'energy', 'waste', 'water')."
          },
          tag: {
            type: "string",
            description: "A specific tag to filter by (from the blog's tags array)."
          }
        }
      }
    },
    {
      name: "getFeaturedBlogs",
      description: "Retrieve a list of blogs that are marked as 'featured' by the editors.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of featured blogs to return (default is 5)."
          }
        }
      }
    }
  ]
};

module.exports = { blogTools };